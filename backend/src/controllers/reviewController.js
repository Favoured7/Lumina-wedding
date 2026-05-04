const { reviewService } = require("../services");

class ReviewController {
  async createReview(req, res) {
    try {
      const reviewData = {
        ...req.body,
        userId: req.userId,
      };
      const review = await reviewService.createReview(reviewData);
      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: review,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReviewsByVendor(req, res) {
    try {
      const reviews = await reviewService.getReviewsByVendor(req.params.vendorId);
      res.json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async approveReview(req, res) {
    try {
      const review = await reviewService.approveReview(req.params.id);
      res.json({
        success: true,
        message: "Review approved successfully",
        data: review,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ReviewController();