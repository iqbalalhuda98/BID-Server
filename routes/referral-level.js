const router = require("express").Router();
const { referralLevelServices } = require("../services");

router.get("/", referralLevelServices.getLevel);
router.post("/", referralLevelServices.addLevel);
router.put("/:id", referralLevelServices.updateLevel);
router.delete("/:id", referralLevelServices.deleteLevel);

module.exports = router;
