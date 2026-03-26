import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FirstVisitRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('gitamind_has_visited');
    
    // If first visit, not logged in, and not already on welcome/login/register page
    if (!hasVisited && !user && 
        location.pathname !== '/welcome' && 
        location.pathname !== '/login' && 
        location.pathname !== '/register') {
      // Mark as visited
      localStorage.setItem('gitamind_has_visited', 'true');
      // Redirect to welcome page
      navigate('/welcome');
    }
  }, [user, location.pathname, navigate]);

  return <>{children}</>;
};

export default FirstVisitRedirect;
