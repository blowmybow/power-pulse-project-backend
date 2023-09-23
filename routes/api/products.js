const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/products");
const { authenticate, isValidId } = require("../../middlewares");

router.get("/", authenticate, ctrl.getProducts);
router.get("/categories", authenticate, ctrl.productsCategories);
router.get("/:id", authenticate, isValidId, ctrl.getProductById);

module.exports = router;
