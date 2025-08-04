import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CanCreate, CanUpdate, CanDelete } from '../../components/Auth/PermissionGuard';

export default function WarehousesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Warehouses Management
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Warehouse Locations
        </Typography>
        <Typography variant="body1">
          Manage warehouse locations and their capacities.
        </Typography>
      </Paper>

      <CanCreate resource="warehouses">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom>
            Add New Warehouse
          </Typography>
          <Typography variant="body2">
            You have permission to create new warehouses.
          </Typography>
        </Paper>
      </CanCreate>

      <CanUpdate resource="warehouses">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
          <Typography variant="h6" gutterBottom>
            Edit Warehouses
          </Typography>
          <Typography variant="body2">
            You have permission to update warehouse information.
          </Typography>
        </Paper>
      </CanUpdate>

      <CanDelete resource="warehouses">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee' }}>
          <Typography variant="h6" gutterBottom>
            Delete Warehouses
          </Typography>
          <Typography variant="body2">
            You have permission to delete warehouses.
          </Typography>
        </Paper>
      </CanDelete>
    </Box>
  );
} 