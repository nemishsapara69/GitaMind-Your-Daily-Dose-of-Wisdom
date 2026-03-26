import React from 'react';
import { Link } from 'react-router-dom';
import gitamindLogo from '../assets/gitamind-logo.svg';

const NotFoundPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      padding: '40px 20px',
      backgroundColor: '#FFF5DF',
      textAlign: 'center'
    }}>
      <img 
        src={gitamindLogo} 
        alt="Gitamind Logo" 
        style={{ 
          width: '120px', 
          height: '120px',
          marginBottom: '30px',
          opacity: 0.7
        }} 
      />
      
      <h1 style={{
        fontSize: '6em',
        fontWeight: 'bold',
        color: '#B06500',
        margin: '0 0 10px 0',
        lineHeight: '1'
      }}>
        404
      </h1>
      
      <h2 style={{
        fontSize: '2em',
        color: '#603900',
        margin: '0 0 20px 0',
        fontWeight: 'bold'
      }}>
        Page Not Found
      </h2>
      
      <p style={{
        fontSize: '1.2em',
        color: '#444444',
        maxWidth: '500px',
        marginBottom: '40px',
        lineHeight: '1.6'
      }}>
        The path you seek does not exist in our sacred texts. 
        Perhaps you were looking for wisdom elsewhere?
      </p>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/"
          style={{
            padding: '12px 30px',
            fontSize: '1.1em',
            backgroundColor: '#B06500',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#9A5700'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#B06500'}
        >
          🏠 Go Home
        </Link>
        
        <Link 
          to="/chapters"
          style={{
            padding: '12px 30px',
            fontSize: '1.1em',
            backgroundColor: 'white',
            color: '#B06500',
            border: '2px solid #B06500',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FFE9D5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          📖 Browse Chapters
        </Link>
        
        <Link 
          to="/products"
          style={{
            padding: '12px 30px',
            fontSize: '1.1em',
            backgroundColor: 'white',
            color: '#B06500',
            border: '2px solid #B06500',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FFE9D5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          🛍️ View Products
        </Link>
      </div>
      
      <p style={{
        marginTop: '50px',
        fontSize: '1em',
        color: '#888888',
        fontStyle: 'italic'
      }}>
        "When the mind wanders, bring it back to the path." - Bhagavad Gita
      </p>
    </div>
  );
};

export default NotFoundPage;
