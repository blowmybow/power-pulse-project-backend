const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

productSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const Product = model("product", productSchema);

module.exports = Product;
