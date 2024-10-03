// models/coverLetterModel.js
const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // User insert the skills as an array of strings
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
});

const jobDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String, // Job description
    required: true,
  },
});

const coverLetterSchema = new mongoose.Schema({
  userData: {
    type: userDataSchema,
    required: true,
  },
  jobData: {
    type: jobDataSchema,
    required: true,
  },
});

// Create the CoverLetter model
const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);

module.exports = CoverLetter;
