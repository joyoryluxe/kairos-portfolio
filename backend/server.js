require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const sectionRoutes = require('./routes/sectionRoutes');
const uploadRoutes  = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/sections', sectionRoutes);
app.use('/api/upload',   uploadRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error: ', err);
  });

// Serve static files (admin panel)
app.use(express.static(path.join(__dirname, 'public')));

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Root Route
app.get('/', (req, res) => {
  res.send('Kairos Backend API is running. Visit <a href="/admin">/admin</a> for the admin panel.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
