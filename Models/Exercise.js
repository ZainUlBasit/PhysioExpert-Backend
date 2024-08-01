const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const ExerciseSchema = new Schema({
  title: reqStr,
  sourceUrl: reqStr,
  categoryId: { type: mongoose.Types.ObjectId, ref: "Category" },
  type: {
    type: Number,
    enum: [1, 2], // 1: Videos, 2: Physical
    required: true,
  },
});

module.exports =
  mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
