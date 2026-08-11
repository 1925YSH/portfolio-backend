const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const projectRoutes =require ('./routes/projectRoutes.js');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

const contactRoutes = require('./routes/contactRoutes');

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));



app.use('/api/projects',projectRoutes)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
