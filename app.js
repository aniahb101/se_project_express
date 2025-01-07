require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const winston = require("winston");
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingitems");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const {
  validateSignupBody,
  validateSigninBody,
} = require("./middlewares/validation");
const { NotFoundError } = require("./errors");

const { PORT = 3001 } = process.env;

const app = express();

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    winston.info("Connected to MongoDB");
  })
  .catch((error) => {
    winston.error("Error connecting to MongoDB", error);
  });

app.use(bodyParser.json());
app.use(cors());
app.use(requestLogger);

app.post("/signup", validateSignupBody, createUser);
app.post("/signin", validateSigninBody, login);
app.use("/items", itemRoutes);

app.use(auth);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  winston.info(`Server is running on port ${PORT}`);
});
