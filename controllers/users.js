const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../models/user");
const { ctrlWrapper, HttpError, dailyCaloriesCalc } = require("../helpers");
const avatarDir = path.resolve("public", "avatars");
// const { cloudinary } = require("../middlewares");

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

const getCurrent = async (req, res) => {
  const { name, email, avatarURL, userParams } = req.user;

  res.json({
    user: { name, email },
    avatarURL,
    userParams,
  });
};

const updateAvatar = async (req, res) => {
  // cloudinary
  // const { email, _id } = req.user;
  // const { path } = req.file;
  // const result = await cloudinary.uploader.upload(path, {
  //   folder: "power_pulse_project_avatars",
  //   public_id: _id,
  // });
  // const user = await User.findOneAndUpdate(
  //   { email },
  //   { avatarUrl: result.url },
  //   { new: true }
  // );
  // await fs.unlink(path);
  // res.status(200).json({
  //   user: {
  //     name: user.name,
  //     avatar: user.avatarUrl,
  //   },
  // });
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
  getCurrent: ctrlWrapper(getCurrent),
  updateParams: ctrlWrapper(updateParams),
  getParams: ctrlWrapper(getParams),
  updateUsername: ctrlWrapper(updateUsername),
  updateAvatar: ctrlWrapper(updateAvatar),
};
