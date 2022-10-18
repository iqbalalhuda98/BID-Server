const pool = require("../db");
const response = require("../helpers/response");
const path = require("path");
const fs = require("fs");

const imageServices = {
  downloadImage: async (req, res) => {
    const { filename } = req.params;

    if (!filename) {
      return response.error(res, {
        statusCode: 400,
        message: "Filename is required",
      });
    }

    try {
      const filePath = path.resolve(__dirname, "../images", filename);

      if (!fs.existsSync(filePath)) {
        return response.error(res, {
          statusCode: 404,
          message: "File not found",
        });
      }

      return res.sendFile(filePath);
    } catch (err) {
      return response.error(res, {
        statusCode: 500,
        message: err?.message ?? "Internal Server Error",
      });
    }
  },


  uploadImage: async (req, res) => {
    const { id, list_img } = req.params;

    if (
      !id ||
      Number.isNaN(Number(id)) ||
      !list_img ||
      Number.isNaN(Number(list_img))
    ) {
      fs.unlinkSync(path.resolve(__dirname, "../images/", req.file?.filename));

      return response.error(res, {
        statusCode: 400,
        message: "List Image & ID is required and must be a number",
      });
    }

    try {
      const getEvent = await pool.query(
        `SELECT * FROM Events WHERE id = ${id}`
      );
      const file = req.file;

      if (getEvent.length === 0) {
        fs.unlinkSync(path.resolve(__dirname, "../images/", file?.filename));

        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      if (!file) {
        fs.unlinkSync(
          path.resolve(__dirname, "../images/", req.file?.filename)
        );

        return response.error(res, {
          statusCode: 400,
          message: "File is required",
        });
      }

      let dataImage;
      switch (list_img) {
        case "1":
          dataImage = getEvent.rows[0].image1;
          break;
        case "2":
          dataImage = getEvent.rows[0].image2;
          break;
        case "3":
          dataImage = getEvent.rows[0].image3;
          break;
        case "4":
          dataImage = getEvent.rows[0].image4;
          break;
      }

      if (dataImage) {
        const isExist = fs.existsSync(
          path.resolve(__dirname, "../images/", dataImage)
        );
        if (isExist)
          fs.unlinkSync(path.resolve(__dirname, "../images/", dataImage));
      }

      const insert = await pool.query(
        `UPDATE Events SET image${list_img}='${file.filename}' WHERE id=${id}`
      );

      if (insert.rowCount === 0) {
        fs.unlinkSync(
          path.resolve(__dirname, "../images/", req.file?.filename)
        );

        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      const result = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

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

  
  uploadLogo: async (req, res) => {
    const { id } = req.params;
    const { file } = req;

    if (!id || Number.isNaN(Number(id))) {
      fs.unlinkSync(path.resolve(__dirname, "../images/", file?.filename));

      return response.error(res, {
        statusCode: 400,
        message: "ID is required and must be a number",
      });
    }

    const getEvent = await pool.query(`SELECT * FROM Events WHERE id = ${id}`);

    try {
      if (!file) {
        fs.unlinkSync(path.resolve(__dirname, "../images/", file?.filename));

        return response.error(res, {
          statusCode: 400,
          message: "File is required",
        });
      }

      const dataImage = getEvent.rows[0].logo;

      if (dataImage) {
        const isExist = fs.existsSync(
          path.resolve(__dirname, "../images/", dataImage)
        );
        if (isExist)
          fs.unlinkSync(path.resolve(__dirname, "../images/", dataImage));
      }

      const insert = await pool.query(
        `UPDATE Events SET logo='${file.filename}' WHERE id=${id}`
      );

      if (insert.rowCount === 0) {
        fs.unlinkSync(path.resolve(__dirname, "../images/", file?.filename));

        return response.error(res, {
          statusCode: 404,
          message: "Event not found",
        });
      }

      const result = await pool.query(`SELECT * FROM Events WHERE id=${id}`);

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

module.exports = imageServices;
