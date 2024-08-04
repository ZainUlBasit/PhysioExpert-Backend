const AppointmentController = require("../controllers/AppointmentController");

const router = require("express").Router();

router.post("/get", AppointmentController.getAllAppointmentsById);
router.post("/available_slots", AppointmentController.checkSlot);
router.patch("/update_prescription", AppointmentController.UpdatePrescription);

module.exports = router;
