const express = require("express");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const {
  sendMessage,
  getMessages,
} = require("../controller/message.controller");

const router = express.Router();

// Note: No need to add multer middleware here as it's handled in the controller
router.route("/").post(authUserMiddleware, sendMessage);
router.route("/:id").get(authUserMiddleware, getMessages);

module.exports = router;
