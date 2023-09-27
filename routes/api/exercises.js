const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/exercises')
const { authenticate } = require('../../middlewares')

router.get('/', authenticate, ctrl.getAllExercises)

router.get('/bodyparts', authenticate, ctrl.getAllBodyParts);

router.get('/muscules', authenticate,ctrl.getAllMuscules);

router.get('/equipments', authenticate, ctrl.getAllEquipments);

module.exports = router