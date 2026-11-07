// Run once:  npm run seed
// Adds sample products and one admin user (admin@shop.com / admin123)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Product = require("./models/Product");
const User = require("./models/User");

const img = (seed) => "https://picsum.photos/seed/" + seed + "/600/450";

const products = [
  { name: "Cotton Kurta", price: 899, category: "Clothing", stock: 25, image: img("kurta"), description: "Soft everyday cotton kurta with a relaxed fit." },
  { name: "Handloom Saree", price: 2499, category: "Clothing", stock: 10, image: img("saree"), description: "Handwoven saree with a simple border." },
  { name: "Denim Jacket", price: 1799, category: "Clothing", stock: 15, image: img("denim"), description: "Classic denim jacket, medium weight." },
  { name: "Wireless Earbuds", price: 1499, category: "Electronics", stock: 30, image: img("earbuds"), description: "Bluetooth earbuds with a charging case." },
  { name: "Power Bank 10000mAh", price: 1199, category: "Electronics", stock: 40, image: img("powerbank"), description: "Slim power bank with fast charging." },
  { name: "Smart Watch", price: 2999, category: "Electronics", stock: 12, image: img("watch"), description: "Tracks steps, sleep and heart rate." },
  { name: "Steel Water Bottle", price: 549, category: "Home", stock: 50, image: img("bottle"), description: "1 litre insulated bottle, keeps drinks cold for 12 hours." },
  { name: "Ceramic Mug Set", price: 699, category: "Home", stock: 20, image: img("mugs"), description: "Set of 4 ceramic mugs." },
  { name: "Study Desk Lamp", price: 799, category: "Home", stock: 18, image: img("lamp"), description: "LED lamp with three brightness levels." },
  { name: "Backpack 25L", price: 1299, category: "Accessories", stock: 22, image: img("backpack"), description: "Water-resistant backpack with laptop sleeve." },
  { name: "Sunglasses", price: 649, category: "Accessories", stock: 35, image: img("sunglasses"), description: "UV protected lenses, lightweight frame." },
  { name: "Leather Wallet", price: 499, category: "Accessories", stock: 45, image: img("wallet"), description: "Slim wallet with six card slots." },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(products);

  const adminExists = await User.findOne({ email: "admin@shop.com" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@shop.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });
  }
  console.log("Seed done: products added, admin = admin@shop.com / admin123");
  process.exit();
}

run().catch((e) => {
  console.log(e.message);
  process.exit(1);
});
