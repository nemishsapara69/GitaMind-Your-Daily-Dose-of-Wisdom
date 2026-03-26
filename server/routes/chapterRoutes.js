const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chapter = require('../models/chapter');
const { protect, authorize } = require('../middleware/authMiddleware'); // Keep imports, but 'protect' won't be used on the GET / route

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️  Database connection not ready');
        return res.status(503).json({ 
            message: 'Database connection unavailable',
            status: 'MongoDB not connected'
        });
    }
    next();
};

// GET all chapters - Now PUBLIC
router.get('/', checkDbConnection, async (req, res) => {
    try {
        const chapters = await Chapter.find().select('-verses.explanations');
        res.json(chapters);
    } catch (error) {
        console.error('❌ Error fetching chapters:', error.message);
        res.status(500).json({ 
            message: 'Error fetching chapters',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET a single chapter by chapter number (Public)
router.get('/:chapterNumber', checkDbConnection, async (req, res) => {
    try {
        const chapter = await Chapter.findOne({ chapter_number: req.params.chapterNumber });
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        console.error(`❌ Error fetching chapter ${req.params.chapterNumber}:`, error.message);
        res.status(500).json({ 
            message: 'Server error fetching chapter',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET a specific verse from a chapter (Public)
router.get('/:chapterNumber/verses/:verseNumber', checkDbConnection, async (req, res) => {
    try {
        const chapter = await Chapter.findOne({ chapter_number: req.params.chapterNumber });
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        const verse = chapter.verses.find(v => v.verse_number === parseInt(req.params.verseNumber));
        if (!verse) {
            return res.status(404).json({ message: 'Verse not found in this chapter' });
        }
        res.json(verse);
    } catch (error) {
        console.error(`❌ Error fetching verse ${req.params.verseNumber} from chapter ${req.params.chapterNumber}:`, error.message);
        res.status(500).json({ 
            message: 'Server error fetching verse',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;