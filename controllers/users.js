const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");

const { User } = require("../models/user");
const { ctrlWrapper, dailyCaloriesCalc } = require("../helpers");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

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
    user,
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

const getCurrent = async (req, res) => {
  const { name, email, avatarURL, token, userParams } = req.user;

  const { desiredWeight, height, birthday, sex, levelActivity } = userParams;

  const bmr = dailyCaloriesCalc(
    desiredWeight,
    height,
    birthday,
    sex,
    levelActivity
  );
  res.json({
    name,
    email,
    avatarURL,
    token,
    userParams,
    bmr,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatar = await jimp.read(resultUpload);
  await avatar.resize(250, 250);
  await avatar.writeAsync(resultUpload);

  const uniqueFileName = `${_id}_${Date.now()}.${originalname
    .split(".")
    .pop()}`;
  const avatarURL = path.join("avatars", uniqueFileName);

  const newAvatarPath = path.join(avatarsDir, uniqueFileName);
  await fs.rename(resultUpload, newAvatarPath);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateParams: ctrlWrapper(updateParams),
  getParams: ctrlWrapper(getParams),
  updateUsername: ctrlWrapper(updateUsername),
  updateAvatar: ctrlWrapper(updateAvatar),
};
