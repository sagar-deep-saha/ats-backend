const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');

// In-memory storage for demo
const resumes = {};

// Basic resume keyword check and email/phone number check
const isProbablyResume = (text) => {
    const resumeKeywords = [
        "education", "experience", "skills", "project", "summary", "contact",
        "certification", "objective", "profile", "work history", "employment",
        "professional", "responsibilities", "achievements", "references"
    ];
    const foundKeywords = resumeKeywords.filter(keyword =>
        text.toLowerCase().includes(keyword)
    ).length;

    const hasEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/.test(text);
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);

    return (foundKeywords >= 2) && (hasEmail || hasPhone);
};

// Upload a resume and analyze it
exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileName = req.file.originalname;
  const fileBuffer = req.file.buffer;
  const fileType = req.file.mimetype;

  // Only process PDF files for now with this logic
  if (fileType !== 'application/pdf') {
      // For other file types, you might want to return an error or handle them differently
      return res.status(400).json({ error: 'Only PDF files are supported in this demo.' });
  }

  try {
    // Extract text from the PDF
    const data = await pdfParse(fileBuffer);
    const pdfText = data.text;

    // Check if the extracted text seems like a resume
    if (!isProbablyResume(pdfText)) {
        return res.status(400).json({ error: 'The uploaded file does not appear to be a resume.' });
    }

    // If it is probably a resume, proceed with mock analysis
    // In a real application, you would send the text to an ML service for analysis
    const analysis = {
      id: uuidv4(), // Generate a new ID for the stored analysis
      name: fileName,
      uploadDate: new Date().toISOString().slice(0, 10),
      professionalityScore: Math.floor(Math.random() * 41) + 60, // 60-100
      careerRecommendations: [
        { field: 'Software Engineering', score: 92 },
        { field: 'System Engineering', score: 87 },
        { field: 'Data Science', score: 78 },
      ],
      strengthPoints: [
        'Strong technical skills',
        'Good project descriptions',
        'Clear progression in career path',
      ],
      improvementPoints: [
        'Add more quantifiable achievements',
        'Enhance the skills section',
      ],
      skillsIdentified: ['Java', 'Python', 'React'],
    };

    // In-memory storage (for demo purposes)
    resumes[analysis.id] = analysis;

    res.json(analysis);

  } catch (error) {
    console.error('Error processing PDF or analyzing resume:', error);
    return res.status(500).json({ error: 'Failed to process or analyze the file.' });
  }
};

// Get analysis for a specific resume
exports.getResumeAnalysis = (req, res) => {
  const { id } = req.params;
  if (!resumes[id]) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  res.json(resumes[id]);
};

// Get all resumes
exports.getAllResumes = (req, res) => {
  res.json(Object.values(resumes));
};

// Delete a resume
exports.deleteResume = (req, res) => {
  const { id } = req.params;
  if (!resumes[id]) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  delete resumes[id];
  res.json({ message: 'Resume deleted' });
}; 