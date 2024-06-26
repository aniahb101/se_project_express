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
    const item = await ClothingItem.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    res.send({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = { getItems, createItem, deleteItem };
