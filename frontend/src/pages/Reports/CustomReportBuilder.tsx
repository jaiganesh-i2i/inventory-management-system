import React, { useState } from 'react';
import analyticsService from '../../services/analyticsService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  Save,
  Download,
  FilterList,
  DateRange,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';

interface ReportField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'date' | 'percentage';
  category: 'sales' | 'inventory' | 'transactions' | 'users';
}

interface ReportFilter {
  field: string;
  operator: string;
  value: string;
}

const availableFields: ReportField[] = [
  // Sales fields
  { id: 'total_sales', name: 'Total Sales', type: 'number', category: 'sales' },
  { id: 'revenue', name: 'Revenue', type: 'number', category: 'sales' },
  { id: 'profit_margin', name: 'Profit Margin', type: 'percentage', category: 'sales' },
  { id: 'avg_order_value', name: 'Average Order Value', type: 'number', category: 'sales' },
  
  // Inventory fields
  { id: 'stock_level', name: 'Stock Level', type: 'number', category: 'inventory' },
  { id: 'low_stock_count', name: 'Low Stock Items', type: 'number', category: 'inventory' },
  { id: 'out_of_stock_count', name: 'Out of Stock Items', type: 'number', category: 'inventory' },
  { id: 'inventory_value', name: 'Inventory Value', type: 'number', category: 'inventory' },
  
  // Transaction fields
  { id: 'transaction_count', name: 'Transaction Count', type: 'number', category: 'transactions' },
  { id: 'avg_transaction_value', name: 'Average Transaction Value', type: 'number', category: 'transactions' },
  { id: 'transaction_date', name: 'Transaction Date', type: 'date', category: 'transactions' },
  
  // User fields
  { id: 'user_count', name: 'User Count', type: 'number', category: 'users' },
  { id: 'active_users', name: 'Active Users', type: 'number', category: 'users' },
];

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
];

export default function CustomReportBuilder() {
  const [reportName, setReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [groupBy, setGroupBy] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleAddField = (fieldId: string) => {
    if (!selectedFields.includes(fieldId)) {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(id => id !== fieldId));
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, field: keyof ReportFilter, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleGenerateReport = async () => {
    try {
      const reportData = await analyticsService.generateCustomReport({
        reportName,
        selectedFields,
        filters,
        groupBy,
        sortBy,
        dateRange,
      });
      console.log('Generated report:', reportData);
      // Handle successful report generation
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleSaveReport = async () => {
    try {
      const template = {
        name: reportName,
        selectedFields,
        filters,
        groupBy,
        sortBy,
        dateRange,
      };
      await analyticsService.saveReportTemplate(template);
      console.log('Report template saved');
      // Handle successful save
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const getFieldCategory = (category: string) => {
    switch (category) {
      case 'sales': return 'Sales & Revenue';
      case 'inventory': return 'Inventory Management';
      case 'transactions': return 'Transactions';
      case 'users': return 'User Management';
      default: return category;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        🛠️ Custom Report Builder
      </Typography>

      <Grid container spacing={3}>
        {/* Report Configuration */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Configuration
              </Typography>
              
              <TextField
                fullWidth
                label="Report Name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Date Range */}
              <Typography variant="subtitle1" gutterBottom>
                Date Range
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* Group By */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Group By</InputLabel>
                <Select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  label="Group By"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="warehouse">Warehouse</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>

              {/* Sort By */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="">None</MenuItem>
                  {selectedFields.map(fieldId => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return (
                      <MenuItem key={fieldId} value={fieldId}>
                        {field?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Filters
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddFilter}
                  variant="outlined"
                  size="small"
                >
                  Add Filter
                </Button>
              </Box>

              {filters.map((filter, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Field</InputLabel>
                        <Select
                          value={filter.field}
                          onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                          label="Field"
                        >
                          {availableFields.map(field => (
                            <MenuItem key={field.id} value={field.id}>
                              {field.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Operator</InputLabel>
                        <Select
                          value={filter.operator}
                          onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                          label="Operator"
                        >
                          {operators.map(op => (
                            <MenuItem key={op.value} value={op.value}>
                              {op.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Value"
                        value={filter.value}
                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => handleRemoveFilter(index)}
                        color="error"
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {filters.length === 0 && (
                <Alert severity="info">
                  No filters applied. Click "Add Filter" to create custom filters.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Available Fields */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Fields
              </Typography>

              {Object.entries(
                availableFields.reduce((acc, field) => {
                  if (!acc[field.category]) acc[field.category] = [];
                  acc[field.category].push(field);
                  return acc;
                }, {} as Record<string, ReportField[]>)
              ).map(([category, fields]) => (
                <Box key={category} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {getFieldCategory(category)}
                  </Typography>
                  {fields.map(field => (
                    <Chip
                      key={field.id}
                      label={field.name}
                      onClick={() => handleAddField(field.id)}
                      disabled={selectedFields.includes(field.id)}
                      sx={{ m: 0.5 }}
                      size="small"
                    />
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Selected Fields */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selected Fields
              </Typography>

              {selectedFields.length === 0 ? (
                <Alert severity="info">
                  No fields selected. Click on fields from the left panel to add them.
                </Alert>
              ) : (
                selectedFields.map(fieldId => {
                  const field = availableFields.find(f => f.id === fieldId);
                  return (
                    <Chip
                      key={fieldId}
                      label={field?.name}
                      onDelete={() => handleRemoveField(fieldId)}
                      sx={{ m: 0.5 }}
                      color="primary"
                      size="small"
                    />
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<Assessment />}
                onClick={handleGenerateReport}
                disabled={selectedFields.length === 0}
                sx={{ mb: 2 }}
              >
                Generate Report
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Save />}
                onClick={handleSaveReport}
                disabled={!reportName}
                sx={{ mb: 2 }}
              >
                Save Template
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
                disabled={selectedFields.length === 0}
              >
                Export Report
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 