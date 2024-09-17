const mongoose = require("mongoose");

// Define the schema for the job post
const jobPostSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    datePosted: String,
    url: String,
    description: String,
    responsibilities: String,
    logo: String

}, { timestamps: true });

// Create a model based on the schema
const JobPost = mongoose.model("JobPost", jobPostSchema);

module.exports = JobPost;
