import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { Container, CircularProgress, Box } from '@mui/material';

const InitRoute: React.FC = () => {
  const { accessToken, loading } = useContext(AuthContext)!;

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default InitRoute;
