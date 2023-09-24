const { ProductDiary } = require("../models/productsDiary");

const { HttpError, ctrlWrapper } = require("../helpers");

const getDatedProducts = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await ProductDiary.find(
    { owner, date },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  );
  console.log(result);
  res.json(result);
};

const addDateProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await ProductDiary.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteDatedProducts = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.params;
  const { product } = req.params;
  //   console.log(req.params);
  const result = await ProductDiary.findOneAndDelete({
    date: date,
    productId: product,
    owner: owner,
  });
  //   console.log(result);
  //   console.log(owner);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success",
  });
};

module.exports = {
  getDatedProducts: ctrlWrapper(getDatedProducts),
  addDateProduct: ctrlWrapper(addDateProduct),
  deleteDatedProducts: ctrlWrapper(deleteDatedProducts),
};
