const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
