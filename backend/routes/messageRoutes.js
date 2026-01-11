const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const {
  getMessages,
  sendFileMessage,
} = require("../controllers/messageController");

router.get("/:userId1/:userId2", getMessages);

// 🔥 Cloudinary upload
router.post("/upload", upload.single("file"), sendFileMessage);

module.exports = router;
