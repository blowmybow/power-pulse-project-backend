const express = require('express')
const { schemas } = require('../../models/exercise')
const router = express.Router()
const ctrl = require('../../controllers/exercises')
const { validateBody, isValidId, authenticate } = require('../../middlewares')


// router.get('/', authenticate, ctrl.getAllExercises)

router.get('/', ctrl.getAllExercises)

router.get('/:id', authenticate, isValidId, ctrl.getExercisesById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addExercise)

router.delete('/:id', authenticate, isValidId, ctrl.removeExercise)

router.put('/:id', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateExercise)

router.patch('/:id/favorite', authenticate, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusExercise)

module.exports = router