const { VerifyUserCookie, VerifyAdmin } = require("../Middleware/auth");
const DoctorController = require("../controllers/DoctorController");

const router = require("express").Router();

router.post("/create", DoctorController.createDoctor);
router.patch("/approved/:id", DoctorController.approvedDoctor);
router.delete("/rejected/:id", DoctorController.rejectDoctor);
router.get("/", DoctorController.getAllDoctors);
router.get("/requests", DoctorController.getDoctorsRequests);
router.delete("/:id", DoctorController.deleteDoctor);
router.patch("/:id", DoctorController.updateDoctor);

module.exports = router;
