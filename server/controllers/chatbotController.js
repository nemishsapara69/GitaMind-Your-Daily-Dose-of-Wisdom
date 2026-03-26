const mongoose = require('mongoose');

// Use existing Chapter model or get it from mongoose
const Chapter = mongoose.models.Chapter || require('../models/chapter');

// Keyword mapping for verse recommendations
const keywordVerseMap = {
  // Peace & Calm
  'peace': { chapter: 2, verse: 66 },
  'calm': { chapter: 5, verse: 29 },
  'meditation': { chapter: 6, verse: 19 },
  'tranquil': { chapter: 2, verse: 71 },
  
  // Motivation & Action
  'duty': { chapter: 2, verse: 47 },
  'action': { chapter: 3, verse: 8 },
  'work': { chapter: 3, verse: 19 },
  'motivated': { chapter: 2, verse: 47 },
  'karma': { chapter: 2, verse: 47 },
  
  // Stress & Anxiety
  'stress': { chapter: 2, verse: 14 },
  'anxiety': { chapter: 12, verse: 8 },
  'worry': { chapter: 2, verse: 14 },
  'fear': { chapter: 11, verse: 50 },
  
  // Confusion & Doubt
  'confused': { chapter: 6, verse: 5 },
  'doubt': { chapter: 4, verse: 40 },
  'decision': { chapter: 18, verse: 63 },
  
  // Love & Devotion
  'love': { chapter: 9, verse: 26 },
  'devotion': { chapter: 9, verse: 34 },
  'faith': { chapter: 7, verse: 21 },
  'bhakti': { chapter: 9, verse: 26 },
  
  // Happiness & Joy
  'happy': { chapter: 18, verse: 78 },
  'joy': { chapter: 5, verse: 21 },
  'bliss': { chapter: 6, verse: 27 },
  
  // Wisdom & Knowledge
  'wisdom': { chapter: 4, verse: 38 },
  'knowledge': { chapter: 4, verse: 33 },
  'learn': { chapter: 4, verse: 34 },
  
  // Soul & Self
  'soul': { chapter: 2, verse: 20 },
  'self': { chapter: 6, verse: 5 },
  'atman': { chapter: 2, verse: 20 },
  
  // Life & Death
  'death': { chapter: 2, verse: 27 },
  'life': { chapter: 2, verse: 22 },
  'rebirth': { chapter: 2, verse: 22 },
  
  // Surrender & Trust
  'surrender': { chapter: 18, verse: 66 },
  'trust': { chapter: 9, verse: 22 },
  'faith': { chapter: 7, verse: 21 }
};

// Quick responses for common greetings
const quickResponses = {
  greetings: [
    "Namaste! 🙏 I'm your GitaMind AI assistant. How can I guide you with the wisdom of Bhagavad Gita today?",
    "Om Shanti! 🕉️ Welcome! Ask me anything about Bhagavad Gita or share how you're feeling.",
    "Hari Om! 🌟 I'm here to help you discover relevant verses and spiritual guidance."
  ],
  help: "I can help you with:\n\n✨ Find verses by mood (peace, stressed, motivated, etc.)\n📖 Search for specific topics (duty, soul, karma, etc.)\n🎯 Get daily verse recommendations\n💭 Answer questions about Bhagavad Gita\n\nJust type your question or tell me how you're feeling!",
  thanks: [
    "You're welcome! 🙏 May the wisdom guide you always.",
    "Happy to help! Feel free to ask anything else. 🕉️",
    "Glad I could assist! Om Shanti! ✨"
  ]
};

// Helper function to get verse by keyword
const getVerseByKeyword = async (keyword) => {
  const normalizedKeyword = keyword.toLowerCase();
  const verseInfo = keywordVerseMap[normalizedKeyword];
  
  if (!verseInfo) return null;
  
  const chapter = await Chapter.findOne({ chapter_number: verseInfo.chapter });
  if (!chapter) return null;
  
  const verse = chapter.verses.find(v => v.verse_number === verseInfo.verse);
  if (!verse) return null;
  
  return {
    chapter_number: chapter.chapter_number,
    verse_number: verse.verse_number,
    sanskrit: verse.sanskrit,
    transliteration: verse.transliteration,
    translation: verse.translations.english,
    explanation: verse.explanations?.english || 'This verse offers profound wisdom from the Bhagavad Gita.'
  };
};

// Helper function to detect keywords in user message
const detectKeywords = (message) => {
  const normalizedMessage = message.toLowerCase();
  const foundKeywords = [];
  
  for (const keyword of Object.keys(keywordVerseMap)) {
    if (normalizedMessage.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  
  return foundKeywords;
};

// Helper function to detect intent
const detectIntent = (message) => {
  const normalizedMessage = message.toLowerCase();
  
  // Greetings
  if (/(hi|hello|hey|namaste|namaskar|greetings)/i.test(normalizedMessage)) {
    return 'greeting';
  }
  
  // Thanks
  if (/(thank|thanks|grateful|appreciate)/i.test(normalizedMessage)) {
    return 'thanks';
  }
  
  // Help
  if (/(help|what can you do|how to use|guide)/i.test(normalizedMessage)) {
    return 'help';
  }
  
  // Daily verse request
  if (/(daily verse|verse of the day|today's verse)/i.test(normalizedMessage)) {
    return 'daily_verse';
  }
  
  // Random verse
  if (/(random verse|surprise me|any verse)/i.test(normalizedMessage)) {
    return 'random_verse';
  }
  
  return 'query';
};

// @desc    Process chatbot message
// @route   POST /api/chatbot/message
// @access  Public
exports.processChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a message' 
      });
    }
    
    const intent = detectIntent(message);
    let response = {};
    
    // Handle different intents
    switch (intent) {
      case 'greeting':
        response = {
          message: quickResponses.greetings[Math.floor(Math.random() * quickResponses.greetings.length)],
          type: 'text'
        };
        break;
        
      case 'thanks':
        response = {
          message: quickResponses.thanks[Math.floor(Math.random() * quickResponses.thanks.length)],
          type: 'text'
        };
        break;
        
      case 'help':
        response = {
          message: quickResponses.help,
          type: 'text'
        };
        break;
        
      case 'daily_verse':
        const dailyVerse = await getRandomVerse();
        response = {
          message: "Here's your daily verse of wisdom:",
          verse: dailyVerse,
          type: 'verse'
        };
        break;
        
      case 'random_verse':
        const randomVerse = await getRandomVerse();
        response = {
          message: "Here's a verse for you:",
          verse: randomVerse,
          type: 'verse'
        };
        break;
        
      default:
        // Check for keywords
        const keywords = detectKeywords(message);
        
        if (keywords.length > 0) {
          const verse = await getVerseByKeyword(keywords[0]);
          if (verse) {
            response = {
              message: `I found a relevant verse about "${keywords[0]}" for you:`,
              verse: verse,
              type: 'verse'
            };
          } else {
            response = {
              message: "I understand you're asking about " + keywords[0] + ", but I couldn't find a specific verse. Try asking about topics like peace, duty, karma, or soul.",
              type: 'text'
            };
          }
        } else {
          response = {
            message: "I'd love to help! Try asking about:\n\n• Specific topics (peace, duty, karma, soul)\n• Your mood (stressed, motivated, confused)\n• Or type 'daily verse' for inspiration\n\nWhat would you like to explore?",
            type: 'text'
          };
        }
    }
    
    res.status(200).json({
      success: true,
      data: response
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.'
    });
  }
};

// Helper to get random verse
const getRandomVerse = async () => {
  const chapters = await Chapter.find();
  if (chapters.length === 0) return null;
  
  const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
  const randomVerse = randomChapter.verses[Math.floor(Math.random() * randomChapter.verses.length)];
  
  return {
    chapter_number: randomChapter.chapter_number,
    verse_number: randomVerse.verse_number,
    sanskrit: randomVerse.sanskrit,
    transliteration: randomVerse.transliteration,
    translation: randomVerse.translations.english,
    explanation: randomVerse.explanations?.english
  };
};

// @desc    Get quick action suggestions
// @route   GET /api/chatbot/quick-actions
// @access  Public
exports.getQuickActions = async (req, res) => {
  try {
    const actions = [
      { id: 'daily_verse', label: '📖 Daily Verse', action: 'Get daily verse' },
      { id: 'random_verse', label: '🎲 Random Verse', action: 'Surprise me with a verse' },
      { id: 'peace', label: '🧘 Find Peace', action: 'Show me verses about peace' },
      { id: 'motivation', label: '🔥 Get Motivated', action: 'I need motivation' },
      { id: 'help', label: '❓ Help', action: 'What can you do?' }
    ];
    
    res.status(200).json({
      success: true,
      data: actions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quick actions'
    });
  }
};
