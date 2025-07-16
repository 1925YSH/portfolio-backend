const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [String],  // ✅ now included
  image: { type: String, required: true },
  github: { type: String },
  demo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema); // ✅ Fixed line
