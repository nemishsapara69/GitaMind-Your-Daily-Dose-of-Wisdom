const express = require('express');
const router = express.Router();
const Chapter = require('../models/chapter');

// Search verses across all chapters
router.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchTerm = q.trim().toLowerCase();
        
        // Find chapters and search within verses
        const chapters = await Chapter.find();
        const searchResults = [];

        chapters.forEach(chapter => {
            if (chapter.verses && chapter.verses.length > 0) {
                chapter.verses.forEach(verse => {
                    // Search in English translation
                    const englishMatch = verse.text && verse.text.english && 
                        verse.text.english.toLowerCase().includes(searchTerm);
                    
                    // Search in Sanskrit
                    const sanskritMatch = verse.text && verse.text.sanskrit && 
                        verse.text.sanskrit.toLowerCase().includes(searchTerm);
                    
                    // Search in commentary if available
                    const commentaryMatch = verse.commentary && 
                        verse.commentary.toLowerCase().includes(searchTerm);

                    if (englishMatch || sanskritMatch || commentaryMatch) {
                        searchResults.push({
                            chapterNumber: chapter.chapter_number,
                            chapterTitle: chapter.title,
                            verseNumber: verse.verse_number,
                            text: verse.text,
                            commentary: verse.commentary,
                            matchType: englishMatch ? 'english' : sanskritMatch ? 'sanskrit' : 'commentary'
                        });
                    }
                });
            }
        });

        res.json({
            success: true,
            data: searchResults,
            query: q,
            totalResults: searchResults.length
        });

    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to perform search'
        });
    }
});

module.exports = router;