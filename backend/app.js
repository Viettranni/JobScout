require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const jobRoutes = require('./src/routes/jobRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes);

mongoose.connect(process.env.MONGO_URI, { 
    
 })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

module.exports = app;
