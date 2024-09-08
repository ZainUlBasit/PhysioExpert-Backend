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

    const io = req?.app?.io;

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
    if (io) {
      // console.log("yes");
      if (sender === 2) {
        const doctorRoom = `/doctor-${doctorId}`;
        console.log(`Emitting message to room: ${doctorRoom}`);
        io.to(doctorRoom).emit("receive-message", {
          message: "New message received from patient!",
          data: AddChat,
        });
      }
      if (sender === 1) {
        const patientRoom = `/patient-${patientId}`;
        console.log(`Emitting message to room: ${patientRoom}`);
        io.to(patientRoom).emit("receive-message", {
          message: "New message received from doctor!",
          data: AddChat,
        });
      }
    } else {
      return createError(res, 500, "Socket.io is not initialized");
    }
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
