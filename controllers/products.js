const Product = require("../models/product");
const ProductsCategories = require("../models/productsCategories");

const ctrlWrapper = require("../helpers/ctrlWrapper");
const { HttpError } = require("../helpers");

const getProducts = async (req, res) => {
  const {
    userParams: { blood },
  } = req.user;
  if (!blood) {
    throw HttpError(400, "Not user params");
  }

  const {
    page = 1,
    limit = 6,
    recommended = "all",
    category = "",
    search = "",
  } = req.query;

  const skip = (page - 1) * limit;
  const filter = {};
  if (search) {
    filter.title = { $regex: `.*${search}.*`, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  if (recommended !== "all") {
    if (recommended === "false") {
      filter[`groupBloodNotAllowed.${blood}`] = false;
    } else {
      filter[`groupBloodNotAllowed.${blood}`] = true;
    }
  }

  const result = await Product.find(filter, "", {
    skip,
    limit,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  const totalProducts = await Product.countDocuments(filter);

  res.json({ page, limit, blood, totalProducts, result });
};

const productsCategories = async (req, res) => {
  const result = await ProductsCategories.find();
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await Product.findById(id);
  console.log(result);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = {
  getProducts: ctrlWrapper(getProducts),
  productsCategories: ctrlWrapper(productsCategories),
  getProductById: ctrlWrapper(getProductById),
};
