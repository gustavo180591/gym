import { useContext, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  element: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if the user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to dashboard if user doesn't have the required role
      return <Navigate to="/" replace />;
    }
  }

  return <>{element}</>;
};

export default ProtectedRoute; 