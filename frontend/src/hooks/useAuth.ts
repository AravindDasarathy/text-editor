import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

interface LoginResponse {
  accessToken: string;
}

export const useAuth = () => {
  const { setAccessToken } = useContext(AuthContext)!;

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:3001/login',
        { email, password },
        { withCredentials: true } // Include cookies in requests
      );
      setAccessToken(response.data.accessToken);
      // Redirect to protected route or handle success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      setAccessToken(null);
      // Redirect to login page or handle logout success
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { login, logout };
};
