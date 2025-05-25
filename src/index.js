const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('node:path');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const resumeRoutes = require('./routes/resumeRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Resume Analyzer API' });
});

// API Routes
app.use('/api/resumes', resumeRoutes);

// Handle ML service communication
app.use('/api/ml', (req, res) => {
  res.json({ message: 'ML Service endpoint' });
});

// Custom error handling middleware
app.use(notFound);
app.use(errorHandler);

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 