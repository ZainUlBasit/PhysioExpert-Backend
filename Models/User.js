const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const UserSchema = new Schema({
  name: reqStr,
  email: String,
  mobile_no: String,
  password: String,
  role: {
    type: Number,
    enum: [1, 2, 3], // 1: admin, 2: Doctor , 3: Patient
    required: true,
  },
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
