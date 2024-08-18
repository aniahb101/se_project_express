const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
