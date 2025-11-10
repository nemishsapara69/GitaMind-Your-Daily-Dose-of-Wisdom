import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [moodVerse, setMoodVerse] = useState(null);
  const [verseLoading, setVerseLoading] = useState(false);
  const [verseError, setVerseError] = useState(null);

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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      {/* Hero Section - Updated with Light Theme Colors */}
      <section style={{
        backgroundColor: '#FFDDBC', // Soft, warm background for hero
        color: '#603900', // Dark Brown text for contrast
        padding: '80px 20px',
        borderRadius: '10px',
        marginBottom: '60px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ fontSize: '3.5em', marginBottom: '20px', fontWeight: 'bold', color: '#B06500' }}>
          Gitamind: Your Daily Dose of Wisdom
        </h1>
        <p style={{ fontSize: '1.5em', lineHeight: '1.6', marginBottom: '40px', color: '#603900' }}>
          Discover verses from Bhagavad Gita tailored to your mood, bringing peace and clarity.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <Link to="/chapters" style={{
            padding: '15px 30px',
            backgroundColor: '#B06500',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9A5700'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B06500'}
          >
            Explore Chapters
          </Link>
          <Link to="/products" style={{
            padding: '15px 30px',
            backgroundColor: '#A38B00',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8A7A00'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A38B00'}
          >
            Shop Products
          </Link>
        </div>
      </section>

      {/* New Section: Find Your Verse by Mood */}
      <section style={{ marginBottom: '60px', padding: '40px 20px', backgroundColor: '#FFE9D5', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '2.5em', color: '#B06500', marginBottom: '30px' }}>Find Your Verse of the Day</h2>
        <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#603900', marginBottom: '25px', maxWidth: '800px', margin: '0 auto' }}>
          Select how you're feeling today, and Gitamind will present a verse from the Bhagavad Gita to inspire and guide you.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          <label htmlFor="mood-select" style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#603900' }}>My mood is:</label>
          <select
            id="mood-select"
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #B06500',
              backgroundColor: 'white',
              color: '#603900',
              fontSize: '1em',
              minWidth: '180px',
              outline: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            <option value="">-- Select Mood --</option>
            <option value="peace">Peaceful</option>
            <option value="happy">Happy</option>
            <option value="calm">Calm</option>
            <option value="stressed">Stressed</option>
            <option value="anxious">Anxious</option>
            <option value="motivated">Motivated</option>
            <option value="confused">Confused</option>
            <option value="grateful">Grateful</option>
            <option value="lonely">Lonely</option>
          </select>
          <button
            onClick={handleGetMoodVerse}
            disabled={verseLoading || !selectedMood}
            style={{
              padding: '12px 25px',
              backgroundColor: '#FF6F00', // Bright Saffron/Orange button
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: verseLoading || !selectedMood ? 'not-allowed' : 'pointer',
              opacity: verseLoading || !selectedMood ? 0.7 : 1,
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => { if (!verseLoading && selectedMood) e.currentTarget.style.backgroundColor = '#E66100'; }}
            onMouseLeave={(e) => { if (!verseLoading && selectedMood) e.currentTarget.style.backgroundColor = '#FF6F00'; }}
          >
            {verseLoading ? 'Finding Verse...' : 'Get My Verse'}
          </button>
        </div>

        {/* Display Area for the Mood-Based Verse */}
        {verseError && <p style={{ color: 'red', marginTop: '20px', fontSize: '1.1em' }}>{verseError}</p>}
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
            <h3 style={{ fontSize: '1.8em', color: '#B06500', marginBottom: '15px' }}>
              Verse {moodVerse.chapter_number}.{moodVerse.verse_number}
            </h3>
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