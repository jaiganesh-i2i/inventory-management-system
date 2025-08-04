import { Request, Response } from 'express';
import { InventoryModel } from '../models/InventoryModel';
import { ProductModel } from '../models/ProductModel';
import { logger } from '../utils/logger';
import { safeParseInt } from '../utils/helpers';

export interface AlertThreshold {
  inventoryId: number;
  lowStockThreshold: number;
  reorderPoint: number;
  reorderQuantity: number;
  isActive: boolean;
}

export class AlertController {
  /**
   * Get all active stock alerts
   * GET /api/alerts
   */
  static async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const alertType = req.query.type as string || 'all'; // all, low-stock, out-of-stock, reorder
      const warehouseId = req.query.warehouseId ? safeParseInt(req.query.warehouseId as string) : undefined;
      
      // In a real application, you would fetch alerts from the database
      // For now, we'll generate alerts based on current inventory data
      const mockAlerts = [
        {
          id: 1,
          type: 'low-stock',
          severity: 'warning',
          inventoryId: 1,
          productId: 1,
          productName: 'Product A',
          warehouseId: 1,
          warehouseName: 'Main Warehouse',
          currentQuantity: 15,
          threshold: 20,
          message: 'Stock level is below reorder point',
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: 2,
          type: 'out-of-stock',
          severity: 'critical',
          inventoryId: 2,
          productId: 2,
          productName: 'Product B',
          warehouseId: 1,
          warehouseName: 'Main Warehouse',
          currentQuantity: 0,
          threshold: 5,
          message: 'Product is out of stock',
          createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        },
        {
          id: 3,
          type: 'reorder',
          severity: 'info',
          inventoryId: 3,
          productId: 3,
          productName: 'Product C',
          warehouseId: 2,
          warehouseName: 'Secondary Warehouse',
          currentQuantity: 8,
          threshold: 10,
          message: 'Reorder point reached',
          createdAt: new Date().toISOString()
        }
      ];

      // Filter alerts based on type
      let filteredAlerts = mockAlerts;
      if (alertType !== 'all') {
        filteredAlerts = mockAlerts.filter(alert => alert.type === alertType);
      }

      // Filter by warehouse if specified
      if (warehouseId) {
        filteredAlerts = filteredAlerts.filter(alert => alert.warehouseId === warehouseId);
      }

      res.status(200).json({
        success: true,
        data: {
          alerts: filteredAlerts,
          totalAlerts: filteredAlerts.length,
          summary: {
            critical: filteredAlerts.filter(a => a.severity === 'critical').length,
            warning: filteredAlerts.filter(a => a.severity === 'warning').length,
            info: filteredAlerts.filter(a => a.severity === 'info').length
          }
        }
      });
    } catch (error) {
      logger.error('Error getting alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Set alert thresholds for an inventory item
   * POST /api/alerts/thresholds
   */
  static async setAlertThresholds(req: Request, res: Response): Promise<void> {
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
          error: 'Insufficient permissions to set alert thresholds'
        });
        return;
      }

      const thresholdData: AlertThreshold = req.body;
      
      // Validate required fields
      if (!thresholdData.inventoryId || thresholdData.lowStockThreshold === undefined || 
          thresholdData.reorderPoint === undefined || thresholdData.reorderQuantity === undefined) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: inventoryId, lowStockThreshold, reorderPoint, reorderQuantity'
        });
        return;
      }

      // Validate thresholds
      if (thresholdData.lowStockThreshold < 0 || thresholdData.reorderPoint < 0 || thresholdData.reorderQuantity <= 0) {
        res.status(400).json({
          success: false,
          error: 'Thresholds must be non-negative and reorder quantity must be positive'
        });
        return;
      }

      // Check if inventory exists
      const inventory = await InventoryModel.findById(thresholdData.inventoryId);
      if (!inventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory not found'
        });
        return;
      }

      // In a real application, you would save this to the database
      logger.info(`Alert thresholds set for inventory ${thresholdData.inventoryId} by user ${req.user.userId}`);

      res.status(201).json({
        success: true,
        data: {
          threshold: {
            id: Date.now(),
            ...thresholdData,
            createdBy: req.user.userId,
            createdAt: new Date().toISOString()
          }
        },
        message: 'Alert thresholds set successfully'
      });
    } catch (error) {
      logger.error('Error setting alert thresholds:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get alert thresholds for an inventory item
   * GET /api/alerts/thresholds/:inventoryId
   */
  static async getAlertThresholds(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const inventoryId = safeParseInt(req.params.inventoryId);
      if (inventoryId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      // Check if inventory exists
      const inventory = await InventoryModel.findById(inventoryId);
      if (!inventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory not found'
        });
        return;
      }

      // In a real application, you would fetch this from the database
      const mockThreshold = {
        id: 1,
        inventoryId: inventoryId,
        lowStockThreshold: 20,
        reorderPoint: 10,
        reorderQuantity: 100,
        isActive: true,
        createdBy: 1,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: mockThreshold
      });
    } catch (error) {
      logger.error('Error getting alert thresholds:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Acknowledge an alert
   * POST /api/alerts/:alertId/acknowledge
   */
  static async acknowledgeAlert(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const alertId = safeParseInt(req.params.alertId);
      if (alertId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid alert ID'
        });
        return;
      }

      const { notes } = req.body;

      // In a real application, you would update the alert status in the database
      logger.info(`Alert ${alertId} acknowledged by user ${req.user.userId}`);

      res.status(200).json({
        success: true,
        data: {
          alertId,
          acknowledgedBy: req.user.userId,
          acknowledgedAt: new Date().toISOString(),
          notes: notes || null
        },
        message: 'Alert acknowledged successfully'
      });
    } catch (error) {
      logger.error('Error acknowledging alert:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get alert statistics
   * GET /api/alerts/stats
   */
  static async getAlertStats(req: Request, res: Response): Promise<void> {
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
          error: 'Insufficient permissions to view alert statistics'
        });
        return;
      }

      const period = req.query.period as string || '30d'; // 30d, 7d, 1d
      
      // In a real application, you would calculate these from the alerts table
      const mockStats = {
        period,
        totalAlerts: 45,
        acknowledgedAlerts: 38,
        pendingAlerts: 7,
        criticalAlerts: 3,
        warningAlerts: 25,
        infoAlerts: 17,
        alertsByType: {
          'low-stock': 20,
          'out-of-stock': 5,
          'reorder': 20
        },
        topProducts: [
          { productId: 1, productName: 'Product A', alerts: 12 },
          { productId: 2, productName: 'Product B', alerts: 8 },
          { productId: 3, productName: 'Product C', alerts: 6 }
        ],
        averageResponseTime: '2.5 hours'
      };

      res.status(200).json({
        success: true,
        data: mockStats
      });
    } catch (error) {
      logger.error('Error getting alert stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Generate reorder suggestions
   * GET /api/alerts/reorder-suggestions
   */
  static async getReorderSuggestions(req: Request, res: Response): Promise<void> {
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
          error: 'Insufficient permissions to view reorder suggestions'
        });
        return;
      }

      // In a real application, you would analyze inventory levels and generate suggestions
      const mockSuggestions = [
        {
          productId: 1,
          productName: 'Product A',
          sku: 'PROD-001',
          currentStock: 15,
          reorderPoint: 20,
          suggestedQuantity: 100,
          estimatedCost: 1500.00,
          supplier: 'Supplier A',
          leadTime: '5-7 days',
          priority: 'high'
        },
        {
          productId: 2,
          productName: 'Product B',
          sku: 'PROD-002',
          currentStock: 0,
          reorderPoint: 10,
          suggestedQuantity: 50,
          estimatedCost: 750.00,
          supplier: 'Supplier B',
          leadTime: '3-5 days',
          priority: 'critical'
        },
        {
          productId: 3,
          productName: 'Product C',
          sku: 'PROD-003',
          currentStock: 8,
          reorderPoint: 15,
          suggestedQuantity: 75,
          estimatedCost: 1125.00,
          supplier: 'Supplier C',
          leadTime: '7-10 days',
          priority: 'medium'
        }
      ];

      const totalEstimatedCost = mockSuggestions.reduce((sum, suggestion) => sum + suggestion.estimatedCost, 0);

      res.status(200).json({
        success: true,
        data: {
          suggestions: mockSuggestions,
          totalSuggestions: mockSuggestions.length,
          totalEstimatedCost,
          summary: {
            critical: mockSuggestions.filter(s => s.priority === 'critical').length,
            high: mockSuggestions.filter(s => s.priority === 'high').length,
            medium: mockSuggestions.filter(s => s.priority === 'medium').length
          }
        }
      });
    } catch (error) {
      logger.error('Error getting reorder suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 