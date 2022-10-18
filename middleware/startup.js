const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, token"
    );

    next();
  });

  app.use(express.json());
  app.use(bodyParser.json());
  // enable x-www-form-urlencoded for post requests
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  // secure apps by setting various HTTP headers
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hidePoweredBy());

  app.use(morgan("dev"));
  app.set("trust proxy", true);
  app.use(
    cors({
      exposedHeaders: "x-auth-token",
    })
  );
};
