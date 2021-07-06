const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User, validateUser, validateAuth } = require("../models/user");

router.get("/", (req, res) => {
  res.send("users working");
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message, error: error });

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({
          success: false,
          msg: "User already registered, please login",
          error: error,
        });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      success: true,
      data: _.pick(user, ["name", "email"]),
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({
      success: false,
      msg: "Error creating new user",
      error: ex,
    });
  }
});

router.post("/auth", async (req, res) => {
  console.log(req.body.email);
  const { error } = validateAuth(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message, error: error });

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({
        success: false,
        msg: "Please, Register to login",
        error: error,
      });

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword)
      return res.status(400).json({ success: false, msg: "Invalid Password" });

    const token = jwt.sign(
      _.pick(user, ["_id", "name", "isAdmin"]),
      process.env.JWT_PRIVATE_KEY
    );

    res
      .header("x-auth-token", token)
      .json({ success: true, msg: "Successfully logged in" });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({
      success: false,
      msg: "Error logging in",
      error: ex,
    });
  }
});

module.exports = router;
