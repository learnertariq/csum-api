const router = require("express").Router();
const {
  Year,
  validateYear,
  validateYearWithoutName,
} = require("../models/year");

router.get("/", async (req, res) => {
  const years = await Year.find({});

  res.json({ success: true, data: years });
});

router.post("/", async (req, res) => {
  const { error } = validateYear(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  const year = new Year({
    name: req.body.name,
    year: req.body.year,
  });

  await year.save();
  res.status(201).json({ success: true, data: year });
});

router.put("/:id", async (req, res) => {
  //TODO: object id validation
  const { error } = validateYearWithoutName(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  const year = await Year.findById(req.params.id);
  if (!year)
    return res.status(404).json({ success: false, msg: "year not found" });

  year.year = req.body.year;
  await year.save();

  res.json({ success: true, data: year });
});

router.delete("/:id", async (req, res) => {
  //TODO: object id validation

  const year = await Year.findByIdAndDelete(req.params.id);
  if (!year)
    return res.status(404).json({ success: false, msg: "Teacher not found" });

  res.json({ success: true, data: year });
});

module.exports = router;
