import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <Link to={"/product/" + product._id}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <p className="muted">{product.category}</p>
        <Link to={"/product/" + product._id} className="card-title">
          {product.name}
        </Link>
        <div className="card-row">
          <strong>₹{product.price}</strong>
          {product.stock > 0 ? (
            <button className="btn small" onClick={() => addToCart(product)}>
              Add to cart
            </button>
          ) : (
            <span className="muted">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
