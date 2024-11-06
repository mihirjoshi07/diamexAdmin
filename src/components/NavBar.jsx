// // src/components/Sidebar.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Typography,
// } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import BarChartIcon from '@mui/icons-material/BarChart';

// const NavBar = () => {
//   return (
//     <Box
//       sx={{
//         width: '20%',
//         height: '100vh',
//         bgcolor: 'background.paper',
//         boxShadow: 3,
//         position: 'fixed',
//         top: 0,
//         left: 0,
//       }}
//     >
//       <Typography variant="h6" sx={{ p: 2 }}>
//         Admin Panel
//       </Typography>
//       <List>
//         <ListItem button component={Link} to="/">
//           <ListItemIcon>
//             <DashboardIcon />
//           </ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItem>
//         <ListItem button component={Link} to="/orders">
//           <ListItemIcon>
//             <ShoppingCartIcon />
//           </ListItemIcon>
//           <ListItemText primary="Orders" />
//         </ListItem>
//         <ListItem button component={Link} to="/reports">
//           <ListItemIcon>
//             <BarChartIcon />
//           </ListItemIcon>
//           <ListItemText primary="Reports" />
//         </ListItem>
//       </List>
//     </Box>
//   );
// };

// export default NavBar;
// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Switch,
  AppBar,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import DescriptionIcon from '@mui/icons-material/Description';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ListIcon from '@mui/icons-material/List';

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box
      sx={{
        width: '20%',
        height: '100vh',
        bgcolor: darkMode ? 'grey.900' : 'background.paper',
        color: darkMode ? 'white' : 'black',
        boxShadow: 3,
        position: 'fixed',
        top: 0,
        left: 0,
        transition: 'background-color 0.3s ease',
      }}
    >
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Toolbar>
      </AppBar>
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200', // Hover effect for dark and light mode
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/feedback"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200',
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <FeedbackIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/reports"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200',
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <ReportIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/documents"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200',
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <DescriptionIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Documents" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/showAds"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200',
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <ListIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Show ADS" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/advertisement"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200',
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <AddPhotoAlternateIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Add Advertisement" />
        </ListItem>


        <ListItem
          button
          component={Link}
          to="/changePassword"
          sx={{
            '&:hover': {
              bgcolor: darkMode ? 'grey.800' : 'grey.200',
              color: darkMode ? 'white' : 'black',
            },
          }}
        >
          <ListItemIcon>
            <ManageAccountsIcon sx={{ color: darkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItem>

      </List>
    </Box>
  );
};

export default NavBar;
