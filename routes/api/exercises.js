const express = require('express')
const { schemas } = require('../../models/exercise')
const router = express.Router()
const ctrl = require('../../controllers/exercises')
const { validateBody, isValidId, authenticate } = require('../../middlewares')

router.get('/', authenticate, ctrl.getAllExercises)

router.get('/bodyparts', authenticate, ctrl.getAllBodyParts);

router.get('/muscules', authenticate,ctrl.getAllMuscules);

router.get('/equipments', authenticate, ctrl.getAllEquipments);

router.get('/:id', authenticate, isValidId, ctrl.getExercisesById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addExercise)

module.exports = router