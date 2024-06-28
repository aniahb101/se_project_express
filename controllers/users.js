const winston = require("winston");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    logger.error(error.message);
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(
      new Error("UserNotFound")
    );
    return res.send(user);
  } catch (error) {
    logger.error(error.message);
    if (error.message === "UserNotFound") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    logger.error(error.message);
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = { getUsers, getUser, createUser };
