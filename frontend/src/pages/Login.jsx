import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in. Is the server running?");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn">Login</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
