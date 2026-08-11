const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const projectRoutes =require ('./routes/projectRoutes.js');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:3001'
        ];
        
        // Also allow any vercel.app domain for preview deployments
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

const contactRoutes = require('./routes/contactRoutes');

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));



app.use('/api/projects',projectRoutes);

// Health check route for UptimeRobot and Render
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend is running smoothly!' });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
