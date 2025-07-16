const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const sendEmail =require('../utils/sendEmail');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save(); // save to db

    await sendEmail ({ name, email, message }); // ⬅️ THIS LINE sends email
    
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ NEW: GET - Fetch all messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ✅ NEW: DELETE - Delete a message by ID
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
