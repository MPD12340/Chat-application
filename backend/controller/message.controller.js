const asyncHandler = require("express-async-handler");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Images only (jpeg, jpg, png, gif)!");
  },
}).single("image"); // 'image' is the field name in FormData

// Send messages
const sendMessage = asyncHandler(async (req, res) => {
  // Handle the upload first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    const { content, chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "ChatId is required" });
    }

    const messageObj = {
      sender: req.user._id,
      chat: chatId,
    };

    // Add content if it exists
    if (content) {
      messageObj.message = content;
    }

    // Add image path if file was uploaded
    if (req.file) {
      messageObj.image = req.file.path;
    }

    if (!content && !req.file) {
      return res.status(400).json({ error: "Message or image required" });
    }

    try {
      let message = await Message.create(messageObj);

      message = await message.populate("sender", "name pic");
      message = await message.populate("chat", "chatName isGroupChat users");

      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      res.json(message);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Message could not be sent" });
    }
  });
});

// Get messages (unchanged)
const getMessages = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(500)
      .json({ error: "Invalid or chatId not found in params" });
  }

  try {
    const messages = await Message.find({ chat: req.params.id })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { sendMessage, getMessages };
