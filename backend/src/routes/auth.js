const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

// Public routes (no authentication needed)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify", authController.verifySession);
router.post("/logout", authController.logout);

// Protected routes (require authentication)
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;