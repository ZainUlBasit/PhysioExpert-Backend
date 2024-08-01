const Joi = require("joi");

const productSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  qty: Joi.number().required(),
  amount: Joi.number().required(),
});

const productOrderSchema = Joi.object({
  name: Joi.string().required(),
  mobile_no: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
  products: Joi.array().items(productSchema).required(),
  total_amount: Joi.number().required(),
});

module.exports = { productOrderSchema };
