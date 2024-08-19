const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const BlogSchema = new Schema({
  title: reqStr,
  imageUrl: reqStr,
  desc: reqStr,
  date: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
