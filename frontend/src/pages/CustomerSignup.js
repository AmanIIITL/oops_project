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

const CustomerSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateMobile = (value) => {
    return /^[0-9]{10}$/.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate inputs
    if (!validateMobile(mobile)) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.register(mobile, password);
      
      if (response.success) {
        // Save token and redirect to dashboard
        login(response.data.accessToken);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Failed to create account');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Mobile number already registered or server error');
      console.error('Signup error:', err);
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
              Customer Sign Up
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
                    error={mobile !== '' && !validateMobile(mobile)}
                    helperText={
                      mobile !== '' && !validateMobile(mobile)
                        ? 'Mobile number must be exactly 10 digits'
                        : ''
                    }
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={password !== '' && !validatePassword(password)}
                    helperText={
                      password !== '' && !validatePassword(password)
                        ? 'Password must be at least 6 characters'
                        : ''
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={
                      confirmPassword !== '' && password !== confirmPassword
                    }
                    helperText={
                      confirmPassword !== '' && password !== confirmPassword
                        ? 'Passwords do not match'
                        : ''
                    }
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
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
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

export default CustomerSignup; 