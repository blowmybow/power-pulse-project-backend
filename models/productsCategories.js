const { Schema, model } = require("mongoose");

const productsCategoriesSchema = new Schema(
  {
    categories: {
      type: Array,
    },
  },
  { versionKey: false }
);

const ProductsCategories = model("category", productsCategoriesSchema);

module.exports = ProductsCategories;
