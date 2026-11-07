import { useEffect, useState } from "react";
import api from "../api.js";

const emptyForm = { name: "", price: "", image: "", category: "", stock: "", description: "" };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const loadProducts = () =>
    api.get("/products", { params: { limit: 100 } }).then((res) => setProducts(res.data.products));
  const loadOrders = () => api.get("/orders").then((res) => setOrders(res.data));

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editId) {
        await api.put("/products/" + editId, data);
        setMessage("Product updated");
      } else {
        await api.post("/products", data);
        setMessage("Product added");
      }
      setForm(emptyForm);
      setEditId(null);
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      stock: p.stock,
      description: p.description,
    });
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete("/products/" + id);
    loadProducts();
  };

  const changeStatus = async (id, status) => {
    await api.put("/orders/" + id + "/status", { status });
    loadOrders();
  };

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1>Admin dashboard</h1>

      <div className="stats">
        <div><span className="muted">Products</span><strong>{products.length}</strong></div>
        <div><span className="muted">Orders</span><strong>{orders.length}</strong></div>
        <div><span className="muted">Revenue</span><strong>₹{revenue}</strong></div>
      </div>

      <div className="chips">
        <button className={"chip" + (tab === "products" ? " active" : "")} onClick={() => setTab("products")}>Products</button>
        <button className={"chip" + (tab === "orders" ? " active" : "")} onClick={() => setTab("orders")}>Orders</button>
      </div>

      {tab === "products" && (
        <>
          <form className="form wide" onSubmit={handleSubmit}>
            <h2>{editId ? "Edit product" : "Add product"}</h2>
            {message && <p className="muted">{message}</p>}
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <textarea name="description" rows="2" placeholder="Description" value={form.description} onChange={handleChange} />
            <div className="inline">
              <button className="btn">{editId ? "Save changes" : "Add product"}</button>
              {editId && (
                <button type="button" className="btn outline" onClick={() => { setEditId(null); setForm(emptyForm); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {products.map((p) => (
            <div className="row" key={p._id}>
              <img src={p.image} alt={p.name} />
              <div className="grow">
                <strong>{p.name}</strong>
                <p className="muted">₹{p.price} · {p.category} · {p.stock} in stock</p>
              </div>
              <button className="link-btn" onClick={() => startEdit(p)}>Edit</button>
              <button className="link-btn danger" onClick={() => deleteProduct(p._id)}>Delete</button>
            </div>
          ))}
        </>
      )}

      {tab === "orders" && (
        <>
          {orders.length === 0 && <p className="muted">No orders yet.</p>}
          {orders.map((o) => (
            <div className="order" key={o._id}>
              <div className="order-head">
                <span>{o.user?.name} ({o.user?.email})</span>
                <strong>₹{o.total}</strong>
              </div>
              {o.items.map((i) => (
                <p key={i._id}>{i.name} × {i.qty}</p>
              ))}
              <p className="muted">{o.address}</p>
              <select value={o.status} onChange={(e) => changeStatus(o._id, e.target.value)}>
                <option>Placed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
