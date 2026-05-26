require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const sectionRoutes = require('./routes/sectionRoutes');
const uploadRoutes  = require('./routes/uploadRoutes');
const authRoutes    = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://kairosstudio.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://kairos-portfolio-xsdp.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy', timestamp: new Date() });
});

// Routes
app.use('/api/sections', sectionRoutes);
app.use('/api/upload',   uploadRoutes);
app.use('/api/auth',     authRoutes);

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

// // Admin panel route
// app.get('/admin', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin.html'));
// });

// Root Route
app.get('/', (req, res) => {
  res.send('Kairos Backend API is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
