import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
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
  Grid,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Add,
  Remove,
  FilterList,
  DateRange,
} from '@mui/icons-material';
import type { Transaction } from '../../types';
import apiService from '../../services/api';
import TransactionDetails from './TransactionDetails';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<number | ''>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Dialog states
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalTransactions: 0,
    totalIn: 0,
    totalOut: 0,
    totalAdjustments: 0,
    totalTransfers: 0,
    averageQuantity: 0,
  });

  // Pagination
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, searchTerm, typeFilter, warehouseFilter, dateFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      if (warehouseFilter !== '') {
        params.warehouse_id = warehouseFilter;
      }

      if (dateFilter !== 'all') {
        // Add date filtering logic here
        params.date_range = dateFilter;
      }

      const response = await apiService.getTransactions(params);
      
      if (response.success && response.data) {
        setTransactions(response.data.data || []);
        setTotalCount(response.data.total || 0);
        calculateSummaryStats(response.data.data || []);
      } else {
        setError(response.error || 'Failed to load transactions');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading transactions');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummaryStats = (transactionsData: Transaction[]) => {
    const totalTransactions = transactionsData.length;
    const totalIn = transactionsData.filter(t => t.type === 'IN').length;
    const totalOut = transactionsData.filter(t => t.type === 'OUT').length;
    const totalAdjustments = transactionsData.filter(t => t.type === 'ADJUSTMENT').length;
    const totalTransfers = transactionsData.filter(t => t.type === 'TRANSFER').length;
    const averageQuantity = totalTransactions > 0 
      ? transactionsData.reduce((sum, t) => sum + Math.abs(t.quantity), 0) / totalTransactions 
      : 0;

    setSummaryStats({
      totalTransactions,
      totalIn,
      totalOut,
      totalAdjustments,
      totalTransfers,
      averageQuantity,
    });
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenDetailsDialog(true);
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return <Add color="success" />;
      case 'OUT':
        return <Remove color="error" />;
      case 'ADJUSTMENT':
        return <TrendingUp color="warning" />;
      case 'TRANSFER':
        return <SwapHoriz color="info" />;
      default:
        return <TrendingDown color="action" />;
    }
  };

  const getTransactionTypeChip = (type: string) => {
    const color = type === 'IN' ? 'success' : type === 'OUT' ? 'error' : type === 'ADJUSTMENT' ? 'warning' : 'info';
    return (
      <Chip
        icon={getTransactionTypeIcon(type)}
        label={type}
        color={color}
        size="small"
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transaction History</Typography>
        <Button
          variant="outlined"
          startIcon={<DateRange />}
          onClick={() => {/* Add export functionality */}}
        >
          Export
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total
                  </Typography>
                  <Typography variant="h4">{summaryStats.totalTransactions}</Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    In
                  </Typography>
                  <Typography variant="h4" color="success.main">{summaryStats.totalIn}</Typography>
                </Box>
                <Add color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Out
                  </Typography>
                  <Typography variant="h4" color="error.main">{summaryStats.totalOut}</Typography>
                </Box>
                <Remove color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Adjustments
                  </Typography>
                  <Typography variant="h4" color="warning.main">{summaryStats.totalAdjustments}</Typography>
                </Box>
                <TrendingUp color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Transfers
                  </Typography>
                  <Typography variant="h4" color="info.main">{summaryStats.totalTransfers}</Typography>
                </Box>
                <SwapHoriz color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg Qty
                  </Typography>
                  <Typography variant="h4">{Math.round(summaryStats.averageQuantity)}</Typography>
                </Box>
                <TrendingDown color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Search transactions..."
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
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="IN">In</MenuItem>
              <MenuItem value="OUT">Out</MenuItem>
              <MenuItem value="ADJUSTMENT">Adjustment</MenuItem>
              <MenuItem value="TRANSFER">Transfer</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateFilter}
              label="Date Range"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Transactions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(transactions || []).map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    {getTransactionTypeChip(transaction.type)}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{transaction.product?.name || 'N/A'}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        SKU: {transaction.product?.sku || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.warehouse?.name || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      color={transaction.type === 'IN' ? 'success.main' : transaction.type === 'OUT' ? 'error.main' : 'text.primary'}
                    >
                      {transaction.type === 'OUT' ? '-' : '+'}{Math.abs(transaction.quantity)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.user?.username || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(transaction.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Transaction Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <TransactionDetails
              transaction={selectedTransaction}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 