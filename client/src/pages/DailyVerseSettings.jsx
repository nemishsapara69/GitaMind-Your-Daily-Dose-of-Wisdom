import { useState, useEffect } from 'react';
import api from '../services/api';

const DailyVerseSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');
  const [preferredMood, setPreferredMood] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/preferences');
      
      const dailyVerse = res.data.data.dailyVerse;
      setEnabled(dailyVerse.enabled);
      setTime(dailyVerse.time || '09:00');
      setPreferredMood(dailyVerse.preferredMood || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await api.put('/preferences/daily-verse', {
        enabled,
        time,
        preferredMood
      });
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#8B4513] mb-6">Daily Verse Settings</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 text-[#C19A6B] focus:ring-[#C19A6B] rounded"
            />
            <span className="ml-3 text-lg font-medium text-gray-700">
              Enable Daily Verse Notifications
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-2 ml-8">
            Receive a verse from the Bhagavad Gita at your chosen time each day
          </p>
        </div>

        {enabled && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C19A6B]"
              />
              <p className="text-sm text-gray-500 mt-1">
                Choose when you'd like to receive your daily verse
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Mood (Optional)
              </label>
              <select
                value={preferredMood}
                onChange={(e) => setPreferredMood(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C19A6B]"
              >
                <option value="">Random (Any)</option>
                <option value="peace">Peace</option>
                <option value="strength">Strength</option>
                <option value="wisdom">Wisdom</option>
                <option value="devotion">Devotion</option>
                <option value="clarity">Clarity</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Get verses that match your mood preference
              </p>
            </div>
          </>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-[#C19A6B] text-white px-6 py-2 rounded hover:bg-[#A0826D] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          
          {message && (
            <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </span>
          )}
        </div>

        <div className="mt-6 p-4 bg-[#F5E6D3] rounded border border-[#C19A6B]">
          <p className="text-sm text-[#8B4513]">
            <strong>Note:</strong> Daily verse notifications are currently logged to the server console. 
            Email/push notification delivery will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyVerseSettings;
