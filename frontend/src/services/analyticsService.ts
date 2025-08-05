import apiService from './api';

export interface AnalyticsData {
  salesTrends: SalesTrend[];
  inventoryMetrics: InventoryMetric[];
  categoryPerformance: CategoryPerformance[];
  predictiveInsights: PredictiveInsight[];
  correlationAnalysis: CorrelationFactor[];
  seasonalityData: SeasonalityData[];
}

export interface SalesTrend {
  period: string;
  actual: number;
  predicted: number;
  confidence: number;
  growth: number;
}

export interface InventoryMetric {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  value: number;
  turnover: number;
}

export interface CategoryPerformance {
  name: string;
  value: number;
  growth: number;
  marketShare: number;
}

export interface PredictiveInsight {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

export interface CorrelationFactor {
  factor: string;
  correlation: number;
  impact: 'high' | 'medium' | 'low';
  significance: number;
}

export interface SeasonalityData {
  month: string;
  sales: number;
  seasonality: number;
  trend: number;
}

export interface ReportFilter {
  field: string;
  operator: string;
  value: string;
}

export interface CustomReportRequest {
  reportName: string;
  selectedFields: string[];
  filters: ReportFilter[];
  groupBy: string;
  sortBy: string;
  dateRange: {
    start: string;
    end: string;
  };
}

class AnalyticsService {
  // Get comprehensive analytics data
  async getAnalyticsData(timeRange: string = '30d'): Promise<AnalyticsData> {
    try {
      console.log('Making API call to /api/v1/analytics/overview with timeRange:', timeRange);
      const response = await apiService.api.get(`/api/v1/analytics/overview?timeRange=${timeRange}`);
      console.log('API response received:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      console.log('Falling back to sample data');
      // Return sample data for development
      return this.getSampleAnalyticsData();
    }
  }

  // Get sales trends with predictions
  async getSalesTrends(timeRange: string = '30d'): Promise<SalesTrend[]> {
    try {
      const response = await apiService.api.get(`/api/v1/analytics/sales-trends?timeRange=${timeRange}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return this.getSampleSalesTrends();
    }
  }

  // Get inventory metrics
  async getInventoryMetrics(): Promise<InventoryMetric[]> {
    try {
      const response = await apiService.api.get('/api/v1/analytics/inventory-metrics');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching inventory metrics:', error);
      return this.getSampleInventoryMetrics();
    }
  }

  // Get category performance
  async getCategoryPerformance(): Promise<CategoryPerformance[]> {
    try {
      const response = await apiService.api.get('/api/v1/analytics/category-performance');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category performance:', error);
      return this.getSampleCategoryPerformance();
    }
  }

  // Get predictive insights
  async getPredictiveInsights(): Promise<PredictiveInsight[]> {
    try {
      const response = await apiService.api.get('/api/v1/analytics/predictive-insights');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching predictive insights:', error);
      return this.getSamplePredictiveInsights();
    }
  }

  // Get correlation analysis
  async getCorrelationAnalysis(): Promise<CorrelationFactor[]> {
    try {
      const response = await apiService.api.get('/api/v1/analytics/correlation-analysis');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching correlation analysis:', error);
      return this.getSampleCorrelationAnalysis();
    }
  }

  // Get seasonality data
  async getSeasonalityData(): Promise<SeasonalityData[]> {
    try {
      const response = await apiService.api.get('/api/v1/analytics/seasonality');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching seasonality data:', error);
      return this.getSampleSeasonalityData();
    }
  }

  // Generate custom report
  async generateCustomReport(request: CustomReportRequest): Promise<any> {
    try {
      const response = await apiService.api.post('/api/v1/analytics/custom-report', request);
      return response.data;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  }

  // Export report
  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    try {
      const response = await apiService.api.get(`/api/v1/analytics/export/${reportId}?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Save report template
  async saveReportTemplate(template: any): Promise<any> {
    try {
      const response = await apiService.api.post('/api/v1/analytics/save-template', template);
      return response.data;
    } catch (error) {
      console.error('Error saving report template:', error);
      throw error;
    }
  }

  // Get saved report templates
  async getReportTemplates(): Promise<any[]> {
    try {
      const response = await apiService.api.get('/api/v1/analytics/templates');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      return [];
    }
  }

  // Sample data methods for development
  private getSampleAnalyticsData(): AnalyticsData {
    return {
      salesTrends: this.getSampleSalesTrends(),
      inventoryMetrics: this.getSampleInventoryMetrics(),
      categoryPerformance: this.getSampleCategoryPerformance(),
      predictiveInsights: this.getSamplePredictiveInsights(),
      correlationAnalysis: this.getSampleCorrelationAnalysis(),
      seasonalityData: this.getSampleSeasonalityData(),
    };
  }

  private getSampleSalesTrends(): SalesTrend[] {
    return [
      { period: 'Jan', actual: 1200, predicted: 1180, confidence: 0.85, growth: 12.5 },
      { period: 'Feb', actual: 1350, predicted: 1320, confidence: 0.88, growth: 15.2 },
      { period: 'Mar', actual: 1500, predicted: 1480, confidence: 0.92, growth: 18.7 },
      { period: 'Apr', actual: 1650, predicted: 1620, confidence: 0.89, growth: 16.3 },
      { period: 'May', actual: 1800, predicted: 1780, confidence: 0.91, growth: 14.8 },
      { period: 'Jun', actual: 1950, predicted: 1920, confidence: 0.87, growth: 13.2 },
      { period: 'Jul', actual: 2100, predicted: 2080, confidence: 0.90, growth: 15.6 },
      { period: 'Aug', actual: 2250, predicted: 2220, confidence: 0.88, growth: 17.1 },
    ];
  }

  private getSampleInventoryMetrics(): InventoryMetric[] {
    return [
      { category: 'Electronics', inStock: 450, lowStock: 25, outOfStock: 5, value: 12500, turnover: 8.2 },
      { category: 'Clothing', inStock: 320, lowStock: 15, outOfStock: 3, value: 8900, turnover: 6.8 },
      { category: 'Books', inStock: 280, lowStock: 20, outOfStock: 8, value: 4200, turnover: 4.5 },
      { category: 'Home', inStock: 380, lowStock: 30, outOfStock: 12, value: 15600, turnover: 7.1 },
      { category: 'Sports', inStock: 220, lowStock: 10, outOfStock: 2, value: 7800, turnover: 9.3 },
    ];
  }

  private getSampleCategoryPerformance(): CategoryPerformance[] {
    return [
      { name: 'Electronics', value: 35, growth: 12.5, marketShare: 28 },
      { name: 'Clothing', value: 25, growth: 8.7, marketShare: 22 },
      { name: 'Books', value: 20, growth: 15.2, marketShare: 18 },
      { name: 'Home & Garden', value: 15, growth: 6.3, marketShare: 16 },
      { name: 'Sports', value: 5, growth: 22.1, marketShare: 8 },
    ];
  }

  private getSamplePredictiveInsights(): PredictiveInsight[] {
    return [
      {
        metric: 'Sales Growth Rate',
        currentValue: 12.5,
        predictedValue: 14.2,
        confidence: 0.88,
        trend: 'up',
        recommendation: 'Increase marketing spend in Q4 to capitalize on seasonal trends'
      },
      {
        metric: 'Inventory Turnover',
        currentValue: 8.2,
        predictedValue: 7.8,
        confidence: 0.75,
        trend: 'down',
        recommendation: 'Review slow-moving inventory and consider promotional strategies'
      },
      {
        metric: 'Customer Satisfaction',
        currentValue: 94.2,
        predictedValue: 95.1,
        confidence: 0.92,
        trend: 'up',
        recommendation: 'Maintain current service quality standards'
      },
    ];
  }

  private getSampleCorrelationAnalysis(): CorrelationFactor[] {
    return [
      { factor: 'Price Changes', correlation: 0.78, impact: 'high', significance: 0.95 },
      { factor: 'Marketing Spend', correlation: 0.65, impact: 'medium', significance: 0.88 },
      { factor: 'Seasonal Events', correlation: 0.92, impact: 'high', significance: 0.99 },
      { factor: 'Competitor Activity', correlation: -0.45, impact: 'medium', significance: 0.82 },
      { factor: 'Economic Indicators', correlation: 0.32, impact: 'low', significance: 0.75 },
    ];
  }

  private getSampleSeasonalityData(): SeasonalityData[] {
    return [
      { month: 'Jan', sales: 1200, seasonality: 0.85, trend: 0.92 },
      { month: 'Feb', sales: 1350, seasonality: 0.90, trend: 0.94 },
      { month: 'Mar', sales: 1500, seasonality: 0.95, trend: 0.96 },
      { month: 'Apr', sales: 1650, seasonality: 1.00, trend: 0.98 },
      { month: 'May', sales: 1800, seasonality: 1.05, trend: 1.00 },
      { month: 'Jun', sales: 1950, seasonality: 1.10, trend: 1.02 },
      { month: 'Jul', sales: 2100, seasonality: 1.15, trend: 1.04 },
      { month: 'Aug', sales: 2250, seasonality: 1.20, trend: 1.06 },
      { month: 'Sep', sales: 2000, seasonality: 1.15, trend: 1.04 },
      { month: 'Oct', sales: 1850, seasonality: 1.10, trend: 1.02 },
      { month: 'Nov', sales: 1700, seasonality: 1.05, trend: 1.00 },
      { month: 'Dec', sales: 1550, seasonality: 1.00, trend: 0.98 },
    ];
  }
}

export default new AnalyticsService(); 