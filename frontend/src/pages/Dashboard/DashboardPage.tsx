import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Inventory,
  Warehouse,
  AttachMoney,
  Warning,
  TrendingUp,
  People,
  Assessment,
  Notifications,
  Visibility,
  ShoppingCart,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DashboardOverview } from '../../types';
import apiService from '../../services/api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              ml: 1,
              minWidth: 40,
              height: 40,
            }}
          >
            {React.cloneElement(icon as React.ReactElement, { 
              sx: { fontSize: 24, color: 'white' } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDashboardOverview();
        
        if (response.success && response.data) {
          setOverview(response.data);
        } else {
          setError(response.error || 'Failed to load dashboard data');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!overview) {
    return (
      <Alert severity="info">
        No dashboard data available
      </Alert>
    );
  }

  // Sample data for charts (in real app, this would come from API)
  const monthlyData = [
    { name: 'Jan', products: 120, value: 45000, transactions: 85 },
    { name: 'Feb', products: 135, value: 52000, transactions: 92 },
    { name: 'Mar', products: 150, value: 58000, transactions: 105 },
    { name: 'Apr', products: 165, value: 62000, transactions: 118 },
    { name: 'May', products: 180, value: 68000, transactions: 125 },
    { name: 'Jun', products: 195, value: 72000, transactions: 135 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#8884d8' },
    { name: 'Clothing', value: 25, color: '#82ca9d' },
    { name: 'Books', value: 20, color: '#ffc658' },
    { name: 'Home & Garden', value: 15, color: '#ff7300' },
    { name: 'Sports', value: 5, color: '#00C49F' },
  ];

  const stockLevelData = [
    { name: 'In Stock', value: (overview.totalProducts || 0) - (overview.lowStockItems || 0) - (overview.outOfStockItems || 0), color: '#4caf50' },
    { name: 'Low Stock', value: overview.lowStockItems || 0, color: '#ff9800' },
    { name: 'Out of Stock', value: overview.outOfStockItems || 0, color: '#f44336' },
  ];

  return (
    <Box sx={{ 
      height: '100%', 
      minHeight: 'calc(100vh - 64px - 48px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          📊 Dashboard Overview
        </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={overview.totalProducts || 0}
            icon={<Inventory />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Warehouses"
            value={overview.totalWarehouses || 0}
            icon={<Warehouse />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`$${(overview.totalInventoryValue || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={overview.lowStockItems || 0}
            icon={<Warning />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📈 Monthly Trends
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="products" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  name="Products"
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Stock Levels Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📦 Stock Levels
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={stockLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats and Charts */}
      <Grid container spacing={3}>
        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🏷️ Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ⚡ Recent Activity
            </Typography>
            <Box sx={{ height: '90%', overflowY: 'auto' }}>
              {(overview.recentActivity || []).slice(0, 8).map((activity, index) => (
                <Box key={index} sx={{ mb: 2, p: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={activity.type}
                      size="small"
                      color={activity.type === 'transaction' ? 'primary' : 'warning'}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    by {activity.user}
                  </Typography>
                  {index < (overview.recentActivity || []).length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats Row */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {overview.outOfStockItems || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Out of Stock
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {overview.totalTransactions || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Transactions
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {overview.pendingAlerts || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pending Alerts
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
              {overview.criticalAlerts || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Critical Alerts
            </Typography>
          </Card>
                 </Grid>
       </Grid>
       </Box>
     </Box>
   );
 } 