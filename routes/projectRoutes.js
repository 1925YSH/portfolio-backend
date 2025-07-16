const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Ensure the upload folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

/// Create project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);

    const { title, description, techStack, github, demo } = req.body;
    const imagePath = req.file ? req.file.path : '';

    const newProject = new Project({
      title,
      description,
      techStack: techStack.split(',').map(tech => tech.trim()), // make sure it's an array
      github,
      demo,
      image: imagePath
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Error in adding project:', err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// ✅ GET: All projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('❌ Error in GET /api/projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ✅ DELETE: By ID
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('❌ Error in DELETE /api/projects/:id:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});



module.exports = router;
