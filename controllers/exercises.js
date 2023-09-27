const Exercise = require('../models/exercise');
const {Bodyparts, Equipments, Muscules} = require('../models/allCategories')
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

module.exports = {
  getAllExercises: ctrlWrapper(getAllExercises),
  getAllBodyParts: ctrlWrapper(getAllBodyParts),
  getAllMuscules: ctrlWrapper(getAllMuscules),
  getAllEquipments: ctrlWrapper(getAllEquipments),
};