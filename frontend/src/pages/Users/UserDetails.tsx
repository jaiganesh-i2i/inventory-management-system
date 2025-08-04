import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  AdminPanelSettings,
  SupervisorAccount,
  CheckCircle,
  Block,
  CalendarToday,
  Security,
} from '@mui/icons-material';
import type { User } from '../../types';

interface UserDetailsProps {
  user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings color="error" />;
      case 'manager':
        return <SupervisorAccount color="primary" />;
      default:
        return <Person color="action" />;
    }
  };

  const getRoleChip = (role: string) => {
    const color = role === 'admin' ? 'error' : role === 'manager' ? 'primary' : 'default';
    return (
      <Chip
        icon={getRoleIcon(role)}
        label={role.charAt(0).toUpperCase() + role.slice(1)}
        color={color}
        size="medium"
      />
    );
  };

  const getStatusChip = (isActive: boolean) => (
    <Chip
      icon={isActive ? <CheckCircle /> : <Block />}
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      size="medium"
    />
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access with user management capabilities';
      case 'manager':
        return 'Inventory and warehouse management with limited user access';
      default:
        return 'Basic access to view inventory and create transactions';
    }
  };

  const getPermissions = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          'Full system access',
          'User management',
          'System configuration',
          'All inventory operations',
          'Analytics and reporting',
          'Security settings'
        ];
      case 'manager':
        return [
          'Inventory management',
          'Warehouse operations',
          'Transaction management',
          'Basic reporting',
          'Product management',
          'Limited user access'
        ];
      default:
        return [
          'View inventory',
          'Create transactions',
          'View basic reports',
          'Update own profile',
          'View products'
        ];
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* User Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
            {getInitials(user.username)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {user.email}
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              {getRoleChip(user.role)}
              {getStatusChip(user.is_active)}
            </Box>
          </Box>
        </Box>

        <Typography variant="body1" color="textSecondary">
          {getRoleDescription(user.role)}
        </Typography>
      </Paper>

      {/* User Details Grid */}
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Person color="primary" />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Username
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {user.username}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Email Address
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Email fontSize="small" color="action" />
                <Typography variant="body1">{user.email}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                User ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {user.id}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Account Status
              </Typography>
              {getStatusChip(user.is_active)}
            </Box>
          </Paper>
        </Grid>

        {/* Role & Permissions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Security color="primary" />
              <Typography variant="h6">Role & Permissions</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Role
              </Typography>
              {getRoleChip(user.role)}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Role Description
              </Typography>
              <Typography variant="body1">
                {getRoleDescription(user.role)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Permissions
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {getPermissions(user.role).map((permission, index) => (
                  <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                    {permission}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Timestamps */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CalendarToday color="primary" />
              <Typography variant="h6">Account Information</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Created
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.created_at)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.updated_at)}
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