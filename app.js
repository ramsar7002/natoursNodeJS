const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routs/tourRoutes");
const userRouter = require("./routs/userRoutes");

const app = express();

//using middleware for handle the request data
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());

//Create a custom middleware example
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTS
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use(express.static(`${__dirname}/public`));

module.exports = app;
