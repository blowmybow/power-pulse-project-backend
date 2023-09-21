const express = require("express");

const ctrl = require("../../controllers/productsDiary");

const { validateBody, authenticate } = require("../../middlewares");

const {schemas} = require("../../models/productsDiary");

const router = express.Router();

router.get("/", authenticate, ctrl.getDatedProducts);

router.post("/", authenticate, validateBody(schemas.addProductDiarySchema), ctrl.addDateProduct);

router.delete("/:product", authenticate, ctrl.deleteDatedProducts);

module.exports = router;
//1234Asd
//{
//   "name": "Andrii2",
//   "email": "andrii2@gmail.com",
//   "password": "1234Asd"
// }