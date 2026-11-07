import { useEffect, useState } from "react";
import api from "../api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading orders...</p>;
  if (orders.length === 0) return <p className="muted">You have not placed any orders yet.</p>;

  return (
    <div>
      <h1>My orders</h1>
      {orders.map((o) => (
        <div className="order" key={o._id}>
          <div className="order-head">
            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
            <span className={"status " + o.status}>{o.status}</span>
            <strong>₹{o.total}</strong>
          </div>
          {o.items.map((i) => (
            <p key={i._id}>{i.name} × {i.qty}</p>
          ))}
          <p className="muted">Deliver to: {o.address}</p>
        </div>
      ))}
    </div>
  );
}
