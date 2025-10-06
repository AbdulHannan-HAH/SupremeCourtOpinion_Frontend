import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'user') {
      return <Navigate to="/user" replace />;
    } else {
      // Invalid role, redirect to login
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;