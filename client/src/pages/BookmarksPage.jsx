import { useState, useEffect } from 'react';
import api from '../services/api';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/preferences');
      setBookmarks(res.data.data.bookmarks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setLoading(false);
    }
  };

  const removeBookmark = async (chapterNumber, verseNumber) => {
    try {
      await api.delete('/preferences/bookmarks', {
        data: { chapterNumber, verseNumber }
      });
      fetchBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const updateBookmarkNote = async (chapterNumber, verseNumber) => {
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(t => t);
      
      await api.put('/preferences/bookmarks', {
        chapterNumber,
        verseNumber,
        note: noteText,
        tags
      });
      
      fetchBookmarks();
      setSelectedBookmark(null);
      setNoteText('');
      setTagInput('');
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const exportBookmarks = async () => {
    try {
      const response = await api.get('/preferences/export/bookmarks', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-gita-bookmarks.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting bookmarks:', error);
    }
  };

  const filteredBookmarks = filterTag
    ? bookmarks.filter(b => b.tags && b.tags.includes(filterTag))
    : bookmarks;

  const allTags = [...new Set(bookmarks.flatMap(b => b.tags || []))];

  if (loading) {
    return <div className="text-center p-8">Loading bookmarks...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#8B4513]">My Bookmarks</h1>
        <button
          onClick={exportBookmarks}
          className="bg-[#C19A6B] text-white px-4 py-2 rounded hover:bg-[#A0826D]"
        >
          Export as TXT
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterTag('')}
            className={`px-3 py-1 rounded ${!filterTag ? 'bg-[#C19A6B] text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded ${filterTag === tag ? 'bg-[#C19A6B] text-white' : 'bg-gray-200'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredBookmarks.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          No bookmarks yet. Start bookmarking verses from chapter pages!
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={`${bookmark.chapterNumber}-${bookmark.verseNumber}-${bookmark.addedAt || ''}`}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#8B4513]">
                    Chapter {bookmark.chapterNumber}, Verse {bookmark.verseNumber}
                  </h3>
                  
                  {bookmark.note && (
                    <p className="text-gray-700 mt-2 italic">"{bookmark.note}"</p>
                  )}
                  
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {bookmark.tags.map(tag => (
                        <span key={tag} className="bg-[#F5E6D3] text-[#8B4513] px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Added {new Date(bookmark.addedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBookmark(bookmark);
                      setNoteText(bookmark.note || '');
                      setTagInput(bookmark.tags ? bookmark.tags.join(', ') : '');
                    }}
                    className="text-[#C19A6B] hover:text-[#A0826D]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.chapterNumber, bookmark.verseNumber)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBookmark && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-[#8B4513]">
              Edit Bookmark - Chapter {selectedBookmark.chapterNumber}, Verse {selectedBookmark.verseNumber}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Personal Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                rows="4"
                placeholder="Add your thoughts, reflections, or insights..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="e.g., dharma, karma, wisdom"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setSelectedBookmark(null);
                  setNoteText('');
                  setTagInput('');
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => updateBookmarkNote(selectedBookmark.chapterNumber, selectedBookmark.verseNumber)}
                className="px-4 py-2 bg-[#C19A6B] text-white rounded hover:bg-[#A0826D]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
