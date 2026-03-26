import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizes = {
    small: { spinner: '30px', fontSize: '0.9em' },
    medium: { spinner: '50px', fontSize: '1.1em' },
    large: { spinner: '70px', fontSize: '1.3em' }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      padding: '20px'
    }}>
      <div style={{
        width: currentSize.spinner,
        height: currentSize.spinner,
        border: '5px solid #FFE9D5',
        borderTop: '5px solid #B06500',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        marginTop: '20px',
        color: '#603900',
        fontSize: currentSize.fontSize,
        fontWeight: 'bold'
      }}>
        {message}
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
