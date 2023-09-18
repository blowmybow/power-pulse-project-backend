const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { randomUUID } = require("crypto");

const { User } = require("../models/user");
const {
  ctrlWrapper,
  HttpError,
  dailyCaloriesCalc,
  sendEmail,
} = require("../helpers");

const avatarDir = path.resolve("public", "avatars");
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = randomUUID();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Сonfirm your registration",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to confirm your registration</a>`,
  };

  await sendEmail(verifyEmail);

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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Сonfirm your registration",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to confirm your registration</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
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
    token: token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const addUserData = async (req, res) => {
  const { email } = req.user;
  const { sex, birthday, height, desiredWeight, activityLevel } = req.body;

  const bmrData = dailyCaloriesCalc(
    sex,
    birthday,
    height,
    desiredWeight,
    activityLevel
  );

  const userData = {
    ...req.body,
  };
  const user = await User.findOneAndUpdate(
    { email },
    { userData: userData },
    { new: true }
  );

  res.status(201).json({
    user: {
      userData: user.userData,
    },
    bmrData,
  });
};

const updateUserData = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOneAndUpdate(
    { email },
    { ...req.body },
    { new: true }
  );

  const { sex, birthday, height, desiredWeight, activityLevel } = user.userData;

  const bmrData = dailyCaloriesCalc(
    sex,
    birthday,
    height,
    desiredWeight,
    activityLevel
  );

  res.status(200).json({
    user: {
      name: user.name,
      userData: user.userData,
    },
    bmrData,
  });
};

const getUserData = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  if (user.userData) {
    const { sex, birthday, height, desiredWeight, activityLevel } =
      user.userData;

    const bmrData = dailyCaloriesCalc(
      sex,
      birthday,
      height,
      desiredWeight,
      activityLevel
    );

    res.status(200).json({
      user: {
        name: user.name,
        userData: user.userData,
      },
      bmrData,
    });
  } else {
    res.status(200).json({
      user: {
        name: user.name,
      },
    });
  }
};

const getCurrent = async (req, res) => {
  const { token, name, email, avatar } = req.user;

  res.json({
    token,
    user: { name, email, avatar },
  });
};

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
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  addUserData: ctrlWrapper(addUserData),
  updateUserData: ctrlWrapper(updateUserData),
  getUserData: ctrlWrapper(getUserData),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
