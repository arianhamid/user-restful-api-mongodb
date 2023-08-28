const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routers/users");
const homeRouter = require("./routers/home");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(helmet());

app.set("view engine", "ejs");
app.set("views", "./views");

// middleware that redirect requests to the routes
app.use("/", homeRouter);
app.use("/api/users", userRouter);

if (app.get("env") == "development") {
  console.log("morgen is active");
  app.use(morgan("tiny"));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));
