const pool = require("../db");
const response = require("../helpers/response");

const Ticketservices = {
  getAllTickets: async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM Tickets ORDER BY id`);

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No Tickets found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: result.rows,
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  getTicketByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;

      if (!user_id || isNaN(user_id)) {
        return response.error(res, {
          statusCode: 400,
          message: "Bad Request",
        });
      }

      const result = await pool.query(
        `SELECT * FROM Tickets WHERE participant=${user_id} ORDER BY time_order ASC`
      );

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No Tickets found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: result.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  getTicketByEventId: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return response.error(res, {
        statusCode: 400,
        message: "Bad Request",
      });
    }

    try {
      const result = await pool.query(
        `SELECT * FROM Tickets WHERE event=${id || req.params.id}`
      );

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: {
          count: result.rowCount,
        },
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  getTicketById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return response.error(res, {
        statusCode: 400,
        message: "Bad Request",
      });
    }

    try {
      const result = await pool.query(`SELECT * FROM Tickets WHERE id=${id}`);

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No Tickets found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: result.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  deleteTicketById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return response.error(res, {
        statusCode: 400,
        message: "Bad Request",
      });
    }

    try {
      const result = await pool.query(
        `DELETE FROM Tickets WHERE id=${id} RETURNING id`
      );

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No Tickets found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "Ticket deleted",
        data: {
          id: result.rows[0].id,
        },
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  deleteTicketByEventId: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return response.error(res, {
        statusCode: 400,
        message: "Bad Request",
      });
    }

    try {
      const result = await pool.query(
        `DELETE FROM Tickets WHERE event=${id} RETURNING id`
      );

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No Tickets found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "Tickets deleted",
        data: {
          count: result.rowCount,
        },
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  createTicket: async (req, res) => {
    const { participant_id, event_id } = req.params;

    if (
      !participant_id ||
      !event_id ||
      isNaN(Number(participant_id)) ||
      isNaN(Number(event_id))
    ) {
      return response.error(res, {
        statusCode: 400,
        message: "Bad Request",
      });
    }

    const checkParticipant = await pool.query(
      `SELECT * FROM participants WHERE id=${participant_id}`
    );

    if (checkParticipant.rowCount === 0) {
      return response.error(res, {
        statusCode: 404,
        message: "Participant not found",
      });
    }

    const isRegistered = await pool.query(
      `SELECT * FROM Tickets WHERE participant=${participant_id}`
    );

    if (isRegistered.rowCount > 0) {
      return response.error(res, {
        statusCode: 400,
        message: "Participant already registered",
      });
    }

    try {
      const checkEvent = await pool.query(
        `SELECT * FROM events WHERE id=${event_id}`
      );

      if (checkEvent.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      const getTicket = await pool.query(
        `SELECT * FROM Tickets WHERE event=${event_id}`
      );

      if (getTicket.rowCount > checkEvent.rows[0].capacity) {
        return response.error(res, {
          statusCode: 400,
          message: "Event is full",
        });
      }

      const ticket = await pool.query(
        `INSERT INTO Tickets (participant, event) VALUES (${participant_id}, ${event_id}) RETURNING *`
      );

      if (ticket.rowCount === 0) {
        return response.error(res, {
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      return response.success(res, {
        statusCode: 201,
        message: "Ticket created",
        data: ticket.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },
};

module.exports = Ticketservices;
