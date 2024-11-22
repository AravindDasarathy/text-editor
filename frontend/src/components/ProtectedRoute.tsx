// ProtectedRoute.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

import { Container, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Container)({
  textAlign: 'center',
  marginTop: '32px',
});

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accessToken, loading } = useContext(AuthContext)!;

  if (loading) {
    return (
      <LoadingContainer maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </LoadingContainer>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
