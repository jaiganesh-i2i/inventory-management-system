import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
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
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  ShowChart,
  Timeline,
  Assessment,
  Warning,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface TrendData {
  period: string;
  actual: number;
  predicted: number;
  confidence: number;
}

interface KPI {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export default function AdvancedAnalytics() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [seasonalityData, setSeasonalityData] = useState<any[]>([]);
  const [correlationData, setCorrelationData] = useState<any[]>([]);

  // Load data from API
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [salesTrends, predictiveInsights, seasonality, correlation] = await Promise.all([
        analyticsService.getSalesTrends(timeRange),
        analyticsService.getPredictiveInsights(),
        analyticsService.getSeasonalityData(),
        analyticsService.getCorrelationAnalysis()
      ]);

      setTrendData(salesTrends);
      setSeasonalityData(seasonality);
      setCorrelationData(correlation);

      // Convert predictive insights to KPIs
      const kpiData: KPI[] = predictiveInsights.map(insight => ({
        name: insight.metric,
        value: insight.currentValue,
        change: insight.predictedValue - insight.currentValue,
        trend: insight.trend,
        status: insight.confidence > 0.8 ? 'good' : insight.confidence > 0.6 ? 'warning' : 'critical'
      }));
      setKpis(kpiData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <Timeline color="info" />;
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'info';
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'critical': return <Error color="error" />;
      default: return <Info color="info" />;
    }
  };

  if (loading) {
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
          🔬 Advanced Analytics & Predictive Insights
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
            size="small"
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="1y">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="textSecondary">
                    {kpi.name}
                  </Typography>
                  {getStatusIcon(kpi.status)}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {kpi.value}%
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {getTrendIcon(kpi.trend)}
                  <Typography 
                    variant="body2" 
                    color={kpi.change >= 0 ? 'success.main' : 'error.main'}
                  >
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    vs last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="analytics tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Predictive Analytics" icon={<Analytics />} />
          <Tab label="Trend Analysis" icon={<ShowChart />} />
          <Tab label="Seasonality" icon={<Timeline />} />
          <Tab label="Correlation Analysis" icon={<Assessment />} />
        </Tabs>

        {/* Predictive Analytics Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sales Forecast vs Actual
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#8884d8" 
                        strokeWidth={3} 
                        name="Actual Sales" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#82ca9d" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        name="Predicted Sales" 
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Forecast Accuracy
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {trendData.slice(-4).map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">{item.period}</Typography>
                          <Typography variant="body2" color="primary">
                            {(item.confidence * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.confidence * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trend Analysis Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Multi-Metric Trend Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="actual" 
                        stackId="1"
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                        name="Actual Sales" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="predicted" 
                        stackId="2"
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.6}
                        name="Predicted Sales" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Trend Insights
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Positive Trend:</strong> Sales are growing at 12.5% monthly rate
                      </Typography>
                    </Alert>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Seasonal Pattern:</strong> Peak sales in Q3-Q4
                      </Typography>
                    </Alert>
                    <Alert severity="warning">
                      <Typography variant="body2">
                        <strong>Forecast:</strong> Expected 15% growth next quarter
                      </Typography>
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Seasonality Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Seasonal Sales Pattern
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={seasonalityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Sales Volume" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Seasonality Index
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {seasonalityData.map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">{item.month}</Typography>
                          <Chip 
                            label={`${(item.seasonality * 100).toFixed(0)}%`}
                            size="small"
                            color={item.seasonality > 1 ? 'success' : item.seasonality < 1 ? 'warning' : 'default'}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Correlation Analysis Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Factor Correlation Analysis
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {correlationData.map((factor, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1">{factor.factor}</Typography>
                          <Chip 
                            label={factor.impact}
                            size="small"
                            color={factor.impact === 'high' ? 'error' : factor.impact === 'medium' ? 'warning' : 'default'}
                          />
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="body2" color="textSecondary">
                            Correlation:
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color={factor.correlation > 0.7 ? 'success.main' : factor.correlation > 0.3 ? 'warning.main' : 'error.main'}
                          >
                            {(factor.correlation * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.abs(factor.correlation) * 100} 
                          sx={{ height: 6, borderRadius: 3, mt: 1 }}
                          color={factor.correlation > 0.7 ? 'success' : factor.correlation > 0.3 ? 'warning' : 'error'}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Key Insights
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Strong Correlation:</strong> Seasonal events have 92% correlation with sales
                      </Typography>
                    </Alert>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Negative Impact:</strong> Competitor activity reduces sales by 45%
                      </Typography>
                    </Alert>
                    <Alert severity="success">
                      <Typography variant="body2">
                        <strong>Opportunity:</strong> Marketing spend shows 65% positive correlation
                      </Typography>
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
} 