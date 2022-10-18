const router = require("express").Router();
const { ticketServices } = require("../services");

// route untuk membaca data pada tabel Tickets
router.get("/", ticketServices.getAllTickets);

// route untuk membaca data pada tabel Tickets berdasarkan event
router.get("/by-event/:id", ticketServices.getTicketByEventId);

// route untuk membaca data pada tabel Tickets berdasarkan id
router.get("/:id", ticketServices.getTicketById);

// route untuk mendapatkan data pada tabel Tickets berdasarkan participant id
router.get("/by-user/:user_id", ticketServices.getTicketByUserId);

// route untuk menghapus Tickets berdasarkan id
router.delete("/:id", ticketServices.deleteTicketById);

// route untuk menghapus Tickets berdasarkan event
router.delete("/by-event/:id", ticketServices.deleteTicketByEventId);

router.post("/:participant_id/:event_id", ticketServices.createTicket);

module.exports = router;
