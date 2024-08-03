const dayjs = require("dayjs");
const Appointment = require("../Models/Appointment");
const Doctor = require("../Models/Doctor");
const { successMessage, createError } = require("../utils/ResponseMessage");

// Generate time slots with a 30-minute gap
const generateTimeSlots = (selectedDaySlots) => {
  const slots = [];
  let currentTime = dayjs(selectedDaySlots.from, "HH:mm");

  const endTime = dayjs(selectedDaySlots.to, "HH:mm");

  console.log(
    `Generating time slots from ${selectedDaySlots.from} to ${selectedDaySlots.to}`
  );

  while (currentTime.isBefore(endTime)) {
    const nextTime = currentTime.add(30, "minute");
    slots.push(`${currentTime.format("HH:mm")} - ${nextTime.format("HH:mm")}`);
    console.log(
      `Generated slot: ${currentTime.format("HH:mm")} - ${nextTime.format(
        "HH:mm"
      )}`
    );
    currentTime = nextTime;
  }

  console.log(`All generated slots: ${slots}`);
  return slots;
};

// Get all appointments by patient or doctor ID
const getAllAppointmentsById = async (req, res) => {
  try {
    const { id, type } = req.body;
    let appointments;

    if (type === "patient") {
      appointments = await Appointment.find({ patientId: id })
        .populate("patientId")
        .populate("doctorId")
        .populate("prescription");
    } else if (type === "doctor") {
      appointments = await Appointment.find({ doctorId: id })
        .populate("patientId")
        .populate("doctorId")
        .populate("prescription");
    } else if (type === "all") {
      appointments = await Appointment.find({})
        .populate("patientId")
        .populate("doctorId")
        .populate("prescription");
    } else {
      return createError(
        res,
        400,
        "Invalid type specified. Use 'patient' or 'doctor'."
      );
    }

    if (!appointments.length) {
      return createError(res, 404, "No appointments found");
    }

    return successMessage(
      res,
      appointments,
      "Appointments retrieved successfully"
    );
  } catch (error) {
    return createError(res, 400, error.message);
  }
};

const checkSlot = async (req, res) => {
  try {
    const { doctorId, date, slots, available } = req.body;
    if (!available) return createError(res, 400, "Not Available");
    const timestampDate = dayjs(date).startOf("day").unix();
    const filterSlots = await Promise.all(
      slots.map(async (dt) => {
        const appointment = await Appointment.exists({
          doctorId,
          time_slot: dt,
          date: timestampDate,
        });
        if (!appointment) return dt;
      })
    );

    return successMessage(
      res,
      filterSlots.filter((dt) => dt),
      "Appointments retrieved successfully"
    );
  } catch (error) {
    console.log(error);
    return createError(res, 400, error.message);
  }
};

module.exports = {
  getAllAppointmentsById,
  checkSlot,
};
