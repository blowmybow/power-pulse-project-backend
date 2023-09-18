const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const userDataSchema = new Schema(
  {
    height: {
      type: Number,
      required: true,
      min: 150,
    },
    currentWeight: {
      type: Number,
      required: true,
      min: 35,
    },
    desiredWeight: {
      type: Number,
      required: true,
      min: 35,
    },
    blood: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    sex: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    levelActivity: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    birthday: {
      type: Date,
      required: true,
      validate: {
        validator: function (birthday) {
          const ableAge = new Date().getFullYear() - birthday.getFullYear();
          return ableAge >= 18;
        },
        message: 'Age must be 18 or older.',
      },
    },
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    //   required: true,
    // },
  },
  { versionKey: false, timestamps: true, _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    token: {
      type: String,
      default: "",
    },
    userData: userDataSchema,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

const addUserDataSchema = Joi.object({
  height: Joi.number().min(150).required(),
  currentWeight: Joi.number().min(35).required(),
  desiredWeight: Joi.number().min(35).required(),
  birthday: Joi.date()
    .max("now")
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - value.getFullYear();
      if (age < 18) {
        return helpers.error("date.min", { limit: "18 years" });
      }
      return value;
    }, "Must be older than 18 years")
    .required(),
  blood: Joi.number().valid(1, 2, 3, 4).required(),
  sex: Joi.string().valid("male", "female").required(),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
});

const updUserDataSchema = Joi.object({
  name: Joi.string(),
  userData: Joi.object({
    height: Joi.number().min(150),
    currentWeight: Joi.number().min(35),
    desiredWeight: Joi.number().min(35),
    birthday: Joi.date()
    .max("now")
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - value.getFullYear();
      if (age < 18) {
        return helpers.error("date.min", { limit: "18 years" });
      }
      return value;
    }, "Must be older than 18 years"),
    blood: Joi.number().valid(1, 2, 3, 4),
    sex: Joi.string().valid("male", "female"),
    levelActivity: Joi.number().valid(1, 2, 3, 4, 5),
  })
});

const schemas = {
  registerSchema,
  loginSchema,
  addUserDataSchema,
  updUserDataSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};

