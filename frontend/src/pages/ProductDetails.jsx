import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products/" + id)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found"));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="muted">Loading...</p>;

  return (
    <div className="details">
      <img src={product.image} alt={product.name} />
      <div>
        <p className="muted">{product.category}</p>
        <h1>{product.name}</h1>
        <h2>₹{product.price}</h2>
        <p>{product.description}</p>
        <p className="muted">
          {product.stock > 0 ? product.stock + " in stock" : "Out of stock"}
        </p>
        <button
          className="btn"
          disabled={product.stock === 0}
          onClick={() => addToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
