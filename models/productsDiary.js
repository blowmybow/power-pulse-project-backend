const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const productDiarySchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  date: {
    type: Date,
    format: "dd/mm/YYYY",
    required: true,
  },
  amount: {
    type: Number,
    min: 1,
    required: true,
  },
  calories: {
    type: Number,
    min: 1,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
},
{ versionKey: false, timestamps: true }
);

productDiarySchema.post("save", handleMongooseError);

const ProductDiary = model("diary_product", productDiarySchema);

const addProductDiarySchema = Joi.object({
  productId: Joi.string().required(),
  date: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  owner: Joi.string().required(),
});

const schemas = {
  addProductDiarySchema,
}

module.exports = {
  ProductDiary,
  schemas,
};