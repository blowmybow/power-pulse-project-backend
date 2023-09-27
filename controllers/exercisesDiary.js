const { ExerciseDiary } = require("../models/exerciseDiary");

const { HttpError, ctrlWrapper } = require("../helpers");
const Exercise = require("../models/exercise");

const getDatedExercise = async (req, res) => {
  const { _id: owner } = req.user;

  const {
    userParams: { blood },
  } = req.user;

  if (!blood) {
    throw HttpError(400, "Not user params");
  }

  const { page = 1, limit = 10 } = req.query;
  const { date } = req.params;
  const skip = (page - 1) * limit;
  const result = await ExerciseDiary.find(
    { owner, date },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).lean();
  let allCaloriesDay = 0;
  let allTimeDay = 0;

  for (const obj of result) {
    allCaloriesDay += obj.calories;
    allTimeDay += obj.time;
    const exerciseId = obj.exerciseId;
    const exercise = await getExerciseById(exerciseId);
    obj.exercise = exercise;
  }
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ result, allCaloriesDay, allTimeDay });
};

const getExerciseById = async (id) => {
  const result = await Exercise.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  return result;
};

const addDatedExercise = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await ExerciseDiary.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteDatedExercise = async (req, res) => {
  const { _id: owner } = req.user;
  const { exerciseIdUser } = req.params;
  const { date } = req.params;
  const result = await ExerciseDiary.findOneAndDelete({
    _id: exerciseIdUser,
    owner,
    date,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success",
  });
};

module.exports = {
  getDatedExercise: ctrlWrapper(getDatedExercise),
  addDatedExercise: ctrlWrapper(addDatedExercise),
  deleteDatedExercise: ctrlWrapper(deleteDatedExercise),
};
