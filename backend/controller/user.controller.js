const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate JWT token
const generateJwtToken = (_id) =>
  jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

// Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please Fill All The Fields." });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(422).json({ error: "User Already Exist." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });

  user
    ? res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateJwtToken(user._id),
      })
    : res.status(422).json({ error: "Login Failed." });
});

// Authenticate user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please Fill All The Fields." });
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateJwtToken(user._id),
    });
  }
  res.status(422).json({ error: "Incorrect email or password." });
});

// Search users
const searchUser = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchQuery).find({
    _id: { $ne: req.user._id },
  });
  res.status(200).json(users);
});

// Update user data
const updateUserData = asyncHandler(async (req, res) => {
  const { name, pic } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) user.name = name;
  if (pic) user.pic = pic;

  await user.save();
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateJwtToken(user._id),
  });
});

module.exports = { registerUser, authUser, searchUser, updateUserData };
