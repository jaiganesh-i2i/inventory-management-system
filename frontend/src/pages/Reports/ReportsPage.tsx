import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CanRead } from '../../components/Auth/PermissionGuard';

export default function ReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Inventory Reports
        </Typography>
        <Typography variant="body1">
          View detailed reports and analytics for your inventory.
        </Typography>
      </Paper>

      <CanRead resource="reports">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e8' }}>
          <Typography variant="h6" gutterBottom>
            Available Reports
          </Typography>
          <Typography variant="body2">
            You have permission to view reports and analytics.
          </Typography>
        </Paper>
      </CanRead>
    </Box>
  );
} 