import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Add as AddIcon, Dashboard as DashboardIcon, Person as PersonIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useState } from 'react';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    }}>
      <Toolbar>
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          Event Manager
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button
                component={RouterLink}
                to="/"
                startIcon={<DashboardIcon />}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' }
                }}
              >
                Dashboard
              </Button>
              <Button
                component={RouterLink}
                to="/events/create"
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Create Event
              </Button>
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '1rem'
                }}>
                  {user?.name.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); logout(); navigate('/login'); }}>
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
