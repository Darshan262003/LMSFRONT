import { Navigate } from 'react-router-dom';
import { authStore } from '../stores/authStore';

const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
