const JSONWebToken = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  encoding: "utf8",
});

const jwt = {
  /**
   * Generate JWT token
   * @param {Object} payload
   */
  generateToken: (payload) => {
    return JSONWebToken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  },

  /**
   * Verify JWT token
   * @param {String} token
   */
  verifyToken: (token) => {
    return JSONWebToken.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = jwt;
