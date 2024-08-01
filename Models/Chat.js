const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const ChatSchema = new Schema({
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
  message: reqStr,
  user_type: {
    type: Number,
    enum: [1, 2], //  1: Doctor , 2: Patient
    required: true,
  },
  date: { type: Number, default: Math.floor(Date.now() / 1000) },
});

module.exports = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
