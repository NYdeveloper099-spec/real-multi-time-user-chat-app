const express = require("express");
const upload = require("../middleware/upload.middleware");

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

//router.post("/register", registerUser);
router.post(
  "/register",
  upload.single("avatar"),
  registerUser
);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

module.exports = router;
