// routes/clothingitems.js

const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");
const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateIdParam,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", getItems);

router.post("/", auth, validateCreateItem, createItem);
router.delete("/:itemId", auth, validateIdParam, deleteItem);
router.put("/:itemId/likes", auth, validateIdParam, likeItem);
router.delete("/:itemId/likes", auth, validateIdParam, dislikeItem);

module.exports = router;
