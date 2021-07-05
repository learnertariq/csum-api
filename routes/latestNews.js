const router = require("express").Router();
const LatestNews = require("../models/latestNews");
const multer = require("multer");
const upload = multer();

router.get("/", async (req, res) => {
  try {
    const latestNews = await LatestNews.find({});
    const base64Img = Buffer.from(latestNews[0].img).toString("base64");

    res.status(200).json({
      success: true,
      data: {
        news: latestNews[0].news,
        img: base64Img,
      },
    });
  } catch (ex) {
    res.status(404).json({
      success: false,
      msg: "news not found",
    });
  }
});

router.post("/", upload.single("img"), async (req, res) => {
  try {
    await LatestNews.deleteMany();

    const latestNews = new LatestNews({
      news: req.body.news,
      img: req.file.buffer,
    });

    await latestNews.save();

    res.status(201).json({
      success: true,
      data: {
        news: latestNews.news,
      },
    });
  } catch (ex) {
    res.status(500).json({
      success: false,
      msg: "error saving latest news",
    });
  }
});

module.exports = router;
