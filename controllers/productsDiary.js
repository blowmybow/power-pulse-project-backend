const { ProductDiary } = require("../models/productsDiary");

const { HttpError, ctrlWrapper } = require("../helpers");

const getDatedProducts = async (req, res) => {
    const {_id: owner} = req.user;
    console.log("user:", req.user);
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
    const result = await ProductDiary.find({owner}, "-createdAt -updatedAt", {skip, limit});
    res.json(result);
};

const addDateProduct = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await ProductDiary.create({...req.body, owner});
    res.status(201).json(result);
};

const deleteDatedProducts = async (req, res) => {
    const {_id: owner} = req.user;    
    const { date } = req.params;
    const { product} = req.params;
    const result = await ProductDiary.findOneandDelete({date: date, product: product, owner: owner});
    if (!result) {
        throw HttpError(404, "Not found");
    }        
    res.json({
        message: "Delete success"
    })
};

module.exports = {
  getDatedProducts: ctrlWrapper(getDatedProducts),
  addDateProduct: ctrlWrapper(addDateProduct),
  deleteDatedProducts: ctrlWrapper(deleteDatedProducts),
}