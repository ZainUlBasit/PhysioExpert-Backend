const PatientController = require("../controllers/PatientController");

const router = require("express").Router();

router.post("/create", PatientController.createPatient);
router.get("/", PatientController.getAllPatients);
router.delete("/:id", PatientController.deletePatient);
router.patch("/:id", PatientController.updatePatient);
router.post("/add-appointment", PatientController.placePatientAppointment);
router.get("/get-exercises/:id", PatientController.getPatientExercises);

module.exports = router;
