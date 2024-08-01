const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller"); // Adjust the path according to your file structure

router.post("/create", serviceController.createService);
router.get("/all", serviceController.getServices);
router.get("/:id", serviceController.getServiceById);
router.patch("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

module.exports = router;
