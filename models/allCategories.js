const { Schema, model } = require("mongoose");

const bodyPartsSchema = new Schema(
  {
    filter: {
      type: String,
    },

    name: {
      type: String,
    },

    imgURL: {
      type: String,
    }
  },
  { versionKey: false }
);

const equipmentsSchema = new Schema(
    {
      filter: {
        type: String,
      },
  
      name: {
        type: String,
      },
  
      imgURL: {
        type: String,
      }
    },
    { versionKey: false }
);

const musculesSchema = new Schema(
    {
      filter: {
        type: String,
      },
  
      name: {
        type: String,
      },
  
      imgURL: {
        type: String,
      }
    },
    { versionKey: false }
);
  
const Muscules = model("muscule", musculesSchema, "filters");
  
const Equipments = model("equipment", equipmentsSchema, "filters");

const Bodyparts = model("bodypart", bodyPartsSchema, "filters");

module.exports = {
    Muscules,
    Equipments,
    Bodyparts
}