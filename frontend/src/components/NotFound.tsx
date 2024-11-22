import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Container, Typography, Button, Box } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 8 }}>
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
    </Container>
  );
};

export default NotFound;
