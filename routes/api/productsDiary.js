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
//   "email": "andrii2@gmail.com",
//   "password": "1234Asd"
// }

// {
//   "productId": "650431e442f30f1602062518",
//   "date": "21/09/2023",
//   "amount": 100,
//   "calories": 2000,
//   "owner": "650b2e786360fe740b811ccc"
// }