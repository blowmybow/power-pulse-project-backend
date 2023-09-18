const express = require("express");

const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema),ctrl.register);

router.post("/login", validateBody(schemas.loginSchema),ctrl.login);

router.post("/info", authenticate, validateBody(schemas.addUserDataSchema), ctrl.addUserData);
router.put("/info", authenticate, validateBody(schemas.updUserDataSchema), ctrl.updateUserData);
router.get("/info", authenticate, ctrl.getUserData);
router.post("/signout", authenticate, ctrl.logout);

module.exports = router;



