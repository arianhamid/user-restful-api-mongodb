const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routers/users");
const homeRouter = require("./routers/home");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

//connect to mongodb using mongoose
var uri = "mongodb://127.0.0.1:27017/hello_express";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error(error.message));

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
