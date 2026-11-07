import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">Kondapur Bazaar</Link>
        <nav className="nav-links">
          <Link to="/cart">Cart ({count})</Link>
          {user && <Link to="/orders">My orders</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          {user ? (
            <button className="link-btn" onClick={handleLogout}>
              Logout ({user.name.split(" ")[0]})
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn small">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
