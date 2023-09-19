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
    },
    { versionKey: false, timestamps: true }
  );

  const userExerciseSchema = new Schema(
    {
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      exercise: {
        type: Object,
        
        required: true,
      },
      time: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      calories: {
        type: Number,
        required: true,
      },
    },
    { versionKey: false, timestamps: true }
  );
  
  const UserExercise = model('user_exercise', userExerciseSchema);
  
  userExerciseSchema.post('save', handleMongooseError);
  
  const addSchema = Joi.object({
    time: Joi.number().min(1).required(),
    exerciseId: Joi.string().required(),
    date: Joi.string().required(),
    calories: Joi.number().min(1).required(),
  });
  
  const schemas = {
    addSchema,
  }

  const Exercise = model('exercise', exerciseSchema);
  
  
  module.exports = {
    Exercise,
    UserExercise,
    schemas,
  };