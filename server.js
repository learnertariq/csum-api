const express = require("express");
const mongoose = require("mongoose");
require("express-async-errors");

// import routes
const resultsRouter = require("./routes/results");
const latestNewsRouter = require("./routes/latestNews");
const usersRouter = require("./routes/users");
const teachersRouter = require("./routes/teachers");
const yearsRouter = require("./routes/years");
const documentsRouter = require("./routes/documents");

// import middlewares
const errorsMiddleware = require("./middlewares/errors");

const app = express();
if (app.get("env") !== "production") {
  require("dotenv").config();
}

// Connecting to database
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("connected to mongoose"));

// middlewares
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-auth-token, Content-Type, Accept"
  );
  res.header("Access-Control-Expose-Headers", " x-auth-token");

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/result", resultsRouter);
app.use("/api/latestNews", latestNewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/years", yearsRouter);
app.use("/api/documents", documentsRouter);
app.use(errorsMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is listening on port ${port}`));
