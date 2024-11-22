import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCredentials } from '../hooks/useCredentials';
import { serverConfigs } from '../configs';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, password, setCredentials] = useCredentials();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (key: 'username' | 'email' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (key === 'username') {
      setUsername(event.target.value);
    } else {
      setCredentials({
        [key]: event.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(
        `${serverConfigs.url}/register`,
        { username, email, password },
        { withCredentials: true }
      );
      // Redirect to login upon successful registration
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError('Registration failed. Please try again later.');
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
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
          <TextField
            type="text"
            value={username}
            onChange={handleInputChange('username')}
            label="Username"
            required
            fullWidth
            margin="normal"
          />
          <TextField
            type="email"
            value={email}
            onChange={handleInputChange('email')}
            label="Email"
            required
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            value={password}
            onChange={handleInputChange('password')}
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
              {loading ? 'Registering...' : 'Register'}
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
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
