import { useAuth } from '@/hooks/auth/useAuth';
import React from 'react';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
