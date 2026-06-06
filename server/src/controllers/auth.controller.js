const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// REGISTER USER
const registerUser = async (req, res) => {

  console.log("BODY:", req.body);

  console.log("FILE:", req.file);


  try {

    const {
      username,
      email,
      password,
    } = req.body;


    // CHECK EXISTING USER
    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }


    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);


    let avatarUrl = "";


    // UPLOAD AVATAR IF EXISTS
    if (req.file) {

  try {

    console.log("Uploading image to Cloudinary...");

    const uploadedImage =
      await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(

          {
            folder: "chat-app-avatars",
          },

          (error, result) => {

            if (error) {
              console.log("CLOUDINARY ERROR:", error);

              reject(error);
            }

            else {
              resolve(result);
            }

          }

        ).end(req.file.buffer);

      });

    avatarUrl = uploadedImage.secure_url;

    console.log("UPLOAD SUCCESS:", avatarUrl);

  } catch (error) {

    console.log("UPLOAD FAILED:", error);

    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });

  }

}

    // CREATE USER
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });


    // GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );


    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  token,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


    // GET CURRENT USER
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};