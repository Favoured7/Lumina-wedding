const { serviceService } = require("../services");

class ServiceController {
  async createService(req, res) {
    try {
      const service = await serviceService.createService(req.body);
      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllServices(req, res) {
    try {
      const services = await serviceService.getAllServices();
      res.json({
        success: true,
        count: services.length,
        data: services,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getServicesByVendor(req, res) {
    try {
      const services = await serviceService.getServicesByVendor(req.params.vendorId);
      res.json({
        success: true,
        count: services.length,
        data: services,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getServiceById(req, res) {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      res.json({
        success: true,
        data: service,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateService(req, res) {
    try {
      const service = await serviceService.updateService(req.params.id, req.body);
      res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteService(req, res) {
    try {
      const result = await serviceService.deleteService(req.params.id);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ServiceController();