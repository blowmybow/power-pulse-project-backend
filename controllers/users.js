const fs = require("fs/promises");

const { User } = require("../models/user");
const { ctrlWrapper, dailyCaloriesCalc } = require("../helpers");
const { cloudinary } = require("../middlewares");

const updateParams = async (req, res) => {
  const { email } = req.user;

  const userParams = {
    ...req.body,
  };
  // console.log(userParams);
  const user = await User.findOneAndUpdate(
    { email },
    { userParams: userParams },
    { new: true }
  );
  // console.log(user);
  const { desiredWeight, height, birthday, sex, levelActivity } =
    user.userParams;

  const bmr = dailyCaloriesCalc(
    desiredWeight,
    height,
    birthday,
    sex,
    levelActivity
  );
  // console.log(bmr);
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
  const { token, name, email, avatarURL } = req.user;

  res.json({
    token,
    user: { name, email },
    avatarURL,
  });
};

const updateAvatar = async (req, res) => {
  const { email, _id } = req.user;
  const { path } = req.file;

  const result = await cloudinary.uploader.upload(path, {
    folder: "power_pulse_project_avatars",
    public_id: _id,
  });

  const user = await User.findOneAndUpdate(
    { email },
    { avatarUrl: result.url },
    { new: true }
  );

  await fs.unlink(path);

  res.status(200).json({
    user: {
      name: user.name,
      avatar: user.avatarUrl,
    },
  });
  // spare option!!
  // if (!req.file) {
  //   throw HttpError(400, "Avatar must be provided");
  // }
  // const { _id } = req.user;
  // const { path: tempUpload, originalname } = req.file;
  // await Jimp.read(tempUpload)
  //   .then((avatar) => {
  //     return avatar.resize(250, 250).quality(60).write(tempUpload);
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
  // const fileName = `${_id}_${originalname}`;
  // const resultUpload = path.join(avatarDir, fileName);
  // await fs.rename(tempUpload, resultUpload);
  // const avatarURL = path.join("avatars", fileName);
  // await User.findByIdAndUpdate(_id, { avatarURL });
  // res.json({
  //   avatarURL,
  // });
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateParams: ctrlWrapper(updateParams),
  getParams: ctrlWrapper(getParams),
  updateUsername: ctrlWrapper(updateUsername),
  updateAvatar: ctrlWrapper(updateAvatar),
};
