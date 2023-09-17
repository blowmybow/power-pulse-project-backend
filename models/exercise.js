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

      favorite: {
        type: Boolean,
        default: false,
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
    bodyPart: Joi.string(),
    equipment: Joi.string(),
    name: Joi.string(),
    target: Joi.string(),
    burnedCalories: Joi.number(),
    time: Joi.number(),
    favorite: Joi.boolean().optional(),
  });

 
  const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean()
      .required()
      .messages({ 'any.required': `Missing field favorite` }),
  });
  
  const schemas = {
    addSchema,
    updateFavoriteSchema,
  }

  const Exercise = model('exercise', exerciseSchema);
  
  
  module.exports = {
    Exercise,
    schemas,
  };