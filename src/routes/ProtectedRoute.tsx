import { Navigate } from 'react-router-dom';
import { authStore } from '../stores/authStore';

const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  // Debug logging
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'Path:', window.location.pathname);

  if (!isAuthenticated) {
    console.warn('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
