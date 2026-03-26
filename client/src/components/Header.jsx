import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import gitamindLogo from '../assets/gitamind-logo.svg';

// SVG Icon for Search
const SearchSVG = ({ color = "#B06500", size = "1.2em" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width={size} height={size} x="0" y="0" viewBox="0 0 6.35 6.35" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve" className="">
    <g>
      <path d="M2.894.511a2.384 2.384 0 0 0-2.38 2.38 2.386 2.386 0 0 0 2.38 2.384c.56 0 1.076-.197 1.484-.523l.991.991a.265.265 0 0 0 .375-.374l-.991-.992a2.37 2.37 0 0 0 .523-1.485C5.276 1.58 4.206.51 2.894.51zm0 .53c1.026 0 1.852.825 1.852 1.85S3.92 4.746 2.894 4.746s-1.851-.827-1.851-1.853.825-1.852 1.851-1.852z" paintOrder="stroke fill markers" fill={color} opacity="1" data-original="#000000"></path>
    </g>
  </svg>
);

// SVG Icon for Chapters Dropdown Arrow
const DropdownArrowSVG = ({ color = "#603900", size = "1em" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width={size} height={size} x="0" y="0" viewBox="0 0 24 24" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve">
    <g>
      <path fill={color} fillRule="evenodd" d="M6.47 8.97a.75.75 0 0 1 1.06 0L12 13.44l4.47-4.47a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06z" clipRule="evenodd"></path>
    </g>
  </svg>
);

// SVG Icon for Chapter Item (Document/File Icon)
const ChapterItemSVG = ({ color = "#B06500", size = "1.1em" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 10 12 14 12"></polyline>
  </svg>
);


const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [chapters, setChapters] = useState([]);
  const [isChaptersDropdownOpen, setIsChaptersDropdownOpen] = useState(false);
  const chaptersDropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Fetch Chapters on Header Mount ---
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get('/chapters');
        setChapters(response.data);
      } catch (err) {
        console.error('Error fetching chapters for header dropdown:', err);
      }
    };
    fetchChapters();
  }, []);

  // --- Handle Clicks Outside Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chaptersDropdownRef.current && !chaptersDropdownRef.current.contains(event.target)) {
        setIsChaptersDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Close dropdown if navigation occurs ---
  useEffect(() => {
    closeChaptersDropdown();
  }, [location]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleChaptersDropdown = () => {
    setIsChaptersDropdownOpen(prev => !prev);
  };

  const closeChaptersDropdown = () => {
    setIsChaptersDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    const lowerCaseQuery = trimmedQuery.toLowerCase();

    const directNavigations = {
      'chapter': '/chapters',
      'chapters': '/chapters',
      'product': '/products',
      'products': '/products',
      'cart': '/cart',
      'my order': '/myorders',
      'my orders': '/myorders',
      'user order': '/admin/orders',
      'user orders': '/admin/orders',
      'admin orders': '/admin/orders',
      'profile': '/profile',
      'admin': '/profile',
      'login': '/login',
      'register': '/register',
      'manage products': '/admin/products'
    };

    if (directNavigations[lowerCaseQuery]) {
      const targetPath = directNavigations[lowerCaseQuery];

      if (['/cart', '/myorders', '/profile'].includes(targetPath)) {
        if (user) {
          navigate(targetPath);
          setSearchQuery('');
          closeChaptersDropdown();
          return;
        } else {
          alert('Please log in to access this page.');
          setSearchQuery('');
          navigate('/login');
          return;
        }
      } else if (targetPath.startsWith('/admin') || (targetPath === '/profile' && isAdmin)) {
        if (isAdmin) {
          navigate(targetPath);
          setSearchQuery('');
          closeChaptersDropdown();
          return;
        } else {
          alert('You do not have permission to access admin pages directly.');
          setSearchQuery('');
          return;
        }
      }
      navigate(targetPath);
      setSearchQuery('');
      closeChaptersDropdown();
      return;
    }

    const chapterMatch = lowerCaseQuery.match(/^(chapter|chap)\s*(\d+)$/);
    if (chapterMatch) {
        const chapterNum = parseInt(chapterMatch[2]);
        if (chapterNum >= 1 && chapterNum <= 18) {
            navigate(`/chapters/${chapterNum}`);
            setSearchQuery('');
            closeChaptersDropdown();
            return;
        }
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setSearchQuery('');
    closeChaptersDropdown();
  };

  const isChaptersActive = location.pathname.startsWith('/chapters');

  const navItemBaseStyle = {
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '5px',
    color: '#603900', // Dark Brown text
    fontSize: '1.1em',
    fontWeight: 'bold',
    padding: '8px 15px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };

  const navItemHoverStyle = {
    background: '#FFE9D5', // Soft Cream background on hover
    color: '#B06500', // Deep Terracotta text on hover
  };

  const chaptersActiveOpenStyle = {
    background: 'white',
    color: '#603900',
    border: '1px solid #603900', // Dark Brown border
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };


  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 25px',
      background: '#FFF5DF',
      color: '#444444',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 100,
      gap: '15px',
      borderBottom: '1px solid #FFDDBC'
    }}>
      {/* Top Row: Logo and Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div className="logo" style={{ flexShrink: 0 }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px'
          }}>
            <img 
              src={gitamindLogo} 
              alt="Gitamind Logo" 
              style={{ 
                height: '50px', 
                width: '50px',
                objectFit: 'contain',
                verticalAlign: 'middle'
              }} 
            />
            <span style={{ 
              color: '#B06500', 
              fontSize: '28px', 
              fontWeight: 'bold',
              verticalAlign: 'middle',
              display: 'inline-block'
            }}>
              Gitamind
            </span>
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 102
          }}
          className="mobile-menu-button"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ width: '25px', height: '3px', backgroundColor: '#B06500', display: 'block', transition: 'all 0.3s' }}></span>
            <span style={{ width: '25px', height: '3px', backgroundColor: '#B06500', display: 'block', transition: 'all 0.3s' }}></span>
            <span style={{ width: '25px', height: '3px', backgroundColor: '#B06500', display: 'block', transition: 'all 0.3s' }}></span>
          </div>
        </button>

        {/* Navigation links */}
        <nav style={{ marginLeft: 'auto' }} className="desktop-nav">
        <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            flexShrink: 0
        }}>
          {/* Chapters Dropdown Button */}
          <li ref={chaptersDropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={toggleChaptersDropdown}
              style={{
                ...navItemBaseStyle,
                ...(isChaptersDropdownOpen || isChaptersActive ? chaptersActiveOpenStyle : {}),
              }}
              onMouseEnter={(e) => {
                if (!(isChaptersDropdownOpen || isChaptersActive)) {
                  Object.assign(e.currentTarget.style, navItemHoverStyle);
                }
              }}
              onMouseLeave={(e) => {
                if (!(isChaptersDropdownOpen || isChaptersActive)) {
                  Object.assign(e.currentTarget.style, navItemBaseStyle);
                }
              }}
            >
              Chapters <span style={{ marginLeft: '5px' }}>
                <DropdownArrowSVG color={(isChaptersDropdownOpen || isChaptersActive) ? '#603900' : '#B06500'} size="1em" />
              </span>
            </button>
            {isChaptersDropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: '0',
                backgroundColor: '#FFFAEC',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                borderRadius: '8px', minWidth: '250px', maxHeight: '400px', overflowY: 'auto',
                border: '1px solid #FFDDBC',
                zIndex: 101, padding: '10px 0', display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '5px 10px'
              }}>
                {chapters.length > 0 ? (
                  chapters.map(chapter => (
                    <Link
                      key={chapter.id}
                      to={`/chapters/${chapter.chapter_number}`}
                      onClick={closeChaptersDropdown}
                      style={{
                        display: 'flex', alignItems: 'center', padding: '8px 15px', color: '#444444',
                        textDecoration: 'none', fontSize: '1em', transition: 'background-color 0.15s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE9D5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFAEC'}
                    >
                      <ChapterItemSVG color="#B06500" size="1.1em" />
                      Chapter {chapter.chapter_number}
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '10px 15px', color: '#757575', gridColumn: '1 / -1' }}>Loading Chapters...</div>
                )}
              </div>
            )}
          </li>

              <li>
                <Link to="/products"
                  style={navItemBaseStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                >
                  Products
                </Link>
              </li>

              {user ? (
                <>
                  {!isAdmin && (
                    <>
                      <li>
                        <Link to="/cart"
                          style={navItemBaseStyle}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                          onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                        >
                          Cart
                        </Link>
                      </li>
                      <li>
                        <Link to="/myorders"
                          style={navItemBaseStyle}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                          onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                        >
                          My Orders
                        </Link>
                      </li>
                    </>
                  )}

                  {isAdmin && (
                    <li>
                      <Link to="/admin/orders"
                        style={navItemBaseStyle}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                      >
                        User Orders
                      </Link>
                    </li>
                  )}
                  {isAdmin && ( /* <--- Conditional for Admin 'Manage Products' */
                    <li>
                      <Link to="/admin/products"
                        style={navItemBaseStyle}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                      >
                        Manage Products
                      </Link>
                    </li>
                  )}

                  <li style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                    <Link to="/profile"
                      style={navItemBaseStyle}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                    >
                      {isAdmin ? "Admin" : "Profile"}
                    </Link>
                  </li>

                  <li>
                    <button onClick={handleLogout} style={{
                      ...navItemBaseStyle,
                      background: '#B06500', // Specific background for Logout
                      color: 'white', // White text on Logout button
                      padding: '8px 15px',
                    }}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#9A5700' })}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#B06500' })}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : ( // If no user is logged in
                <>
                  <li>
                    <Link to="/login"
                      style={navItemBaseStyle}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register"
                      style={navItemBaseStyle}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemBaseStyle)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Bottom Row: Centered Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px 10px 40px',
                borderRadius: '25px',
                border: '1px solid #FFDDBC',
                backgroundColor: '#FFFAEC',
                color: '#444444',
                fontSize: '1em',
                outline: 'none',
                boxSizing: 'border-box',
                '::placeholder': { color: '#888888' }
              }}
            />
            <button type="submit" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#B06500',
              cursor: 'pointer',
              fontSize: '1.2em',
              padding: '0'
            }}>
              <SearchSVG color="#B06500" size="1.2em" />
            </button>
          </form>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 100,
                display: 'none'
              }}
              className="mobile-overlay"
            />
            <div 
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '280px',
                backgroundColor: '#FFF5DF',
                boxShadow: '-2px 0 10px rgba(0,0,0,0.2)',
                zIndex: 101,
                overflowY: 'auto',
                padding: '80px 20px 20px',
                display: 'none'
              }}
              className="mobile-menu"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '30px',
                  color: '#B06500',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1'
                }}
              >
                ×
              </button>
              
              <nav>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={() => { toggleChaptersDropdown(); }}
                      style={{
                        ...navItemBaseStyle,
                        width: '100%',
                        justifyContent: 'space-between'
                      }}
                    >
                      Chapters <DropdownArrowSVG />
                    </button>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                      Products
                    </Link>
                  </li>
                  {user && !isAdmin && (
                    <>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          Cart
                        </Link>
                      </li>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/myorders" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          My Orders
                        </Link>
                      </li>
                    </>
                  )}
                  {user && isAdmin && (
                    <>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          User Orders
                        </Link>
                      </li>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/admin/products" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          Manage Products
                        </Link>
                      </li>
                    </>
                  )}
                  {user ? (
                    <>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          {isAdmin ? 'Admin' : 'Profile'}
                        </Link>
                      </li>
                      <li style={{ marginBottom: '10px' }}>
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ ...navItemBaseStyle, width: '100%', background: '#B06500', color: 'white' }}>
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          Login
                        </Link>
                      </li>
                      <li style={{ marginBottom: '10px' }}>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} style={{ ...navItemBaseStyle, width: '100%', display: 'block' }}>
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </>
        )}

        {/* Responsive CSS */}
        <style>{`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-menu-button {
              display: block !important;
            }
            .mobile-overlay,
            .mobile-menu {
              display: block !important;
            }
          }
        `}</style>
        </header>
      );
    };

    export default Header;