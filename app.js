const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");

const app = express();

//1) GLOBAL MIDDLEWARE

//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  //allow 100 requests per hour per IP
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Requested at ${req.requestTime}`);

  next();
});

//Routes
app.get("/", (req, res) => {
  res.status(200).render("base", {
    tour: "The Forest Hiker",
    user: "Jonas",
  });
});

app.get("/overview", (req, res) => {
  res.status(200).render("overview", {
    title: "All tours",
  });
});

app.get("/tour", (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker Tour",
  });
});

app.use("/api/v1/users", userRouter);

//Handle non-existing routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
