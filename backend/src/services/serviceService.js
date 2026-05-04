const { Service, Vendor } = require("../models");

class ServiceService {
  // Create a new service
  async createService(serviceData) {
    try {
      const service = await Service.create(serviceData);
      return service;
    } catch (error) {
      throw error;
    }
  }

  // Get all services
  async getAllServices() {
    try {
      const services = await Service.findAll({
        include: [{ model: Vendor, attributes: ["businessName"] }],
      });
      return services;
    } catch (error) {
      throw error;
    }
  }

  // Get services by vendor
  async getServicesByVendor(vendorId) {
    try {
      const services = await Service.findAll({
        where: { vendorId, isActive: true },
      });
      return services;
    } catch (error) {
      throw error;
    }
  }

  // Get service by ID
  async getServiceById(id) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error("Service not found");
      }
      return service;
    } catch (error) {
      throw error;
    }
  }

  // Update service
  async updateService(id, updateData) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error("Service not found");
      }
      
      await service.update(updateData);
      return service;
    } catch (error) {
      throw error;
    }
  }

  // Delete service
  async deleteService(id) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error("Service not found");
      }
      
      await service.destroy();
      return { message: "Service deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServiceService();