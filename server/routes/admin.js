const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Lấy tất cả sản phẩm (có phân trang)
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Thêm sản phẩm mới
router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Cập nhật sản phẩm
router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Xóa sản phẩm
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Thống kê
router.get("/stats", async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const inStock = await Product.countDocuments({ inStock: true });
    const outOfStock = await Product.countDocuments({ inStock: false });
    const chamSocDa = await Product.countDocuments({ category: "cham-soc-da" });
    const trangDiem = await Product.countDocuments({ category: "trang-diem" });
    res.json({ success: true, data: { total, inStock, outOfStock, chamSocDa, trangDiem } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
