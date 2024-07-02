const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const winston = require("winston");

const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingitems");

const HTTP_STATUS_NOT_FOUND = 404;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error);
  });

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "667b83fa98d4d8d5f3388639",
  };
  next();
});

app.use("/users", userRoutes);
app.use("/items", itemRoutes);

app.use((req, res) => {
  res
    .status(HTTP_STATUS_NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
