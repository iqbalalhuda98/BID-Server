const responseHelper = {
  /**
   * @description - This function is used to return a response with a status code and a message
   * @param {object} res - Express response object
   * @param {number} statusCode - Status code of the response
   * @param {string} message - Message of the response
   * @returns {object} - Returns a response object
   * @memberof responseHelper
   */
  success: (res, { statusCode, message, data }) => {
    return res.status(statusCode).json({
      status: "success",
      message: message ?? null,
      data: data ?? null,
    });
  },

  /**
   * @description - This function is used to return a response with a status code and a message
   * @param {object} res - Express response object
   * @param {number} statusCode - Status code of the response
   * @param {string} message - Message of the response
   * @returns {object} - Returns a response object
   */
  error: (res, { statusCode, message, data }) => {
    return res.status(statusCode).json({
      status: "error",
      message: message ?? null,
      data: data ?? null,
    });
  },
};

module.exports = responseHelper;
