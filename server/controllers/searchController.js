const Chapter = require('../models/Chapter');
const Product = require('../models/Product');

// @desc    Global search across chapters, verses, and products
// @route   GET /api/search?q=query
// @access  Public
exports.globalSearch = async (req, res) => {
    const query = req.query.q; // Get search query from URL
    if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Case-insensitive search using $regex
    const searchRegex = new RegExp(query, 'i');

    try {
        const results = [];

        // 1. Search Chapters (title and summary)
        const chapterResults = await Chapter.find({
            $or: [
                { 'title.english': searchRegex },
                { 'title.hindi': searchRegex },
                { 'title.gujarati': searchRegex },
                { 'summary.english': searchRegex },
                { 'summary.hindi': searchRegex },
                { 'summary.gujarati': searchRegex },
            ]
        }).select('chapter_number title summary'); // Select relevant fields
        
        // Format chapter results
        chapterResults.forEach(chap => {
            results.push({
                id: chap._id,
                type: 'Chapter',
                title: `Chapter ${chap.chapter_number}: ${chap.title.english}`,
                summary: chap.summary.english,
                link: `/chapters/${chap.chapter_number}`
            });
        });

        // 2. Search Verses (sanskrit, transliteration, translations, explanations)
        // This is a bit more complex as verses are nested. We'll search chapters and then filter verses.
        const verseChapterResults = await Chapter.find({
            'verses': {
                $elemMatch: { // Search within the verses array
                    $or: [
                        { 'sanskrit': searchRegex },
                        { 'transliteration': searchRegex },
                        { 'translations.english': searchRegex },
                        { 'translations.hindi': searchRegex },
                        { 'translations.gujarati': searchRegex },
                        { 'explanations.english': searchRegex },
                        { 'explanations.hindi': searchRegex },
                        { 'explanations.gujarati': searchRegex },
                    ]
                }
            }
        }).select('chapter_number title verses');

        verseChapterResults.forEach(chap => {
            chap.verses.forEach(verse => {
                // Only add if the specific verse text matches (to avoid duplicates if chapter title also matched)
                if (
                    verse.sanskrit.match(searchRegex) ||
                    verse.transliteration.match(searchRegex) ||
                    verse.translations.english.match(searchRegex) ||
                    verse.translations.hindi.match(searchRegex) ||
                    verse.translations.gujarati.match(searchRegex) ||
                    verse.explanations.english.match(searchRegex) ||
                    verse.explanations.hindi.match(searchRegex) ||
                    verse.explanations.gujarati.match(searchRegex)
                ) {
                    results.push({
                        id: verse._id, // Use verse's own ID or chapter's ID for linking
                        type: 'Verse',
                        title: `Verse ${chap.chapter_number}.${verse.verse_number}: ${verse.translations.english.substring(0, 50)}...`,
                        summary: verse.explanations.english.substring(0, 100) + '...',
                        link: `/chapters/${chap.chapter_number}/verses/${verse.verse_number}` // Link to specific verse
                    });
                }
            });
        });


        // 3. Search Products (name and description)
        const productResults = await Product.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex }
            ]
        }).populate('category', 'name').select('name description price images slug'); // Populate category name

        // Format product results
        productResults.forEach(prod => {
            results.push({
                id: prod._id,
                type: 'Product',
                title: prod.name,
                summary: prod.description.substring(0, 150) + '...',
                link: `/products/${prod._id}`
            });
        });

        // Remove duplicates based on ID (if a chapter matches for title and a verse within it also matches)
        const uniqueResults = Array.from(new Map(results.map(item => [item.id.toString(), item])).values());


        res.status(200).json({ success: true, count: uniqueResults.length, data: uniqueResults });

    } catch (error) {
        console.error('Error during global search:', error.message);
        res.status(500).json({ success: false, message: 'Server error during search' });
    }
};