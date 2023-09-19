const Product = require("../models/product");
const { User } = require("../models/user");

const ctrlWrapper = require("../helpers/ctrlWrapper");

const statistics = async (req, res) => {
  const product = await Product.find();
  const user = await User.find();

  const result = {
    allProduct: product.length,
    allUser: user.length,
  };

  res.json(result);
};

module.exports = {
  statistics: ctrlWrapper(statistics),
};
