// backend/src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));                  // Logging HTTP requests
app.use(cors());                         // Enable CORS for frontend
app.use(express.json());                 // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Mount routes (you'll create these files next)
const projectRoutes = require('./routes/projectRoutes');
const documentRoutes = require('./routes/documentRoutes');

app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                message: 'Validation Error',
                details: Object.values(err.errors).map(e => e.message),
                status: 400
            }
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            error: {
                message: 'Duplicate Entry',
                details: Object.keys(err.keyValue).map(key => `${key} already exists`),
                status: 400
            }
        });
    }

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Something went wrong!',
            status: err.status || 500
        }
    });
});

// Start server
const PORT = process.env.PORT || 5001;
const startServer = async () => {
    try {
        await app.listen(PORT);
        console.log(`Backend server is running on port ${PORT}`);
        console.log(`Test the server: http://localhost:${PORT}/api/test`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Optionally: process.exit(1);
});