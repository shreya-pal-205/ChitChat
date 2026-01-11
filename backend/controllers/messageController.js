const Message = require("../models/Message");

// Get all messages between two users
exports.getMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Upload file / video & create message (CLOUDINARY)
exports.sendFileMessage = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    //  Cloudinary gives this URL
    const fileUrl = req.file.path;

    const message = await Message.create({
      sender,
      receiver,
      file: fileUrl,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};