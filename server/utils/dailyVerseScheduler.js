const cron = require('node-cron');
const UserPreferences = require('../models/UserPreferences');
const Chapter = require('../models/chapter');

// Function to get random verse based on mood
const getRandomVerse = async (preferredMood = null) => {
  try {
    // Get all chapters
    const chapters = await Chapter.find({});
    
    if (chapters.length === 0) return null;
    
    // Flatten all verses from all chapters
    const allVerses = [];
    chapters.forEach(chapter => {
      chapter.verses.forEach(verse => {
        allVerses.push({
          chapterNumber: chapter.chapter_number,
          verseNumber: verse.verse_number,
          text: verse.sanskrit || '',
          translation: verse.translations?.english || '',
          explanation: verse.explanations?.english || ''
        });
      });
    });
    
    if (allVerses.length === 0) return null;
    
    // Select random verse
    const randomIndex = Math.floor(Math.random() * allVerses.length);
    return allVerses[randomIndex];
  } catch (error) {
    console.error('Error getting random verse:', error);
    return null;
  }
};

// Function to send daily verse notification (placeholder - implement email/push later)
const sendDailyVerse = async (user, verse) => {
  // TODO: Implement actual notification (email, push notification, etc.)
  console.log(`Daily verse for user ${user.name || user.email}:`);
  console.log(`Chapter ${verse.chapterNumber}, Verse ${verse.verseNumber}`);
  console.log(`Translation: ${verse.translation}`);
  console.log('---');
  
  // For now, just log. Later integrate with email service or push notifications
  return true;
};

// Main function to process daily verses
const processDailyVerses = async () => {
  try {
    console.log('Processing daily verses...');
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Find all users with daily verse enabled
    const preferences = await UserPreferences.find({
      'dailyVerse.enabled': true,
      'dailyVerse.time': currentTime
    }).populate('userId');
    
    console.log(`Found ${preferences.length} users for time ${currentTime}`);
    
    for (const pref of preferences) {
      // Check if verse already sent today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastSent = pref.dailyVerse.lastSent ? new Date(pref.dailyVerse.lastSent) : null;
      
      if (lastSent && lastSent >= today) {
        console.log(`Verse already sent today for user ${pref.userId.email}`);
        continue;
      }
      
      // Get random verse
      const verse = await getRandomVerse(pref.dailyVerse.preferredMood);
      
      if (!verse) {
        console.log(`No verse found for user ${pref.userId.email}`);
        continue;
      }
      
      // Send notification
      await sendDailyVerse(pref.userId, verse);
      
      // Update last sent time
      pref.dailyVerse.lastSent = new Date();
      await pref.save();
    }
    
    console.log('Daily verse processing completed');
  } catch (error) {
    console.error('Error processing daily verses:', error);
  }
};

// Schedule cron job to run every minute (check if any user needs verse at this time)
const startDailyVerseScheduler = () => {
  // Run every minute to check for scheduled verses
  cron.schedule('* * * * *', () => {
    processDailyVerses();
  });
  
  console.log('Daily verse scheduler started - checking every minute');
};

module.exports = { startDailyVerseScheduler, processDailyVerses };
