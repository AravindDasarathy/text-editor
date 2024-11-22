import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCredentials } from '../hooks/useCredentials';
import { serverConfigs } from '../configs';

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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Register</h2>
        <input
          type="text"
          value={username}
          onChange={handleInputChange('username')}
          placeholder="Username"
          required
          style={styles.input}
        />
        <input
          type="email"
          value={email}
          onChange={handleInputChange('email')}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={handleInputChange('password')}
          placeholder="Password"
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p style={styles.switchText}>
          Already have an account? <Link to="/login">Login here</Link>
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
  },
};

export default RegisterPage;
