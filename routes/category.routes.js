const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

// Define the routes and map them to controller functions
router.post("/create", categoryController.createCategory);
router.get("/all", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
