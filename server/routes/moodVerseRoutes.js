const express = require('express');
const router = express.Router();
const moodVerseController = require('../controllers/moodVerseController');

// Route to get a mood-based verse (public)
router.get('/', moodVerseController.getMoodBasedVerse);

module.exports = router;