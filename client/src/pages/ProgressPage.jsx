import { useState, useEffect } from 'react';
import api from '../services/api';

const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/preferences');
      setProgress(res.data.data.progress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const exportProgress = async () => {
    try {
      const response = await api.get('/preferences/export/progress', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-gita-progress.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting progress:', error);
    }
  };

  const exportAll = async () => {
    try {
      const response = await api.get('/preferences/export/all', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-gita-journey.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting all data:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading progress...</div>;
  }

  if (!progress) {
    return <div className="text-center p-8">No progress data available.</div>;
  }

  const daysSinceStart = progress.startDate 
    ? Math.floor((new Date() - new Date(progress.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const completionPercentage = ((progress.chaptersRead.length / 18) * 100).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#8B4513]">My Reading Progress</h1>
        <div className="flex gap-2">
          <button
            onClick={exportProgress}
            className="bg-[#C19A6B] text-white px-4 py-2 rounded hover:bg-[#A0826D]"
          >
            Export Progress
          </button>
          <button
            onClick={exportAll}
            className="bg-[#8B7355] text-white px-4 py-2 rounded hover:bg-[#6B5A42]"
          >
            Export All Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-[#C19A6B]">{progress.chaptersRead.length}</div>
          <div className="text-gray-600 mt-2">Chapters Read</div>
          <div className="text-sm text-gray-400">out of 18</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-[#C19A6B]">{progress.totalVersesRead}</div>
          <div className="text-gray-600 mt-2">Verses Read</div>
          <div className="text-sm text-gray-400">out of 700+</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-[#C19A6B]">{progress.readingStreak}</div>
          <div className="text-gray-600 mt-2">Day Streak</div>
          <div className="text-sm text-gray-400">Keep it up!</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-[#C19A6B]">{daysSinceStart}</div>
          <div className="text-gray-600 mt-2">Days Active</div>
          <div className="text-sm text-gray-400">since started</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow">
        <h2 className="text-xl font-bold text-[#8B4513] mb-4">Overall Completion</h2>
        <div className="w-full bg-gray-200 rounded-full h-8 mb-2">
          <div
            className="bg-gradient-to-r from-[#C19A6B] to-[#8B7355] h-8 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage}%
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          {18 - progress.chaptersRead.length} chapters remaining
        </p>
      </div>

      {/* Chapters Completed */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow">
        <h2 className="text-xl font-bold text-[#8B4513] mb-4">Chapters Completed</h2>
        <div className="grid grid-cols-6 gap-2">
          {[...Array(18)].map((_, i) => {
            const chapterNum = i + 1;
            const isCompleted = progress.chaptersRead.includes(chapterNum);
            return (
              <div
                key={chapterNum}
                className={`p-3 rounded text-center font-semibold ${
                  isCompleted
                    ? 'bg-[#C19A6B] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {chapterNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Verses */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-[#8B4513] mb-4">Recently Read Verses</h2>
        {progress.versesRead.length === 0 ? (
          <p className="text-gray-500">No verses read yet. Start reading chapters!</p>
        ) : (
          <div className="space-y-2">
            {progress.versesRead.slice(-10).reverse().map((verse, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <span className="font-semibold text-[#8B4513]">
                    Chapter {verse.chapterNumber}, Verse {verse.verseNumber}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(verse.readAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
