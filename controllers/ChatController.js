const Chat = require("../Models/Chat");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");
const { successMessage, createError } = require("../utils/ResponseMessage");

const sendMessage = async (req, res) => {
  const { patientId, doctorId, message, date, sender } = req.body;
  if (!patientId || !doctorId || !message || !date || !sender) {
    return createError(res, 422, "Required fields are undefined!");
  }
  // sender= 2: patient, 1: Doctor
  try {
    const AddChat = new Chat({
      patientId,
      doctorId,
      message,
      date,
      user_type: sender,
    });
    await AddChat.save();

    const doctorAccount = await Doctor.findById(doctorId);
    if (!doctorAccount.Chats) {
      doctorAccount.Chats = [];
    }
    doctorAccount.Chats.push(AddChat._id);
    await doctorAccount.save();

    const patientAccount = await Patient.findById(patientId);
    if (!patientAccount.Chats) {
      patientAccount.Chats = [];
    }
    patientAccount.Chats.push(AddChat._id);
    await patientAccount.save();
    return successMessage(
      res,
      {
        AddChat,
      },
      "Message Successfully Sended!"
    );
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

module.exports = { sendMessage };
