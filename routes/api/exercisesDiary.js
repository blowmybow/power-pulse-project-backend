const express = require("express");

const ctrl = require("../../controllers/exercisesDiary");

const { validateBody, authenticate } = require("../../middlewares");

const {schemas} = require("../../models/exerciseDiary");

const router = express.Router();

router.get("/", authenticate, ctrl.getDatedExercise);

router.post("/", authenticate, validateBody(schemas.addExerciseDiarySchema), ctrl.addDatedExercise);

router.delete("/:exercise", authenticate, ctrl.deleteDatedExercise);

module.exports = router;
//1234Asd
//{
//   "name": "Andrii2",
//   "email": "andrii2@gmail.com",
//   "password": "1234Asd"
// }