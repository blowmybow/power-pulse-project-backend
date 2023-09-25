const express = require("express");

const ctrl = require("../../controllers/productsDiary");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/productsDiary");

const router = express.Router();

router.get("/:date", authenticate, ctrl.getDatedProducts);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addProductDiarySchema),
  ctrl.addDateProduct
);

router.delete("/:product/:date", authenticate, ctrl.deleteDatedProducts);

module.exports = router;
