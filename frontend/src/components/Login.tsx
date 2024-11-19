import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCredentials } from '../hooks/useCredentials';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, password, setCredentials] = useCredentials();

  const handleInputFor = (key: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setCredentials({
        [key]: event.target.value,
      });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleInputFor('email')}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={handleInputFor('password')}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
