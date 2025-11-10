import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth(); // Get user from context
  const navigate = useNavigate();

  // State to hold profile data (initially from authUser, can be fetched/updated)
  const [fullName, setFullName] = useState(authUser?.user.fullName || '');
  const [username, setUsername] = useState(authUser?.user.username || '');
  const [email, setEmail] = useState(authUser?.user.email || ''); // Email usually not changeable
  const [preferredLanguage, setPreferredLanguage] = useState(authUser?.user.preferredLanguage || 'english');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to populate form when authUser changes (e.g., after login)
  useEffect(() => {
    if (authUser && authUser.user) {
      setFullName(authUser.user.fullName || '');
      setUsername(authUser.user.username || '');
      setEmail(authUser.user.email || '');
      setPreferredLanguage(authUser.user.preferredLanguage || 'english');
    } else {
      // If not logged in, redirect to login
      navigate('/login');
    }
  }, [authUser, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.put(`/users/profile`, { fullName, username, preferredLanguage }); // Assuming you'll create this backend endpoint
      
      // Update user in local storage and context
      const updatedUserData = { ...authUser, user: { ...authUser.user, fullName, username, preferredLanguage } };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      // If you had a 'updateUser' function in AuthContext, you'd call it here
      // For now, refreshing browser or full re-login would pick up simple local storage changes.
      setMessage('Profile updated successfully!');
      console.log('Profile updated:', res.data);
      // Optional: Re-fetch user in context or just update local state
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
      console.error('Profile update error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setMessage('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    if (!currentPassword || !newPassword) {
      setMessage('Current and new passwords are required.');
      setLoading(false);
      return;
    }

    try {
      // Assuming you'll create a backend endpoint like PUT /api/users/change-password
      await api.put('/users/change-password', { currentPassword, newPassword });
      setMessage('Password changed successfully! Please log in again with your new password.');
      logout(); // Log out after password change for security
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password. Check your current password.');
      console.error('Change password error:', err.response?.data || err);
    } finally {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  if (!authUser) {
    // Redirection handled by useEffect if authUser is null
    return <div style={{ textAlign: 'center', padding: '50px' }}>Redirecting to login...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5em', color: '#6A1B9A' }}>User Profile</h2>
      {message && <p style={{ textAlign: 'center', marginBottom: '20px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}

      {/* Profile Details Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.8em', color: '#424242', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Your Information</h3>
        <form onSubmit={handleUpdateProfile}>
          <div style={formGroupStyle}>
            <label htmlFor="fullName" style={labelStyle}>Full Name:</label>
            <input
              type="text" id="fullName"
              value={fullName} onChange={(e) => setFullName(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="username" style={labelStyle}>Username:</label>
            <input
              type="text" id="username"
              value={username} onChange={(e) => setUsername(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input
              type="email" id="email"
              value={email} // Email typically not editable in profile
              readOnly // Make email read-only
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="preferredLanguage" style={labelStyle}>Preferred Language:</label>
            <select
              id="preferredLanguage"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              style={inputStyle}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="gujarati">Gujarati</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: loading ? '#A5D6A7' : '#2196F3',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: 'auto'
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div>
        <h3 style={{ fontSize: '1.8em', color: '#424242', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div style={formGroupStyle}>
            <label htmlFor="currentPassword" style={labelStyle}>Current Password:</label>
            <input
              type="password" id="currentPassword"
              value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="newPassword" style={labelStyle}>New Password:</label>
            <input
              type="password" id="newPassword"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="confirmNewPassword" style={labelStyle}>Confirm New Password:</label>
            <input
              type="password" id="confirmNewPassword"
              value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: loading ? '#FFCC80' : '#FF9800',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: 'auto'
            }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
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
  padding: '12px 20px',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1.1em',
  transition: 'background-color 0.2s ease-in-out',
};


export default ProfilePage;