const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/usersAuth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.userEmailSchema),
  ctrl.resendVerifyEmail
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post(
  "/info",
  authenticate,
  validateBody(schemas.addUserDataSchema),
  ctrl.addUserData
);
router.put(
  "/info",
  authenticate,
  validateBody(schemas.updUserDataSchema),
  ctrl.updateUserData
);
router.get("/info", authenticate, ctrl.getUserData);
router.post("/logout", authenticate, ctrl.logout);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
