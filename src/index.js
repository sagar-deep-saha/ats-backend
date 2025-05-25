const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('node:path');
const morgan = require('morgan');
const axios = require('axios'); // Import axios for HTTP requests
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const resumeRoutes = require('./routes/resumeRoutes');

const corsOptions = {
  origin: 'https://ats.sagar.ltd', // Replace with https if your site uses it
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors(corsOptions));
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

// Route to communicate with ats.sagar.ltd
app.get('/api/external', async (req, res) => {
  try {
    const response = await axios.get('https://ats.sagar.ltd/api/some-endpoint'); // Replace with the actual endpoint
    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with ats.sagar.ltd:', error.message);
    res.status(500).json({ message: 'Failed to communicate with ats.sagar.ltd' });
  }
});

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