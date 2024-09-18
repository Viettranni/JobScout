require("dotenv").config();
const connectDB = require("../backend/src/config/db");
const express = require("express");
const mongoose = require("mongoose");
// const authRoutes = require("./src/routes/authRouter");
const jobRoutes = require("./src/routes/jobRouter");
const userRoutes = require("./src/routes/userRouter");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./src/middleware/customMiddleware");

const app = express();

app.use(express.json());

app.use(requestLogger);

connectDB();

// Routers
// app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// Example route that throws an error
app.get("/error", (req, res, next) => {
  // Trigger an error
  const error = new Error("Something went wrong!");
  next(error);
});

// Use the unknownEndpoint middleware for handling undefined routes
app.use(unknownEndpoint);

// Use the errorHandler middleware for handling errors
app.use(errorHandler);

module.exports = app;
