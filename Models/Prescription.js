const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const PrescriptionSchema = new Schema({
  history_complaints: String,
  assessment: String,
  differential_diagnosis: String,
  management: String,
  remarks: String,
  exercises: [String],
  videos: [String],
  date: { type: Number, default: Math.floor(Date.now() / 1000) },
});

module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
