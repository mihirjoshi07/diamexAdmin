// src/components/TopBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const TopBar = ({ onLogout }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Diamex Admin Panel
        </Typography>
        <IconButton
          color="inherit"
          onClick={onLogout} // Call the logout function
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
