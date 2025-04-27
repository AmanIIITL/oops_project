import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Paper, Grid, Typography, Button, Divider, List, ListItem, 
  ListItemText, Card, CardContent, CardActions, CardMedia, Chip, TextField,
  IconButton, Badge, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab
} from '@mui/material';
import { 
  ShoppingCart as CartIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Layout from '../components/Layout';

// Products Component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/items');
        setProducts(response.data.data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(response.data.data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map(category => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Box>
      
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random/300x200?${product.name.replace(' ', '+')}`}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>
                  Price: ${product.price.toFixed(2)}
                </Typography>
                <Chip 
                  label={`In stock: ${product.quantity}`} 
                  color={product.quantity > 0 ? "success" : "error"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<AddIcon />}
                  disabled={product.quantity <= 0}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Cart Component
const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();
  
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      
      {cart.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">Your cart is empty</Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/dashboard" 
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton 
                          size="small"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton 
                          size="small"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${totalAmount.toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/dashboard" 
              startIcon={<BackIcon />}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/dashboard/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

// Wallet Component
const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [topupAmount, setTopupAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await api.get('/api/customers/wallet');
        setWalletBalance(response.data.data);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
    
    fetchWalletBalance();
  }, []);
  
  const handleTopup = async () => {
    if (!topupAmount || isNaN(topupAmount) || Number(topupAmount) <= 0) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/api/customers/wallet/topup', {
        amount: Number(topupAmount)
      });
      setWalletBalance(response.data.data);
      setTopupAmount('');
    } catch (error) {
      console.error('Error adding funds to wallet:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wallet
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Current Balance</Typography>
        <Typography variant="h2" sx={{ color: 'primary.main', my: 2 }}>
          ${walletBalance.toFixed(2)}
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Add Funds</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
          <TextField
            label="Amount"
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
            sx={{ mr: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleTopup}
            disabled={!topupAmount || isNaN(topupAmount) || Number(topupAmount) <= 0 || loading}
          >
            Add Funds
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// Checkout Component
const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await api.get('/api/customers/wallet');
        setWalletBalance(response.data.data);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
    
    fetchWalletBalance();
  }, []);
  
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setProcessing(true);
    try {
      const items = cart.map(item => ({
        itemId: item.id,
        quantity: item.quantity
      }));
      
      await api.post('/api/customers/checkout', { items });
      clearCart();
      navigate('/dashboard/transactions');
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Checkout</Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">Your cart is empty</Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/dashboard" 
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <List>
              {cart.map(item => (
                <ListItem key={item.id}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`${item.quantity} x $${item.price.toFixed(2)}`} 
                  />
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="h6">${totalAmount.toFixed(2)}</Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Payment</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">Wallet Balance</Typography>
              <Typography variant="h6">${walletBalance.toFixed(2)}</Typography>
            </Box>
            
            {walletBalance < totalAmount ? (
              <>
                <Typography color="error" sx={{ mb: 2 }}>
                  Insufficient balance. Please add more funds to your wallet.
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/dashboard/wallet"
                  fullWidth
                >
                  Add Funds
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                disabled={processing}
                onClick={handleCheckout}
              >
                Complete Purchase
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Transactions Component
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/customers/transactions');
        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleDownloadReceipt = async (transactionId) => {
    try {
      const response = await api.get(`/api/customers/receipts/${transactionId}/pdf`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      
      {loading ? (
        <Typography>Loading transactions...</Typography>
      ) : transactions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No transactions found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{new Date(transaction.transactionDate).toLocaleString()}</TableCell>
                  <TableCell align="right">${transaction.totalAmount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary"
                      onClick={() => handleDownloadReceipt(transaction.id)}
                    >
                      <ReceiptIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

// Main Dashboard Component
const CustomerDashboard = () => {
  const { authState, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'ROLE_CUSTOMER') {
      navigate('/login');
    }
  }, [authState, navigate]);
  
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">Customer Dashboard</Typography>
              <Box>
                <IconButton component={Link} to="/dashboard/wallet" color="primary" sx={{ mr: 1 }}>
                  <WalletIcon />
                </IconButton>
                <IconButton component={Link} to="/dashboard/cart">
                  <Badge badgeContent={cart.length} color="error">
                    <CartIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Box>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/dashboard"
                    fullWidth
                    startIcon={<CartIcon />}
                  >
                    Shop
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/dashboard/wallet"
                    fullWidth
                    startIcon={<WalletIcon />}
                  >
                    My Wallet
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/dashboard/transactions"
                    fullWidth
                    startIcon={<HistoryIcon />}
                  >
                    Transactions
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CustomerDashboard;