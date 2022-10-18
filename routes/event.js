const router = require("express").Router();
const { eventServices } = require("../services");

// route untuk membaca data yang ada pada event
router.get("/", eventServices.getAllEvent);

// route untuk membaca data event yang sedang aktif
router.get("/active", eventServices.getActiveEvent);

// route untuk membaca data yang ada pada event berdasarkan id
router.get("/:id", eventServices.getEventById);

// route untuk menghapus event
router.delete("/:id", eventServices.deleteEvent);

// route untuk edit nama event
router.put("/change-name/:id", eventServices.updateEventName);

// route untuk edit waktu pelaksanaan event
router.put("/change-held/:id", eventServices.updateEventHeld);

// route untuk edit kapasitas peserta event
router.put("/change-capacity/:id", eventServices.updateEventCapacity);

// route untuk edit status event
router.put("/change-active/:id", eventServices.updateEventStatus);

// route untuk membuat event baru
router.post("/", eventServices.createEvent);

module.exports = router;
