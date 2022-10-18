const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const pool = require("../db");
const { jwt } = require("../utils");
const response = require("../helpers/response");

const participantServices = {
  getAllParticipants: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, referral_code, referrer, used_by FROM participants`
      );

      if (result.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "No participants found",
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

  
  getParticipantById: async (req, res) => {
    const { id } = req.params;

    // check if id is provided
    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    try {
      // check if participant exists
      const participant = await pool.query(
        `SELECT id, name, email, referral_code, referrer, used_by FROM participants WHERE id='${id}'`
      );

      if (participant.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Participant not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: participant.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  getParticipantByReferralCode: async (req, res) => {
    const { referral_code } = req.params;

    // check if referrer is provided
    if (!referral_code) {
      return response.error(res, {
        statusCode: 401,
        message: "Invalid referrer",
      });
    }

    try {
      // check if participant exists
      const participant = await pool.query(
        `SELECT id, name, email, referral_code, referrer, used_by FROM participants WHERE referral_code='${referral_code}'`
      );

      if (participant.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Participant not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: participant.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  getParticipantByDecodedToken: async (req, res) => {
    const { id, email } = req.user;

    if (!id || !email) {
      return response.error(res, {
        statusCode: 401,
        message: "Invalid token",
      });
    }

    try {
      const participant = await pool.query(
        `SELECT id, name, email, referral_code, referrer, used_by FROM participants WHERE id='${id}' AND email='${email}'`
      );

      if (participant.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Participant not found",
        });
      }

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: participant.rows[0],
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  deleteParticipantById: async (req, res) => {
    const { id } = req.params;

    // check if id is provided
    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    try {
      // check if participant exists
      const participant = await pool.query(
        `SELECT * FROM participants WHERE id='${id}'`
      );

      if (participant.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Participant not found",
        });
      }

      // Get referrer
      const getReferrer = await pool.query(
        `SELECT * FROM participants WHERE referral_code='${participant.rows[0].referrer}'`
      );

      if (getReferrer.rowCount > 0) {
        await pool.query(
          `UPDATE participants SET used_by=${
            Number(getReferrer.rows[0].used_by) - 1
          } WHERE id='${getReferrer.rows[0].id}'`
        );
      }

      // delete participant
      const result = await pool.query(
        `DELETE FROM participants WHERE id='${id}' RETURNING id, name`
      );

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

  
  register: async (req, res) => {
    const { name, email, password, referral } = req.body;

    // check if name, email, and password is provided
    if (!name || !email || !password) {
      return response.error(res, {
        statusCode: 400,
        message: "Name, email, and password are required",
      });
    }

    try {
      // check if participant exists
      const participant = await pool.query(
        `SELECT * FROM participants WHERE email='${email}'`
      );

      if (participant.rowCount > 0) {
        return response.error(res, {
          statusCode: 400,
          message: "Participant already exists",
        });
      }

      // const getActiveEvent = await pool.query(`SELECT * FROM Events WHERE isactive=true`);

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert participant referals
      if (referral) {
        const getParticipantByReferralCode = await pool.query(
          `SELECT id, used_by FROM participants WHERE referral_code='${referral}'`
        );

        if (getParticipantByReferralCode.rowCount == 0) {
          return response.error(res, {
            statusCode: 400,
            message: "Referral code is invalid",
          });
        }

        const usedBy = Number(getParticipantByReferralCode.rows[0].used_by);
        const id = getParticipantByReferralCode.rows[0].id;

        await pool.query(
          `UPDATE participants SET used_by='${usedBy + 1}' WHERE id='${id}'`
        );
      }

      // insert participant
      const referralCode = randomUUID().split("-").join("").substring(0, 15);
      const result = await pool.query(
        `INSERT INTO participants (name, email, password, referrer, referral_code) VALUES ('${name}', '${email}', '${hashedPassword}', '${
          referral ?? null
        }', '${referralCode}') RETURNING id, name, email`
      );

      // await pool.query(
      //   `INSERT INTO Tickets (participant, event) VALUES (${result.rows[0].id}, ${getActiveEvent.rows[0].id})`
      // );

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

  
  login: async (req, res) => {
    const { email, password } = req.body;

    // check if email and password is provided
    if (!email || !password) {
      return response.error(res, {
        statusCode: 400,
        message: "Email and password are required",
      });
    }

    try {
      // check if participant exists
      const participant = await pool.query(
        `SELECT id, name, email, password FROM participants WHERE email='${email}'`
      );

      if (participant.rowCount == 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Participant not found",
        });
      }

      // compare password
      const result = await bcrypt.compare(
        password,
        participant.rows[0].password
      );

      if (!result) {
        return response.error(res, {
          statusCode: 401,
          message: "Invalid password",
        });
      }

      const user = participant.rows[0];
      const token = jwt.generateToken({
        id: user.id,
        email: user.email,
        level: "participant",
      });

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: {
          token,
          id: user.id,
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

module.exports = participantServices;
