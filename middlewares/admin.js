const admin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ success: false, msg: "Forbidden. Permission denied" });

  next();
};

module.exports = admin;
