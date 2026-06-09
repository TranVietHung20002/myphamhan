const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const Product = require("../models/Product");

// Dùng memory storage — file lưu tạm vào RAM rồi đẩy lên GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Chỉ chấp nhận file ảnh"), false);
  },
});

// Helper: lưu buffer vào GridFS, trả về filename
async function saveToGridFS(buffer, originalname, mimetype) {
  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "images" });
  const ext = originalname.split(".").pop().toLowerCase();
  const filename = `product-${Date.now()}.${ext}`;

  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimetype,
    });

    readable.pipe(uploadStream);
    uploadStream.on("finish", () => resolve(filename));
    uploadStream.on("error", reject);
  });
}

// Helper: xoá file cũ khỏi GridFS
async function deleteFromGridFS(filename) {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "images" });
    const files = await db.collection("images.files").find({ filename }).toArray();
    if (files.length) await bucket.delete(files[0]._id);
  } catch (_) {}
}

// Serve ảnh từ GridFS
router.get("/image/:filename", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const files = await db.collection("images.files")
      .find({ filename: req.params.filename }).toArray();

    if (!files.length) return res.status(404).json({ message: "Không tìm thấy ảnh" });

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "images" });
    res.set("Content-Type", files[0].contentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000");
    bucket.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Trang upload HTML
router.get("/", async (req, res) => {
  const products = await Product.find({}, "_id name image").sort({ name: 1 });

  const rows = products.map(p => {
    const imgSrc = p.image ? `/api/upload/image/${p.image}` : null;
    return `
    <tr>
      <td>${p.name}</td>
      <td>${imgSrc
        ? `<img src="${imgSrc}" width="64" height="64" style="object-fit:cover;border-radius:8px;border:1px solid #eee;">`
        : `<span style="color:#bbb;font-size:13px;">Chưa có ảnh</span>`}
      </td>
      <td>
        <form action="/api/upload/product/${p._id}" method="POST" enctype="multipart/form-data" style="display:flex;gap:8px;align-items:center;">
          <input type="file" name="image" accept="image/*" required style="font-size:13px;max-width:220px;">
          <button type="submit" style="background:#1a1a1a;color:#fff;border:none;padding:7px 16px;border-radius:6px;cursor:pointer;font-size:13px;white-space:nowrap;">⬆ Upload</button>
        </form>
      </td>
    </tr>`;
  }).join("");

  res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Upload Ảnh — Mỹ Phẩm 90+</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:"Segoe UI",sans-serif;background:#f5efe6;padding:32px;color:#1a1a1a}
    h1{font-size:22px;font-weight:800;margin-bottom:6px}
    p.sub{font-size:13px;color:#999;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)}
    th{background:#1a1a1a;color:#fff;padding:13px 18px;text-align:left;font-size:12px;letter-spacing:.5px;text-transform:uppercase}
    td{padding:12px 18px;border-bottom:1px solid #f5efe6;vertical-align:middle;font-size:14px}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:#fdf9f5}
    .msg{margin-bottom:18px;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:500}
    .ok{background:#d1fae5;color:#065f46}
    .err{background:#fee2e2;color:#991b1b}
  </style>
</head>
<body>
  <h1>🖼 Upload Ảnh Sản Phẩm</h1>
  <p class="sub">Ảnh lưu thẳng vào MongoDB Atlas (GridFS)</p>
  ${req.query.ok  ? `<div class="msg ok">✅ Upload thành công: <strong>${decodeURIComponent(req.query.ok)}</strong></div>` : ""}
  ${req.query.err ? `<div class="msg err">❌ Lỗi: ${decodeURIComponent(req.query.err)}</div>` : ""}
  <table>
    <thead><tr><th>Sản phẩm</th><th>Ảnh hiện tại</th><th>Upload ảnh mới</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`);
});

// Xử lý upload
router.post("/product/:id", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.redirect("/api/upload?err=" + encodeURIComponent("Chưa chọn file ảnh"));

    // Lưu ảnh mới lên GridFS
    const filename = await saveToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Xoá ảnh cũ nếu có
    const old = await Product.findById(req.params.id);
    if (old?.image) await deleteFromGridFS(old.image);

    // Cập nhật MongoDB
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { image: filename },
      { returnDocument: "after" }
    );

    if (!product) return res.redirect("/api/upload?err=" + encodeURIComponent("Không tìm thấy sản phẩm"));

    res.redirect("/api/upload?ok=" + encodeURIComponent(product.name));
  } catch (err) {
    res.redirect("/api/upload?err=" + encodeURIComponent(err.message));
  }
});

module.exports = router;
