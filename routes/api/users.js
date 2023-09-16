const express = require("express");

const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema),ctrl.register);

router.post("/login",validateBody(schemas.loginSchema),ctrl.login);

// router.get("/verify/:verificationCode", ctrl.verifyEmail);

// router.post("/verify", validateBody(schemas.emailSchema), ctrl.resendVerifyEmail);

module.exports = router;



