const mongoose = require('mongoose');

// Defines the structure/schema for job posts
const jobPostSchema = new mongoose.Schema({
    title: String,
    description: String,
    salary: String,
    datePosted: Date,
    url: String
});

// Creates the model for exporting further
const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
