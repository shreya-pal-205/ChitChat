const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_app_media",
    resource_type: "auto", // image + video
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm", "mp3", "pdf", "txt", "docx"],
  },
});

const upload = multer({ storage });

module.exports = upload;
