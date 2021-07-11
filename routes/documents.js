const router = require("express").Router();
const { Document, validateDocument } = require("../models/document");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const multer = require("multer");
const upload = multer();

router.get("/", async (req, res) => {
  const documents = await Document.find({});
  documentsCopy = [];

  documents.forEach((d) => {
    const documentObject = d.toObject();
    documentObject.pdf = getB64(d.pdf);
    documentsCopy.push(documentObject);
  });

  res.json({ success: true, data: documentsCopy });
});

router.post("/", [auth, admin, upload.single("pdf")], async (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, msg: "Please select PDF" });

  const bodyCopy = req.body;
  delete bodyCopy.pdf;

  const { error } = validateDocument(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  const document = new Document({
    title: req.body.title,
    pdf: req.file.buffer,
  });
  await document.save();

  res.json({ success: true, data: document });
});

function getB64(binData) {
  return Buffer.from(binData).toString("base64");
}

module.exports = router;
