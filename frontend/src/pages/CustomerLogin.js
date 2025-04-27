import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Link,
  Alert,
} from '@mui/material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    if (!mobile || !password) {
      setError('Please enter both mobile number and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.login(mobile, password);
      
      if (response.success) {
        // Save token and redirect to dashboard
        login(response.data.accessToken);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or server error');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
              Customer Login
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="mobile"
                    label="Mobile Number"
                    name="mobile"
                    autoComplete="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    Don't have an account? Sign up
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/admin/login" variant="body2">
                    Admin Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CustomerLogin; 