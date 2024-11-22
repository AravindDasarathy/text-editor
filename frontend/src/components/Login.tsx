import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCredentials } from '../hooks/useCredentials';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
    <div style={styles.container}>
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={handleInputFor('email')}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={handleInputFor('password')}
          placeholder="Password"
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.switchText}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  input: {
    marginBottom: '20px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#1890ff',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  switchText: {
    marginTop: '20px',
    textAlign: 'center',
  }
};

export default LoginPage;
