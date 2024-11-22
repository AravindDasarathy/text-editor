import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCredentials } from '../hooks/useCredentials';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

const loginMessages: Record<string, string> = {
  'verification_failed': 'Invalid verification link.',
  'verification_expired': 'Verification link has expired.',
  'already_verified': 'Your email is already verified. Please log in.',
  'verification_success': 'Your email is verified successfully. Please log in.'
};

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, password, setCredentials] = useCredentials();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const messageKey = queryParams.get('message');

    if (messageKey) {
      setAlertMessage(loginMessages[messageKey] || 'Email verification failed.');
    }
  }, [location.search]);

  const handleInputFor = (key: 'email' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials({
      [key]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);

      // After successful login, check for redirect parameter
      const queryParams = new URLSearchParams(location.search);
      const redirectPath = queryParams.get('redirect');

      if (redirectPath) {
        // Navigate to the redirect path (e.g., /accept-invite?token=...)
        navigate(redirectPath);
      } else {
        // Navigate to dashboard upon successful login
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        {alertMessage && <Alert severity="info">{alertMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <TextField
            type="email"
            value={email}
            onChange={handleInputFor('email')}
            label="Email"
            required
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            value={password}
            onChange={handleInputFor('password')}
            label="Password"
            required
            fullWidth
            margin="normal"
          />
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <Box sx={{ position: 'relative', marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
