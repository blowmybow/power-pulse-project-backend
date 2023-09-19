const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/statistics");

router.get("/", ctrl.statistics);

module.exports = router;
