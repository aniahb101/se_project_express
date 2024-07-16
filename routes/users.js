const express = require("express");
const { getUser, getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
router.get("/:userId", getUser);

module.exports = router;
