const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Bookmarks & Notes
  bookmarks: [{
    chapterNumber: { type: Number, required: true },
    verseNumber: { type: Number, required: true },
    note: { type: String, default: '' },
    tags: [{ type: String }],
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Progress Tracking
  progress: {
    chaptersRead: [{ type: Number }],
    versesRead: [{
      chapterNumber: { type: Number },
      verseNumber: { type: Number },
      readAt: { type: Date, default: Date.now }
    }],
    readingStreak: { type: Number, default: 0 },
    lastReadDate: { type: Date },
    totalVersesRead: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now }
  },
  
  // Daily Verse Settings
  dailyVerse: {
    enabled: { type: Boolean, default: false },
    time: { type: String, default: '09:00' }, // HH:MM format
    lastSent: { type: Date },
    preferredMood: { type: String, default: 'peace' }
  },
  
  // Search History
  searchHistory: [{
    query: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Customization
  settings: {
    theme: { type: String, default: 'light' },
    fontSize: { type: String, default: 'medium' },
    language: { type: String, default: 'english' },
    notifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for faster queries (userId already has unique index, no need to add again)
userPreferencesSchema.index({ 'bookmarks.chapterNumber': 1, 'bookmarks.verseNumber': 1 });

module.exports = mongoose.models.UserPreferences || mongoose.model('UserPreferences', userPreferencesSchema);
