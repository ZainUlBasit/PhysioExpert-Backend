const Appointment = require("../Models/Appointment");
const Blog = require("../Models/Blog"); // Adjust the path according to your file structure
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");
const Product = require("../Models/Product");
const { createError, successMessage } = require("../utils/ResponseMessage"); // Adjust the path according to your file structure

// Get all blogs
const getAdminStats = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const patients = await Patient.find();
    const products = await Product.find();
    const appointments = await Appointment.find();
    return successMessage(
      res,
      [
        {
          no_of_doctors: doctors.length,
          no_of_patients: patients.length,
          no_of_products: products.length,
          no_of_appointments: appointments.length,
        },
      ],
      "Blogs retrieved successfully"
    );
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

module.exports = {
  getAdminStats,
};
