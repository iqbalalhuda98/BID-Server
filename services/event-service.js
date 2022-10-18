const pool = require("../db");
const response = require("../helpers/response");
const fs = require("fs");
const path = require("path");

const eventServices = {
  getAllEvent: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM Events ORDER BY id");

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No events found",
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

  
  getActiveEvent: async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM Events WHERE isactive=TRUE ORDER BY id"
      );

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No active event found",
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

  
  getEventById: async (req, res) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    try {
      const result = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
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

  
  createEvent: async (req, res) => {
    const { name, held, capacity } = req.body;

    if (!name || !capacity) {
      return response.error(res, {
        statusCode: 400,
        message: "Name and capacity are required",
      });
    }

    try {
      const getActiveEvent = await pool.query(
        "SELECT * FROM Events WHERE isactive=TRUE"
      );

      const result = await pool.query(
        `INSERT INTO events (name, held, capacity, isactive) VALUES ('${name}', '${
          held ?? new Date().toISOString()
        }', '${capacity}', '${
          getActiveEvent.rowCount === 0 ? true : false
        }') RETURNING id`
      );

      if (result.rows.length === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      return response.success(res, {
        statusCode: 201,
        message: "Created",
        data: result.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  updateEventName: async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || !id) {
      return response.error(res, {
        statusCode: 400,
        message: "Name and ID are required",
      });
    }

    const isExist = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

    if (isExist.rowCount === 0) {
      return response.error(res, {
        statusCode: 404,
        message: "Event not found",
      });
    }

    try {
      const update = await pool.query(
        `UPDATE Events SET name='${name.trim()}' WHERE id=${id} RETURNING id, name`
      );

      if (update.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: update.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  updateEventHeld: async (req, res) => {
    const { held } = req.body;
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    const isExist = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

    if (isExist.rowCount === 0) {
      return response.error(res, {
        statusCode: 404,
        message: "Event not found",
      });
    }

    try {
      const update = await pool.query(
        `UPDATE Events SET held='${
          held ?? new Date().toISOString()
        }' WHERE id=${id} RETURNING id, held`
      );

      if (update.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: update.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  updateEventCapacity: async (req, res) => {
    const { capacity } = req.body;
    const { id } = req.params;

    if (
      !capacity ||
      !id ||
      Number.isNaN(Number(id)) ||
      Number.isNaN(Number(capacity))
    ) {
      return response.error(res, {
        statusCode: 400,
        message: "Capacity and ID are required and must be a number",
      });
    }

    const isExist = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

    if (isExist.rowCount === 0) {
      return response.error(res, {
        statusCode: 404,
        message: "Event not found",
      });
    }

    try {
      const update = await pool.query(
        `UPDATE Events SET capacity='${capacity.trim()}' WHERE id=${id} RETURNING id, capacity`
      );

      if (update.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: update.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  updateEventStatus: async (req, res) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    const isExist = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

    if (isExist.rowCount === 0) {
      return response.error(res, {
        statusCode: 404,
        message: "Event not found",
      });
    }

    const event = isExist.rows[0];

    try {
      const getActiveEvent = await pool.query(
        "SELECT * FROM Events WHERE isactive=TRUE"
      );

      // if (getActiveEvent.rowCount === 0) {
      //   return response.error(res, {
      //     statusCode: 404,
      //     message: "Cannot update event status. at least one event must be active"
      //   });
      // }

      if (getActiveEvent.rowCount > 0) {
        await pool.query(
          `UPDATE Events SET isactive=FALSE WHERE id=${getActiveEvent.rows[0].id}`
        );
      }

      let update;

      if (event.isactive) {
        update = await pool.query(
          `UPDATE Events SET isactive=FALSE WHERE id=${id}`
        );
      } else {
        update = await pool.query(
          `UPDATE Events SET isactive=TRUE WHERE id=${id}`
        );
      }

      if (update.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  deleteEvent: async (req, res) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    const isExist = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

    if (isExist.rowCount === 0) {
      return response.error(res, {
        statusCode: 404,
        message: "Event not found",
      });
    }

    const data = isExist.rows[0];
    const dataImages = [
      data.image1,
      data.image2,
      data.image3,
      data.image4,
      data.logo,
    ].filter((image) => image);

    try {
      dataImages.forEach((image) => {
        fs.unlinkSync(path.resolve(__dirname, "../images/", image));
      });

      const deleteEvent = await pool.query(
        `DELETE FROM Events WHERE id=${id} RETURNING id, name`
      );

      if (deleteEvent.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      await pool.query(`DELETE FROM Tickets WHERE event=${id}`);

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: {
          message: "Event deleted successfully",
          id: deleteEvent.rows[0].id,
          name: deleteEvent.rows[0].name,
        },
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },
};

module.exports = eventServices;
