const router = require("express").Router();
const { participantServices } = require("../services");
const JwtMiddleware = require("../middleware/jwt");

// route untuk membaca data pada tabel Participants
router.get("/", participantServices.getAllParticipants);

// route untuk membaca data participants berdasarkan token
router.get(
  "/getData",
  JwtMiddleware,
  participantServices.getParticipantByDecodedToken
);

// route untuk membaca data participants berdasarkan id
router.get("/:id", participantServices.getParticipantById);

// route untuk membaca data participants berdasarkan referral_code
router.get("/v1/:referral_code", participantServices.getParticipantByReferralCode);

// route untuk menghapus data participants
router.delete("/:id", participantServices.deleteParticipantById);

// route untuk login menggunakan akun participant
router.post("/login", participantServices.login);

// route untuk registrasi participant baru
router.post("/register", participantServices.register);

module.exports = router;
