const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController"); // Adjust the path as necessary

// Create a new product
router.post("/create", productController.createProduct);

// Get all products
router.get("/all", productController.getAllProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID
router.patch("/:id", productController.updateProduct);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
