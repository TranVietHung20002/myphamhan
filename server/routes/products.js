const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const { category, search, limit } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    let query = Product.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit));

    const data = await query;
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const cham = await Product.countDocuments({ category: "cham-soc-da" });
    const trang = await Product.countDocuments({ category: "trang-diem" });
    res.json({
      success: true,
      data: [
        { id: "cham-soc-da", name: "Chăm Sóc Da", count: cham },
        { id: "trang-diem", name: "Trang Điểm", count: trang },
      ],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
