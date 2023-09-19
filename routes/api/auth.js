const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/usersAuth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post(
  "/data",
  authenticate,
  validateBody(schemas.updUserDataSchema),
  ctrl.updateData
);
router.put(
  "/data",
  authenticate,
  validateBody(schemas.updUserDataSchema),
  ctrl.updateData
);

router.get("/data", authenticate, ctrl.getData);
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
