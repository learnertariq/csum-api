const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .json({ success: false, msg: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res
      .status(400)
      .json({ success: false, msg: "Access denied, Invalid Token" });
  }
};

module.exports = auth;
