require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const connectDB = require("./connect");
const Product = require("../models/Product");
const { products } = require("../data/products");

(async () => {
  await connectDB();

  await Product.deleteMany({});
  console.log("Đã xoá dữ liệu cũ");

  await Product.insertMany(products);
  console.log(`Đã thêm ${products.length} sản phẩm vào MongoDB`);

  process.exit(0);
})();
