const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { authMiddleware, adminOnly } = require("../middleware/auth");

router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (req.userRole !== "admin" && req.userId !== targetId) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const user = await userService.getUserById(targetId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;