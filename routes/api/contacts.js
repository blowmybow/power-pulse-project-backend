const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");
const { schemas } = require("../../models/contact");
const { validateBody, isValidId } = require("../../middlewares");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", isValidId, ctrl.getByIdContacts);

router.post("/", validateBody(schemas.contactAddSchema), ctrl.addContacts);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.contactAddSchema),
  ctrl.updateContacts
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchemas),
  ctrl.updateFavorite
);

router.delete("/:contactId", isValidId, ctrl.deleteContacts);

module.exports = router;
