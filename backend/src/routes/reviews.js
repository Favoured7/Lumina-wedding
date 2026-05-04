const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const router = express.Router();

router.post("/", authMiddleware, reviewController.createReview);
router.get("/vendor/:vendorId", reviewController.getReviewsByVendor);
router.put("/:id/approve", authMiddleware, adminOnly, reviewController.approveReview);

module.exports = router;