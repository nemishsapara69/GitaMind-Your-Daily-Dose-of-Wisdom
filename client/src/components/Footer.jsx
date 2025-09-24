import React from 'react';

const Footer = () => {
  return (
    <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', background: '#f0f0f0', borderTop: '1px solid #ddd' }}>
      <p>&copy; {new Date().getFullYear()} Gitamind. All rights reserved.</p>
    </footer>
  );
};

export default Footer;