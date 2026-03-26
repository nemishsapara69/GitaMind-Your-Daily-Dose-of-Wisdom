import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      marginTop: 'auto', 
      padding: '40px 20px 20px', 
      textAlign: 'center', 
      background: 'linear-gradient(180deg, #FFF5DF 0%, #FFE9D5 100%)', 
      borderTop: '2px solid #FFDDBC',
      color: '#603900'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        textAlign: 'left',
        marginBottom: '30px'
      }}>
        {/* About Section */}
        <div>
          <h3 style={{ color: '#B06500', marginBottom: '15px', fontSize: '1.2em' }}>About Gitamind</h3>
          <p style={{ fontSize: '0.95em', lineHeight: '1.6', color: '#603900' }}>
            Your daily companion for spiritual growth and wisdom from the timeless teachings of Bhagavad Gita.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 style={{ color: '#B06500', marginBottom: '15px', fontSize: '1.2em' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/chapters" style={{ color: '#603900', textDecoration: 'none', fontSize: '0.95em' }}>
                📖 Chapters
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/products" style={{ color: '#603900', textDecoration: 'none', fontSize: '0.95em' }}>
                🛍️ Products
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/search" style={{ color: '#603900', textDecoration: 'none', fontSize: '0.95em' }}>
                🔍 Search
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Contact */}
        <div>
          <h3 style={{ color: '#B06500', marginBottom: '15px', fontSize: '1.2em' }}>Connect With Us</h3>
          <p style={{ fontSize: '0.95em', lineHeight: '1.6', color: '#603900' }}>
            📧 Email: info@gitamind.com<br />
            🌐 Website: gitamind.com
          </p>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div style={{ 
        borderTop: '1px solid #FFDDBC', 
        paddingTop: '20px',
        fontSize: '0.9em',
        color: '#603900'
      }}>
        <p style={{ margin: '5px 0' }}>
          &copy; {new Date().getFullYear()} Gitamind. Nemish Sapara
        </p>
        <p style={{ margin: '5px 0', fontSize: '0.85em', fontStyle: 'italic' }}>
          "You have the right to perform your prescribed duty, but you are not entitled to the fruits of action." - Bhagavad Gita 2.47
        </p>
      </div>
    </footer>
  );
};

export default Footer;