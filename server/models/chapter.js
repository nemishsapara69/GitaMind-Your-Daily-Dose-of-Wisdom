const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
    verse_number: { type: Number, required: true },
    sanskrit: { type: String, required: true },
    transliteration: { type: String, required: true },
    translations: {
        english: { type: String, required: true },
        hindi: { type: String, required: true },
        gujarati: { type: String, required: true }
    },
    explanations: {
        english: { type: String, required: true },
        hindi: { type: String, required: true },
        gujarati: { type: String, required: true }
    }
});

const chapterSchema = new mongoose.Schema({
    chapter_number: { type: Number, required: true, unique: true },
    title: {
        english: { type: String, required: true },
        hindi: { type: String, required: true },
        gujarati: { type: String, required: true }
    },
    summary: {
        english: { type: String, required: true },
        hindi: { type: String, required: true },
        gujarati: { type: String, required: true }
    },
    verse_count: { type: Number, required: true },
    verses: [verseSchema] // Array of verseSchema
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Chapter', chapterSchema);