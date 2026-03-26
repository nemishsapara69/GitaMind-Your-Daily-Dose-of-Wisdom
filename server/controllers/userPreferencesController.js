const UserPreferences = require('../models/UserPreferences');
const { exportBookmarksTXT, exportProgressTXT, exportAllDataTXT } = require('../utils/exportUtils');

// Get user preferences
exports.getUserPreferences = async (req, res) => {
  try {
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      // Create default preferences if none exist
      preferences = await UserPreferences.create({ userId: req.user._id });
    }
    
    res.json({ success: true, data: preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch preferences' });
  }
};

// Add bookmark
exports.addBookmark = async (req, res) => {
  try {
    const { chapterNumber, verseNumber, note, tags } = req.body;
    
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = await UserPreferences.create({ userId: req.user._id });
    }
    
    // Check if bookmark already exists
    const exists = preferences.bookmarks.find(
      b => b.chapterNumber === chapterNumber && b.verseNumber === verseNumber
    );
    
    if (exists) {
      return res.status(400).json({ success: false, message: 'Bookmark already exists' });
    }
    
    preferences.bookmarks.push({ chapterNumber, verseNumber, note, tags });
    await preferences.save();
    
    res.json({ success: true, data: preferences.bookmarks });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ success: false, message: 'Failed to add bookmark' });
  }
};

// Update bookmark note/tags
exports.updateBookmark = async (req, res) => {
  try {
    const { chapterNumber, verseNumber, note, tags } = req.body;
    
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return res.status(404).json({ success: false, message: 'Preferences not found' });
    }
    
    const bookmark = preferences.bookmarks.find(
      b => b.chapterNumber === chapterNumber && b.verseNumber === verseNumber
    );
    
    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }
    
    if (note !== undefined) bookmark.note = note;
    if (tags !== undefined) bookmark.tags = tags;
    
    await preferences.save();
    
    res.json({ success: true, data: preferences.bookmarks });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ success: false, message: 'Failed to update bookmark' });
  }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const { chapterNumber, verseNumber } = req.body;
    
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return res.status(404).json({ success: false, message: 'Preferences not found' });
    }
    
    preferences.bookmarks = preferences.bookmarks.filter(
      b => !(b.chapterNumber === chapterNumber && b.verseNumber === verseNumber)
    );
    
    await preferences.save();
    
    res.json({ success: true, data: preferences.bookmarks });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ success: false, message: 'Failed to remove bookmark' });
  }
};

// Track verse read
exports.trackVerseRead = async (req, res) => {
  try {
    const { chapterNumber, verseNumber } = req.body;
    
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = await UserPreferences.create({ userId: req.user._id });
    }
    
    // Add to verses read (avoid duplicates for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const alreadyReadToday = preferences.progress.versesRead.some(v => 
      v.chapterNumber === chapterNumber && 
      v.verseNumber === verseNumber &&
      new Date(v.readAt) >= today
    );
    
    if (!alreadyReadToday) {
      preferences.progress.versesRead.push({ chapterNumber, verseNumber });
      preferences.progress.totalVersesRead += 1;
      
      // Add to chapters read if not already there
      if (!preferences.progress.chaptersRead.includes(chapterNumber)) {
        preferences.progress.chaptersRead.push(chapterNumber);
      }
      
      // Update reading streak
      const lastRead = preferences.progress.lastReadDate;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (!lastRead || new Date(lastRead) < yesterday) {
        preferences.progress.readingStreak = 1;
      } else if (new Date(lastRead).toDateString() === yesterday.toDateString()) {
        preferences.progress.readingStreak += 1;
      }
      
      preferences.progress.lastReadDate = new Date();
      await preferences.save();
    }
    
    res.json({ success: true, data: preferences.progress });
  } catch (error) {
    console.error('Error tracking verse:', error);
    res.status(500).json({ success: false, message: 'Failed to track verse' });
  }
};

// Update daily verse settings
exports.updateDailyVerse = async (req, res) => {
  try {
    const { enabled, time, preferredMood } = req.body;
    
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = await UserPreferences.create({ userId: req.user._id });
    }
    
    if (enabled !== undefined) preferences.dailyVerse.enabled = enabled;
    if (time !== undefined) preferences.dailyVerse.time = time;
    if (preferredMood !== undefined) preferences.dailyVerse.preferredMood = preferredMood;
    
    await preferences.save();
    
    res.json({ success: true, data: preferences.dailyVerse });
  } catch (error) {
    console.error('Error updating daily verse:', error);
    res.status(500).json({ success: false, message: 'Failed to update daily verse settings' });
  }
};

// Add to search history
exports.addSearchHistory = async (req, res) => {
  try {
    const { query } = req.body;
    
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = await UserPreferences.create({ userId: req.user._id });
    }
    
    preferences.searchHistory.unshift({ query });
    
    // Keep only last 50 searches
    if (preferences.searchHistory.length > 50) {
      preferences.searchHistory = preferences.searchHistory.slice(0, 50);
    }
    
    await preferences.save();
    
    res.json({ success: true, data: preferences.searchHistory });
  } catch (error) {
    console.error('Error adding search history:', error);
    res.status(500).json({ success: false, message: 'Failed to add search history' });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const { theme, fontSize, language, notifications } = req.body;
    
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = await UserPreferences.create({ userId: req.user._id });
    }
    
    if (theme !== undefined) preferences.settings.theme = theme;
    if (fontSize !== undefined) preferences.settings.fontSize = fontSize;
    if (language !== undefined) preferences.settings.language = language;
    if (notifications !== undefined) preferences.settings.notifications = notifications;
    
    await preferences.save();
    
    res.json({ success: true, data: preferences.settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

// Export bookmarks as TXT
exports.exportBookmarks = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences || preferences.bookmarks.length === 0) {
      return res.status(404).json({ success: false, message: 'No bookmarks to export' });
    }
    
    const txtContent = await exportBookmarksTXT(preferences.bookmarks);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="my-gita-bookmarks.txt"');
    res.send(txtContent);
  } catch (error) {
    console.error('Error exporting bookmarks:', error);
    res.status(500).json({ success: false, message: 'Failed to export bookmarks' });
  }
};

// Export progress as TXT
exports.exportProgress = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return res.status(404).json({ success: false, message: 'No progress data to export' });
    }
    
    const txtContent = await exportProgressTXT(preferences.progress);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="my-gita-progress.txt"');
    res.send(txtContent);
  } catch (error) {
    console.error('Error exporting progress:', error);
    res.status(500).json({ success: false, message: 'Failed to export progress' });
  }
};

// Export all data (bookmarks + progress) as TXT
exports.exportAllData = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return res.status(404).json({ success: false, message: 'No data to export' });
    }
    
    const txtContent = await exportAllDataTXT(preferences.bookmarks, preferences.progress);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="my-gita-journey.txt"');
    res.send(txtContent);
  } catch (error) {
    console.error('Error exporting all data:', error);
    res.status(500).json({ success: false, message: 'Failed to export data' });
  }
};
