import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accessToken, loading } = useContext(AuthContext)!;

  if (loading) {
    return <div>Loading...</div>
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
