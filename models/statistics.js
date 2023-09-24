const { Schema, model } = require("mongoose");

const productSchema = new Schema({}, { versionKey: false });

const Statistics = model("diary_exercises", productSchema);

module.exports = Statistics;
