import { Request, Response } from 'express';
import { InventoryModel } from '../models/InventoryModel';
import { ProductModel } from '../models/ProductModel';
import { WarehouseModel } from '../models/WarehouseModel';
import { logger } from '../utils/logger';
import { safeParseInt } from '../utils/helpers';

export class DashboardController {
  /**
   * Get dashboard overview data
   * GET /api/dashboard/overview
   */
  static async getOverview(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // In a real application, you would fetch this data from the database
      const mockOverview = {
        totalProducts: 150,
        totalWarehouses: 5,
        totalInventoryValue: 125000.00,
        lowStockItems: 12,
        outOfStockItems: 3,
        totalTransactions: 245,
        pendingAlerts: 8,
        criticalAlerts: 2,
        recentActivity: [
          {
            id: 1,
            type: 'transaction',
            description: 'Stock received for Product A',
            timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            user: 'John Doe'
          },
          {
            id: 2,
            type: 'alert',
            description: 'Low stock alert for Product B',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            user: 'System'
          },
          {
            id: 3,
            type: 'transaction',
            description: 'Stock adjustment for Product C',
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            user: 'Jane Smith'
          }
        ]
      };

      res.status(200).json({
        success: true,
        data: mockOverview
      });
    } catch (error) {
      logger.error('Error getting dashboard overview:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get inventory analytics
   * GET /api/dashboard/inventory-analytics
   */
  static async getInventoryAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const period = req.query.period as string || '30d'; // 30d, 7d, 1d
      const warehouseId = req.query.warehouseId ? safeParseInt(req.query.warehouseId as string) : undefined;

      // In a real application, you would calculate these from the database
      const mockAnalytics = {
        period,
        warehouseId,
        totalValue: 125000.00,
        averageValue: 833.33,
        valueChange: 5.2, // percentage
        topProducts: [
          {
            productId: 1,
            productName: 'Product A',
            sku: 'PROD-001',
            quantity: 150,
            value: 15000.00,
            percentage: 12.0
          },
          {
            productId: 2,
            productName: 'Product B',
            sku: 'PROD-002',
            quantity: 100,
            value: 12000.00,
            percentage: 9.6
          },
          {
            productId: 3,
            productName: 'Product C',
            sku: 'PROD-003',
            quantity: 75,
            value: 9000.00,
            percentage: 7.2
          }
        ],
        categoryDistribution: [
          { category: 'Electronics', value: 45000.00, percentage: 36.0 },
          { category: 'Clothing', value: 35000.00, percentage: 28.0 },
          { category: 'Home & Garden', value: 25000.00, percentage: 20.0 },
          { category: 'Sports', value: 15000.00, percentage: 12.0 },
          { category: 'Books', value: 5000.00, percentage: 4.0 }
        ],
        stockLevels: {
          healthy: 120,
          low: 25,
          critical: 5
        },
        turnoverRate: 2.5, // times per month
        averageLeadTime: 7.2 // days
      };

      res.status(200).json({
        success: true,
        data: mockAnalytics
      });
    } catch (error) {
      logger.error('Error getting inventory analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get transaction analytics
   * GET /api/dashboard/transaction-analytics
   */
  static async getTransactionAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const period = req.query.period as string || '30d';
      
      // In a real application, you would calculate these from the transactions table
      const mockTransactionAnalytics = {
        period,
        totalTransactions: 245,
        transactionsIn: 120,
        transactionsOut: 100,
        transactionsAdjustment: 20,
        transactionsTransfer: 5,
        averageTransactionValue: 510.20,
        topTransactionReasons: [
          { reason: 'Sales order', count: 85, percentage: 34.7 },
          { reason: 'Stock received', count: 45, percentage: 18.4 },
          { reason: 'Inventory adjustment', count: 20, percentage: 8.2 },
          { reason: 'Return', count: 15, percentage: 6.1 },
          { reason: 'Transfer', count: 5, percentage: 2.0 }
        ],
        dailyTransactionTrend: [
          { date: '2024-12-15', count: 8, value: 4200.00 },
          { date: '2024-12-16', count: 12, value: 6300.00 },
          { date: '2024-12-17', count: 10, value: 5200.00 },
          { date: '2024-12-18', count: 15, value: 7800.00 },
          { date: '2024-12-19', count: 9, value: 4700.00 }
        ],
        topProductsByTransactions: [
          { productId: 1, productName: 'Product A', transactions: 45 },
          { productId: 2, productName: 'Product B', transactions: 32 },
          { productId: 3, productName: 'Product C', transactions: 28 }
        ]
      };

      res.status(200).json({
        success: true,
        data: mockTransactionAnalytics
      });
    } catch (error) {
      logger.error('Error getting transaction analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouse performance analytics
   * GET /api/dashboard/warehouse-analytics
   */
  static async getWarehouseAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // In a real application, you would calculate these from the database
      const mockWarehouseAnalytics = {
        totalWarehouses: 5,
        totalCapacity: 10000,
        utilizedCapacity: 7500,
        utilizationRate: 75.0,
        warehouses: [
          {
            warehouseId: 1,
            warehouseName: 'Main Warehouse',
            capacity: 5000,
            utilized: 4000,
            utilizationRate: 80.0,
            totalValue: 60000.00,
            products: 75,
            alerts: 3
          },
          {
            warehouseId: 2,
            warehouseName: 'Secondary Warehouse',
            capacity: 3000,
            utilized: 2000,
            utilizationRate: 66.7,
            totalValue: 35000.00,
            products: 45,
            alerts: 2
          },
          {
            warehouseId: 3,
            warehouseName: 'Regional Warehouse A',
            capacity: 1500,
            utilized: 1200,
            utilizationRate: 80.0,
            totalValue: 20000.00,
            products: 25,
            alerts: 1
          },
          {
            warehouseId: 4,
            warehouseName: 'Regional Warehouse B',
            capacity: 500,
            utilized: 300,
            utilizationRate: 60.0,
            totalValue: 8000.00,
            products: 15,
            alerts: 1
          },
          {
            warehouseId: 5,
            warehouseName: 'Cold Storage',
            capacity: 0,
            utilized: 0,
            utilizationRate: 0.0,
            totalValue: 2000.00,
            products: 5,
            alerts: 1
          }
        ],
        topPerformingWarehouses: [
          { warehouseId: 1, warehouseName: 'Main Warehouse', performance: 95.0 },
          { warehouseId: 3, warehouseName: 'Regional Warehouse A', performance: 88.0 },
          { warehouseId: 2, warehouseName: 'Secondary Warehouse', performance: 82.0 }
        ]
      };

      res.status(200).json({
        success: true,
        data: mockWarehouseAnalytics
      });
    } catch (error) {
      logger.error('Error getting warehouse analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get alert analytics
   * GET /api/dashboard/alert-analytics
   */
  static async getAlertAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const period = req.query.period as string || '30d';
      
      // In a real application, you would calculate these from the alerts table
      const mockAlertAnalytics = {
        period,
        totalAlerts: 45,
        acknowledgedAlerts: 38,
        pendingAlerts: 7,
        responseRate: 84.4, // percentage
        averageResponseTime: '2.5 hours',
        alertTypes: {
          'low-stock': 20,
          'out-of-stock': 5,
          'reorder': 20
        },
        alertSeverity: {
          critical: 3,
          warning: 25,
          info: 17
        },
        topProductsByAlerts: [
          { productId: 1, productName: 'Product A', alerts: 12 },
          { productId: 2, productName: 'Product B', alerts: 8 },
          { productId: 3, productName: 'Product C', alerts: 6 }
        ],
        dailyAlertTrend: [
          { date: '2024-12-15', count: 2 },
          { date: '2024-12-16', count: 3 },
          { date: '2024-12-17', count: 1 },
          { date: '2024-12-18', count: 4 },
          { date: '2024-12-19', count: 2 }
        ]
      };

      res.status(200).json({
        success: true,
        data: mockAlertAnalytics
      });
    } catch (error) {
      logger.error('Error getting alert analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get performance metrics
   * GET /api/dashboard/performance-metrics
   */
  static async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions to view performance metrics'
        });
        return;
      }

      // In a real application, you would calculate these from various data sources
      const mockPerformanceMetrics = {
        inventoryTurnover: 2.5,
        orderFulfillmentRate: 98.5,
        stockAccuracy: 99.2,
        averageLeadTime: 7.2,
        carryingCost: 12500.00,
        stockoutRate: 1.5,
        excessInventory: 8.3,
        supplierPerformance: 95.0,
        warehouseEfficiency: 88.0,
        customerSatisfaction: 96.0,
        keyMetrics: {
          'Inventory Turnover Ratio': { value: 2.5, target: 3.0, status: 'warning' },
          'Order Fulfillment Rate': { value: 98.5, target: 99.0, status: 'good' },
          'Stock Accuracy': { value: 99.2, target: 99.5, status: 'good' },
          'Average Lead Time': { value: 7.2, target: 5.0, status: 'warning' },
          'Stockout Rate': { value: 1.5, target: 1.0, status: 'warning' }
        }
      };

      res.status(200).json({
        success: true,
        data: mockPerformanceMetrics
      });
    } catch (error) {
      logger.error('Error getting performance metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Generate custom report
   * POST /api/dashboard/reports
   */
  static async generateReport(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions to generate reports'
        });
        return;
      }

      const { reportType, filters, dateRange } = req.body;
      
      // Validate report type
      const validReportTypes = ['inventory', 'transactions', 'alerts', 'performance', 'warehouse'];
      if (!validReportTypes.includes(reportType)) {
        res.status(400).json({
          success: false,
          error: 'Invalid report type'
        });
        return;
      }

      // In a real application, you would generate the report based on the parameters
      const mockReport = {
        reportId: Date.now(),
        reportType,
        generatedBy: req.user.userId,
        generatedAt: new Date().toISOString(),
        filters,
        dateRange,
        data: {
          summary: 'Report summary data',
          details: 'Detailed report data',
          charts: 'Chart data',
          recommendations: 'Recommendations based on data'
        }
      };

      logger.info(`Report generated: ${reportType} by user ${req.user.userId}`);

      res.status(200).json({
        success: true,
        data: mockReport,
        message: 'Report generated successfully'
      });
    } catch (error) {
      logger.error('Error generating report:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 