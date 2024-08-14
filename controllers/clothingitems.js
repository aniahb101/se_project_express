const winston = require("winston");
const ClothingItem = require("../models/clothingitem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.send(items);
  } catch (error) {
    logger.error(error.message);
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    const item = new ClothingItem({ name, weather, imageUrl, owner });
    await item.save();
    return res.status(201).send(item);
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

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new Error("ItemNotFound")
    );

    // Check if the current user is the owner of the item
    if (item.owner.toString() !== req.user._id) {
      return res
        .status(FORBIDDEN)
        .send({ message: "You are not authorized to delete this item" });
    }

    await item.remove();
    return res.send({ message: "Item deleted successfully" });
  } catch (error) {
    logger.error(error.message);
    if (error.message === "ItemNotFound") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(new Error("ItemNotFound"));
    return res.send(item);
  } catch (error) {
    logger.error(error.message);
    if (error.message === "ItemNotFound") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(new Error("ItemNotFound"));
    return res.send(item);
  } catch (error) {
    logger.error(error.message);
    if (error.message === "ItemNotFound") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
