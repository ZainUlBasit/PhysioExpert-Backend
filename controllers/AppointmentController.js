const Appointment = require("../Models/Appointment");
const { successMessage, createError } = require("../utils/ResponseMessage");

// Get all appointments by patient or doctor ID
const getAllAppointmentsById = async (req, res) => {
  try {
    const { id, type } = req.body;
    let appointments;

    if (type === "patient") {
      appointments = await Appointment.find({ patientId: id })
        .populate("patientId")
        .populate("doctorId")
        .populate("prescription");
    } else if (type === "doctor") {
      appointments = await Appointment.find({ doctorId: id })
        .populate("patientId")
        .populate("doctorId")
        .populate("prescription");
    } else if (type === "all") {
      appointments = await Appointment.find({})
        .populate("patientId")
        .populate("doctorId")
        .populate("prescription");
    } else {
      return createError(
        res,
        400,
        "Invalid type specified. Use 'patient' or 'doctor'."
      );
    }

    if (!appointments.length) {
      return createError(res, 404, "No appointments found");
    }

    return successMessage(
      res,
      appointments,
      "Appointments retrieved successfully"
    );
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

module.exports = {
  getAllAppointmentsById,
};
