const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Mock responses - no database needed
app.get("/", (req, res) => {
  res.json({ message: "Lumina Weddings API is running" });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: "Login successful",
    token: "mock-token-123",
    user: { id: 1, name: email.split('@')[0], email: email, role: "couple" }
  });
});

app.post("/api/auth/register", (req, res) => {
  res.json({
    success: true,
    message: "Registration successful",
    token: "mock-token-123",
    user: req.body
  });
});

app.get("/api/users", (req, res) => {
  res.json({ users: [] });
});

app.get("/api/vendors", (req, res) => {
  res.json({ vendors: [] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mock API - No database required`);
});