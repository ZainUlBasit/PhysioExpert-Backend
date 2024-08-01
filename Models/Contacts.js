const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const ContactsSchema = new Schema({
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
});

module.exports =
  mongoose.models.Contacts || mongoose.model("Contacts", ContactsSchema);
