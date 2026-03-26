const express = require('express');
const router = express.Router();
const Chapter = require('../models/chapter');
const { protect, authorize } = require('../middleware/authMiddleware'); // Keep imports, but 'protect' won't be used on the GET / route

// GET all chapters - Now PUBLIC
router.get('/', async (req, res) => { // <--- 'protect' MIDDLEWARE REMOVED HERE
    try {
        const chapters = await Chapter.find().select('-verses.explanations'); // You might want to remove this .select() for public API
        res.json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a single chapter by chapter number (Public)
router.get('/:chapterNumber', async (req, res) => {
    try {
        const chapter = await Chapter.findOne({ chapter_number: req.params.chapterNumber });
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        console.error(`Error fetching chapter ${req.params.chapterNumber}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a specific verse from a chapter (Public)
router.get('/:chapterNumber/verses/:verseNumber', async (req, res) => {
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
        console.error(`Error fetching verse ${req.params.verseNumber} from chapter ${req.params.chapterNumber}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;