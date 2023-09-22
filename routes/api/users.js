const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/users");

const router = express.Router();

router.get("/current", authenticate, ctrl.getCurrent);
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
// router.patch(
//   "/username",
//   authenticate,
//   validateBody(schemas.updateUsername),
//   ctrl.updateUsername
// );
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
