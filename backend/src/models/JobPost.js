const mongoose = require("mongoose");

// Define the schema for the job post
const jobPostSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    url: String,
    logoUrl: String,
    postedTime: String,
    description: String,
    favorite: { type: Boolean, default: false },
    applied: { type: Boolean, default: false }

}, { timestamps: true });

// Create a model based on the schema
const JobPost = mongoose.model("JobPost", jobPostSchema);

module.exports = JobPost;
