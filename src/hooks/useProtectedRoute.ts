import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface UseProtectedRouteProps {
  allowedRoles?: ('patient' | 'doctor')[];
  redirectTo?: string;
}

export const useProtectedRoute = ({
  allowedRoles = ['patient', 'doctor'],
  redirectTo = '/login',
}: UseProtectedRouteProps = {}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the attempted URL for redirecting after login
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, allowedRoles, navigate, location, redirectTo]);

  return {
    isAuthorized: isAuthenticated && user && allowedRoles.includes(user.role),
    user,
  };
}; 