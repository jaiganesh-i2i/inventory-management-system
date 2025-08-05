import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  Download,
  Refresh,
  BarChart,
  PieChart,
  ShowChart,
  Analytics,
  Build,
  Timeline,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CustomReportBuilder from './CustomReportBuilder';
import AdvancedAnalytics from './AdvancedAnalytics';
import analyticsService from '../../services/analyticsService';
import type { 
  AnalyticsData, 
  SalesTrend, 
  InventoryMetric, 
  CategoryPerformance,
  PredictiveInsight,
  CorrelationFactor,
  SeasonalityData 
} from '../../services/analyticsService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ReportsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  
  // Real analytics data state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [inventoryMetrics, setInventoryMetrics] = useState<InventoryMetric[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [correlationAnalysis, setCorrelationAnalysis] = useState<CorrelationFactor[]>([]);
  const [seasonalityData, setSeasonalityData] = useState<SeasonalityData[]>([]);

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading analytics data for timeRange:', timeRange);
      const data = await analyticsService.getAnalyticsData(timeRange);
      console.log('Analytics data loaded:', data);
      
      setAnalyticsData(data);
      setSalesTrends(data.salesTrends);
      setInventoryMetrics(data.inventoryMetrics);
      setCategoryPerformance(data.categoryPerformance);
      setPredictiveInsights(data.predictiveInsights);
      setCorrelationAnalysis(data.correlationAnalysis);
      setSeasonalityData(data.seasonalityData);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load specific data for each tab
  const loadSalesTrends = async () => {
    try {
      const data = await analyticsService.getSalesTrends(timeRange);
      setSalesTrends(data);
    } catch (err) {
      console.error('Error loading sales trends:', err);
    }
  };

  const loadInventoryMetrics = async () => {
    try {
      const data = await analyticsService.getInventoryMetrics();
      setInventoryMetrics(data);
    } catch (err) {
      console.error('Error loading inventory metrics:', err);
    }
  };

  const loadCategoryPerformance = async () => {
    try {
      const data = await analyticsService.getCategoryPerformance();
      setCategoryPerformance(data);
    } catch (err) {
      console.error('Error loading category performance:', err);
    }
  };

  const loadPredictiveInsights = async () => {
    try {
      const data = await analyticsService.getPredictiveInsights();
      setPredictiveInsights(data);
    } catch (err) {
      console.error('Error loading predictive insights:', err);
    }
  };

  const loadCorrelationAnalysis = async () => {
    try {
      const data = await analyticsService.getCorrelationAnalysis();
      setCorrelationAnalysis(data);
    } catch (err) {
      console.error('Error loading correlation analysis:', err);
    }
  };

  const loadSeasonalityData = async () => {
    try {
      const data = await analyticsService.getSeasonalityData();
      setSeasonalityData(data);
    } catch (err) {
      console.error('Error loading seasonality data:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  // Load specific data when tab changes
  useEffect(() => {
    switch (tabValue) {
      case 0: // Sales Analytics
        loadSalesTrends();
        break;
      case 1: // Inventory Reports
        loadInventoryMetrics();
        break;
      case 2: // Category Insights
        loadCategoryPerformance();
        break;
      case 3: // Performance Metrics
        // Uses data from other tabs
        break;
      case 4: // Custom Reports
        // Handled by CustomReportBuilder component
        break;
      case 5: // Advanced Analytics
        loadPredictiveInsights();
        loadCorrelationAnalysis();
        loadSeasonalityData();
        break;
    }
  }, [tabValue, timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      // This would need a report ID from the backend
      console.log(`Exporting report in ${format} format`);
      // const blob = await analyticsService.exportReport('report-id', format);
      // Handle download
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again.');
    }
  };

  if (loading && !analyticsData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          📊 Advanced Analytics & Reports
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Export PDF">
            <IconButton onClick={() => handleExport('pdf')} color="primary">
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Excel">
            <IconButton onClick={() => handleExport('excel')} color="primary">
              <BarChart />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} color="primary" disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Report Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="report tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Sales Analytics" icon={<TrendingUp />} />
          <Tab label="Inventory Reports" icon={<Assessment />} />
          <Tab label="Category Insights" icon={<PieChart />} />
          <Tab label="Performance Metrics" icon={<Analytics />} />
          <Tab label="Custom Reports" icon={<Build />} />
          <Tab label="Advanced Analytics" icon={<Timeline />} />
        </Tabs>

        {/* Sales Analytics Tab */}
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sales Trend Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={salesTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={3} name="Actual Sales" />
                        <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeWidth={3} name="Predicted Sales" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sales Summary
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography>Total Sales:</Typography>
                        <Typography variant="h6" color="primary">
                          {salesTrends.reduce((sum, item) => sum + item.actual, 0).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography>Avg Growth:</Typography>
                        <Typography variant="h6" color="success.main">
                          {salesTrends.length > 0 
                            ? (salesTrends.reduce((sum, item) => sum + item.growth, 0) / salesTrends.length).toFixed(1) + '%'
                            : '0%'
                          }
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography>Confidence:</Typography>
                        <Typography variant="h6" color="info.main">
                          {salesTrends.length > 0 
                            ? (salesTrends.reduce((sum, item) => sum + item.confidence, 0) / salesTrends.length * 100).toFixed(0) + '%'
                            : '0%'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Inventory Reports Tab */}
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Inventory Status by Category
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsBarChart data={inventoryMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="inStock" fill="#4caf50" name="In Stock" />
                        <Bar dataKey="lowStock" fill="#ff9800" name="Low Stock" />
                        <Bar dataKey="outOfStock" fill="#f44336" name="Out of Stock" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Inventory Summary
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {inventoryMetrics.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">{item.category}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Value: ${item.value.toLocaleString()} | Turnover: {item.turnover}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Category Insights Tab */}
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Category Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsPieChart>
                        <Pie
                          data={categoryPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Category Performance
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {categoryPerformance.map((category, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">{category.name}</Typography>
                            <Typography variant="h6" color="primary">
                              {category.value}%
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            Growth: {category.growth}% | Market Share: {category.marketShare}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Performance Metrics Tab */}
        <TabPanel value={tabValue} index={3}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Key Performance Indicators
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">
                              {salesTrends.reduce((sum, item) => sum + item.actual, 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">Total Sales</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">
                              ${inventoryMetrics.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">Total Inventory Value</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">
                              {inventoryMetrics.reduce((sum, item) => sum + item.lowStock, 0)}
                            </Typography>
                            <Typography variant="body2">Low Stock Items</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">
                              {inventoryMetrics.reduce((sum, item) => sum + item.outOfStock, 0)}
                            </Typography>
                            <Typography variant="body2">Out of Stock</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Custom Reports Tab */}
        <TabPanel value={tabValue} index={4}>
          <CustomReportBuilder />
        </TabPanel>

        {/* Advanced Analytics Tab */}
        <TabPanel value={tabValue} index={5}>
          <AdvancedAnalytics 
            predictiveInsights={predictiveInsights}
            correlationAnalysis={correlationAnalysis}
            seasonalityData={seasonalityData}
            loading={loading}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
} 