import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const googleInitializedRef = useRef(false);

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential) {
      setMessage('Google sign-in failed. Please try again.');
      return;
    }

    try {
      const res = await api.post('/auth/google', { credential: response.credential });
      login(res.data);
      setMessage('Google login successful!');
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Google login failed. Please try again.');
      console.error('Google login error:', err.response?.data || err);
    }
  }, [login, navigate]);

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId.includes('your_google_web_client_id')) {
      setGoogleReady(false);
      return;
    }

    // Prevent multiple initializations
    if (googleInitializedRef.current) {
      return;
    }

    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;
      
      // Only initialize if not already done
      if (!googleInitializedRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential
        });
        googleInitializedRef.current = true;
      }

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 280
      });
      setGoogleReady(true);
    };

    if (window.google) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    script.onerror = () => {
      setMessage('Unable to load Google Sign-In. Check your internet and try again.');
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      setMessage('Login successful!');
      console.log('Logged in user:', res.data);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Please check credentials.');
      console.error('Login error:', err.response?.data || err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
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

      <div style={{ marginTop: '20px' }}>
        <p>Or continue with Google</p>
        <div ref={googleButtonRef} />
        {!googleReady && (
          <small style={{ color: '#666' }}>
            Add VITE_GOOGLE_CLIENT_ID in client env to enable Google button.
          </small>
        )}
      </div>
    </div>
  );
};

export default LoginPage;