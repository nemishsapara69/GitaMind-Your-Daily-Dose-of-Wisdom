import React from 'react'; // Removed useState, useEffect as user state is now from context
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ADDED: Import useAuth

const Header = () => {
  const { user, logout, isAdmin } = useAuth(); // MODIFIED: Get user, logout, isAdmin from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // MODIFIED: Call the context's logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#333', color: 'white' }}>
      <div className="logo">
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          Gitamind
        </Link>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '15px' }}>
          <li><Link to="/chapters" style={{ color: 'white', textDecoration: 'none' }}>Chapters</Link></li>
          <li><Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link></li>
          {user ? ( // This now checks the 'user' state from AuthContext
            <>
              <li><Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</Link></li>
              <li><Link to="/myorders" style={{ color: 'white', textDecoration: 'none' }}>My Orders</Link></li>
              {isAdmin && ( // MODIFIED: Use isAdmin from context
                <li>
                  <Link to="/admin/orders" style={{ color: 'white', textDecoration: 'none' }}>Admin Orders</Link>
                </li>
              )}
              <li><Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>{user.user.username || user.user.email}</Link></li>
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link></li>
              <li><Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;