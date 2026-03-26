const Chapter = require('../models/chapter');

// Export bookmarks as TXT
exports.exportBookmarksTXT = async (bookmarks) => {
  try {
    let txtContent = '='.repeat(60) + '\n';
    txtContent += 'MY BHAGAVAD GITA BOOKMARKS\n';
    txtContent += '='.repeat(60) + '\n\n';
    
    for (const bookmark of bookmarks) {
      const chapter = await Chapter.findOne({ chapter_number: bookmark.chapterNumber });
      
      if (chapter) {
        const verse = chapter.verses.find(v => v.verse_number === bookmark.verseNumber);
        
        if (verse) {
          txtContent += `Chapter ${bookmark.chapterNumber}, Verse ${bookmark.verseNumber}\n`;
          txtContent += '-'.repeat(60) + '\n';
          txtContent += `Sanskrit: ${verse.text}\n`;
          txtContent += `Transliteration: ${verse.transliteration}\n`;
          txtContent += `Translation: ${verse.translation}\n`;
          txtContent += `Explanation: ${verse.word_meanings}\n\n`;
          
          if (bookmark.note) {
            txtContent += `Personal Note: ${bookmark.note}\n\n`;
          }
          
          if (bookmark.tags && bookmark.tags.length > 0) {
            txtContent += `Tags: ${bookmark.tags.join(', ')}\n\n`;
          }
          
          txtContent += '='.repeat(60) + '\n\n';
        }
      }
    }
    
    return txtContent;
  } catch (error) {
    console.error('Error generating TXT export:', error);
    throw error;
  }
};

// Export reading progress as TXT
exports.exportProgressTXT = async (progress) => {
  try {
    let txtContent = '='.repeat(60) + '\n';
    txtContent += 'MY BHAGAVAD GITA READING PROGRESS\n';
    txtContent += '='.repeat(60) + '\n\n';
    
    txtContent += `Total Chapters Read: ${progress.chaptersRead.length}/18\n`;
    txtContent += `Total Verses Read: ${progress.totalVersesRead}\n`;
    txtContent += `Current Reading Streak: ${progress.readingStreak} days\n`;
    
    if (progress.startDate) {
      const daysSinceStart = Math.floor((new Date() - new Date(progress.startDate)) / (1000 * 60 * 60 * 24));
      txtContent += `Days Since Started: ${daysSinceStart}\n`;
    }
    
    txtContent += `\n${'='.repeat(60)}\n`;
    txtContent += 'CHAPTERS COMPLETED\n';
    txtContent += '='.repeat(60) + '\n\n';
    
    for (const chapterNum of progress.chaptersRead.sort((a, b) => a - b)) {
      const chapter = await Chapter.findOne({ chapter_number: chapterNum });
      if (chapter) {
        txtContent += `Chapter ${chapterNum}: ${chapter.name}\n`;
        txtContent += `${chapter.translation}\n\n`;
      }
    }
    
    txtContent += '='.repeat(60) + '\n';
    txtContent += 'RECENT VERSES READ\n';
    txtContent += '='.repeat(60) + '\n\n';
    
    const recentVerses = progress.versesRead.slice(-20).reverse();
    
    for (const verseRead of recentVerses) {
      const chapter = await Chapter.findOne({ chapter_number: verseRead.chapterNumber });
      
      if (chapter) {
        const verse = chapter.verses.find(v => v.verse_number === verseRead.verseNumber);
        
        if (verse) {
          const readDate = new Date(verseRead.readAt).toLocaleDateString();
          txtContent += `[${readDate}] Chapter ${verseRead.chapterNumber}, Verse ${verseRead.verseNumber}\n`;
          txtContent += `${verse.translation}\n\n`;
        }
      }
    }
    
    return txtContent;
  } catch (error) {
    console.error('Error generating progress TXT export:', error);
    throw error;
  }
};

// Export combined (bookmarks + progress) as TXT
exports.exportAllDataTXT = async (bookmarks, progress) => {
  try {
    let txtContent = '='.repeat(60) + '\n';
    txtContent += 'MY BHAGAVAD GITA JOURNEY\n';
    txtContent += '='.repeat(60) + '\n\n';
    
    const bookmarksTXT = await exports.exportBookmarksTXT(bookmarks);
    const progressTXT = await exports.exportProgressTXT(progress);
    
    txtContent += progressTXT + '\n\n';
    txtContent += bookmarksTXT;
    
    return txtContent;
  } catch (error) {
    console.error('Error generating combined TXT export:', error);
    throw error;
  }
};
