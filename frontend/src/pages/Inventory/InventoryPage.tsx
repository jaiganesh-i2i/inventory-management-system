import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  TrendingUp,
  TrendingDown,
  Warning,
  Inventory,
  Warehouse,
  Search as SearchIcon,
  FilterList,
} from '@mui/icons-material';
import type { InventoryWithDetails, Warehouse as WarehouseType } from '../../types';
import apiService from '../../services/api';
import InventoryTransactionForm from './InventoryTransactionForm';
import InventoryDetails from './InventoryDetails';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryWithDetails[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<number | ''>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  // Dialog states
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryWithDetails | null>(null);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    averageStockLevel: 0,
  });

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [page, rowsPerPage, searchTerm, warehouseFilter, stockFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (warehouseFilter !== '') {
        params.warehouse_id = warehouseFilter;
      }

      if (stockFilter !== 'all') {
        params.stock_level = stockFilter;
      }

      const response = await apiService.getInventory(params);
      
      if (response.success && response.data) {
        setInventory(response.data);
        calculateSummaryStats(response.data);
      } else {
        setError(response.error || 'Failed to load inventory');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await apiService.getWarehouses({ limit: 100 });
      if (response.success && response.data) {
        setWarehouses(response.data);
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  };

  const calculateSummaryStats = (inventoryData: InventoryWithDetails[]) => {
    const totalItems = inventoryData.length;
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    const lowStockItems = inventoryData.filter(item => item.quantity <= item.min_threshold).length;
    const outOfStockItems = inventoryData.filter(item => item.quantity === 0).length;
    const averageStockLevel = totalItems > 0 ? inventoryData.reduce((sum, item) => sum + item.quantity, 0) / totalItems : 0;

    setSummaryStats({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      averageStockLevel,
    });
  };

  const handleTransaction = async (transactionData: any) => {
    try {
      const response = await apiService.createTransaction(transactionData);
      if (response.success) {
        setOpenTransactionDialog(false);
        fetchInventory();
      } else {
        setError(response.error || 'Failed to create transaction');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction');
    }
  };

  const handleViewInventory = (inventoryItem: InventoryWithDetails) => {
    setSelectedInventory(inventoryItem);
    setOpenDetailsDialog(true);
  };

  const getStockLevelChip = (quantity: number, minThreshold: number) => {
    if (quantity === 0) {
      return <Chip label="Out of Stock" color="error" size="small" />;
    } else if (quantity <= minThreshold) {
      return <Chip label="Low Stock" color="warning" size="small" />;
    } else {
      return <Chip label="In Stock" color="success" size="small" />;
    }
  };

  const getStockLevelColor = (quantity: number, minThreshold: number) => {
    if (quantity === 0) return '#f44336';
    if (quantity <= minThreshold) return '#ff9800';
    return '#4caf50';
  };

  const getStockLevelPercentage = (quantity: number, maxThreshold?: number) => {
    if (!maxThreshold || maxThreshold === 0) return 0;
    return Math.min((quantity / maxThreshold) * 100, 100);
  };

  if (loading && inventory.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventory Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenTransactionDialog(true)}
        >
          Add Transaction
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Items
                  </Typography>
                  <Typography variant="h4">{summaryStats.totalItems}</Typography>
                </Box>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Value
                  </Typography>
                  <Typography variant="h4">${summaryStats.totalValue.toLocaleString()}</Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Low Stock
                  </Typography>
                  <Typography variant="h4" color="warning.main">{summaryStats.lowStockItems}</Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" color="error.main">{summaryStats.outOfStockItems}</Typography>
                </Box>
                <TrendingDown color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg Stock
                  </Typography>
                  <Typography variant="h4">{Math.round(summaryStats.averageStockLevel)}</Typography>
                </Box>
                <Warehouse color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={warehouseFilter}
              label="Warehouse"
              onChange={(e) => setWarehouseFilter(e.target.value as number | '')}
            >
              <MenuItem value="">All Warehouses</MenuItem>
                              {(warehouses || []).map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Stock Level</InputLabel>
            <Select
              value={stockFilter}
              label="Stock Level"
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="out">Out of Stock</MenuItem>
              <MenuItem value="healthy">Healthy</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Inventory Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Reserved</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(inventory || []).map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{item.product.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        SKU: {item.product.sku}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.warehouse.name}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{item.quantity}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="warning.main">
                      {item.reserved_quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="success.main">
                      {item.quantity - item.reserved_quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {getStockLevelChip(item.quantity, item.min_threshold)}
                      {item.max_threshold && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={getStockLevelPercentage(item.quantity, item.max_threshold)}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getStockLevelColor(item.quantity, item.min_threshold),
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewInventory(item)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedInventory(item);
                        setOpenTransactionDialog(true);
                      }}
                      title="Add Transaction"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Transaction Dialog */}
      <Dialog
        open={openTransactionDialog}
        onClose={() => setOpenTransactionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedInventory ? 'Add Transaction' : 'New Transaction'}
        </DialogTitle>
        <DialogContent>
          <InventoryTransactionForm
            inventory={selectedInventory}
            onSubmit={handleTransaction}
            onCancel={() => setOpenTransactionDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Inventory Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Inventory Details</DialogTitle>
        <DialogContent>
          {selectedInventory && (
            <InventoryDetails
              inventory={selectedInventory}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add transaction"
        sx={{ position: 'fixed', bottom: 16, right: 16, display: { sm: 'none' } }}
        onClick={() => setOpenTransactionDialog(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
} 