const Product = require("../models/product");
const ProductsCategories = require("../models/productsCategories");

const ctrlWrapper = require("../helpers/ctrlWrapper");

const getProducts = async (req, res) => {
  const {
    userParams: { blood },
  } = req.user;
  // console.log(req.user);
  const {
    page = 1,
    limit = 6,
    recommended = "all",
    category = "",
    search = "",
  } = req.query;
  // console.log(req.query);
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

  // console.log(filter);
  const result = await Product.find(filter, "", {
    skip,
    limit,
  });
  // console.log(result);
  const totalProducts = await Product.countDocuments(filter);
  // console.log(totalProducts);
  res.json({ page, limit, blood, totalProducts, result });
};

const productsCategories = async (req, res) => {
  const result = await ProductsCategories.find();
  res.json(result);
};

module.exports = {
  getProducts: ctrlWrapper(getProducts),
  productsCategories: ctrlWrapper(productsCategories),
};
