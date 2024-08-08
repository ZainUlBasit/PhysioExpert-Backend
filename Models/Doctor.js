const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const DoctorSchema = new Schema({
  name: reqStr,
  mobile_no: reqStr,
  email: reqStr,
  desc: reqStr,
  gender: reqStr,
  address: String,
  imageUrl: String,
  clinic_timing: [
    { day: String, available: Boolean, to: String, from: String },
  ],
  docUrl: String,
  cuurent_plan: {
    type: Number,
    enum: [1, 2, 3], // 1: Basic, 2: Premium , 3: Standard
    required: true,
  },
  isApproved: { type: Boolean, default: false },
  Chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
});

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
