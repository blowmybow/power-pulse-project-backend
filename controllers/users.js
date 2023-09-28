// const path = require("path");
// const fs = require("fs/promises");
// const Jimp = require("jimp");

const { User } = require("../models/user");
const { ctrlWrapper, dailyCaloriesCalc } = require("../helpers");
// const avatarDir = path.resolve("public", "avatars");
const { cloudinary } = require("../helpers");

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
  // const avatarURL = req.file.path;
  // console.log(avatarURL);

  // const { _id } = req.user;
  // await User.findByIdAndUpdate(_id, { avatarURL });

  // res.status(200).json({ avatarURL });

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
    allowed_formats: ["jpg", "png"],
    transformation: [
      { width: 350, height: 350 },
      { width: 700, height: 700 },
    ],
  });

  const { _id } = req.user;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { avatarURL: result.secure_url },
    { new: true }
  );

  res.json({ avatarURL: updatedUser.avatarURL });
};
// const { email, _id } = req.user;
// const { path } = req.file;
// const result = await cloudinary.uploader.upload(path, {
//   folder: "power_pulse_project_avatars",
//   public_id: _id,
// });
// console.log(result);
// const user = await User.findOneAndUpdate(
//   { email },
//   { avatarURL: result.url },
//   { new: true }
// );
// await fs.unlink(path);
// res.status(200).json({
//   user: {
//     name: user.name,
//     avatar: user.avatarURL,
//   },
// });
//   if (!req.file) {
//     throw HttpError(400, "Avatar must be provided");
//   }
//   const { _id } = req.user;
//   const { path: tempUpload, originalname } = req.file;
//   await Jimp.read(tempUpload)
//     .then((avatar) => {
//       return avatar.resize(250, 250).quality(60).write(tempUpload);
//     })
//     .catch((err) => {
//       throw err;
//     });
//   const fileName = `${_id}_${originalname}`;
//   const resultUpload = path.join(avatarDir, fileName);
//   await fs.rename(tempUpload, resultUpload);
//   const avatarURL = path.join("avatars", fileName);
//   await User.findByIdAndUpdate(_id, { avatarURL });
//   res.json({
//     avatarURL,
//   });

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateParams: ctrlWrapper(updateParams),
  getParams: ctrlWrapper(getParams),
  updateUsername: ctrlWrapper(updateUsername),
  updateAvatar: ctrlWrapper(updateAvatar),
};
