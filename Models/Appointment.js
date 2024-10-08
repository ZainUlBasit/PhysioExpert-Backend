const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const AppointmentSchema = new Schema({
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
  patient_name: reqStr,
  doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
  doctor_name: reqStr,
  time_slot: reqStr,
  status: {
    type: Number,
    enum: [1, 2], // 1: Pending, 2: Done
    required: true,
  },
  consult_type: {
    type: Number,
    enum: [1, 2], // 1: Online, 2: Physical
    required: true,
  },
  date: { type: Number, default: Math.floor(Date.now() / 1000) },
  prescription: { type: mongoose.Types.ObjectId, ref: "Prescription" },
});

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
