const Product = require("../Models/Product"); // Adjust the path to your Product model as necessary
const { successMessage, createError } = require("../utils/ResponseMessage");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, imageUrl, price } = req.body;
    const newProduct = new Product({ name, imageUrl, price });
    await newProduct.save();
    return successMessage(res, newProduct, "Product created successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return successMessage(res, products, "Products retrieved successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return createError(res, 404, "Product not found");
    }
    return successMessage(res, product, "Product retrieved successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, imageUrl, price },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return createError(res, 404, "Product not found");
    }
    return successMessage(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return createError(res, 404, "Product not found");
    }
    return successMessage(res, deletedProduct, "Product deleted successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
