const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const exerciseSchema = new Schema(
    {
      bodyPart: {
        type: String,
      },
  
      equipment: {
        type: String,
      },
  
      gifUrl: {
        type: String,
      },
  
      name: {
        type: String,
      },

      target: {
        type: String,
      },

      burnedCalories: {
        type: Number,
      },

      time: {
        type: Number,
      },

      // owner: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'user',
      //   required: true,
      // },
    },
    { versionKey: false, timestamps: true }
  );
  
  exerciseSchema.post('save', handleMongooseError);
  
  const addSchema = Joi.object({
    time: Joi.number().min(1).required(),
    exerciseId: Joi.string().required(),
    date: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required(),
    calories: Joi.number().min(1).required(),
  });
  
  const schemas = {
    addSchema,
  }

  const Exercise = model('exercise', exerciseSchema);
  
  
  module.exports = {
    Exercise,
    schemas,
  };