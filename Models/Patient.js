const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const PatientSchema = new Schema({
  name: reqStr,
  mobile_no: reqStr,
  gender: String,
  age: Number,
  address: String,
  imageUrl: String,
  Chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
});

module.exports =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
