import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import {
  Add,
  Remove,
  TrendingUp,
  SwapHoriz,
  Inventory,
  Warehouse,
  Receipt,
} from '@mui/icons-material';
import type { InventoryWithDetails, CreateTransactionInput } from '../../types';
import apiService from '../../services/api';

interface InventoryTransactionFormProps {
  inventory?: InventoryWithDetails;
  onSubmit: (data: CreateTransactionInput) => Promise<void>;
  onCancel: () => void;
}

export default function InventoryTransactionForm({ inventory, onSubmit, onCancel }: InventoryTransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'IN',
    quantity: '',
    reference_number: '',
    notes: '',
    inventory_id: inventory?.id || '',
    warehouse_id: inventory?.warehouse_id || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (inventory) {
      setFormData(prev => ({
        ...prev,
        inventory_id: inventory.id,
        warehouse_id: inventory.warehouse_id,
      }));
    }
  }, [inventory]);

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts({ limit: 100 });
      if (response.success && response.data) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await apiService.getWarehouses({ limit: 100 });
      if (response.success && response.data) {
        setWarehouses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Transaction type is required';
    }

    // Quantity validation
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else {
      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.quantity = 'Quantity must be a positive number';
      }
    }

    // Inventory validation
    if (!formData.inventory_id) {
      newErrors.inventory_id = 'Inventory item is required';
    }

    // Warehouse validation
    if (!formData.warehouse_id) {
      newErrors.warehouse_id = 'Warehouse is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const submitData: CreateTransactionInput = {
        type: formData.type as any,
        quantity: parseFloat(formData.quantity),
        reference_number: formData.reference_number || undefined,
        notes: formData.notes || undefined,
        inventory_id: parseInt(formData.inventory_id),
        warehouse_id: parseInt(formData.warehouse_id),
      };

      await onSubmit(submitData);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
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
        return <Add color="action" />;
    }
  };

  const getTransactionTypeDescription = (type: string) => {
    switch (type) {
      case 'IN':
        return 'Add stock to inventory';
      case 'OUT':
        return 'Remove stock from inventory';
      case 'ADJUSTMENT':
        return 'Adjust inventory levels';
      case 'TRANSFER':
        return 'Transfer between locations';
      default:
        return 'Select transaction type';
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.type} required>
            <InputLabel>Transaction Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Transaction Type"
              onChange={handleSelectChange}
              startAdornment={
                <InputAdornment position="start">
                  {getTransactionTypeIcon(formData.type)}
                </InputAdornment>
              }
            >
              <MenuItem value="IN">
                <Box display="flex" alignItems="center" gap={1}>
                  <Add color="success" />
                  <Typography>In</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="OUT">
                <Box display="flex" alignItems="center" gap={1}>
                  <Remove color="error" />
                  <Typography>Out</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="ADJUSTMENT">
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp color="warning" />
                  <Typography>Adjustment</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="TRANSFER">
                <Box display="flex" alignItems="center" gap={1}>
                  <SwapHoriz color="info" />
                  <Typography>Transfer</Typography>
                </Box>
              </MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            <FormHelperText>
              {getTransactionTypeDescription(formData.type)}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            error={!!errors.quantity}
            helperText={errors.quantity || 'Enter the quantity to process'}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Inventory />
                </InputAdornment>
              ),
            }}
            placeholder="0"
          />
        </Grid>

        {!inventory && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.inventory_id} required>
              <InputLabel>Inventory Item</InputLabel>
              <Select
                name="inventory_id"
                value={formData.inventory_id}
                label="Inventory Item"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Inventory />
                  </InputAdornment>
                }
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </MenuItem>
                ))}
              </Select>
              {errors.inventory_id && <FormHelperText>{errors.inventory_id}</FormHelperText>}
            </FormControl>
          </Grid>
        )}

        {!inventory && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.warehouse_id} required>
              <InputLabel>Warehouse</InputLabel>
              <Select
                name="warehouse_id"
                value={formData.warehouse_id}
                label="Warehouse"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Warehouse />
                  </InputAdornment>
                }
              >
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.warehouse_id && <FormHelperText>{errors.warehouse_id}</FormHelperText>}
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Reference Number"
            name="reference_number"
            value={formData.reference_number}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Receipt />
                </InputAdornment>
              ),
            }}
            placeholder="PO-12345, Invoice-67890, etc."
            helperText="Optional reference number for tracking"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            multiline
            rows={3}
            placeholder="Add any additional notes about this transaction..."
            helperText="Optional notes for this transaction"
          />
        </Grid>
      </Grid>

      {/* Current Inventory Info (if inventory is provided) */}
      {inventory && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Inventory Information:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                Product: {inventory.product.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                Current Stock: {inventory.quantity}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                Warehouse: {inventory.warehouse.name}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creating...' : 'Create Transaction'}
        </Button>
      </Box>
    </Box>
  );
} 