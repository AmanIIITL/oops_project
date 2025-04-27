import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import Layout from '../components/Layout';

const Landing = () => {
  return (
    <Layout>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Smart Vending Machine
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Get your favorite snacks, drinks, and meals at the click of a button.
            Our smart vending machine provides a convenient way to grab what you need,
            when you need it.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Sign Up
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  size="large"
                >
                  Customer Login
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/admin/login"
                  variant="outlined"
                  color="secondary"
                  size="large"
                >
                  Admin Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Wide Selection
                </Typography>
                <Typography>
                  Explore our wide range of items including juices, cold drinks, pizzas, 
                  burgers, and snacks.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Easy Payment
                </Typography>
                <Typography>
                  Top up your wallet and pay seamlessly for your purchases. No need for 
                  cash or cards.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Transaction History
                </Typography>
                <Typography>
                  Keep track of all your purchases with detailed transaction history and 
                  downloadable receipts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Landing; 