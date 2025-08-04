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
  Inventory,
  Category,
  AttachMoney,
  ShoppingCart,
  Info,
} from '@mui/icons-material';
import type { Product } from '../../types';

interface ProductDetailsProps {
  product: Product;
  categoryName: string;
}

export default function ProductDetails({ product, categoryName }: ProductDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusChip = (isActive: boolean) => (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      size="small"
    />
  );

  return (
    <Box sx={{ mt: 1 }}>
      {/* Product Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Inventory color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              SKU: {product.sku}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            {getStatusChip(product.is_active)}
          </Box>
        </Box>

        {product.description && (
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
        )}
      </Paper>

      {/* Product Details Grid */}
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Info color="primary" />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Product Name
              </Typography>
              <Typography variant="body1">{product.name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                SKU
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {product.sku}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Category
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Category fontSize="small" color="action" />
                <Typography variant="body1">{categoryName}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              {getStatusChip(product.is_active)}
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
                Selling Price
              </Typography>
              <Typography variant="h6" color="primary">
                ${product.price.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Cost Price
              </Typography>
              <Typography variant="h6" color="error">
                ${product.cost.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Profit Margin
              </Typography>
              <Typography variant="h6" color="success.main">
                ${(product.price - product.cost).toFixed(2)} 
                <Typography component="span" variant="body2" color="textSecondary">
                  {' '}({((product.price - product.cost) / product.price * 100).toFixed(1)}%)
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Timestamps */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ShoppingCart color="primary" />
              <Typography variant="h6">Timestamps</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(product.created_at)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(product.updated_at)}
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