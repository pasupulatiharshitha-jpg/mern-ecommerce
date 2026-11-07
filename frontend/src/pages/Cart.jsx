import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, changeQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div>
        <h1>Your cart is empty</h1>
        <Link to="/" className="btn">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your cart</h1>
      {cart.map((item) => (
        <div className="row" key={item._id}>
          <img src={item.image} alt={item.name} />
          <div className="grow">
            <strong>{item.name}</strong>
            <p className="muted">₹{item.price}</p>
          </div>
          <div className="qty">
            <button onClick={() => changeQty(item._id, item.qty - 1)}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => changeQty(item._id, item.qty + 1)}>+</button>
          </div>
          <strong>₹{item.price * item.qty}</strong>
          <button className="link-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
      <div className="summary">
        <h2>Total: ₹{total}</h2>
        <button className="btn" onClick={() => navigate("/checkout")}>Proceed to checkout</button>
      </div>
    </div>
  );
}
