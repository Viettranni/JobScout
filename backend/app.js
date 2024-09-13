require("dotenv").config();
const connectDB = require("../backend/src/config/db");
const express = require("express");
const mongoose = require("mongoose");
// const authRoutes = require("./src/routes/authRouter");
const jobRoutes = require("./src/routes/jobRouter");

const app = express();

app.use(express.json());

connectDB();

// Routers
// app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
