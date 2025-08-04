import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Inventory,
  Warehouse,
  Category,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Block,
  Info,
} from '@mui/icons-material';
import type { InventoryWithDetails } from '../../types';

interface InventoryDetailsProps {
  inventory: InventoryWithDetails;
}

export default function InventoryDetails({ inventory }: InventoryDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStockLevelChip = (quantity: number, minThreshold: number) => {
    if (quantity === 0) {
      return <Chip icon={<Block />} label="Out of Stock" color="error" size="medium" />;
    } else if (quantity <= minThreshold) {
      return <Chip icon={<Warning />} label="Low Stock" color="warning" size="medium" />;
    } else {
      return <Chip icon={<CheckCircle />} label="In Stock" color="success" size="medium" />;
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

  const calculateInventoryValue = () => {
    return inventory.quantity * inventory.product.price;
  };

  const calculateAvailableStock = () => {
    return inventory.quantity - inventory.reserved_quantity;
  };

  const getStockUtilization = () => {
    if (!inventory.max_threshold || inventory.max_threshold === 0) return 0;
    return (inventory.quantity / inventory.max_threshold) * 100;
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Inventory Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Inventory color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {inventory.product.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              SKU: {inventory.product.sku} | Warehouse: {inventory.warehouse.name}
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              {getStockLevelChip(inventory.quantity, inventory.min_threshold)}
            </Box>
          </Box>
        </Box>

        {/* Stock Level Progress Bar */}
        {inventory.max_threshold && (
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="textSecondary">
                Stock Level: {inventory.quantity} / {inventory.max_threshold}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {getStockUtilization().toFixed(1)}% utilized
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getStockLevelPercentage(inventory.quantity, inventory.max_threshold)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStockLevelColor(inventory.quantity, inventory.min_threshold),
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Inventory Details Grid */}
      <Grid container spacing={3}>
        {/* Stock Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Inventory color="primary" />
              <Typography variant="h6">Stock Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Current Quantity
              </Typography>
              <Typography variant="h4" color="primary">
                {inventory.quantity}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Reserved Quantity
              </Typography>
              <Typography variant="h6" color="warning.main">
                {inventory.reserved_quantity}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Available Stock
              </Typography>
              <Typography variant="h6" color="success.main">
                {calculateAvailableStock()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Minimum Threshold
              </Typography>
              <Typography variant="body1">
                {inventory.min_threshold}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Maximum Threshold
              </Typography>
              <Typography variant="body1">
                {inventory.max_threshold || 'Not set'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Financial Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AttachMoney color="primary" />
              <Typography variant="h6">Financial Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Unit Price
              </Typography>
              <Typography variant="h6" color="primary">
                ${inventory.product.price.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Unit Cost
              </Typography>
              <Typography variant="h6" color="error">
                ${inventory.product.cost.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Total Inventory Value
              </Typography>
              <Typography variant="h6" color="success.main">
                ${calculateInventoryValue().toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Profit Margin per Unit
              </Typography>
              <Typography variant="body1" color="success.main">
                ${(inventory.product.price - inventory.product.cost).toFixed(2)} 
                <Typography component="span" variant="body2" color="textSecondary">
                  {' '}({((inventory.product.price - inventory.product.cost) / inventory.product.price * 100).toFixed(1)}%)
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Info color="primary" />
              <Typography variant="h6">Product Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Product Name
              </Typography>
              <Typography variant="body1">
                {inventory.product.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                SKU
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {inventory.product.sku}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Category
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Category fontSize="small" color="action" />
                <Typography variant="body1">
                  {inventory.product.category?.name || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Product Status
              </Typography>
              <Chip
                label={inventory.product.is_active ? 'Active' : 'Inactive'}
                color={inventory.product.is_active ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {inventory.product.description && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {inventory.product.description}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Warehouse Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Warehouse color="primary" />
              <Typography variant="h6">Warehouse Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Warehouse Name
              </Typography>
              <Typography variant="body1">
                {inventory.warehouse.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Location
              </Typography>
              <Typography variant="body1">
                {inventory.warehouse.location || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Warehouse ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {inventory.warehouse_id}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Warehouse Status
              </Typography>
              <Chip
                label={inventory.warehouse.is_active ? 'Active' : 'Inactive'}
                color={inventory.warehouse.is_active ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Timestamps */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingUp color="primary" />
              <Typography variant="h6">Inventory History</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(inventory.created_at)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(inventory.updated_at)}
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