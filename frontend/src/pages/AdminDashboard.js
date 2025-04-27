import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Paper, Grid, Typography, Button, Divider, TextField,
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  History as HistoryIcon,
  People as UsersIcon,
  Edit as EditIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

// Inventory Management Component
const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get('/api/admin/inventory');
        setInventory(response.data.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventory();
  }, []);
  
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditedPrice(item.price.toString());
    setEditedQuantity(item.quantity.toString());
    setEditDialogOpen(true);
  };
  
  const handleEditClose = () => {
    setEditDialogOpen(false);
    setCurrentItem(null);
  };
  
  const handleSaveChanges = async () => {
    if (!currentItem || isNaN(editedPrice) || isNaN(editedQuantity)) {
      return;
    }
    
    try {
      const updatedItem = {
        ...currentItem,
        price: parseFloat(editedPrice),
        quantity: parseInt(editedQuantity)
      };
      
      await api.put('/api/admin/inventory', updatedItem);
      
      // Update the local state
      setInventory(inventory.map(item => 
        item.id === currentItem.id ? updatedItem : item
      ));
      
      handleEditClose();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      
      {loading ? (
        <Typography>Loading inventory...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price ($)</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary"
                      onClick={() => handleEditClick(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6">{currentItem?.name}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Category: {currentItem?.category}
            </Typography>
            
            <TextField
              label="Price"
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />
            
            <TextField
              label="Quantity"
              type="number"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button 
            onClick={handleSaveChanges}
            variant="contained"
            disabled={!editedPrice || !editedQuantity || isNaN(editedPrice) || isNaN(editedQuantity)}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Transactions Component
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const response = await api.get('/api/admin/transactions');
        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllTransactions();
  }, []);
  
  const handleViewDetails = async (transactionId) => {
    try {
      const response = await api.get(`/api/admin/transactions/${transactionId}`);
      setSelectedTransaction(response.data.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };
  
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedTransaction(null);
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Transactions
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
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.userId}</TableCell>
                  <TableCell>{new Date(transaction.transactionDate).toLocaleString()}</TableCell>
                  <TableCell align="right">${transaction.totalAmount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleViewDetails(transaction.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Transaction Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ p: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Transaction ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedTransaction.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">User ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedTransaction.userId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Date</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {new Date(selectedTransaction.transactionDate).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Total Amount</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>${selectedTransaction.totalAmount.toFixed(2)}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Purchased Items</Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTransaction.items && selectedTransaction.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">${item.pricePerUnit.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${(item.pricePerUnit * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Customers Component
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/api/admin/customers');
        setCustomers(response.data.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Accounts
      </Typography>
      
      {loading ? (
        <Typography>Loading customers...</Typography>
      ) : customers.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No customers found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell align="right">Wallet Balance</TableCell>
                <TableCell align="center">Total Transactions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.mobileNumber}</TableCell>
                  <TableCell align="right">${customer.walletBalance.toFixed(2)}</TableCell>
                  <TableCell align="center">{customer.transactionCount}</TableCell>
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
const AdminDashboard = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'ROLE_ADMIN') {
      navigate('/admin/login');
    }
  }, [authState, navigate]);
  
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">Admin Dashboard</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Admin: {authState.user?.username}
                </Typography>
                <IconButton>
                  <PersonIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/admin/dashboard"
                    fullWidth
                    startIcon={<InventoryIcon />}
                  >
                    Inventory
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/admin/dashboard/transactions"
                    fullWidth
                    startIcon={<HistoryIcon />}
                  >
                    Transactions
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/admin/dashboard/customers"
                    fullWidth
                    startIcon={<UsersIcon />}
                  >
                    Customers
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Routes>
              <Route path="/" element={<Inventory />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/customers" element={<Customers />} />
            </Routes>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AdminDashboard; 