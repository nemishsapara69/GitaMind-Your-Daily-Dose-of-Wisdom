import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for login page navigation
import api from '../services/api'; // Your configured API client
import { useAuth } from '../context/AuthContext'; // To potentially auto-login after register

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use auth context to automatically log in after registration

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state
    setMessage(''); // Clear previous messages

    try {
      const res = await api.post('/auth/register', { fullName, username, email, password });
      
      // Auto-login after successful registration (optional, but good UX)
      login(res.data); 
      
      setMessage('Registration successful! You are now logged in.');
      console.log('Registered user:', res.data);
      navigate('/'); // Redirect to home page after successful registration and login

    } catch (err) {
      // Display error message from backend or a generic one
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err.response?.data || err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '2em', color: '#6A1B9A' }}>Register</h2>
      {message && <p style={{ textAlign: 'center', marginBottom: '20px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleRegister}>
        <div style={formGroupStyle}>
          <label htmlFor="fullName" style={labelStyle}>Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="username" style={labelStyle}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="password" style={labelStyle}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? '#A5D6A7' : '#4CAF50',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#555' }}>
        Already have an account? <Link to="/login" style={{ color: '#6A1B9A', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

// Inline styles (for quick setup, move to CSS file later)
const formGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle = {
  width: 'calc(100% - 20px)', // Full width minus padding
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1em',
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1.1em',
  transition: 'background-color 0.2s ease-in-out',
};

export default RegisterPage;