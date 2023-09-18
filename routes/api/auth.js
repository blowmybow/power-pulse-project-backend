const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/usersAuth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
// router.get("/current", authenticate, ctrl.getCurrent);
router.post(
  "/params",
  authenticate,
  validateBody(schemas.updateUserParamsSchema),
  ctrl.updateParams
);
router.put(
  "/params",
  authenticate,
  validateBody(schemas.updateUserParamsSchema),
  ctrl.updateParams
);
router.get("/params", authenticate, ctrl.getParams);
router.patch(
  "/username",
  authenticate,
  validateBody(schemas.updateUsername),
  ctrl.updateUsername
);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);
router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
