import React, { useState, useContext, MouseEvent } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Typography, Divider } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

const UserMenu: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  if (!user) return null; // Do not render if no user is logged in

  // Function to get user initials from username or email
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        edge="end"
        color="inherit"
        aria-label="user account"
        aria-controls={Boolean(anchorEl) ? 'user-menu' : undefined}
        aria-haspopup="true"
      >
        <Avatar sx={{ bgcolor: deepPurple[500] }}>
          {getInitials(user.username || user.email)}
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle1">{user.email}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
