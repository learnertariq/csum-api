const router = require("express").Router();
const Result = require("../models/result");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const multer = require("multer");
const upload = multer();

router.get("/", async (req, res) => {
  const results = await Result.find({}).select("className year");

  const classNames = [];
  const years = [];
  results.forEach((item) => {
    if (!classNames.includes(item.className)) classNames.push(item.className);
    if (!years.includes(item.year)) years.push(item.year);
  });

  res.json({ success: true, data: { classNames, years } });
});

router.post("/", [auth, admin, upload.single("pdf")], async (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, msg: "Please select PDF" });

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
});

router.post("/download", async (req, res) => {
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

  res.json({
    success: true,
    data: {
      className: result.className,
      year: result.year,
      pdf: base64Pdf,
    },
  });
});

module.exports = router;
