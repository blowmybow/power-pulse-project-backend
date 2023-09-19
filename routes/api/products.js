const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/products");
const { authenticate } = require("../../middlewares");

router.get("/", authenticate, ctrl.getProducts);
router.get("/categories", authenticate, ctrl.productsCategories);

module.exports = router;
