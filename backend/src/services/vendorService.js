const { Vendor, User } = require("../models");

class VendorService {
  async getAllVendors() {
    const vendors = await Vendor.findAll({
      include: [{ model: User, attributes: ["name", "email", "phone"] }],
      order: [["rating", "DESC"]],
    });
    return vendors;
  }

  async getVendorById(id) {
    const vendor = await Vendor.findByPk(id, {
      include: [{ model: User, attributes: ["name", "email", "phone"] }],
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return vendor;
  }

  async getVendorsByType(vendorType) {
    const vendors = await Vendor.findAll({
      where: { vendorType, isApproved: true },
      include: [{ model: User, attributes: ["name", "email", "phone"] }],
      order: [["rating", "DESC"]],
    });
    return vendors;
  }
}

module.exports = new VendorService();