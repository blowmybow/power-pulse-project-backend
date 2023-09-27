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

router.delete("/:exerciseIdUser/:date", authenticate, ctrl.deleteDatedExercise);

module.exports = router;
