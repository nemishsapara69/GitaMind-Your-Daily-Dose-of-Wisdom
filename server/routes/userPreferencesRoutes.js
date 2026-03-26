const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserPreferences,
  addBookmark,
  updateBookmark,
  removeBookmark,
  trackVerseRead,
  updateDailyVerse,
  addSearchHistory,
  updateSettings,
  exportBookmarks,
  exportProgress,
  exportAllData
} = require('../controllers/userPreferencesController');

// Get user preferences
router.get('/', protect, getUserPreferences);

// Bookmark routes
router.post('/bookmarks', protect, addBookmark);
router.put('/bookmarks', protect, updateBookmark);
router.delete('/bookmarks', protect, removeBookmark);

// Progress tracking
router.post('/progress', protect, trackVerseRead);

// Daily verse settings
router.put('/daily-verse', protect, updateDailyVerse);

// Search history
router.post('/search-history', protect, addSearchHistory);

// Settings
router.put('/settings', protect, updateSettings);

// Export routes
router.get('/export/bookmarks', protect, exportBookmarks);
router.get('/export/progress', protect, exportProgress);
router.get('/export/all', protect, exportAllData);

module.exports = router;
