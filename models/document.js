const Joi = require("joi");
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  pdf: {
    type: Buffer,
    required: true,
  },
});

function validate(body) {
  const joiSchema = Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
  });
  return joiSchema.validate(body);
}

module.exports = {
  Document: mongoose.model("Document", documentSchema),
  validateDocument: validate,
};
