const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/ExerciseController"); // Adjust the path according to your file structure

router.post("/create", ExerciseController.createExercise);
router.get("/allexercises", ExerciseController.getAllExercises);
router.get("/allvideos", ExerciseController.getAllVideos);
router.get("/:id", ExerciseController.getExerciseById);
router.patch("/:id", ExerciseController.updateExercise);
router.delete("/:id", ExerciseController.deleteExercise);

module.exports = router;
