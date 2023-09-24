const express = require("express");

const ctrl = require("../../controllers/exercisesDiary");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/exerciseDiary");

const router = express.Router();

router.get("/:date", authenticate, ctrl.getDatedExercise);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addExerciseDiarySchema),
  ctrl.addDatedExercise
);

router.delete("/:exercise/:date", authenticate, ctrl.deleteDatedExercise);

module.exports = router;
//1234Asd
//{
//   "email": "andrii2@gmail.com",
//   "password": "1234Asd"
// }

// {
//   "exerciseId": "650431e442f30f1602062518",
//   "date": "21/09/2023",
//   "time": 10,
//   "calories": 200,
//   "owner": "650b2e786360fe740b811ccc",
// }
