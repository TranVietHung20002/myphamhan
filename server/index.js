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

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Kết nối MongoDB trước mỗi request (serverless safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Lỗi kết nối database" });
  }
});

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Mỹ Phẩm 90+ API đang chạy" });
});

app.get("/api/test-email", async (req, res) => {
  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const result = await resend.emails.send({
      from: "Mỹ Phẩm 90+ <onboarding@resend.dev>",
      to: [process.env.SHOP_EMAIL],
      subject: "Test email từ Mỹ Phẩm 90+",
      html: "<p>Email test thành công! ✅</p>",
    });
    console.log("Test email result:", JSON.stringify(result));
    res.json({ success: true, result });
  } catch (err) {
    console.error("Test email error:", err);
    res.json({ success: false, error: err.message });
  }
});

// Export cho Vercel serverless
module.exports = app;

// Chỉ listen khi chạy local
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server chạy tại http://localhost:${PORT}`);
    });
  });
}
