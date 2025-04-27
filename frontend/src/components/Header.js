import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ShoppingCart,
  Dashboard,
  Logout,
  Person,
  RestaurantMenu,
  Receipt,
  Wallet,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isCustomer, isAuthenticated } = useAuth();
  const { cart } = useCart();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Smart Vending Machine
            </RouterLink>
          </Typography>

          {isAuthenticated ? (
            <>
              {isCustomer && (
                <IconButton
                  color="inherit"
                  aria-label="cart"
                  onClick={() => navigate('/dashboard/cart')}
                >
                  <Badge badgeContent={cart?.items?.length || 0} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              )}
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Customer Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signup"
              >
                Signup
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/admin/login"
              >
                Admin
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <Typography variant="h6" component="div">
                {isAdmin ? 'Admin Menu' : 'Menu'}
              </Typography>
            </ListItem>
            <Divider />
            
            {isCustomer && (
              <>
                <ListItem button component={RouterLink} to="/dashboard">
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={RouterLink} to="/dashboard/wallet">
                  <ListItemIcon>
                    <Wallet />
                  </ListItemIcon>
                  <ListItemText primary="Wallet" />
                </ListItem>
                <ListItem button component={RouterLink} to="/dashboard/items">
                  <ListItemIcon>
                    <RestaurantMenu />
                  </ListItemIcon>
                  <ListItemText primary="Shop Items" />
                </ListItem>
                <ListItem button component={RouterLink} to="/dashboard/cart">
                  <ListItemIcon>
                    <ShoppingCart />
                  </ListItemIcon>
                  <ListItemText primary="Cart" />
                </ListItem>
                <ListItem button component={RouterLink} to="/dashboard/transactions">
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText primary="Transactions" />
                </ListItem>
              </>
            )}
            
            {isAdmin && (
              <>
                <ListItem button component={RouterLink} to="/admin/dashboard">
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={RouterLink} to="/admin/dashboard/inventory">
                  <ListItemIcon>
                    <RestaurantMenu />
                  </ListItemIcon>
                  <ListItemText primary="Inventory" />
                </ListItem>
                <ListItem button component={RouterLink} to="/admin/dashboard/transactions">
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText primary="Transactions" />
                </ListItem>
              </>
            )}
            
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header; 