const { Schema, model } = require("mongoose");

const productsCategoriesSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

productsCategoriesSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const ProductsCategories = model("category", productsCategoriesSchema);

module.exports = ProductsCategories;
