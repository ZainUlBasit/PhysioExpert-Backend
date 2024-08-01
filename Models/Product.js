const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const ProductSchema = new Schema({
  name: reqStr,
  imageUrl: reqStr,
  price: {
    type: Number,
    required: true,
  },
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
