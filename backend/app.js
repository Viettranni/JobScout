require("dotenv").config();
const connectDB = require("../backend/src/config/db");
const express = require("express");
const mongoose = require("mongoose");
// const authRoutes = require("./src/routes/authRouter");
const jobRoutes = require("./src/routes/jobRouter");
const userRoutes = require("./src/routes/userRouter");

const app = express();

app.use(express.json());

connectDB();

// Routers
// app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);
app.use("/api", userRoutes);

module.exports = app;
