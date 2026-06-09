const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true },
    category:    { type: String, required: true, enum: ["cham-soc-da", "trang-diem"] },
    price:       { type: Number, required: true, min: 0 },
    rating:      { type: Number, default: 5, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    image:       { type: String, default: "" },
    badge:       { type: String, default: null },
    inStock:     { type: Boolean, default: true },
    buttonMode:  { type: String, default: "add_to_cart", enum: ["add_to_cart", "out_of_stock"] },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
