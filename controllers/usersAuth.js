const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../models/user");
const { ctrlWrapper, HttpError, dailyCaloriesCalc } = require("../helpers");

const avatarDir = path.resolve("public", "avatars");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw HttpError(400, "Email or password is missing");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      userParams: user.userParams,
    },
  });
};

const updateParams = async (req, res) => {
  const { email } = req.user;

  const userParams = {
    ...req.body,
  };

  const user = await User.findOneAndUpdate(
    { email },
    { userParams: userParams },
    { new: true }
  );

  const { desiredWeight, height, birthday, sex, levelActivity } =
    user.userParams;

  const bmr = dailyCaloriesCalc(
    desiredWeight,
    height,
    birthday,
    sex,
    levelActivity
  );

  res.status(200).json({
    user: {
      name: user.name,
      userParams: user.userParams,
    },
    bmr,
  });
};

const getParams = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  const { desiredWeight, height, birthday, sex, levelActivity } =
    user.userParams;

  const bmr = dailyCaloriesCalc(
    desiredWeight,
    height,
    birthday,
    sex,
    levelActivity
  );

  res.status(200).json({
    user: {
      name: user.name,
      avatarUrl: user.avatarUrl,
      userParams: user.userParams,
    },
    bmr,
  });
};

const updateUsername = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOneAndUpdate({ email }, req.body, { new: true });

  res.status(200).json({
    user: {
      name: user.name,
    },
  });
};
// const getCurrent = async (req, res) => {
//   const { token, name, email, avatarURL } = req.user;

//   res.json({
//     token,
//     user: { name, email, avatarURL },
//   });
// };

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Avatar must be provided");
  }

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

  const fileName = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarDir, fileName);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  updateParams: ctrlWrapper(updateParams),
  getParams: ctrlWrapper(getParams),
  updateUsername: ctrlWrapper(updateUsername),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
