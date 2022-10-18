const { jwt } = require("../utils");
const pool = require("../db");
const response = require("../helpers/response");

const JwtMiddleware = async (req, res, next) => {
  const token =
    req.headers["x-access-token"]?.split(" ")[1] ??
    req.headers["authorization"]?.split(" ")[1] ??
    undefined;

  if (!token) {
    return response.error(res, {
      statusCode: 401,
      message: "Token is required",
    });
  }

  try {
    const decoded = jwt.verifyToken(token);

    if (!decoded || !(decoded.exp < Date.now())) {
      return response.error(res, {
        statusCode: 401,
        message: "Token is invalid",
      });
    }

    if (decoded.level === "admin") {
      const admin = await pool.query(
        `SELECT * FROM Admins WHERE id='${decoded.id}'`
      );

      if (admin.rowCount == 0) {
        return response.error(res, {
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }

    if (decoded.level === "participant") {
      const participant = await pool.query(
        `SELECT * FROM Participants WHERE id='${decoded.id}'`
      );

      if (participant.rowCount == 0) {
        return response.error(res, {
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }

    req.user = decoded;
    next();
  } catch (err) {
    return response.error(res, {
      statusCode: 500,
      message: err?.message ?? "Internal Server Error",
    });
  }
};

module.exports = JwtMiddleware;
