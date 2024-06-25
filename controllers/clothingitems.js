const ClothingItem = require("../models/clothingItem");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.send(items);
  } catch (error) {
    res.status(500).send({ message: "Error fetching items" });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl, owner } = req.body;
    const item = new ClothingItem({ name, weather, imageUrl, owner });
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send({ message: "Error creating item" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.send({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting item" });
  }
};

module.exports = { getItems, createItem, deleteItem };
