const { VendorReview, User, Vendor } = require("../models");

class ReviewService {
  // Create a new review
  async createReview(reviewData) {
    try {
      const review = await VendorReview.create(reviewData);
      
      // Update vendor rating
      await this.updateVendorRating(reviewData.vendorId);
      
      return review;
    } catch (error) {
      throw error;
    }
  }

  // Update vendor rating
  async updateVendorRating(vendorId) {
    const reviews = await VendorReview.findAll({
      where: { vendorId, isApproved: true },
    });
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Vendor.update(
      { rating: avgRating, totalReviews: reviews.length },
      { where: { id: vendorId } }
    );
  }

  // Get reviews by vendor
  async getReviewsByVendor(vendorId) {
    try {
      const reviews = await VendorReview.findAll({
        where: { vendorId, isApproved: true },
        include: [{ model: User, attributes: ["name"] }],
        order: [["createdAt", "DESC"]],
      });
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Approve review
  async approveReview(id) {
    try {
      const review = await VendorReview.findByPk(id);
      if (!review) {
        throw new Error("Review not found");
      }
      
      await review.update({ isApproved: true });
      
      // Update vendor rating
      await this.updateVendorRating(review.vendorId);
      
      return review;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReviewService();