const { Schema, model } = require("mongoose");

const productsCategoriesSchema = new Schema({}, { versionKey: false });

const ProductsCategories = model("category", productsCategoriesSchema);

module.exports = ProductsCategories;
