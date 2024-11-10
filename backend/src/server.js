// backend/src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));                  // Logging HTTP requests
app.use(cors());                         // Enable CORS for frontend
app.use(express.json());                 // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: {
            message: err.message || 'Something went wrong!',
            status: 500
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}/api/test`);
});