const AppointmentController = require("../controllers/AppointmentController");

const router = require("express").Router();

router.post("/get", AppointmentController.getAllAppointmentsById);

module.exports = router;
