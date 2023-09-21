const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const exerciseDiarySchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: "exercise",
    required: true,
  },
  date: {
    type: Date,
    format: "dd/mm/YYYY",
    required: true,
  },
  time: {
    type: Number,
    min: 1,
    required: true,
  },
  calories: {
    type: Number,
    min: 1,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
},
{ versionKey: false, timestamps: true }
);

exerciseDiarySchema.post("save", handleMongooseError);

const ExerciseDiary = model("diary_exercise", exerciseDiarySchema);

const addExerciseDiarySchema = Joi.object({
  exerciseId: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
  owner: Joi.string().required(),
});

const schemas = {
  addExerciseDiarySchema,
}

module.exports = {
  ExerciseDiary,
  schemas,
};