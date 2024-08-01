const Exercise = require("../Models/Exercise");
const { createError, successMessage } = require("../utils/ResponseMessage");

// Create a new exercise
const createExercise = async (req, res) => {
  try {
    const { title, sourceUrl, categoryId, type } = req.body;

    const newExercise = new Exercise({ title, sourceUrl, categoryId, type });
    await newExercise.save();

    successMessage(res, newExercise, "Exercise created successfully!");
  } catch (error) {
    createError(res, 500, error.message);
  }
};

// Get all exercises
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ type: 2 }).populate(
      "categoryId",
      "name"
    ); // Populate category name
    successMessage(res, exercises, "Exercises retrieved successfully!");
  } catch (error) {
    createError(res, 500, "Error retrieving exercises");
  }
};
const getAllVideos = async (req, res) => {
  try {
    const exercises = await Exercise.find({ type: 1 }).populate(
      "categoryId",
      "name"
    ); // Populate category name
    successMessage(res, exercises, "Exercises retrieved successfully!");
  } catch (error) {
    createError(res, 500, "Error retrieving exercises");
  }
};

// Get an exercise by ID
const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id).populate("categoryId", "name");

    if (!exercise) {
      return createError(res, 404, "Exercise not found");
    }

    successMessage(res, exercise, "Exercise retrieved successfully!");
  } catch (error) {
    createError(res, 500, "Error retrieving exercise");
  }
};

// Update an exercise by ID
const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedExercise = await Exercise.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name");

    if (!updatedExercise) {
      return createError(res, 404, "Exercise not found");
    }

    successMessage(res, updatedExercise, "Exercise updated successfully!");
  } catch (error) {
    createError(res, 500, "Error updating exercise");
  }
};

// Delete an exercise by ID
const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExercise = await Exercise.findByIdAndDelete(id);

    if (!deletedExercise) {
      return createError(res, 404, "Exercise not found");
    }

    successMessage(res, null, "Exercise deleted successfully!");
  } catch (error) {
    createError(res, 500, "Error deleting exercise");
  }
};

module.exports = {
  createExercise,
  getAllExercises,
  getAllVideos,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
