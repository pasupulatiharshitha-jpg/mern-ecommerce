const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        qty: Number,
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: "COD" },
    status: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
