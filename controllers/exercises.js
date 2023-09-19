const { Exercise, UserExercise } = require('../models/exercise');

const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');

const getAllExercises = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Exercise.find({}, '-createdAt -updatedAt', {
    skip,
    limit,
  });

  res.status(200).json(result);
};


const getExercisesById = async (req, res) => {
  const { id } = req.params;
  const result = await Exercise.findById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const addExercise = async (req, res) => {
  const { _id: owner } = req.user;
  const { exerciseId, time, date, calories } = req.body;
  

  const exerciseData = await Exercise.findById(exerciseId);

  if (!exerciseData) {
    return res.status(404).json({ message: "Exercise not found" });
  }

  const result = await UserExercise.create({ owner, exercise: {...exerciseData}, time, date, calories });

  res.status(201).json(result);
};

module.exports = {
    getAllExercises: ctrlWrapper(getAllExercises),
    getExercisesById: ctrlWrapper(getExercisesById),
    addExercise: ctrlWrapper(addExercise),
};