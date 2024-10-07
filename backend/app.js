require("dotenv").config();
const connectDB = require("../backend/src/config/db");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const authRoutes = require("./src/routes/authRouter");
const adminRoutes = require("./src/routes/adminRouter");
const jobRoutes = require("./src/routes/jobRouter");
const userRoutes = require("./src/routes/userRouter");
const aiModelRouter = require("./src/routes/aiModelRouter");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./src/middleware/customMiddleware");
const statusMonitor = require("express-status-monitor");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger/swagger.yaml"); // Load the YAML file

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allowing the Frontend to interact with backend
  })
);

app.use(express.json());

app.use(statusMonitor());
app.use(morgan("dev"));

connectDB();

// Routers
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/coverLetter", aiModelRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
