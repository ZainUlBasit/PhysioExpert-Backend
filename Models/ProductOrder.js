const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};
const reqNum = {
  type: Number,
  required: true,
};

const ProductOrderSchema = new Schema({
  name: reqStr,
  mobile_no: reqStr,
  email: reqStr,
  address: reqStr,
  products: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "Product" },
      name: reqStr,
      price: reqNum,
      qty: reqNum,
      amount: reqNum,
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    enum: [1, 2, 3, 4], // 1: Placed, 2: Confirmation , 3: Delivered, 4: Cancel
    required: true,
  },
});

module.exports =
  mongoose.models.ProductOrder ||
  mongoose.model("ProductOrder", ProductOrderSchema);
