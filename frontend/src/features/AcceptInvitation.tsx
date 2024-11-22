import React, { useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';

import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Container)({
  textAlign: 'center',
  marginTop: '32px',
});

const AcceptInvitation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, loading } = useContext(AuthContext)!;
  const axiosInstance = useAxios();
  const hasAcceptedRef = useRef(false); // Flag to prevent multiple calls

  useEffect(() => {
    if (loading) {
      // Wait until authentication state is resolved
      return;
    }

    const acceptInvitation = async () => {
      if (hasAcceptedRef.current) return; // Exit if already accepted

      hasAcceptedRef.current = true;

      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (!token) {
        alert('Invalid invitation link.');
        navigate('/');
        return;
      }

      try {
        if (accessToken) {
          // User is authenticated, proceed to accept the invitation
          const response = await axiosInstance.get(`/accept-invite?token=${token}`);
          alert(response.data.message);
          navigate(`/documents/${response.data.documentId}`);
        } else {
          // User is not authenticated, redirect to login with token
          navigate(`/login?redirect=/accept-invite?token=${token}`);
        }
      } catch (error: any) {
        console.error('Error accepting invitation:', error);
        alert(error.response?.data?.message || 'Failed to accept invitation.');
        navigate('/');
      }
    };

    acceptInvitation();
  }, [location.search, accessToken, navigate, axiosInstance]);

  return (
    <LoadingContainer maxWidth="sm">
      <Typography variant="h6">Processing your invitation...</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    </LoadingContainer>
  );
};

export default AcceptInvitation;
