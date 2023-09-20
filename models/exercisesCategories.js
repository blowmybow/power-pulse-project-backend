const { Schema, model } = require("mongoose");


const exercisesCategoriesSchema = new Schema(
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
  
  const ExercisesCategories = model('filters', exercisesCategoriesSchema);
  
  module.exports = ExercisesCategories;