const Joi = require("joi");
const Patient = require("../Models/Patient");
const { successMessage, createError } = require("../utils/ResponseMessage");
const User = require("../Models/User");
const Doctor = require("../Models/Doctor");
const Appointment = require("../Models/Appointment");
const Prescription = require("../Models/Prescription");
const dayjs = require("dayjs");

// Define the Joi schema for validation
const patientSchema = Joi.object({
  name: Joi.string().required(),
  mobile_no: Joi.string().required(),
  gender: Joi.string().optional(),
  age: Joi.number().optional(),
  address: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
});

// Create a new patient
const createPatient = async (req, res) => {
  try {
    const { error } = patientSchema.validate(req.body);
    if (error) return createError(res, 400, error.details[0].message);

    const patient = new Patient(req.body);
    await patient.save();
    return successMessage(res, patient, "Patient created successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("Chats");
    return successMessage(res, patients, "Patients retrieved successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Get a patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return createError(res, 404, "Patient not found");
    }
    return successMessage(res, patient, "Patient retrieved successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Update a patient by ID
const updatePatient = async (req, res) => {
  try {
    const { error } = patientSchema.validate(req.body);
    if (error) return createError(res, 400, error.details[0].message);

    const user = await User.findOneAndUpdate(
      { patientId: req.params.id },
      { name: req.body.name, mobile_no: req.body.mobile_no },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) return createError(res, 404, "Patient not found");

    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return createError(res, 404, "Patient not found");
    }
    return successMessage(res, patient, "Patient updated successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return createError(res, 404, "Patient not found");
    }
    return successMessage(res, null, "Patient deleted successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

const placePatientAppointment = async (req, res) => {
  try {
    const {
      patient_name,
      doctor_name,
      patientId,
      doctorId,
      date,
      consult_type,
      time_slot,
    } = req.body;
    if (
      !doctorId ||
      !patientId ||
      !doctor_name ||
      !patient_name ||
      !date ||
      !consult_type ||
      !time_slot
    ) {
      return createError(res, 422, "Required field are undefined!");
    } else {
      const patient = await Patient.findOne({
        _id: patientId,
      });
      if (!patient)
        return createError(res, 404, "Invalid ID Patient not found!");

      const doctor = await Doctor.findOne({ _id: doctorId });
      if (!doctor) {
        return createError(res, 404, "Invalid ID Doctor not found!");
      }
      const startOfDayTimestamp = dayjs(date).startOf("da y").unix();

      const addPrescription = await Prescription({
        history_complaints: "",
        assessment: "",
        differential_diagnosis: "",
        management: "",
        remarks: "",
        exercises: [""],
        date: startOfDayTimestamp,
      });
      await addPrescription.save();

      const addAppointment = await Appointment({
        patientId: patientId,
        doctorId: doctorId,
        patient_name: patient_name,
        doctor_name: doctor_name,
        consult_type,
        date: startOfDayTimestamp,
        prescription: addPrescription._id,
        time_slot: time_slot,
      });

      await addAppointment.save();

      if (addAppointment) {
        return successMessage(
          res,
          addAppointment,
          "Appointment Successfully added!"
        );
      } else return createError(res, 400, "Unable to add Appointment!");
    }
  } catch (error) {
    console.log(error);
    return createError(res, 400, { error: error.message });
  }
};

module.exports = {
  placePatientAppointment,
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
