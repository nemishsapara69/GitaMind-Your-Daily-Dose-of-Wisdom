import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user } = useAuth(); // Get user from context

  // If auth context is still loading user from localStorage, show a loading indicator
  // (This assumes your AuthProvider has a 'loading' state if you fetch user from backend)
  // For now, AuthProvider directly sets user from localStorage, so loading is quick.
  // If `user` is null initially, it means localStorage hasn't been checked yet or it's empty.
  // We can refine 'loading' in AuthContext if needed.

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are required, check if the user has at least one of them
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user.user.roles; // Assuming user.user.roles is an array
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirect to a "not authorized" page or home page
      return <Navigate to="/" replace state={{ message: "You are not authorized to access this page." }} />;
    }
  }

  // If logged in and has required roles, render the child components (the protected route)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;