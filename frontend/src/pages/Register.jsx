import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", { name, email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign up. Is the server running?");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Create account</h1>
      {error && <p className="error">{error}</p>}
      <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password (min 6 characters)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn">Sign up</button>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
