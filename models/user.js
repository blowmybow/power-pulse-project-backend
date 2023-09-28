const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

const userParamsSchema = new Schema(
  {
    height: {
      type: Number,
      min: 150,
    },
    currentWeight: {
      type: Number,
      min: 35,
    },
    desiredWeight: {
      type: Number,
      min: 35,
    },
    birthday: {
      type: String,
      validate: {
        validator: function (birthday) {
          const today = new Date();
          const birthDate = new Date(birthday);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age >= 18;
        },
        message: "User must be 18 years or older. ",
      },
    },
    blood: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    sex: {
      type: String,
      enum: ["male", "female"],
    },
    levelActivity: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: 6,
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      default: "",
    },
    userParams: { type: userParamsSchema, default: {} },
  },
  { versionKey: false, minimize: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  email: Joi.string()
    .pattern(emailRegexp, { name: "email pattern" })
    .required()
    .empty(false)
    .messages({
      "string.base": "Email should be a string",
      "string.empty": "Email should not be an empty field.",
      "any.required": "Email is required.",
      "string.pattern.base": "Email must be in format of test@mail.com.",
    }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "any.required": "Password is required.",
    "string.pattern.base":
      "The password must consist of 7 characters and can contain numbers and letters.",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp, { name: "email pattern" })
    .required()
    .messages({
      "string.base": "Email should be a string",
      "string.empty": "Email should not be an empty field.",
      "any.required": "Email is required.",
      "string.pattern.base": "Email must be in format of test@mail.com.",
    }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "any.required": "Password is required.",
    "string.pattern.base":
      "The password must consist of 7 characters and can contain numbers and letters.",
  }),
});

const updateUserParamsSchema = Joi.object({
  height: Joi.number().min(150).required().messages({
    "number.min": "Height must be at least 140 cm.",
    "any.required": "Height is required.",
    "number.base": "Height must be a valid number.",
  }),
  currentWeight: Joi.number().min(35).required().messages({
    "number.min": "Current weight must be at least 40 kg.",
    "any.required": "Current weight is required.",
    "number.base": "Current weight must be a valid number.",
  }),
  desiredWeight: Joi.number().min(35).required().messages({
    "number.min": "Desired weight must be at least 40 kg.",
    "any.required": "Desired weight is required.",
    "number.base": "Desired weight must be a valid number.",
  }),
  birthday: Joi.date()
    .max("now")
    .custom((value, helpers) => {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return helpers.error("date.min", { limit: "18 years" });
      }
      return value;
    }, "Mininum age validation")
    .required()
    .messages({
      "date.max": "Birthday cannot be in the future.",
      "date.base": "Birthday must be a valid date.",
      "any.required": "Birthday is required.",
    }),
  blood: Joi.number().valid(1, 2, 3, 4).required().messages({
    "number.base": "Blood type must be a valid number.",
    "any.only": "Invalid blood type selected.",
    "any.required": "Blood type is required.",
  }),
  sex: Joi.string().valid("male", "female").required().messages({
    "string.base": "Sex must be a valid string.",
    "any.only": "Invalid sex selected.",
    "any.required": "Sex is required.",
  }),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    "number.base": "Activity level must be a valid number.",
    "any.only": "Invalid activity level selected.",
    "any.required": "Activity level is required.",
  }),
});

const updateUsername = Joi.object({
  name: Joi.string().trim().empty().required().messages({
    "string.empty": "Name cannot be empty.",
    "any.required": "Name is required.",
  }),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateUserParamsSchema,
  updateUsername,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
