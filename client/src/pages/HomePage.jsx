import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [moodVerse, setMoodVerse] = useState(null);
  const [verseLoading, setVerseLoading] = useState(false);
  const [verseError, setVerseError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- Fetch Mood-Based Verse ---
  const handleGetMoodVerse = async () => {
    if (!selectedMood) {
      alert('Please select a mood!');
      return;
    }
    setVerseLoading(true);
    setVerseError(null);
    setMoodVerse(null); // Clear previous verse

    try {
      const response = await api.get(`/mood-verses?mood=${encodeURIComponent(selectedMood)}`);
      setMoodVerse(response.data.data);
    } catch (err) {
      console.error('Error fetching mood verse:', err.response?.data || err);
      setVerseError(err.response?.data?.message || 'Failed to fetch a verse for your mood. Please try again.');
    } finally {
      setVerseLoading(false);
    }
  };

  // Text-to-Speech for mood verse
  const speakMoodVerse = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }

    if (!moodVerse) return;

    // If already speaking, stop
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Build text to speak
    let textToSpeak = `Verse ${moodVerse.chapter_number} point ${moodVerse.verse_number}. `;
    
    if (moodVerse.sanskrit) {
      textToSpeak += `Sanskrit: ${moodVerse.sanskrit}. `;
    }
    
    if (moodVerse.transliteration) {
      textToSpeak += `Transliteration: ${moodVerse.transliteration}. `;
    }
    
    if (moodVerse.translation) {
      textToSpeak += `Translation: ${moodVerse.translation}. `;
    }
    
    if (moodVerse.explanation) {
      textToSpeak += `Explanation: ${moodVerse.explanation}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      {/* Hero Section - Updated with Video Background */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FFDDBC',
        color: '#603900',
        padding: '80px 20px',
        borderRadius: '10px',
        marginBottom: '60px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Video Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
          borderRadius: '10px'
        }}>
          <iframe
            src="https://www.youtube.com/embed/MmOAsC7A39o?autoplay=1&mute=1&loop=1&playlist=MmOAsC7A39o&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '100vh',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              border: 'none'
            }}
            allow="autoplay; encrypted-media"
            title="Background Video"
          />
        </div>

        {/* Dark Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
          borderRadius: '10px'
        }} />

        {/* Content on top of video */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5em', marginBottom: '20px', fontWeight: 'bold', color: '#FFE9D5', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            Gitamind: Your Daily Dose of Wisdom
          </h1>
          <p style={{ fontSize: '1.5em', lineHeight: '1.6', marginBottom: '40px', color: '#FFFAEC', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            Discover verses from Bhagavad Gita tailored to your mood, bringing peace and clarity.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <Link to="/chapters" style={{
              padding: '15px 30px',
              backgroundColor: 'rgba(193, 154, 107, 0.9)',
              color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(160, 130, 109, 0.95)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(193, 154, 107, 0.9)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
          }}
          >
            Explore Chapters
          </Link>
          <Link to="/products" style={{
            padding: '15px 30px',
            backgroundColor: 'rgba(245, 230, 211, 0.9)',
            color: '#8B4513',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(245, 230, 211, 0.9)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
          }}
          >
            Shop Products
          </Link>
        </div>
        </div>
      </section>

      {/* New Section: Find Your Verse by Mood */}
      <section style={{ marginBottom: '60px', padding: '40px 20px', backgroundColor: '#FFE9D5', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '2.5em', color: '#B06500', marginBottom: '15px' }}>Find Your Verse of the Day</h2>
        <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#603900', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          Select how you're feeling today, and Gitamind will present a verse from the Bhagavad Gita to inspire and guide you.
        </p>

        {/* Mood Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '1100px',
          margin: '0 auto 40px auto'
        }}>
          {/* Peace Card */}
          <div
            onClick={() => setSelectedMood('peace')}
            style={{
              backgroundColor: selectedMood === 'peace' ? '#C19A6B' : 'white',
              border: selectedMood === 'peace' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'peace' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'peace' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'peace') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'peace') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" alt="Peace" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'peace' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Peace</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'peace' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Find</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'peace' ? 'white' : '#8B4513', fontWeight: '500' }}>Calmness</p>
          </div>

          {/* Strength Card */}
          <div
            onClick={() => setSelectedMood('strength')}
            style={{
              backgroundColor: selectedMood === 'strength' ? '#C19A6B' : 'white',
              border: selectedMood === 'strength' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'strength' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'strength' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'strength') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'strength') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2583/2583791.png" alt="Strength" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'strength' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Strength</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'strength' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Build</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'strength' ? 'white' : '#8B4513', fontWeight: '500' }}>Courage</p>
          </div>

          {/* Wisdom Card */}
          <div
            onClick={() => setSelectedMood('wisdom')}
            style={{
              backgroundColor: selectedMood === 'wisdom' ? '#C19A6B' : 'white',
              border: selectedMood === 'wisdom' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'wisdom' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'wisdom' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'wisdom') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'wisdom') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3094/3094837.png" alt="Wisdom" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'wisdom' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Wisdom</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'wisdom' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Gain</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'wisdom' ? 'white' : '#8B4513', fontWeight: '500' }}>Clarity</p>
          </div>

          {/* Devotion Card */}
          <div
            onClick={() => setSelectedMood('devotion')}
            style={{
              backgroundColor: selectedMood === 'devotion' ? '#C19A6B' : 'white',
              border: selectedMood === 'devotion' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'devotion' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'devotion' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'devotion') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'devotion') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/1570/1570887.png" alt="Devotion" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'devotion' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Devotion</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'devotion' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Deepen</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'devotion' ? 'white' : '#8B4513', fontWeight: '500' }}>Connection</p>
          </div>

          {/* Clarity Card */}
          <div
            onClick={() => setSelectedMood('clarity')}
            style={{
              backgroundColor: selectedMood === 'clarity' ? '#C19A6B' : 'white',
              border: selectedMood === 'clarity' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'clarity' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'clarity' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'clarity') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'clarity') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2916/2916139.png" alt="Clarity" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'clarity' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Clarity</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'clarity' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Remove</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'clarity' ? 'white' : '#8B4513', fontWeight: '500' }}>Confusion</p>
          </div>

          {/* Love Card */}
          <div
            onClick={() => setSelectedMood('love')}
            style={{
              backgroundColor: selectedMood === 'love' ? '#C19A6B' : 'white',
              border: selectedMood === 'love' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'love' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'love' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'love') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'love') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="Love" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'love' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Love</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'love' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Cultivate</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'love' ? 'white' : '#8B4513', fontWeight: '500' }}>Compassion</p>
          </div>

          {/* Focus Card */}
          <div
            onClick={() => setSelectedMood('focus')}
            style={{
              backgroundColor: selectedMood === 'focus' ? '#C19A6B' : 'white',
              border: selectedMood === 'focus' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'focus' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'focus' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'focus') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'focus') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3094/3094840.png" alt="Focus" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'focus' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Focus</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'focus' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Sharpen</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'focus' ? 'white' : '#8B4513', fontWeight: '500' }}>Mind</p>
          </div>

          {/* Joy Card */}
          <div
            onClick={() => setSelectedMood('joy')}
            style={{
              backgroundColor: selectedMood === 'joy' ? '#C19A6B' : 'white',
              border: selectedMood === 'joy' ? '3px solid #B06500' : '2px solid #FFDDBC',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood === 'joy' ? '0 8px 20px rgba(176, 101, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.08)',
              transform: selectedMood === 'joy' ? 'translateY(-5px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedMood !== 'joy') {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood !== 'joy') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3588/3588592.png" alt="Joy" style={{ width: '70px', height: '70px' }} />
            </div>
            <h3 style={{ fontSize: '1.5em', color: selectedMood === 'joy' ? 'white' : '#B06500', marginBottom: '8px', fontWeight: 'bold' }}>Joy</h3>
            <p style={{ fontSize: '0.95em', color: selectedMood === 'joy' ? '#F5E6D3' : '#603900', marginBottom: '5px' }}>Celebrate</p>
            <p style={{ fontSize: '1em', color: selectedMood === 'joy' ? 'white' : '#8B4513', fontWeight: '500' }}>Life</p>
          </div>
        </div>

        {/* Get Verse Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={handleGetMoodVerse}
            disabled={verseLoading || !selectedMood}
            style={{
              padding: '15px 40px',
              backgroundColor: selectedMood && !verseLoading ? '#FF6F00' : '#CCCCCC',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              cursor: verseLoading || !selectedMood ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMood && !verseLoading ? '0 4px 15px rgba(255, 111, 0, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => { 
              if (!verseLoading && selectedMood) {
                e.currentTarget.style.backgroundColor = '#E66100';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 111, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => { 
              if (!verseLoading && selectedMood) {
                e.currentTarget.style.backgroundColor = '#FF6F00';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 111, 0, 0.3)';
              }
            }}
          >
            {verseLoading ? '🔍 Finding Your Verse...' : selectedMood ? '✨ Get My Verse' : '☝️ Select a Mood First'}
          </button>
        </div>

        {/* Display Area for the Mood-Based Verse */}
        {verseError && <p style={{ color: '#DC3545', marginTop: '20px', fontSize: '1.1em', fontWeight: '500' }}>{verseError}</p>}
        {moodVerse && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #FFDDBC',
            borderRadius: '8px',
            padding: '30px',
            marginTop: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '1.8em', color: '#B06500', margin: 0 }}>
                Verse {moodVerse.chapter_number}.{moodVerse.verse_number}
              </h3>
              <button
                onClick={speakMoodVerse}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isSpeaking ? '#DC3545' : '#C19A6B',
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
                  {isSpeaking ? '⏸️' : '🔊'}
                </span>
                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1em', color: '#333', marginBottom: '10px' }}>
              <strong style={{ color: '#B06500' }}>Sanskrit:</strong> {moodVerse.sanskrit}
            </p>
            <p style={{ fontStyle: 'italic', fontSize: '1em', color: '#555', marginBottom: '15px' }}>
              <strong style={{ color: '#A38B00' }}>Transliteration:</strong> {moodVerse.transliteration}
            </p>
            <p style={{ fontSize: '1.1em', color: '#424242', lineHeight: '1.8', marginBottom: '15px' }}>
              <strong style={{ color: '#B06500' }}>Translation:</strong> "{moodVerse.translation}"
            </p>
            <p style={{ fontSize: '1em', color: '#616161', lineHeight: '1.6', borderTop: '1px dashed #eee', paddingTop: '15px' }}>
              <strong style={{ color: '#FF6F00' }}>Explanation:</strong> {moodVerse.explanation}
            </p>
            <p style={{ fontSize: '0.9em', color: '#757575', marginTop: '15px' }}>
              <Link to={`/chapters/${moodVerse.chapter_number}/verses/${moodVerse.verse_number}`} style={{ color: '#B06500', textDecoration: 'underline' }}>
                View Verse in Chapter {moodVerse.chapter_number}
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Section: Why Bhagavad Gita? */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.5em', color: '#424242', marginBottom: '30px' }}>Why the Bhagavad Gita?</h2>
        <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#555', maxWidth: '800px', margin: '0 auto' }}>
          The Bhagavad Gita is a timeless classic of spiritual wisdom. It presents a dialogue between Lord Krishna and Arjuna, exploring themes of duty, devotion, knowledge, and self-realization. Its teachings offer guidance applicable to everyday life, helping navigate moral dilemmas and achieve inner peace.
        </p>
      </section>

      {/* Featured Content */}
      <section>
        <h2 style={{ fontSize: '2.5em', color: '#424242', marginBottom: '30px' }}>Explore Our Collection</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <Link to="/chapters" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={featureCardStyle}>
              <h3 style={{ color: '#B06500', marginBottom: '10px' }}>Deep Dive into Chapters</h3>
              <p style={{ color: '#757575' }}>Systematic study of each verse with translations.</p>
            </div>
          </Link>
          <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={featureCardStyle}>
              <h3 style={{ color: '#A38B00', marginBottom: '10px' }}>Curated Spiritual Products</h3>
              <p style={{ color: '#757575' }}>Books, audio, and more to aid your spiritual journey.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

const featureCardStyle = {
  backgroundColor: 'white',
  border: '1px solid #FFDDBC',
  borderRadius: '8px',
  padding: '30px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  width: '300px',
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
};

export default HomePage;