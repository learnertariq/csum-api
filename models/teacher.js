const mongoose = require("mongoose");
const Joi = require("joi");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  order: {
    type: String,
    required: true,
  },
});

function validate(body) {
  const joiSchema = Joi.object().keys({
    name: Joi.string().min(3).max(100).required(),
    position: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(6).max(100).required(),
    order: Joi.string().min(1).max(10).required(),
  });
  return joiSchema.validate(body);
}

module.exports = {
  Teacher: mongoose.model("Teacher", teacherSchema),
  validateTeacher: validate,
};
