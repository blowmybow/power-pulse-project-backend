const { ProductDiary } = require("../models/productsDiary");
const Product = require("../models/product");

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
  ).lean();

  let allCaloriesDay = 0;
  for (const obj of result) {
    allCaloriesDay += obj.calories;
    const productId = obj.productId;
    const product = await getProductById(productId);
    obj.product = product;
  }

  result.allCaloriesDay = allCaloriesDay;
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ result, allCaloriesDay });
};

const getProductById = async (id) => {
  const result = await Product.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  return result;
};

const addDateProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await ProductDiary.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteDatedProducts = async (req, res) => {
  // const { _id: owner } = req.user;
  const { productIdUser } = req.params;
  // const { product } = req.params;
  const result = await ProductDiary.findOneAndDelete({
    _id: productIdUser,
  });

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
