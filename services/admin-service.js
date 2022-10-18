const pool = require("../db");
const bcrypt = require("bcrypt");
const response = require("../helpers/response");
const jwt = require("../utils/jwt");

const adminServices = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    // check if name, email, password is provided
    if (!name || !email || !password) {
      return response.error(res, {
        statusCode: 400,
        message: "Name, email, and password are required",
      });
    }

    // check if admin already exists
    const checkAdmin = await pool.query(
      `SELECT * FROM Admins WHERE email='${email}'`
    );

    if (checkAdmin.rowCount > 0) {
      return response.error(res, {
        statusCode: 400,
        message: "Admin already exists",
      });
    }

    try {
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // insert admin and then check if admin is inserted
      const insert = await pool.query(
        `INSERT INTO Admins(name, email, password) VALUES('${name}', '${email}', '${hashedPassword}') RETURNING id`
      );

      if (insert.rowCount === 0) {
        return response.error(res, {
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      // get admin
      const result = await pool.query(
        `SELECT * FROM Admins WHERE id=${insert.rows[0].id}`
      );

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
      const admin = await pool.query(
        `SELECT * FROM Admins WHERE email='${email}'`
      );

      // check if admin exists
      if (admin.rowCount === 0) {
        return response.error(res, {
          statusCode: 401,
          message: "Admin does not exist",
        });
      }

      // check if password is valid
      const isValid = await bcrypt.compare(password, admin.rows[0].password);

      if (!isValid) {
        return response.error(res, {
          statusCode: 401,
          message: "Invalid password",
        });
      }

      const data = admin.rows[0];
      const token = jwt.generateToken({
        id: data.id,
        email: data.email,
        level: "admin",
      });

      return response.success(res, {
        statusCode: 200,
        message: "OK",
        data: {
          token,
        },
      });
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },

  
  delete: async (req, res) => {
    const { id } = req.params;

    // check if id is provided
    if (!id || Number.isNaN(Number(id))) {
      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    try {
      // check if admin exists
      const admin = await pool.query(`SELECT * FROM Admins WHERE id='${id}'`);

      if (admin.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Admin does not exist",
        });
      }

      // delete admin
      const result = await pool.query(
        `DELETE FROM Admins WHERE id='${id}' RETURNING id`
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

  
  getProfile: async (req, res) => {
    const { id, email } = req.user;

    if (!id || !email) {
      return response.error(res, {
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    try {
      // get admin
      const result = await pool.query(
        `SELECT id,email,name FROM Admins WHERE id='${id}' AND email='${email}'`
      );

      if (result.rowCount === 0) {
        return response.error(res, {
          statusCode: 404,
          message: "Admin does not exist",
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
};

module.exports = adminServices;
