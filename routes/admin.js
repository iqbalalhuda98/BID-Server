const router = require("express").Router();
const { adminServices } = require("../services");
const jwtMiddleware = require("../middleware/jwt");

// route untuk mendapatkan data admin sesuai id dan email
router.get("/", jwtMiddleware, adminServices.getProfile);

// route untuk melakukan pendaftaran admin
router.post("/register", adminServices.register);

// route untuk login ke dalam cms admin
router.post("/login", adminServices.login);

// route untuk menghapus admin berdasarkan id
router.delete("/:id", adminServices.delete);

module.exports = router;
