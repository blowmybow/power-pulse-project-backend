const { Exercise } = require('../models/exercise');

const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');

// const getAllExercises = async (req, res) => {
//   const { _id: owner } = req.user;
//   const { page = 1, limit = 20 } = req.query;
//   const skip = (page - 1) * limit;
//   const result = await Exercise.find({ owner }, '-createdAt -updatedAt', {
//     skip,
//     limit,
//   }).populate('owner', 'email');
//   res.status(200).json(result);
// };

const getAllExercises = async (req, res) => {
  
  const result = await Exercise.find();
  res.json(result);
};

const getSubcategoriesByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 20 } = req.query;

  let exercises = [];

  switch (category) {
    case 'bodyParts':
      exercises = await Exercise.find({ bodyPart: { $exists: true, $ne: null } })
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    case 'muscles':
      exercises = await Exercise.find({ target: { $exists: true, $ne: null } })
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    case 'equipment':
      exercises = await Exercise.find({ equipment: { $exists: true, $ne: null } })
        .skip((page - 1) * limit)
        .limit(limit);
      break;
    default:
      exercises = [];
      break;
  }

  res.status(200).json(exercises);
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
  const result = await Exercise.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeExercise = async (req, res) => {
  const { id } = req.params;
  const result = await Exercise.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({
    message: 'Exercise deleted',
  });
};

const updateExercise = async (req, res) => {
  const { id } = req.params;
  const result = await Exercise.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const updateStatusExercise = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    throw HttpError(400, 'missing field favorite');
  }

  const result = await Exercise.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

module.exports = {
    getAllExercises: ctrlWrapper(getAllExercises),
    getSubcategoriesByCategory: ctrlWrapper(getSubcategoriesByCategory),
    getExercisesById: ctrlWrapper(getExercisesById),
    removeExercise: ctrlWrapper(removeExercise),
    addExercise: ctrlWrapper(addExercise),
    updateExercise: ctrlWrapper(updateExercise),
    updateStatusExercise: ctrlWrapper(updateStatusExercise),
};