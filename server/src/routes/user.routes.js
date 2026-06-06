const express = require("express");

const router = express.Router();

const {
  getUsers,
} = require("../controllers/user.controller");

const protect =
  require("../middleware/auth.middleware");

router.get("/", protect, getUsers);

module.exports = router;