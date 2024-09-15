const mongoose = require('mongoose');

// Defines the structure/schema for job posts
const jobPostSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    url: String,
    logoUrl: String,
    postedTime: String,
    description: String
}, { timestamp: true });

// Creates the model for exporting further
const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
