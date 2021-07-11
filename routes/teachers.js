const router = require("express").Router();
const { Teacher, validateTeacher } = require("../models/teacher");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", async (req, res) => {
  const teachers = await Teacher.find({});

  res.json({ success: true, data: teachers });
});

router.get("/:id", async (req, res) => {
  //TODO: object id validation
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher)
    return res.status(404).json({ success: false, msg: "Teacher not found" });

  return res.json({ success: true, data: teacher });
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validateTeacher(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  const teacher = new Teacher({
    name: req.body.name,
    position: req.body.position,
    phone: req.body.phone,
    order: req.body.order,
  });

  await teacher.save();
  res.status(201).json({ success: true, data: teacher });
});

router.put("/:id", [auth, admin], async (req, res) => {
  //TODO: object id validation
  const { error } = validateTeacher(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher)
    return res.status(404).json({ success: false, msg: "Teacher not found" });

  teacher.name = req.body.name;
  teacher.position = req.body.position;
  teacher.phone = req.body.phone;
  teacher.order = req.body.order;
  await teacher.save();

  res.json({ success: true, data: teacher });
});

router.delete("/:id", [auth, admin], async (req, res) => {
  //TODO: object id validation

  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher)
    return res.status(404).json({ success: false, msg: "Teacher not found" });

  res.json({ success: true, data: teacher });
});

module.exports = router;
