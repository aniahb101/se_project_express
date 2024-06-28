const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.send(items);
  } catch (error) {
    console.error(error);
    res
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
    res.status(201).send(item);
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

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndDelete(req.params.itemId).orFail(
      new Error("ItemNotFound")
    );
    res.send({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.message === "ItemNotFound") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    } else if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    res
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
    res.send(item);
  } catch (error) {
    console.error(error);
    if (error.message === "ItemNotFound") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    } else if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    res
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
    res.send(item);
  } catch (error) {
    console.error(error);
    if (error.message === "ItemNotFound") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    } else if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
