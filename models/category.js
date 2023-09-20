const { Schema, model } = require("mongoose");


const CategorySchema = new Schema(
    {
        filter: {
        type: String,
      },
  
      name: {
        type: String,
      },

      imgURL: {
        type: String,
      },

    },
    { versionKey: false, timestamps: true }
  );
  
  const Category = model('filters', CategorySchema);
  
  module.exports = Category;