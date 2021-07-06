const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

function validate(body) {
  const joiSchema = Joi.object().keys({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().min(3).max(100).required(),
    password: Joi.string().min(6).max(100).required(),
  });
  return joiSchema.validate(body);
}

function validateAuth(body) {
  const joiSchema = Joi.object().keys({
    email: Joi.string().email().min(3).max(100).required(),
    password: Joi.string().min(6).max(100).required(),
  });
  return joiSchema.validate(body);
}

module.exports = {
  User: mongoose.model("User", userSchema),
  validateUser: validate,
  validateAuth: validateAuth,
};
