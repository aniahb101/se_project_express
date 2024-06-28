const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(
      new Error("UserNotFound")
    );
    res.send(user);
  } catch (error) {
    console.error(error);
    if (error.message === "UserNotFound") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    } else if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = { getUsers, getUser, createUser };
