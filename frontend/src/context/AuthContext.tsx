import axios from 'axios';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { serverConfigs } from '../configs';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${serverConfigs.url}/refresh-token`, {}, { withCredentials: true });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, loading, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};