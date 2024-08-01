const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  //   secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EmailName,
    pass: process.env.EmailPass,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (email, otp) => {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: {
        name: "Physio Experts",
        address: process.env.EmailName,
      }, // sender address
      to: email, // list of receivers
      subject: "Physio Experts Admin Verification ✔", // Subject line
      text: "Otp Verification", // plain text body
      html: `<b>Your OTP is ${otp}</b>`, // html body
    });
    return true;
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
    return false;
  }
};

module.exports = {
  sendMail,
};
