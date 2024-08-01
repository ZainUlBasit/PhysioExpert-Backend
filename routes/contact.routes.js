const { VerifyUserCookie, VerifyAdmin } = require("../Middleware/auth");
const ContactController = require("../controllers/ContactController");

const router = require("express").Router();

router.post("/create", ContactController.createContact);
router.get("/patient/:id", ContactController.getPatientsContactById);
router.get("/doctor/:id", ContactController.getDoctorsContactById);

module.exports = router;
