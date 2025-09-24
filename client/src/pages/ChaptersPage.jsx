import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Your API client
import { Link } from 'react-router-dom'; // For linking to individual chapter pages

const ChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Check if user is logged in for protected routes, though /api/chapters is public
        // If /api/chapters was protected, the interceptor in api.js would add the token
        const user = JSON.parse(localStorage.getItem('user'));
        let config = {};
        if (user && user.token) {
          config.headers = {
            Authorization: `Bearer ${user.token}`
          };
        }

        const response = await api.get('/chapters', config); // Fetch all chapters
        setChapters(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError(err.response?.data?.message || 'Failed to fetch chapters');
        setLoading(false);
      }
    };

    fetchChapters();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Chapters...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#6A1B9A' }}>Chapters of Bhagavad Gita</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {chapters.map((chapter) => (
          <div key={chapter.id} style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ fontSize: '1.8em', marginBottom: '10px', color: '#424242' }}>
              Chapter {chapter.chapter_number}: {chapter.title.english}
            </h3>
            <p style={{ fontSize: '1.1em', color: '#757575', lineHeight: '1.6' }}>
              {chapter.summary.english.substring(0, 150)}...
            </p>
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '0.9em', color: '#9E9E9E' }}>Total Verses: {chapter.verse_count}</p>
              <Link
                to={`/chapters/${chapter.chapter_number}`} // Link to a specific chapter page (to be created)
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '10px 20px',
                  backgroundColor: '#6A1B9A',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontSize: '1em',
                  transition: 'background-color 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A148C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6A1B9A'}
              >
                Read Chapter
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChaptersPage;