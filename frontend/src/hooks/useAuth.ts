import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const useAuth = () => {
  const { setAccessToken, setUser } = useContext(AuthContext)!;

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        'http://localhost:3001/login',
        { email, password },
        { withCredentials: true }
      );
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Propagate the error to be handled in the component
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return { login, logout };
};

