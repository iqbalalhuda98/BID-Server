const pool = require("../db");
const response = require("../helpers/response");

const referralLevelServices = {
  getLevel: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM referral_levels ORDER BY level ASC`
      );

      if (result.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Level not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "Success",
        data: result.rows,
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },


  addLevel: async (req, res) => {
    const { level, range } = req.body;

    // check if level and range is provided
    if (!level || !range) {
      return response.error(res, {
        statusCode: 400,
        message: "Level and range are required",
      });
    }

    const checkRange = range.split("-");

    if (checkRange.length != 2) {
      return response.error(res, {
        statusCode: 400,
        message: "Range is invalid",
      });
    }

    if (parseInt(checkRange[0]) >= parseInt(checkRange[1])) {
      return response.error(res, {
        statusCode: 400,
        message: "Range is invalid",
      });
    }

    try {
      const isExist = await pool.query(
        `SELECT * FROM referral_levels WHERE level='${level.trim()}'`
      );

      // check if level is already exist
      if (isExist.rowCount > 0) {
        return response.error(res, {
          statusCode: 400,
          message: "Level is already exist",
        });
      }

      const result = await pool.query(
        `INSERT INTO referral_levels (level, range) VALUES ('${level.trim()}', '${range?.trim()}')`
      );

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      return response.success(res, {
        statusCode: 201,
        message: "Created",
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  updateLevel: async (req, res) => {
    const { id } = req.params;
    const { level, range } = req.body;

    // check if level and range is provided
    if (!id || !level || !range) {
      return response.error(res, {
        statusCode: 400,
        message: "Level and range are required",
      });
    }

    const checkRange = range.split("-");

    if (checkRange.length != 2) {
      return response.error(res, {
        statusCode: 400,
        message: "Range is invalid",
      });
    }

    if (parseInt(checkRange[0].trim()) >= parseInt(checkRange[1].trim())) {
      return response.error(res, {
        statusCode: 400,
        message: "Range is invalid",
      });
    }

    try {
      const isExist = await pool.query(
        `SELECT * FROM referral_levels WHERE id=${id}`
      );

      // check if level is already exist
      if (isExist.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Level not found",
        });
      }

      const result = await pool.query(
        `UPDATE referral_levels SET range='${
          range?.trim() ?? isExist.rows[0].range
        }', level=${Number(level) ?? isExist.rows[0].level} WHERE id=${id}`
      );

      if (result.rowCount == 0) {
        return response.error(res, {
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "Success",
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  deleteLevel: async (req, res) => {
    const { id } = req.params;

    // check if id is provided
    if (!id || isNaN(id)) {
      return response.error(res, {
        statusCode: 400,
        message: "Id is required",
      });
    }

    try {
      const isExist = await pool.query(
        `SELECT * FROM referral_levels WHERE id=${id}`
      );

      // check if level is already exist
      if (isExist.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Level not found",
        });
      }

      const result = await pool.query(
        `DELETE FROM referral_levels WHERE id=${id}`
      );

      if (result.rowCount == 0) {
        return response.error(res, {
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "Success",
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },
};

module.exports = referralLevelServices;
