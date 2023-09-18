const express = require('express')
// const { schemas } = require('../../models/filter')
const router = express.Router()
const ctrl = require('../../controllers/filters')
// const { authenticate } = require('../../middlewares')


// router.get('/:category', authenticate, ctrl.getSubcategoriesByCategory);

router.get('/:category', ctrl.getSubcategoriesByCategory);


module.exports = router