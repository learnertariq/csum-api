const mongoose = require("mongoose");

const latestNewsSchema = new mongoose.Schema({
  news: {
    type: String,
    required: true,
  },
  img: {
    type: Buffer,
    required: true,
  },
});

module.exports = mongoose.model("LatestNews", latestNewsSchema);
