import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Add,
  Remove,
  Person,
  Inventory,
  Warehouse,
  CalendarToday,
  Receipt,
} from '@mui/icons-material';
import type { Transaction } from '../../types';

interface TransactionDetailsProps {
  transaction: Transaction;
}

export default function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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
        size="medium"
      />
    );
  };

  const getTransactionDescription = (type: string) => {
    switch (type) {
      case 'IN':
        return 'Stock received into inventory';
      case 'OUT':
        return 'Stock removed from inventory';
      case 'ADJUSTMENT':
        return 'Inventory level adjustment';
      case 'TRANSFER':
        return 'Stock transferred between locations';
      default:
        return 'Inventory transaction';
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Transaction Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Receipt color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Transaction #{transaction.id}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {getTransactionDescription(transaction.type)}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            {getTransactionTypeChip(transaction.type)}
          </Box>
        </Box>

        {transaction.notes && (
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {transaction.notes}
          </Typography>
        )}
      </Paper>

      {/* Transaction Details Grid */}
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Receipt color="primary" />
              <Typography variant="h6">Transaction Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Transaction ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {transaction.id}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Type
              </Typography>
              {getTransactionTypeChip(transaction.type)}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Quantity
              </Typography>
              <Typography 
                variant="h6" 
                color={transaction.type === 'IN' ? 'success.main' : transaction.type === 'OUT' ? 'error.main' : 'text.primary'}
              >
                {transaction.type === 'OUT' ? '-' : '+'}{Math.abs(transaction.quantity)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Reference Number
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {transaction.reference_number || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Inventory color="primary" />
              <Typography variant="h6">Product Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Product Name
              </Typography>
              <Typography variant="body1">
                {transaction.product?.name || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                SKU
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {transaction.product?.sku || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Category
              </Typography>
              <Typography variant="body1">
                {transaction.product?.category?.name || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Unit Price
              </Typography>
              <Typography variant="body1">
                ${transaction.product?.price?.toFixed(2) || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Location Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Warehouse color="primary" />
              <Typography variant="h6">Location Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Warehouse
              </Typography>
              <Typography variant="body1">
                {transaction.warehouse?.name || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Location
              </Typography>
              <Typography variant="body1">
                {transaction.warehouse?.location || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Warehouse ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {transaction.warehouse_id}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Person color="primary" />
              <Typography variant="h6">User Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Created By
              </Typography>
              <Typography variant="body1">
                {transaction.user?.username || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                User Email
              </Typography>
              <Typography variant="body1">
                {transaction.user?.email || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                User Role
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {transaction.user?.role || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Timestamps */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CalendarToday color="primary" />
              <Typography variant="h6">Timestamps</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(transaction.created_at)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(transaction.updated_at)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 