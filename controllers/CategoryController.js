const Category = require("../Models/Category");
const Joi = require("joi");
const mongoose = require("mongoose");
const { createError, successMessage } = require("../utils/ResponseMessage");

// Joi schema for validation
const categorySchema = Joi.object({
  name: Joi.string().required(),
});

// Create a new category
const createCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return createError(res, 400, error.details[0].message);

  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    return successMessage(res, category, "Category created successfully");
  } catch (err) {
    return createError(res, 500, "Server error");
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return successMessage(res, categories, "Categories retrieved successfully");
  } catch (err) {
    return createError(res, 500, "Server error");
  }
};

// Get a single category by ID
const getCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return createError(res, 400, "Invalid category ID");
  }

  try {
    const category = await Category.findById(id);
    if (!category) return createError(res, 404, "Category not found");
    return successMessage(res, category, "Category retrieved successfully");
  } catch (err) {
    return createError(res, 500, "Server error");
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { error } = categorySchema.validate(req.body);
  if (error) return createError(res, 400, error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return createError(res, 400, "Invalid category ID");
  }

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );
    if (!category) return createError(res, 404, "Category not found");
    return successMessage(res, category, "Category updated successfully");
  } catch (err) {
    return createError(res, 500, "Server error");
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return createError(res, 400, "Invalid category ID");
  }

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return createError(res, 404, "Category not found");
    return successMessage(res, null, "Category deleted successfully");
  } catch (err) {
    return createError(res, 500, "Server error");
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
