import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gitamindLogo from '../assets/gitamind-logo.svg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const features = [
    {
      icon: '📖',
      title: 'All 18 Chapters',
      description: 'Complete Bhagavad Gita with Sanskrit verses and English translations'
    },
    {
      icon: '🤖',
      title: 'Krishna AI Assistant',
      description: 'Chat with our intelligent AI bot for spiritual guidance and answers'
    },
    {
      icon: '🌅',
      title: 'Daily Verse',
      description: 'Get a new verse every day for daily inspiration and wisdom'
    },
    {
      icon: '🔖',
      title: 'Bookmark & Track',
      description: 'Save your favorite verses and track your reading progress'
    },
    {
      icon: '🛍️',
      title: 'Spiritual Products',
      description: 'Shop authentic spiritual books, idols, and meditation items'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find any verse or teaching instantly with powerful search'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5DF 0%, #FFE9D5 50%, #FFDDBC 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(176,101,0,0.1) 0%, rgba(255,221,188,0) 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'all 0.8s ease-out'
        }}>
          <img 
            src={gitamindLogo} 
            alt="Gitamind Logo" 
            style={{ 
              width: '150px', 
              height: '150px',
              marginBottom: '30px',
              animation: 'rotate 20s linear infinite'
            }} 
          />
          <h1 style={{
            fontSize: 'clamp(2.5em, 6vw, 4.5em)',
            fontWeight: 'bold',
            color: '#B06500',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Welcome to Gitamind
          </h1>
          <p style={{
            fontSize: 'clamp(1.2em, 3vw, 1.8em)',
            color: '#603900',
            marginBottom: '15px',
            fontWeight: '500'
          }}>
            Your Daily Dose of Wisdom
          </p>
          <p style={{
            fontSize: 'clamp(1em, 2vw, 1.3em)',
            color: '#444444',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Discover the timeless teachings of Bhagavad Gita, find inner peace, 
            and embark on your spiritual journey with our AI-powered companion.
          </p>
          
          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '18px 40px',
                fontSize: '1.3em',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #B06500 0%, #9A5700 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(176,101,0,0.4)',
                transition: 'all 0.3s ease',
                animation: 'pulse 2s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(176,101,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(176,101,0,0.4)';
              }}
            >
              🚀 Start Your Journey
            </button>
            
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '18px 40px',
                fontSize: '1.3em',
                fontWeight: 'bold',
                background: 'white',
                color: '#B06500',
                border: '3px solid #B06500',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FFE9D5';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔑 Login
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.3s'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(2em, 4vw, 3em)',
            color: '#B06500',
            marginBottom: '50px',
            fontWeight: 'bold'
          }}>
            ✨ Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '30px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  border: '2px solid #FFDDBC',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(176,101,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  fontSize: '4em',
                  marginBottom: '15px',
                  animation: `bounce 2s ease-in-out infinite ${index * 0.2}s`
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5em',
                  color: '#B06500',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '1em',
                  color: '#603900',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          marginBottom: '40px',
          backdropFilter: 'blur(10px)',
          border: '2px solid #FFDDBC',
          opacity: showContent ? 1 : 0,
          transition: 'all 1.2s ease-out 0.6s'
        }}>
          <p style={{
            fontSize: 'clamp(1.2em, 2.5vw, 1.8em)',
            fontStyle: 'italic',
            color: '#603900',
            marginBottom: '15px',
            lineHeight: '1.8'
          }}>
            "You have the right to perform your prescribed duty, but you are not entitled to the fruits of action."
          </p>
          <p style={{
            fontSize: '1.1em',
            color: '#B06500',
            fontWeight: 'bold'
          }}>
            - Bhagavad Gita 2.47
          </p>
        </div>

        {/* Final CTA */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <p style={{
            fontSize: '1.5em',
            color: '#603900',
            marginBottom: '25px',
            fontWeight: '500'
          }}>
            Ready to transform your life with ancient wisdom?
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '20px 50px',
              fontSize: '1.4em',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #B06500 0%, #9A5700 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(176,101,0,0.4)',
              transition: 'all 0.3s ease',
              animation: 'pulse 2s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 10px 30px rgba(176,101,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(176,101,0,0.4)';
            }}
          >
            Join Gitamind Today! 🙏
          </button>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, 20px) scale(1.1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
