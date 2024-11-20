import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const InitRoute: React.FC = () => {
  const { accessToken, loading } = useContext(AuthContext)!;

  if (loading) {
    return <div>Loading...</div>
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default InitRoute;
