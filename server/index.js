require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connect");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/upload");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve ảnh đã upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Mỹ Phẩm 90+ API đang chạy" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
  });
});
