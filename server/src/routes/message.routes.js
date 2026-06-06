const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/auth.middleware");

const {
  getConversation,
} = require("../controllers/message.controller");

router.get(
  "/:receiverId",
  protect,
  getConversation
);

module.exports = router;