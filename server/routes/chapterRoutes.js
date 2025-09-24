const express = require('express');
const router = express.Router();
const Chapter = require('../models/chapter');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import middleware

// GET all chapters - NOW PROTECTED
router.get('/', protect, async (req, res) => {
    try {
        const chapters = await Chapter.find().select('-verses.explanations');
        res.json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a single chapter by chapter number (Public for now)
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

// GET a specific verse from a chapter (Public for now)
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