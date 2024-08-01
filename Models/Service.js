const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const ServiceSchema = new Schema({
  name: reqStr,
  imageUrl: reqStr,
});

module.exports =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);
