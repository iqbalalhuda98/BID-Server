const imageUpload = require("../middleware/multer");
const router = require("express").Router();
const { imageServices } = require("../services");

// route untuk download gambar
router.get("/download/:filename", imageServices.downloadImage);

// route untuk upload gambar poster
router.put(
  "/upload/:id/:list_img",
  imageUpload.single("image"),
  imageServices.uploadImage
);

// route untuk upload gambar logo
router.put("/logo/:id", imageUpload.single("image"), imageServices.uploadLogo);

module.exports = router;
