const vendorService = require("../services/vendorService");

class VendorController {
  async getAllVendors(req, res) {
    try {
      const vendors = await vendorService.getAllVendors();
      res.json({
        success: true,
        count: vendors.length,
        data: vendors,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVendorById(req, res) {
    try {
      const vendor = await vendorService.getVendorById(req.params.id);
      res.json({
        success: true,
        data: vendor,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getVendorsByType(req, res) {
    try {
      const vendors = await vendorService.getVendorsByType(req.params.type);
      res.json({
        success: true,
        count: vendors.length,
        data: vendors,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VendorController();