const express = require("express");
const router = express.Router();
const productOrderController = require("../controllers/ProductOrderController"); // Adjust the path as necessary

// Create a new product order
router.post("/create", productOrderController.createProductOrder);
// Create a new product order
router.post("/place-order", productOrderController.placeAppointment);

// Get all products orders
router.get("/all", productOrderController.getAllProductOrders);

// Get a single product order by ID
router.get("/:id", productOrderController.getProductOrder);

// Get a single product order by ID
router.get("/:id", productOrderController.getProductOrder);

// Update a product order by ID
router.patch("/:id", productOrderController.updateProductOrder);

// Delete a product order by ID
router.delete("/:id", productOrderController.deleteProductOrder);

module.exports = router;
