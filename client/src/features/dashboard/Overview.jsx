import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Overview / Root Route
 * Authenticated users are redirected to their role dashboard.
 * Unauthenticated users are redirected to the login page.
 * This component should not render any visible UI in normal usage.
 */
export default function Overview() {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    switch (currentUser.role) {
      case 'admin':    navigate('/admin/dashboard',    { replace: true }); break;
      case 'staff':    navigate('/staff/dashboard',    { replace: true }); break;
      case 'volunteer':navigate('/volunteer/dashboard',{ replace: true }); break;
      case 'student':  navigate('/student/dashboard',  { replace: true }); break;
      default:         navigate('/login',              { replace: true });
    }
  }, [loading, isAuthenticated, currentUser]);

  // Render nothing — this is purely a redirect component
  return null;
}
