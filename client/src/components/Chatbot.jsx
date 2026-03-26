import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import krishnaFace from '../assets/new loard krishna.jpg';
import { logError } from '../utils/logger';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [enableKrishnaTune, setEnableKrishnaTune] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [quickReplies, setQuickReplies] = useState([
    'What is dharma?',
    'Meaning of life?',
    'How to find peace?',
    'Karma yoga explained'
  ]);
  
  const messagesEndRef = useRef(null);
  const iconRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Load chat history and favorites on mount
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('gitamind_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        logError('Error loading favorites:', error);
        localStorage.removeItem('gitamind_favorites');
      }
    }
    
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('gitamind_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        logError('Error loading chat history:', error);
        localStorage.removeItem('gitamind_chat_history');
        setMessages([{
          sender: 'bot',
          message: 'Namaste! 🙏 I\'m your GitaMind AI assistant. How can I guide you with the wisdom of Bhagavad Gita today?',
          type: 'text',
          timestamp: new Date().toISOString()
        }]);
      }
    } else {
      setMessages([{
        sender: 'bot',
        message: 'Namaste! 🙏 I\'m your GitaMind AI assistant. How can I guide you with the wisdom of Bhagavad Gita today?',
        type: 'text',
        timestamp: new Date().toISOString()
      }]);
    }
    
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        logError('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable it in browser settings.');
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('gitamind_chat_history', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gitamind_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Play sound effect
  const playSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Play Krishna tune for bot messages
  const playKrishnaTune = () => {
    if (!enableKrishnaTune) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Play a melodious Krishna-inspired tune
      const notes = [
        { freq: 523.25, duration: 0.15 }, // C5
        { freq: 587.33, duration: 0.15 }, // D5
        { freq: 659.25, duration: 0.15 }, // E5
        { freq: 698.46, duration: 0.2 },  // F5
        { freq: 783.99, duration: 0.25 }  // G5
      ];
      
      let startTime = audioContextRef.current.currentTime;
      
      notes.forEach((note) => {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
        
        startTime += note.duration;
      });
    } catch (error) {
      console.error('Error playing Krishna tune:', error);
    }
  };

  // Text-to-Speech functionality
  const speakText = (text, language = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.lang = language;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a Hindi/Sanskrit voice for Sanskrit text
    const voices = window.speechSynthesis.getVoices();
    if (language === 'hi-IN' || language === 'sa-IN') {
      const hindiVoice = voices.find(voice => 
        voice.lang.startsWith('hi') || voice.lang.startsWith('sa')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      // Use English voice for English text
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speak verse with proper language detection
  const speakVerse = (verse) => {
    if (!verse) return;

    let textToSpeak = '';
    let language = 'en-US';

    // Build the text to speak
    if (verse.sanskrit) {
      textToSpeak += `Sanskrit: ${verse.sanskrit}. `;
      language = 'hi-IN'; // Use Hindi voice for Sanskrit
    }
    
    if (verse.transliteration) {
      textToSpeak += `Transliteration: ${verse.transliteration}. `;
    }
    
    if (verse.translation) {
      textToSpeak += `Translation: ${verse.translation}. `;
      language = 'en-US';
    }
    
    if (verse.explanation) {
      textToSpeak += `Explanation: ${verse.explanation}`;
      language = 'en-US';
    }

    if (textToSpeak) {
      speakText(textToSpeak, language);
    }
  };

  // Speak any message
  const speakMessage = (message) => {
    if (message && message.message) {
      speakText(message.message, 'en-US');
    }
  };

  // Load voices when they're ready
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      const loadVoices = () => {
        speechSynthesisRef.current = window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    // Cleanup: stop any ongoing speech when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: 'user',
      message: inputMessage,
      type: 'text',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    playSound();

    // Check for simple greetings
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar'];
    const lowerInput = currentInput.toLowerCase().trim();
    
    if (greetings.includes(lowerInput)) {
      const greetingResponse = {
        sender: 'bot',
        message: `Namaste! 🙏 I'm Krishna AI Guide. I can help you with:\n\n• Understanding Bhagavad Gita verses\n• Finding peace and wisdom\n• Guidance on dharma and karma\n• Life's spiritual questions\n\nHow may I assist you today?`,
        type: 'text',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, greetingResponse]);
      playKrishnaTune();
      setQuickReplies([
        'What is dharma?',
        'Meaning of life?',
        'How to find peace?',
        'Karma yoga explained'
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/chatbot/message', {
        message: currentInput
      });

      const botMessage = {
        sender: 'bot',
        message: response.data.data.message,
        verse: response.data.data.verse,
        type: response.data.data.type,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      playKrishnaTune();
      
      // Update quick replies based on response
      if (response.data.verse) {
        setQuickReplies([
          'Tell me more',
          'Another verse please',
          'Explain this deeper',
          'How to apply this?'
        ]);
      } else {
        setQuickReplies([
          'What is dharma?',
          'Meaning of life?',
          'How to find peace?',
          'Karma yoga explained'
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'bot',
        message: 'Sorry, I encountered an error. Please try again later.',
        type: 'text',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      playKrishnaTune();
      setQuickReplies([
        'Try again',
        'What is dharma?',
        'Tell me about karma',
        'Guide me'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  // Add to favorites
  const addToFavorites = (verse) => {
    if (!verse) return;
    
    const chapterNum = verse.chapter_number || verse.chapter;
    const isAlreadyFavorite = favorites.some(fav => 
      (fav.chapter === chapterNum || fav.chapter_number === chapterNum) && fav.verse_number === verse.verse_number
    );

    if (isAlreadyFavorite) {
      alert('This verse is already in your favorites!');
      return;
    }

    setFavorites(prev => [...prev, verse]);
    playSound();
  };

  // Remove from favorites
  const removeFromFavorites = (verseToRemove) => {
    const chapterNum = verseToRemove.chapter_number || verseToRemove.chapter;
    setFavorites(prev => prev.filter(verse => {
      const vChapter = verse.chapter_number || verse.chapter;
      return !(vChapter === chapterNum && verse.verse_number === verseToRemove.verse_number);
    }));
  };

  // Share verse
  const shareVerse = async (verse, platform) => {
    if (!verse) return;
    
    const verseText = verse.translation || verse.text || verse.transliteration || verse.sanskrit;
    const chapterNum = verse.chapter_number || verse.chapter;
    const text = `${verseText}\n\n- Bhagavad Gita, Chapter ${chapterNum}, Verse ${verse.verse_number}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(text);
        alert('Verse copied to clipboard!');
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Verse copied to clipboard!');
        } catch {
          alert('Failed to copy verse');
        }
        document.body.removeChild(textArea);
      }
    }
  };

  // Clear chat history
  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setMessages([{
        sender: 'bot',
        message: 'Namaste! 🙏 I\'m your GitaMind AI assistant. How can I guide you with the wisdom of Bhagavad Gita today?',
        type: 'text',
        timestamp: new Date().toISOString()
      }]);
      playSound();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle quick reply click
  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    // Auto-send the message
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (!iconRef.current || isOpen) return;
    setIsDragging(true);
    const rect = iconRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Floating Krishna Icon */}
      <div
        ref={iconRef}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(true)}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C19A6B 0%, #B8956F 50%, #A0826D 100%)',
          boxShadow: '0 8px 25px rgba(193, 154, 107, 0.4)',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 9999,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          animation: 'iconFloat 3s ease-in-out infinite',
          border: '3px solid #C19A6B',
          overflow: 'hidden'
        }}
      >
        {krishnaFace ? (
          <img 
            src={krishnaFace} 
            alt="Krishna" 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }} 
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '🕉️'; }}
          />
        ) : (
          <span style={{ fontSize: '32px' }}>🕉️</span>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '380px',
          height: '550px',
          backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(193, 154, 107, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9998,
          overflow: 'hidden',
          border: `3px solid ${darkMode ? '#C19A6B' : '#C19A6B'}`,
          transition: 'background-color 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #0f0f1e 0%, #8B7355 100%)'
              : 'linear-gradient(135deg, #C19A6B 0%, #B8956F 50%, #A0826D 100%)',
            padding: '20px',
            color: 'white',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
            boxShadow: '0 4px 15px rgba(193, 154, 107, 0.4)',
            position: 'relative'
          }}>
            {/* Close Button - Top Right Corner */}
            <button
              onClick={() => setIsOpen(false)}
              title="Close Chat"
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'linear-gradient(135deg, #E85D5D 0%, #DC3545 50%, #C82333 100%)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15) rotate(90deg)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.6), inset 0 -2px 8px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.2)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Title Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              {krishnaFace ? (
                <img 
                  src={krishnaFace} 
                  alt="Krishna" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    border: '2px solid #C19A6B',
                    objectFit: 'cover',
                    animation: 'iconPulse 2s ease-in-out infinite'
                  }} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span style={{ fontSize: '32px' }}>🕉️</span>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Krishna AI Guide</h3>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.95 }}>Divine wisdom at your service 🙏</p>
              </div>
            </div>
            
            {/* Action Buttons Row */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '10px'
            }}>
              {/* Timestamps Toggle */}
              <button
                onClick={() => setShowTimestamps(!showTimestamps)}
                title={showTimestamps ? 'Hide Timestamps' : 'Show Timestamps'}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '14px' }}>🕐</span>
                <span style={{ fontSize: '10px' }}>Time</span>
              </button>
              
              {/* Krishna Tune Toggle */}
              <button
                onClick={() => setEnableKrishnaTune(!enableKrishnaTune)}
                title={enableKrishnaTune ? 'Disable Krishna Tune' : 'Enable Krishna Tune'}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '14px' }}>{enableKrishnaTune ? '🎵' : '🔇'}</span>
                <span style={{ fontSize: '10px' }}>Tune</span>
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '14px' }}>{darkMode ? '☀️' : '🌙'}</span>
                <span style={{ fontSize: '10px' }}>{darkMode ? 'Light' : 'Dark'}</span>
              </button>
              
              {/* Favorites Toggle */}
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                title="Favorites"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '14px' }}>⭐</span>
                <span style={{ fontSize: '10px' }}>Saved</span>
              </button>
              
              {/* Speech Control */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    // Cycle through speech rates: 1.0 -> 1.2 -> 0.8 -> 1.0
                    if (speechRate === 1.0) setSpeechRate(1.2);
                    else if (speechRate === 1.2) setSpeechRate(0.8);
                    else setSpeechRate(1.0);
                  }
                }}
                title={isSpeaking ? 'Stop Speaking' : `Speech Speed: ${speechRate}x`}
                style={{
                  background: isSpeaking ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isSpeaking ? 'rgba(239, 68, 68, 1)' : 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSpeaking ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '14px' }}>{isSpeaking ? '🔇' : '🔊'}</span>
                <span style={{ fontSize: '10px' }}>{isSpeaking ? 'Stop' : `${speechRate}x`}</span>
              </button>
              
              {/* Clear History */}
              <button
                onClick={clearChatHistory}
                title="Clear Chat"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '14px' }}>🗑️</span>
                <span style={{ fontSize: '10px' }}>Clear</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: darkMode ? '#16213e' : '#f8fafc'
          }}>
            {showFavorites ? (
              /* Favorites View */
              <div>
                <h4 style={{ color: darkMode ? '#C19A6B' : '#A0826D', marginBottom: '15px' }}>
                  ⭐ Favorite Verses ({favorites.length})
                </h4>
                {favorites.length === 0 ? (
                  <p style={{ color: darkMode ? '#9ca3af' : '#64748b', textAlign: 'center', marginTop: '50px' }}>
                    No favorites yet. Star a verse to save it!
                  </p>
                ) : (
                  favorites.map((verse, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: darkMode ? '#8B7355' : '#ffffff',
                        borderRadius: '12px',
                        padding: '15px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: `2px solid ${darkMode ? '#C19A6B' : '#e2e8f0'}`
                      }}
                    >
                      <p style={{ 
                        color: darkMode ? '#ffffff' : '#1e293b',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        margin: '0 0 10px 0',
                        fontStyle: 'italic'
                      }}>
                        "{verse.translation || verse.text || verse.transliteration || verse.sanskrit}"
                      </p>
                      <p style={{ 
                        color: darkMode ? '#C19A6B' : '#A0826D',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        margin: '8px 0'
                      }}>
                        - Chapter {verse.chapter_number || verse.chapter}, Verse {verse.verse_number}
                      </p>
                      {(verse.explanation || verse.translation) && (
                        <p style={{ 
                          color: darkMode ? '#cbd5e1' : '#64748b',
                          fontSize: '13px',
                          marginTop: '8px',
                          lineHeight: '1.5'
                        }}>
                          {verse.explanation || verse.translation}
                        </p>
                      )}
                      <button
                        onClick={() => removeFromFavorites(verse)}
                        style={{
                          marginTop: '10px',
                          padding: '6px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Chat Messages */
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '15px'
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #C19A6B 0%, #A0826D 100%)'
                        : darkMode ? '#8B7355' : '#ffffff',
                      color: msg.sender === 'user' ? '#ffffff' : (darkMode ? '#ffffff' : '#1e293b'),
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: msg.sender === 'bot' ? `2px solid ${darkMode ? '#C19A6B' : '#e2e8f0'}` : 'none'
                    }}>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                        {msg.message}
                      </p>
                      
                      {/* Listen button for messages without verse */}
                      {!msg.verse && msg.sender === 'bot' && (
                        <button
                          onClick={() => speakMessage(msg)}
                          style={{
                            marginTop: '8px',
                            padding: '4px 10px',
                            backgroundColor: darkMode ? '#C19A6B' : '#F5E6D3',
                            color: darkMode ? 'white' : '#8B7355',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🔊 Listen
                        </button>
                      )}
                      
                      {/* Timestamp */}
                      {showTimestamps && msg.timestamp && (
                        <p style={{ 
                          margin: '8px 0 0 0', 
                          fontSize: '10px', 
                          opacity: 0.6,
                          textAlign: msg.sender === 'user' ? 'right' : 'left'
                        }}>
                          {formatTime(msg.timestamp)}
                        </p>
                      )}
                      
                      {msg.verse && (
                        <div style={{ 
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: `1px solid ${darkMode ? '#C19A6B' : '#e2e8f0'}`
                        }}>
                          <p style={{ 
                            fontSize: '13px',
                            fontStyle: 'italic',
                            color: darkMode ? '#cbd5e1' : '#64748b',
                            marginBottom: '8px'
                          }}>
                            "{msg.verse.sanskrit || msg.verse.transliteration || msg.verse.text}"
                          </p>
                          <p style={{ 
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: darkMode ? '#C19A6B' : '#A0826D',
                            marginBottom: '8px'
                          }}>
                            - Chapter {msg.verse.chapter_number || msg.verse.chapter}, Verse {msg.verse.verse_number}
                          </p>
                          {msg.verse.translation && (
                            <p style={{ 
                              fontSize: '12px',
                              color: darkMode ? '#cbd5e1' : '#64748b',
                              marginBottom: '8px',
                              lineHeight: '1.5'
                            }}>
                              {msg.verse.translation}
                            </p>
                          )}
                          {msg.verse.explanation && (
                            <p style={{ 
                              fontSize: '11px',
                              color: darkMode ? '#9ca3af' : '#64748b',
                              marginBottom: '12px',
                              fontStyle: 'italic',
                              lineHeight: '1.4'
                            }}>
                              {msg.verse.explanation}
                            </p>
                          )}
                          
                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => speakVerse(msg.verse)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: darkMode ? '#C19A6B' : '#F5E6D3',
                                color: darkMode ? 'white' : '#8B7355',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              🔊 Listen
                            </button>
                            <button
                              onClick={() => addToFavorites(msg.verse)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: darkMode ? '#C19A6B' : '#F5E6D3',
                                color: darkMode ? 'white' : '#8B7355',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              ⭐ Save
                            </button>
                            <button
                              onClick={() => shareVerse(msg.verse, 'twitter')}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: darkMode ? '#C19A6B' : '#F5E6D3',
                                color: darkMode ? 'white' : '#8B7355',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              🐦 Tweet
                            </button>
                            <button
                              onClick={() => shareVerse(msg.verse, 'whatsapp')}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: darkMode ? '#C19A6B' : '#F5E6D3',
                                color: darkMode ? 'white' : '#8B7355',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              💬 Share
                            </button>
                            <button
                              onClick={() => shareVerse(msg.verse, 'copy')}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: darkMode ? '#C19A6B' : '#F5E6D3',
                                color: darkMode ? 'white' : '#8B7355',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '18px 18px 18px 4px',
                      background: darkMode ? '#8B7355' : '#ffffff',
                      border: `2px solid ${darkMode ? '#C19A6B' : '#e2e8f0'}`,
                      display: 'flex',
                      gap: '6px'
                    }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: darkMode ? '#C19A6B' : '#A0826D',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '-0.32s'
                      }}></div>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: darkMode ? '#C19A6B' : '#A0826D',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '-0.16s'
                      }}></div>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: darkMode ? '#C19A6B' : '#A0826D',
                        animation: 'bounce 1.4s infinite ease-in-out both'
                      }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '15px 20px',
            borderTop: `2px solid ${darkMode ? '#0f0f1e' : '#e2e8f0'}`,
            backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px'
          }}>
            {/* Quick Reply Buttons */}
            {!showFavorites && quickReplies.length > 0 && (
              <div style={{
                marginBottom: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: darkMode ? '#8B7355' : '#F5E6D3',
                      color: darkMode ? '#ffffff' : '#8B7355',
                      border: `1px solid ${darkMode ? '#C19A6B' : '#C19A6B'}`,
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#C19A6B' : '#DDB892';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#8B7355' : '#F5E6D3';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            {/* Input Field */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={showFavorites}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '25px',
                  border: `2px solid ${darkMode ? '#C19A6B' : '#e2e8f0'}`,
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: darkMode ? '#0f0f1e' : '#f8fafc',
                  color: darkMode ? '#ffffff' : '#1e293b',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C19A6B'}
                onBlur={(e) => e.target.style.borderColor = darkMode ? '#C19A6B' : '#e2e8f0'}
              />
              
              <button
                onClick={toggleVoiceInput}
                disabled={showFavorites}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isListening 
                    ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
                    : 'linear-gradient(135deg, #C19A6B 0%, #A0826D 100%)',
                  color: 'white',
                  fontSize: '18px',
                  cursor: showFavorites ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  opacity: showFavorites ? 0.5 : 1,
                  animation: isListening ? 'gradientPulse 2s ease infinite' : 'none',
                  backgroundSize: '200% 200%'
                }}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                🎤
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || showFavorites}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #C19A6B 0%, #A0826D 100%)',
                  color: 'white',
                  fontSize: '18px',
                  cursor: (!inputMessage.trim() || isLoading || showFavorites) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  opacity: (!inputMessage.trim() || isLoading || showFavorites) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (inputMessage.trim() && !isLoading && !showFavorites) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1.0);
          }
        }
        
        @keyframes gradientPulse {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }
        
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
