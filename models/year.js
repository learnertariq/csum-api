const Joi = require("joi");
const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  year: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

function validate(body) {
  const joiSchema = Joi.object().keys({
    name: Joi.string().min(3).max(100).required(),
    year: Joi.string().min(3).max(100).required(),
  });
  return joiSchema.validate(body);
}

function validateWithoutName(body) {
  const joiSchema = Joi.object().keys({
    year: Joi.string().min(3).max(100).required(),
  });
  return joiSchema.validate(body);
}

module.exports = {
  Year: mongoose.model("Year", yearSchema),
  validateYear: validate,
  validateYearWithoutName: validateWithoutName,
};
