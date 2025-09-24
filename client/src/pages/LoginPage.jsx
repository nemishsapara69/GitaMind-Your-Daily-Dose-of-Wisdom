import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // ADDED: Import useAuth

const LoginPage = () => {
  const [email, setEmail] = useState('gitamind.admin@example.com'); // Pre-fill for convenience
  const [password, setPassword] = useState('MySecretPassword123!'); // Pre-fill for convenience
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ADDED: Use the login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data); // MODIFIED: Call the context's login function
      setMessage('Login successful!');
      console.log('Logged in user:', res.data);
      navigate('/'); // Redirect to the home page after successful login
    } catch (err) {
      // Display error message from backend or a generic one
      setMessage(err.response?.data?.message || 'Login failed. Please check credentials.');
      console.error('Login error:', err.response?.data || err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {/* Display login message */}
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;