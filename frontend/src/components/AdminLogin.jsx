import { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Login:", { email, password });
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Admin Login</h1>
        <p className="admin-subtitle">Secure access only</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
            required
          />

          <button type="submit" className="admin-button">
            Login as Admin
          </button>
        </form>

        <p className="admin-footer">Authorized personnel only</p>
      </div>
    </div>
  );
}
