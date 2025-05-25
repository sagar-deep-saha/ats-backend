const express = require('express');
const multer = require('multer');
const { uploadResume, getResumeAnalysis, getAllResumes, deleteResume } = require('../controllers/resumeController');

const router = express.Router();

// Set up multer for file uploads (store in memory for now)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a resume
router.post('/upload', upload.single('file'), uploadResume);

// Get analysis for a specific resume
router.get('/:id', getResumeAnalysis);

// Get all resumes (for dashboard)
router.get('/', getAllResumes);

// Delete a resume
router.delete('/:id', deleteResume);

module.exports = router; 