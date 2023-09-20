const { Exercise, UserExercise } = require('../models/exercise');
const {Bodyparts, Equipments, Muscules} = require('../models/allCategories')
// const { ExercisesCategories } = require('../models/exercisesCategories');

const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');

const getAllExercises = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Exercise.find({}, '-createdAt -updatedAt', {
    skip,
    limit,
  });

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json(result);
};

const getAllBodyParts = async (req, res) => {
  const result = await Bodyparts.find({ filter: 'Body parts' });

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const getAllMuscules = async (req, res) => {
  const result = await Muscules.find({ filter: 'Muscles' });

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const getAllEquipments = async (req, res) => {
  const result = await Equipments.find({ filter: 'Equipment' });

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

// const getSubcategoriesByCategory = async (req, res) => {
    
//   const { category } = req.params;
//   console.log(category)
//   const { page = 1, limit = 20 } = req.query;

//   let exercises = [];

//   switch (category) {
//     case 'bodyParts':
//     exercises = await ExercisesCategories.find({ filter: "Body parts" })
//     .skip((page - 1) * limit)
//     .limit(limit);
//   break;

//   case 'muscles':
//     exercises = await ExercisesCategories.find({ filter: "Muscles" })
//     .skip((page - 1) * limit)
//     .limit(limit);
//   break;

//   case 'equipment':
//     exercises = await ExercisesCategories.find({ filter: "Equipment" })
//     .skip((page - 1) * limit)
//     .limit(limit);
//   break;
//   }

//   res.status(200).json(exercises);
// };

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
    getAllBodyParts: ctrlWrapper(getAllBodyParts),
    getAllMuscules: ctrlWrapper(getAllMuscules),
    getAllEquipments: ctrlWrapper(getAllEquipments),
    // getSubcategoriesByCategory: ctrlWrapper(getSubcategoriesByCategory),
};