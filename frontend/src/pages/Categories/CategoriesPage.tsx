import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CanCreate, CanUpdate, CanDelete } from '../../components/Auth/PermissionGuard';

export default function CategoriesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Categories Management
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Product Categories
        </Typography>
        <Typography variant="body1">
          Manage product categories and subcategories.
        </Typography>
      </Paper>

      <CanCreate resource="categories">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom>
            Create New Category
          </Typography>
          <Typography variant="body2">
            You have permission to create new categories.
          </Typography>
        </Paper>
      </CanCreate>

      <CanUpdate resource="categories">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
          <Typography variant="h6" gutterBottom>
            Edit Categories
          </Typography>
          <Typography variant="body2">
            You have permission to update category information.
          </Typography>
        </Paper>
      </CanUpdate>

      <CanDelete resource="categories">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee' }}>
          <Typography variant="h6" gutterBottom>
            Delete Categories
          </Typography>
          <Typography variant="body2">
            You have permission to delete categories.
          </Typography>
        </Paper>
      </CanDelete>
    </Box>
  );
} 