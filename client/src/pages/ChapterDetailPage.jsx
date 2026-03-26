import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ChapterDetailPage = () => {
  const { chapterNumber, verseNumber } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingVerse, setCurrentSpeakingVerse] = useState(null);
  const verseRefs = useRef({});

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await api.get(`/chapters/${chapterNumber}`);
        setChapter(response.data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching chapter ${chapterNumber}:`, err);
        setError(err.response?.data?.message || `Failed to fetch Chapter ${chapterNumber}`);
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterNumber]);

  // Text-to-Speech function
  const speakVerse = (verse) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }

    // If already speaking this verse, stop
    if (isSpeaking && currentSpeakingVerse === verse.verse_number) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingVerse(null);
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Build text to speak
    let textToSpeak = `Verse ${chapter.chapter_number} point ${verse.verse_number}. `;
    
    // Add Sanskrit
    if (verse.sanskrit) {
      textToSpeak += `Sanskrit: ${verse.sanskrit}. `;
    }
    
    // Add Transliteration
    if (verse.transliteration) {
      textToSpeak += `Transliteration: ${verse.transliteration}. `;
    }
    
    // Add Translation
    if (verse.translations && verse.translations[selectedLanguage]) {
      textToSpeak += `Translation: ${verse.translations[selectedLanguage]}. `;
    }
    
    // Add Explanation
    if (verse.explanations && verse.explanations[selectedLanguage]) {
      textToSpeak += `Explanation: ${verse.explanations[selectedLanguage]}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingVerse(verse.verse_number);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingVerse(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingVerse(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Speak full chapter summary
  const speakChapterSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }

    // If already speaking, stop
    if (isSpeaking && currentSpeakingVerse === 'summary') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingVerse(null);
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = `Chapter ${chapter.chapter_number}: ${chapter.title.english}. ${chapter.summary.english}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingVerse('summary');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingVerse(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingVerse(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop all speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (chapter && verseNumber && verseRefs.current[verseNumber]) {
      const targetVerseElement = verseRefs.current[verseNumber];
      if (targetVerseElement) {
        targetVerseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetVerseElement.style.backgroundColor = '#FFFBE6'; // Light highlight color
        targetVerseElement.style.transition = 'background-color 0.5s ease-in-out';
        
        const timer = setTimeout(() => {
          if (targetVerseElement) {
            targetVerseElement.style.backgroundColor = 'white';
          }
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [chapter, verseNumber]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#603900' }}>Loading Chapter {chapterNumber}...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '1.2em' }}>Error: {error}</div>;
  }

  if (!chapter) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#757575' }}>Chapter not found.</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Link to="/chapters" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#B06500', fontWeight: 'bold', fontSize: '1.1em' }}>
        &larr; Back to All Chapters
      </Link>
      
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2.8em', color: '#B06500' }}>
        Chapter {chapter.chapter_number}: {chapter.title.english}
      </h2>
      <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#603900', lineHeight: '1.6', marginBottom: '20px', maxWidth: '800px', margin: '0 auto 20px auto' }}>
        {chapter.summary.english}
      </p>
      
      {/* Listen to Summary Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={speakChapterSummary}
          style={{
            padding: '12px 30px',
            backgroundColor: isSpeaking && currentSpeakingVerse === 'summary' ? '#DC3545' : '#C19A6B',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <span style={{ fontSize: '20px' }}>
            {isSpeaking && currentSpeakingVerse === 'summary' ? '⏸️' : '🔊'}
          </span>
          <span>{isSpeaking && currentSpeakingVerse === 'summary' ? 'Stop Summary' : 'Listen to Summary'}</span>
        </button>
      </div>

      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px', fontSize: '1.1em', color: '#603900', fontWeight: 'bold' }}>View in:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ 
            padding: '8px 15px', // Consistent padding
            borderRadius: '8px', // Consistent rounded corners
            border: '1px solid #FFDDBC', // Soft border
            backgroundColor: 'white', // White background
            color: '#603900', // Dark Brown text
            fontSize: '1em',
            outline: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)' // Subtle shadow
          }}
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="gujarati">Gujarati</option>
        </select>
      </div>

      <h3 style={{ fontSize: '2em', color: '#B06500', marginBottom: '25px', borderBottom: '1px solid #FFDDBC', paddingBottom: '10px', textAlign: 'left' }}>Verses:</h3>
      {chapter.verses.map((verse) => (
        <div
          key={verse.verse_number}
          ref={el => verseRefs.current[verse.verse_number] = el}
          style={{
            backgroundColor: 'white',
            border: '1px solid #FFDDBC',
            borderRadius: '8px',
            padding: '25px', // Slightly more padding
            marginBottom: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)', // Consistent shadow
            transition: 'background-color 0.3s ease-in-out',
            textAlign: 'left' // Ensure text aligns left
          }}>
          <h4 style={{ fontSize: '1.6em', marginBottom: '15px', color: '#B06500', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Verse {chapter.chapter_number}.{verse.verse_number}</span>
            <button
              onClick={() => speakVerse(verse)}
              style={{
                padding: '10px 20px',
                backgroundColor: isSpeaking && currentSpeakingVerse === verse.verse_number ? '#DC3545' : '#C19A6B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }}
              >
                <span style={{ fontSize: '18px' }}>
                {isSpeaking && currentSpeakingVerse === verse.verse_number ? '⏸️' : '🔊'}
              </span>
              <span>{isSpeaking && currentSpeakingVerse === verse.verse_number ? 'Stop' : 'Listen'}</span>
            </button>
          </h4>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1em', color: '#333333', marginBottom: '10px' }}>
            <strong style={{ color: '#603900' }}>Sanskrit:</strong> {verse.sanskrit}
          </p>
          <p style={{ fontStyle: 'italic', fontSize: '1em', color: '#555555', marginBottom: '15px' }}>
            <strong style={{ color: '#A38B00' }}>Transliteration:</strong> {verse.transliteration}
          </p>
          <p style={{ fontSize: '1.1em', color: '#424242', lineHeight: '1.8', marginBottom: '15px' }}>
            <strong style={{ color: '#B06500' }}>Translation ({selectedLanguage}):</strong> {verse.translations[selectedLanguage]}
          </p>
          <p style={{ fontSize: '1em', color: '#616161', lineHeight: '1.6', marginTop: '15px', borderTop: '1px dashed #FFDDBC', paddingTop: '15px' }}>
            <strong style={{ color: '#FF6F00' }}>Explanation ({selectedLanguage}):</strong> {verse.explanations[selectedLanguage]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChapterDetailPage;