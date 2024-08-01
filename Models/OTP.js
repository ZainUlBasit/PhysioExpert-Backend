const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const OTPSchema = new Schema({
  accountId: reqStr,
  otp: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
