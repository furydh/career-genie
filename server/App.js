// server/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const resumeRoute = require('./routes/resumeRoute');
const authRoutes = require('./routes/authRoute');
const jobRoute = require('./routes/jobRoute');
const applicationRoute = require('./routes/applicationRoute');
const notificationRoute = require('./routes/notificationRoute');

const app = express();

app.get('/', (req, res) => {
  res.send('✅ Resume Parser API is working');
});


// ✅ Allow frontend origin
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use('/api/resume', resumeRoute);
app.use('/api/auth', authRoutes);
app.use('/api', jobRoute);
app.use('/api', applicationRoute);
app.use('/api', notificationRoute);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = 5001;
app.listen(5001, () => {
  console.log("Server running on port 5001");
});
