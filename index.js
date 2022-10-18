require("express-async-errors");

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, ".env"),
  encoding: "utf-8",
});

const express = require("express");
const app = express();

const http = require("http").createServer(app);
const Startup = require("./middleware/startup");
const error = require("./middleware/error");

Startup(app);

// mendaftarkan router
app.use("/api/admin", require("./routes/admin"));
app.use("/api/participant", require("./routes/participant"));
app.use("/api/event", require("./routes/event"));
app.use("/api/ticket", require("./routes/ticket"));
app.use("/api/image", require("./routes/images"));
app.use("/api/level", require("./routes/referral-level"));

app.use(error);
const PORT = process.env.PORT || 8888;
http.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
