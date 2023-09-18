const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { ctrlWrapper, HttpError, dailyCaloriesCalc } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
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
    sex, birthday, height, desiredWeight, activityLevel
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

  const { sex, birthday, height, desiredWeight, activityLevel } =
    user.userData;

  const bmrData = dailyCaloriesCalc(
    sex, birthday, height, desiredWeight, activityLevel
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
      sex, birthday, height, desiredWeight, activityLevel
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

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};



module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  addUserData: ctrlWrapper(addUserData),
  updateUserData: ctrlWrapper(updateUserData),
  getUserData: ctrlWrapper(getUserData),
  logout: ctrlWrapper(logout)
};
