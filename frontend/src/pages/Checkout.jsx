import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      // Only product id and quantity are sent. The server finds the real price.
      const items = cart.map((i) => ({ product: i._id, qty: i.qty }));
      await api.post("/orders", { items, address, paymentMethod: "COD" });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place the order");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) return <p className="muted">Your cart is empty.</p>;

  return (
    <form className="form" onSubmit={placeOrder}>
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}
      <textarea
        rows="3"
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <p className="muted">Payment: Cash on delivery</p>
      <h2>Total: ₹{total}</h2>
      <button className="btn" disabled={placing}>
        {placing ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
}
