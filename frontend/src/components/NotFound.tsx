// NotFound.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const NotFoundContainer = styled(Container)({
  textAlign: 'center',
  marginTop: '64px',
});

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you're looking for doesn't exist.
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <Button variant="contained" color="primary" component={RouterLink} to="/">
          Go to Home
        </Button>
      </Box>
    </NotFoundContainer>
  );
};

export default NotFound;
