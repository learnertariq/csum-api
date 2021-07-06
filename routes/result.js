const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const Result = require("../models/result");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", async (req, res) => {
  try {
    const results = await Result.find({}).select("className year");

    const classNames = [];
    const years = [];
    results.forEach((item) => {
      if (!classNames.includes(item.className)) classNames.push(item.className);
      if (!years.includes(item.year)) years.push(item.year);
    });

    res.json({ success: true, data: { classNames, years } });
  } catch (ex) {
    res.status(500).json({ success: false, msg: ex.message });
  }
});

router.post("/", [auth, admin, upload.single("pdf")], async (req, res) => {
  try {
    let result = await Result.findOne({
      className: req.body.className,
      year: req.body.year,
    });
    if (result) await result.remove();

    result = new Result({
      className: req.body.className,
      year: req.body.year,
      pdf: req.file.buffer,
    });

    await result.save();

    res.status(201).json({
      success: true,
      data: {
        className: req.body.className,
        year: req.body.year,
      },
    });
  } catch (ex) {
    console.log(ex);

    res.status(500).json({
      success: false,
      msg: "Error saving result info",
    });
  }
});

router.post("/download", async (req, res) => {
  console.log(req.body);
  try {
    const result = await Result.findOne({
      className: req.body.className,
      year: req.body.year,
    });

    if (!result)
      return res.status(404).json({
        success: false,
        msg: "result not found",
      });

    const base64Pdf = Buffer.from(result.pdf).toString("base64");

    res.status(200).json({
      success: true,
      data: {
        className: result.className,
        year: result.year,
        pdf: base64Pdf,
      },
    });
  } catch (ex) {
    console.log(ex);
    res.status(404).json({
      success: false,
      msg: "invalid request / result not found",
    });
  }
});

module.exports = router;
