import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@mui/material';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Button color="inherit" onClick={logout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
