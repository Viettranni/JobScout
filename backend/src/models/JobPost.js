const mongoose = require("mongoose");

// Define the schema for the job post
const jobPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    datePosted: { type: String, required: true },
    url: { type: String, required: true, unique: true },
<<<<<<< HEAD
    description: { type: String },
=======
    description: { type: [String] },
>>>>>>> vietbe
    responsibilities: { type: [String] },
    logo: { type: String },
  },
  {
<<<<<<< HEAD
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
=======
    timestamps: true, 
>>>>>>> vietbe
  }
);

// Create a model based on the schema
const JobPost = mongoose.model("JobPost", jobPostSchema);

module.exports = { JobPost, jobPostSchema };
