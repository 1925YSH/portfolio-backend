const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes.js');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL && process.env.FRONTEND_URL.replace(/\/+$/, ''),
  'https://portfolio-frontend-ashy-eight.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, uptime checkers)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }

    // Default to allow origin for portfolio endpoints rather than throwing 500
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route for UptimeRobot, Vercel, and browser direct checks
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Backend is running smoothly on Vercel!' 
  });
});

// Middleware to ensure database connection before handling /api routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: err.message,
      hint: 'Please ensure MONGO_URI is set in Vercel Environment Variables and MongoDB Atlas allows 0.0.0.0/0 Network Access.'
    });
  }
});

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

// Connect to DB immediately if not on Vercel (for local dev)
if (!process.env.VERCEL) {
  connectDB().catch(err => console.log('Local DB Connection error:', err.message));
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
