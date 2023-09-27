const Exercise = require("../models/exercise");
const { User } = require("../models/user");
const { ExerciseDiary } = require("../models/exerciseDiary");

const ctrlWrapper = require("../helpers/ctrlWrapper");

const statistics = async (req, res) => {
  const usersData = await User.find();
  const exercisesData = await Exercise.find();
  const statisticsData = await ExerciseDiary.find()
    .select("calories time")
    .lean();

  let allCalories = 0;
  let allTimeMin = 0;

  statisticsData.forEach((obj) => {
    allCalories += obj.calories;
    allTimeMin += obj.time;
  });

  const allTime = Math.round(allTimeMin / 60);
  const result = {
    allUser: usersData.length,
    exercisesVideo: exercisesData.length,
    exercisesDone: statisticsData.length,
    allCalories,
    allTime,
  };

  res.json(result);
};

module.exports = {
  statistics: ctrlWrapper(statistics),
};
