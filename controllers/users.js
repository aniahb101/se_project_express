const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(
      () => new NotFoundError("User not found")
    );
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).send(userWithoutPassword);
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError("Email already in use"));
    } else if (error.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.send({ token });
  } catch (error) {
    if (error.message === "Incorrect email or password") {
      next(new UnauthorizedError("Incorrect email or password"));
    } else {
      next(error);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("User not found"));

    res.send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
