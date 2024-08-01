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
  gender: reqStr,
  address: String,
  imageUrl: String,
  clinic_timing: [
    { day: String, available: Boolean, to: String, from: String },
  ],
  docUrl: String,
  isApproved: { type: Boolean, default: false },
  Chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
});

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
