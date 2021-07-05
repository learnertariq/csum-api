const router = require("express").Router();
const Result = require("../models/result");
const multer = require("multer");
const upload = multer();

router.get("/", (req, res) => {
  res.send("result working");
});

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const result = new Result({
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
