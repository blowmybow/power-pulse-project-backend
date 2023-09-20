const dailyCaloriesCalc = (
  desiredWeight,
  height,
  birthday,
  sex,
  levelActivity
) => {
  const bmrConstants = {
    male: 5,
    female: -161,
  };

  const activityLevels = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };

  const bdDate = new Date(birthday);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - bdDate.getFullYear();

  const sexBmrConstant =
    sex === "male" ? bmrConstants.male : bmrConstants.female;

  const result =
    (10 * desiredWeight + 6.25 * height - 5 * age + sexBmrConstant) *
    activityLevels[levelActivity];

  return Math.round(result);
};

module.exports = dailyCaloriesCalc;
