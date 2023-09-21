const { Schema, model } = require("mongoose");

const productSchema = new Schema({}, { versionKey: false });

const Product = model("product", productSchema);

module.exports = Product;
