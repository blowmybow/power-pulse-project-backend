const { Filter } = require('../models/filter');

// const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');

// const getAllCategories = async (req, res) => {
//   const { _id: owner } = req.user;
//   const { page = 1, limit = 20 } = req.query;
//   const skip = (page - 1) * limit;
//   const result = await Filter.find({ owner }, '-createdAt -updatedAt', {
//     skip,
//     limit,
//   }).populate('owner', 'email');
//   res.status(200).json(result);
// };

const getSubcategoriesByCategory = async (req, res) => {
    
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
  
    let exercises = [];
  
    switch (category) {
      case 'bodyParts':
        exercises = await Filter.find({ filter: "Body parts" })
          .skip((page - 1) * limit)
          .limit(limit);
        break;
      case 'muscles':
        exercises = await Filter.find({ filter: "Muscles" })
          .skip((page - 1) * limit)
          .limit(limit);
        break;
      case 'equipment':
        exercises = await Filter.find({ filter: "Equipment"  })
          .skip((page - 1) * limit)
          .limit(limit);
        break;
      default:
        exercises = [];
        break;
    }
  
    res.status(200).json(exercises);
};

// const getSubcategoriesByCategory = async (req, res) => {
//     const { _id: owner } = req.user;
//     const { category } = req.params;
//     const { page = 1, limit = 20 } = req.query;
  
//     let exercises = [];
  
//     switch (category) {
//       case 'bodyParts':
//         exercises = await Filter.find({ owner, filter: "Body parts" }, '-createdAt -updatedAt')
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .populate('owner', 'email');
//         break;
//       case 'muscles':
//         exercises = await Filter.find({ owner, filter: "Muscles" }, '-createdAt -updatedAt')
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .populate('owner', 'email');
//         break;
//       case 'equipment':
//         exercises = await Filter.find({ owner, filter: "Equipment" }, '-createdAt -updatedAt')
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .populate('owner', 'email');
//         break;
//       default:
//         exercises = [];
//         break;
//     }
  
//     res.status(200).json(exercises);
// };



module.exports = {
    // getAllCategories: ctrlWrapper(getAllCategories),
    getSubcategoriesByCategory: ctrlWrapper(getSubcategoriesByCategory),
};