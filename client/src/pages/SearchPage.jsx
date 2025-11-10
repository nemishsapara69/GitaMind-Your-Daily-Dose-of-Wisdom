import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api'; // <--- IMPORTANT: Ensure api is imported

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get the 'q' parameter from the URL

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]); // Clear results if no query
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // --- IMPORTANT: Calling the Backend Search API ---
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`); 
        setSearchResults(response.data.data); // Assuming backend sends { success, data: [...] }
        // --- End Backend Call ---

      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err.response?.data?.message || 'Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Re-run effect when the 'q' query parameter changes

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#B06500' }}> {/* Deep Terracotta Heading */}
        Searching results for: "{query}"
      </h2>

      {loading && <div style={{ textAlign: 'center', padding: '30px', fontSize: '1.2em', color: '#603900' }}>Loading search results...</div>}
      {error && <div style={{ textAlign: 'center', padding: '30px', fontSize: '1.2em', color: 'red' }}>Error: {error}</div>}

      {/* Display "No results" message */}
      {!loading && !error && searchResults.length === 0 && query && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ fontSize: '2.5em', color: '#FF6F00', marginBottom: '15px' }}>No results</h3> {/* Saffron/Orange for "No results" */}
          <p style={{ fontSize: '1.2em', color: '#757575' }}>Sorry, we couldn't find anything matching your search for "{query}".</p>
          <p style={{ fontSize: '1.0em', color: '#9E9E9E', marginTop: '10px' }}>Try refining your search terms.</p>
        </div>
      )}
      {!loading && !error && !query && (
        <div style={{ textAlign: 'center', padding: '30px', fontSize: '1.2em', color: '#757575' }}>Please enter a search query.</div>
      )}

      {/* Display Actual Results */}
      {!loading && !error && searchResults.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {searchResults.map(result => (
            <div key={result.id} style={{
              backgroundColor: 'white', // White background for cards
              border: '1px solid #FFDDBC', // Soft border
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.4em', marginBottom: '10px', color: '#603900' }}>{result.title}</h3> {/* Dark Brown Heading */}
                <p style={{ fontSize: '0.9em', color: '#757575', marginBottom: '5px' }}>Type: {result.type}</p>
                {result.summary && <p style={{ fontSize: '0.95em', color: '#616161', lineHeight: '1.5', marginTop: '5px' }}>{result.summary}</p>}
              </div>
              <Link
                to={result.link}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '8px 15px',
                  backgroundColor: '#B06500', // Deep Terracotta button
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontSize: '0.9em',
                  transition: 'background-color 0.2s ease',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9A5700'} // Darker on hover
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B06500'}
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;