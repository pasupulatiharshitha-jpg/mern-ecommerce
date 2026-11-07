const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders  (logged-in user places an order)
// body: { items: [{ product: id, qty: number }], address, paymentMethod }
router.post("/", protect, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!address) return res.status(400).json({ message: "Address is required" });

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      // Price comes from the database, not from the browser (safer)
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ message: "Product not found" });
      if (product.stock < item.qty) {
        return res
          .status(400)
          .json({ message: product.name + " has only " + product.stock + " left" });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      });
      total += product.price * item.qty;
      product.stock -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      address,
      paymentMethod: paymentMethod || "COD",
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my  (orders of the logged-in user)
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders  (admin: all orders)
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status  (admin: change status)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
