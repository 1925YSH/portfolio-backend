const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Ensure the upload folder exists safely (won't crash on read-only serverless filesystems)
const uploadDir = path.join(__dirname, '..', 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Upload directory creation skipped:', err.message);
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

// Create project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);

    const { title, description, techStack, github, demo } = req.body;
    const imagePath = req.file ? `uploads/${path.basename(req.file.path)}` : '';

    const newProject = new Project({
      title,
      description,
      techStack: typeof techStack === 'string' ? techStack.split(',').map(tech => tech.trim()) : (techStack || []),
      github,
      demo,
      image: imagePath
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Error in adding project:', err);
    res.status(500).json({ error: 'Failed to add project', details: err.message });
  }
});

// ✅ GET: All projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('❌ Error in GET /api/projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// ✅ DELETE: By ID
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('❌ Error in DELETE /api/projects/:id:', err);
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

// ✅ PUT: Update By ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, techStack, github, demo } = req.body;
    let updateData = {
      title,
      description,
      techStack: typeof techStack === 'string' ? techStack.split(',').map(tech => tech.trim()) : (techStack || []),
      github,
      demo,
    };
    
    if (req.file) {
      updateData.image = `uploads/${path.basename(req.file.path)}`;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedProject);
  } catch (err) {
    console.error('❌ Error in PUT /api/projects/:id:', err);
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

module.exports = router;
