import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams to get chapterNumber from URL
import api from '../services/api'; // Your API client

const ChapterDetailPage = () => {
  const { chapterNumber } = useParams(); // Get the chapter number from the URL
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english'); // Default language

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await api.get(`/chapters/${chapterNumber}`); // Fetch specific chapter
        setChapter(response.data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching chapter ${chapterNumber}:`, err);
        setError(err.response?.data?.message || `Failed to fetch Chapter ${chapterNumber}`);
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterNumber]); // Re-run effect if chapterNumber changes

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Chapter {chapterNumber}...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (!chapter) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chapter not found.</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Link to="/chapters" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#6A1B9A', fontWeight: 'bold' }}>
        &larr; Back to All Chapters
      </Link>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2.8em', color: '#6A1B9A' }}>
        Chapter {chapter.chapter_number}: {chapter.title.english}
      </h2>
      <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#757575', marginBottom: '30px' }}>
        {chapter.summary.english}
      </p>

      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px', fontSize: '1.1em' }}>View in:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="gujarati">Gujarati</option>
        </select>
      </div>

      <h3 style={{ fontSize: '2em', color: '#424242', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Verses:</h3>
      {chapter.verses.map((verse) => (
        <div key={verse.verse_number} style={{
          backgroundColor: '#fdfdfd',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h4 style={{ fontSize: '1.5em', marginBottom: '15px', color: '#6A1B9A' }}>
            Verse {chapter.chapter_number}.{verse.verse_number}
          </h4>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2em', color: '#333', marginBottom: '10px' }}>
            <strong style={{ color: '#4CAF50' }}>Sanskrit:</strong> {verse.sanskrit}
          </p>
          <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '15px' }}>
            <strong style={{ color: '#FF9800' }}>Transliteration:</strong> {verse.transliteration}
          </p>
          <p style={{ fontSize: '1.1em', color: '#424242', lineHeight: '1.8' }}>
            <strong style={{ color: '#2196F3' }}>Translation ({selectedLanguage}):</strong> {verse.translations[selectedLanguage]}
          </p>
          <p style={{ fontSize: '1em', color: '#616161', lineHeight: '1.6', marginTop: '15px', borderTop: '1px dashed #eee', paddingTop: '15px' }}>
            <strong style={{ color: '#F44336' }}>Explanation ({selectedLanguage}):</strong> {verse.explanations[selectedLanguage]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChapterDetailPage;