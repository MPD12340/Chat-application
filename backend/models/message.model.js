const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    message: { type: String, trim: true },
    image: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel)

module.exports = Message;