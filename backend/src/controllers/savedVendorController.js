const { savedVendorService } = require("../services");

class SavedVendorController {
  async saveVendor(req, res) {
    try {
      const { vendorId, notes } = req.body;
      const saved = await savedVendorService.saveVendor(req.userId, vendorId, notes);
      res.status(201).json({
        success: true,
        message: "Vendor saved to wishlist",
        data: saved,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMySavedVendors(req, res) {
    try {
      const saved = await savedVendorService.getSavedVendorsByUser(req.userId);
      res.json({
        success: true,
        count: saved.length,
        data: saved,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeSavedVendor(req, res) {
    try {
      const result = await savedVendorService.removeSavedVendor(req.userId, req.params.vendorId);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateNotes(req, res) {
    try {
      const { notes } = req.body;
      const saved = await savedVendorService.updateNotes(req.userId, req.params.vendorId, notes);
      res.json({
        success: true,
        message: "Notes updated successfully",
        data: saved,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new SavedVendorController();