import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutButton from './LogoutButton';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1, // Ensure the AppBar is on top
}));

const TopBar: React.FC = () => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Collaborative Text Editor
        </Typography>
        <LogoutButton />
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;
