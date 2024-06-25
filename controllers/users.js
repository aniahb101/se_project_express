const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error fetching user" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = new User({ name, avatar });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ message: "Error creating user" });
  }
};

module.exports = { getUsers, getUser, createUser };
