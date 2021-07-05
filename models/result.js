const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  pdf: {
    type: Buffer,
    required: true,
  },
});

module.exports = mongoose.model("Result", resultSchema);
