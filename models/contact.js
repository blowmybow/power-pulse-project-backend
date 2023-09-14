const { handleMongooseError } = require("../helpers");

const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

const contactAddSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/)
    .required()
    .messages({
      "any.required": "field 'name' is missing",
      "string.pattern.base":
        "Name may contain only letters, apostrophe, dash, and spaces. For example, Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan",
    }),
  email: Joi.string().email().required().messages({
    "any.required": "field 'email' is missing",
  }),
  phone: Joi.string()
    .pattern(
      /^((\+)?(3)?(8)?[- ]?)?(\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{2}[- ]?\d{2}$/
    )
    .required()
    .messages({
      "any.required": "field 'phone' is missing",
      "string.pattern.base":
        "Phone number must be a valid phone number for region UA, digits and can contain spaces, dashes, parentheses and can start with +",
    }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchemas = Joi.object({
  favorite: Joi.boolean().required,
});

const schemas = { contactAddSchema, updateFavoriteSchemas };

module.exports = { Contact, schemas };
