const Service = require("../Models/Service"); // Adjust the path according to your file structure
const { createError, successMessage } = require("../utils/ResponseMessage"); // Adjust the path according to your file structure

// Create a new service
const createService = async (req, res) => {
  const { name, imageUrl, price } = req.body;
  try {
    const newService = new Service({ name, imageUrl, price });
    const savedService = await newService.save();
    return successMessage(res, savedService, "Service created successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    return successMessage(res, services, "Services retrieved successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return createError(res, 404, "Service not found");
    }
    return successMessage(res, service, "Service retrieved successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Update a service by ID
const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl, price } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, imageUrl, price },
      { new: true }
    );
    if (!updatedService) {
      return createError(res, 404, "Service not found");
    }
    return successMessage(res, updatedService, "Service updated successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Delete a service by ID
const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return createError(res, 404, "Service not found");
    }
    return successMessage(res, deletedService, "Service deleted successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
