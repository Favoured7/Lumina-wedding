const { SavedVendor, Vendor } = require("../models");

class SavedVendorService {
  // Save a vendor to wishlist
  async saveVendor(userId, vendorId, notes = "") {
    try {
      const existing = await SavedVendor.findOne({
        where: { userId, vendorId },
      });
      
      if (existing) {
        throw new Error("Vendor already saved");
      }
      
      const saved = await SavedVendor.create({
        userId,
        vendorId,
        notes,
      });
      
      return saved;
    } catch (error) {
      throw error;
    }
  }

  // Get saved vendors by user
  async getSavedVendorsByUser(userId) {
    try {
      const saved = await SavedVendor.findAll({
        where: { userId },
        include: [{ model: Vendor }],
        order: [["createdAt", "DESC"]],
      });
      return saved;
    } catch (error) {
      throw error;
    }
  }

  // Remove saved vendor
  async removeSavedVendor(userId, vendorId) {
    try {
      const saved = await SavedVendor.findOne({
        where: { userId, vendorId },
      });
      
      if (!saved) {
        throw new Error("Saved vendor not found");
      }
      
      await saved.destroy();
      return { message: "Vendor removed from wishlist" };
    } catch (error) {
      throw error;
    }
  }

  // Update notes
  async updateNotes(userId, vendorId, notes) {
    try {
      const saved = await SavedVendor.findOne({
        where: { userId, vendorId },
      });
      
      if (!saved) {
        throw new Error("Saved vendor not found");
      }
      
      await saved.update({ notes });
      return saved;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SavedVendorService();