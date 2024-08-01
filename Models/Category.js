const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const CategorySchema = new Schema({
  name: reqStr,
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
