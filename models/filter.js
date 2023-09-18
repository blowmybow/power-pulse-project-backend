const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const filterSchema = new Schema(
    {
        filter: {
        type: String,
      },
  
      name: {
        type: String,
      },

      imgURL: {
        type: String,
      },

      // owner: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'user',
      //   required: true,
      // },
    },
    { versionKey: false, timestamps: true }
  );
  
  filterSchema.post('save', handleMongooseError);
  
  const addSchema = Joi.object({
    filter: Joi.string(),
    name: Joi.string(),
    imgURL: Joi.string(),
    });

 
  
  
  const schemas = {
    addSchema,
    }

  const Filter = model('filter', filterSchema);
  
  
  module.exports = {
    Filter,
    schemas,
  };