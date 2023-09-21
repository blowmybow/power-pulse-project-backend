const { ExerciseDiary } = require("../models/exerciseDiary");

const { HttpError, ctrlWrapper } = require("../helpers");

const getDatedExercise = async (req, res) => {
    const {_id: owner} = req.user;
    console.log("user:", req.user);
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
    const result = await ExerciseDiary.find({owner}, "-createdAt -updatedAt", {skip, limit});
    res.json(result);
};


const addDatedExercise = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await ExerciseDiary.create({...req.body, owner});
  res.status(201).json(result);
};

const deleteDatedExercise = async (req, res) => {
  const {_id: owner} = req.user;    
  const { date } = req.params;
  const { exercise } = req.params;
  const result = await ExerciseDiary.findOneandDelete({date: date, exercise: exercise, owner: owner});
  if (!result) {
      throw HttpError(404, "Not found");
  }        
  res.json({
      message: "Delete success"
  })
};

module.exports = {
  getDatedExercise: ctrlWrapper(getDatedExercise),
  addDatedExercise: ctrlWrapper(addDatedExercise),
  deleteDatedExercise: ctrlWrapper(deleteDatedExercise),
}