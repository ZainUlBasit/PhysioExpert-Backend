const Doctor = require("../Models/Doctor");
const User = require("../Models/User");
const { successMessage, createError } = require("../utils/ResponseMessage");

// Create a new doctor
const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    return successMessage(res, doctor, "Doctor created successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true }).populate("Chats");
    return successMessage(res, doctors, "Doctors retrieved successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};
const getDoctorsRequests = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false });
    return successMessage(res, doctors, "Doctors retrieved successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Get a doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return createError(res, 404, "Doctor not found");
    }
    return successMessage(res, doctor, "Doctor retrieved successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Update a doctor by ID
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const doctorAccount = await User.findOneAndUpdate(
      { doctorId: req.params.id },
      {
        name: req.body.name,
        mobile_no: req.body.mobile_no,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!doctor) {
      return createError(res, 404, "Doctor not found");
    }
    return successMessage(res, doctor, "Doctor updated successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};
const approvedDoctor = async (req, res) => {
  if (!req.params.id) return createError(res, 422, "Doctor Id Required!");
  try {
    const doctorAccount = await User.findOneAndUpdate(
      { doctorId: req.params.id },
      { isApproved: true },
      {
        new: true,
        runValidators: true,
      }
    );
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!doctor) {
      return createError(res, 404, "Doctor not found");
    }
    return successMessage(res, doctor, "Doctor Approved successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};
const rejectDoctor = async (req, res) => {
  if (!req.params.id) return createError(res, 422, "Doctor Id Required!");
  try {
    const doctorAccount = await User.findOneAndDelete({
      doctorId: req.params.id,
    });
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return createError(res, 404, "Doctor not found");
    }
    return successMessage(res, doctor, "Doctor Deleted successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Delete a doctor by ID
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return createError(res, 404, "Doctor not found");
    }
    return successMessage(res, null, "Doctor deleted successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  approvedDoctor,
  getDoctorsRequests,
  rejectDoctor,
};
