import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let config = {};
        if (user && user.token) {
          config.headers = {
            Authorization: `Bearer ${user.token}`
          };
        }

        const response = await api.get('/chapters', config);
        setChapters(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError(err.response?.data?.message || 'Failed to fetch chapters');
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#603900' }}>Loading Chapters...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '1.2em' }}>Error: {error}</div>;
  }

  if (chapters.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#757575' }}>No chapters found.</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#B06500' }}>Chapters of Bhagavad Gita</h2> {/* Deep Terracotta Heading */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {chapters.map((chapter) => (
          <div key={chapter.id} style={{
            backgroundColor: 'white', // White background for cards
            border: '1px solid #FFDDBC', // Soft border
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)', // Enhanced shadow
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ fontSize: '1.8em', marginBottom: '10px', color: '#603900' }}> {/* Dark Brown Heading */}
              Chapter {chapter.chapter_number}: {chapter.title.english}
            </h3>
            <p style={{ fontSize: '1.1em', color: '#555555', lineHeight: '1.6' }}> {/* Muted grey text */}
              {chapter.summary.english.substring(0, 150)}...
            </p>
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '0.9em', color: '#757575' }}>Total Verses: {chapter.verse_count}</p>
              <Link
                to={`/chapters/${chapter.chapter_number}`}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '12px 25px', // Increased padding for button
                  backgroundColor: '#B06500', // Deep Terracotta button color
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px', // More rounded button
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease' // Added shadow transition
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9A5700'; // Darker terracotta on hover
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)'; // Shadow on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#B06500'; // Reset color
                  e.currentTarget.style.boxShadow = 'none'; // Remove shadow
                }}
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