const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../utils/errors");
const logger = require("../logger");
const { JWT_SECRET } = require("../utils/config");

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

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail(
      new Error("UserNotFound")
    );
    return res.send(user);
  } catch (error) {
    logger.error(error.message);
    if (error.message === "UserNotFound") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).send({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, avatar, email, password: hashedPassword });

    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    logger.error(error.message);
    if (error.code === 11000) {
      return res.status(BAD_REQUEST).send({ message: "Email already in use" });
    }
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.send({ token });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Incorrect email or password" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true } // Ensure validators are run
    ).orFail(new Error("UserNotFound"));
    return res.send(user);
  } catch (error) {
    logger.error(error.message);
    if (error.message === "UserNotFound") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
