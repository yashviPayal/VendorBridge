import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore, UserRole } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    // Not logged in -> redirect to auth login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Role not authorized -> redirect to default dashboard page
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
