
const  dailyCaloriesCalc = (sex, birthday, height, desiredWeight, activityLevel) => {

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
    const age = new Date().getFullYear() - bdDate.getFullYear();
  
    return (
        ((10 * desiredWeight) + (6.25 * height) - (5 * age) + bmrConstants[sex]) * activityLevels[activityLevel]
    )

  }
  
  module.exports = dailyCaloriesCalc;