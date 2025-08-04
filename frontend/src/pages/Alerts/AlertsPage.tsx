import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CanRead, CanUpdate } from '../../components/Auth/PermissionGuard';

export default function AlertsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Alerts & Notifications
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          System Alerts
        </Typography>
        <Typography variant="body1">
          View and manage system alerts and notifications.
        </Typography>
      </Paper>

      <CanRead resource="alerts">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
          <Typography variant="h6" gutterBottom>
            Low Stock Alerts
          </Typography>
          <Typography variant="body2">
            You have permission to view alerts and notifications.
          </Typography>
        </Paper>
      </CanRead>

      <CanUpdate resource="alerts">
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom>
            Manage Alerts
          </Typography>
          <Typography variant="body2">
            You have permission to update and acknowledge alerts.
          </Typography>
        </Paper>
      </CanUpdate>
    </Box>
  );
} 