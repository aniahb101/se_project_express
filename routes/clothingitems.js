const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
