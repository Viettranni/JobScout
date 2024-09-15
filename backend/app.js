require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRouter');
const jobRoutes = require('./src/routes/jobRouter');

const app = express();
app.use(express.json());

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

mongoose.connect(process.env.MONGO_URI, { 
    
 })
    .then(() => console.log('Connected successfully to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

module.exports = app;
