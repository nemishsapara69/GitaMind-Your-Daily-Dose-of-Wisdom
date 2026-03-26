const Chapter = require('../models/chapter'); // We need Chapters to get verses

// A simple, hardcoded mapping of moods to verse numbers for demonstration
// In a real application, this would be a more sophisticated AI/NLP model,
// or tag verses with moods in the database.
const moodVerseMap = {
  "peace": { chapter: 2, verse: 66, translationKey: 'english' }, // "For him who is not connected with the Supreme..."
  "happy": { chapter: 18, verse: 78, translationKey: 'english' }, // "Wherever there is Kṛṣṇa..." (a concluding joyful verse)
  "calm": { chapter: 5, verse: 29, translationKey: 'english' }, // "A person in full consciousness of Me..."
  "stressed": { chapter: 2, verse: 14, translationKey: 'english' }, // "O son of Kuntī, the nonpermanent appearance of happiness and distress..."
  "anxious": { chapter: 12, verse: 8, translationKey: 'english' }, // "Just fix your mind upon Me, the Supreme Personality of Godhead..."
  "motivated": { chapter: 2, verse: 47, translationKey: 'english' }, // "You have a right to perform your prescribed duty..."
  "confused": { chapter: 6, verse: 5, translationKey: 'english' }, // "A man must elevate himself by his own mind, not degrade himself..."
  "grateful": { chapter: 9, verse: 26, translationKey: 'english' }, // "If one offers Me with love and devotion a leaf, a flower, fruit or water..."
  "lonely": { chapter: 10, verse: 8, translationKey: 'english' }, // "I am the source of all spiritual and material worlds..."
  // Fallback or general wisdom if mood not found/specific
  "default": { chapter: 18, verse: 66, translationKey: 'english' } // "Abandon all varieties of religion and just surrender unto Me."
};

// Helper to get a random verse from a small selection for a given mood
const getVerseByMood = async (mood) => {
  const verseInfo = moodVerseMap[mood.toLowerCase()] || moodVerseMap['default'];
  
  const chapter = await Chapter.findOne({ chapter_number: verseInfo.chapter });
  if (chapter) {
    const verse = chapter.verses.find(v => v.verse_number === verseInfo.verse);
    if (verse) {
      return {
        chapter_number: chapter.chapter_number,
        verse_number: verse.verse_number,
        sanskrit: verse.sanskrit, // <--- ADDED
        transliteration: verse.transliteration, // <--- ADDED
        translation: verse.translations[verseInfo.translationKey], // Already there
        explanation: verse.explanations[verseInfo.translationKey] // <--- ADDED
      };
    }
  }
  // Fallback if specific verse not found or error
  return {
    chapter_number: 2,
    verse_number: 11,
    sanskrit: "श्रीभगवानुवाच\nअशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे |\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ||11||", // <--- ADDED
    transliteration: "śrī-bhagavān uvāca\naśocyān anvaśocas tvaṁ prajñā-vādāṁś ca bhāṣase |\ngatāsūn agatāsūṁś ca nānuśocanti paṇḍitāḥ ||11||", // <--- ADDED
    translation: "The Supreme Personality of Godhead said: While speaking learned words, you are mourning for what is not worthy of grief. Those who are wise lament neither for the living nor for the dead.",
    explanation: "This verse marks the beginning of Lord Krishna's direct instructions to Arjuna, highlighting the wisdom of the soul's eternal nature."
  };
};


// @desc    Get a verse based on user's selected mood
// @route   GET /api/mood-verses?mood=happy
// @access  Public
exports.getMoodBasedVerse = async (req, res) => {
  const { mood } = req.query;

  if (!mood) {
    return res.status(400).json({ success: false, message: 'Mood query parameter is required.' });
  }

  try {
    const verse = await getVerseByMood(mood);
    res.status(200).json({ success: true, data: verse });
  } catch (error) {
    console.error('Error in getMoodBasedVerse:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching mood-based verse.' });
  }
};