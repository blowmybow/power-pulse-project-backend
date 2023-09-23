const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET_KEY } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET_KEY,
  secure: true,
});

const tempDir = path.join(__dirname, "../", "temp");
const avatarSize = 1048576;

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: avatarSize,
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
