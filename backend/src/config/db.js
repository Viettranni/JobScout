const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use await to connect to the database, and ensure you pass the URI properly
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    // Log the MongoDB connection host
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error if the connection fails
    console.error('Could not connect to MongoDB...', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
