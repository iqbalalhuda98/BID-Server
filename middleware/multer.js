const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../images/"));
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    cb(null, randomUUID().split("-").join("") + fileExt);
  },
});

const imageUpload = multer({ storage: storage });

module.exports = imageUpload;
