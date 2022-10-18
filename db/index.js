const { Pool } = require("pg");

const poolConfig = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "IqbalJAG486",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "bisnis_indonesia",
};

const pool = new Pool(poolConfig);

pool
  .connect()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = pool;
