// backend/src/routes/documentRoutes.js
const express = require('express');
const router = express.Router();

// GET all documents
router.get('/', async (req, res, next) => {
    try {
        res.json({ message: 'Get all documents' });
    } catch (error) {
        next(error);
    }
});

// POST upload document
router.post('/upload', async (req, res, next) => {
    try {
        res.json({ message: 'Upload document' });
    } catch (error) {
        next(error);
    }
});

// GET document analysis
router.get('/:id/analysis', async (req, res, next) => {
    try {
        res.json({ message: `Get analysis for document ${req.params.id}` });
    } catch (error) {
        next(error);
    }
});

module.exports = router;