import { useEffect, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/categories/list").then((res) => setCategories(res.data));
  }, []);

  // Load products again whenever search, category or page changes
  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { search, category, page, limit: 8 } })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  return (
    <div>
      <section className="hero">
        <h1>Everyday things, delivered to your door.</h1>
        <p>Clothing, electronics, home and accessories. Cash on delivery available.</p>
      </section>

      <div className="filters">
        <input
          placeholder="Search products"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="chips">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              className={"chip" + (category === c ? " active" : "")}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="muted">No products match your search. Try a different word or category.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="pager">
          <button className="btn outline small" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page} of {pages}</span>
          <button className="btn outline small" disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
