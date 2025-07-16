const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Dummy admin credentials (replace with env or DB later)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '2h'
  });

  res.json({ token });
});

module.exports = router;
