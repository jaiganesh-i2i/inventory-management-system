import { Request, Response } from 'express';
import { InventoryModel } from '../models/InventoryModel';
import { logger } from '../utils/logger';
import { safeParseInt } from '../utils/helpers';

export interface TransactionInput {
  inventoryId: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
}

export class TransactionController {
  /**
   * Record inventory transaction
   * POST /api/transactions
   */
  static async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const transactionData: TransactionInput = req.body;
      
      // Validate required fields
      if (!transactionData.inventoryId || !transactionData.type || !transactionData.quantity || !transactionData.reason) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: inventoryId, type, quantity, reason'
        });
        return;
      }

      // Validate transaction type
      const validTypes = ['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'];
      if (!validTypes.includes(transactionData.type)) {
        res.status(400).json({
          success: false,
          error: 'Invalid transaction type. Must be one of: IN, OUT, ADJUSTMENT, TRANSFER'
        });
        return;
      }

      // Validate quantity
      if (transactionData.quantity <= 0) {
        res.status(400).json({
          success: false,
          error: 'Quantity must be greater than 0'
        });
        return;
      }

      // Get current inventory
      const currentInventory = await InventoryModel.findById(transactionData.inventoryId);
      if (!currentInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      // Check if user has permission to modify this inventory
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions to create transactions'
        });
        return;
      }

      let newQuantity = currentInventory.quantity;
      
      // Calculate new quantity based on transaction type
      switch (transactionData.type) {
        case 'IN':
          newQuantity += transactionData.quantity;
          break;
        case 'OUT':
          if (currentInventory.quantity < transactionData.quantity) {
            res.status(400).json({
              success: false,
              error: 'Insufficient stock for this transaction'
            });
            return;
          }
          newQuantity -= transactionData.quantity;
          break;
        case 'ADJUSTMENT':
          newQuantity = transactionData.quantity;
          break;
        case 'TRANSFER':
          // For transfers, we need both source and destination
          if (!transactionData.sourceWarehouseId || !transactionData.destinationWarehouseId) {
            res.status(400).json({
              success: false,
              error: 'Source and destination warehouse IDs are required for transfers'
            });
            return;
          }
          if (currentInventory.quantity < transactionData.quantity) {
            res.status(400).json({
              success: false,
              error: 'Insufficient stock for transfer'
            });
            return;
          }
          newQuantity -= transactionData.quantity;
          break;
      }

      // Update inventory quantity
      const updatedInventory = await InventoryModel.updateQuantity(
        transactionData.inventoryId,
        newQuantity - currentInventory.quantity
      );

      if (!updatedInventory) {
        res.status(500).json({
          success: false,
          error: 'Failed to update inventory'
        });
        return;
      }

      // Log the transaction
      logger.info(`Transaction created: ${transactionData.type} ${transactionData.quantity} units for inventory ${transactionData.inventoryId} by user ${req.user.userId}`);

      res.status(201).json({
        success: true,
        data: {
          transaction: {
            id: Date.now(), // In a real app, this would be from the database
            inventoryId: transactionData.inventoryId,
            type: transactionData.type,
            quantity: transactionData.quantity,
            previousQuantity: currentInventory.quantity,
            newQuantity: newQuantity,
            reason: transactionData.reason,
            reference: transactionData.reference,
            notes: transactionData.notes,
            createdBy: req.user.userId,
            createdAt: new Date().toISOString()
          },
          inventory: updatedInventory
        },
        message: 'Transaction recorded successfully'
      });
    } catch (error) {
      logger.error('Error creating transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get transaction history for an inventory item
   * GET /api/transactions/inventory/:inventoryId
   */
  static async getInventoryTransactions(req: Request, res: Response): Promise<void> {
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

      // In a real application, you would fetch transactions from a transactions table
      // For now, we'll return a mock response
      const mockTransactions = [
        {
          id: 1,
          inventoryId: inventoryId,
          type: 'IN',
          quantity: 100,
          reason: 'Initial stock',
          reference: 'PO-001',
          createdBy: 1,
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 2,
          inventoryId: inventoryId,
          type: 'OUT',
          quantity: 25,
          reason: 'Sales order',
          reference: 'SO-001',
          createdBy: 2,
          createdAt: new Date().toISOString()
        }
      ];

      res.status(200).json({
        success: true,
        data: {
          inventory,
          transactions: mockTransactions,
          totalTransactions: mockTransactions.length
        }
      });
    } catch (error) {
      logger.error('Error getting inventory transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get transaction history for a warehouse
   * GET /api/transactions/warehouse/:warehouseId
   */
  static async getWarehouseTransactions(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const warehouseId = safeParseInt(req.params.warehouseId);
      if (warehouseId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid warehouse ID'
        });
        return;
      }

      // In a real application, you would fetch transactions for all inventory in this warehouse
      const mockTransactions = [
        {
          id: 1,
          inventoryId: 1,
          type: 'IN',
          quantity: 100,
          reason: 'Stock received',
          reference: 'PO-001',
          createdBy: 1,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          inventoryId: 2,
          type: 'OUT',
          quantity: 50,
          reason: 'Sales order',
          reference: 'SO-001',
          createdBy: 2,
          createdAt: new Date().toISOString()
        }
      ];

      res.status(200).json({
        success: true,
        data: {
          warehouseId,
          transactions: mockTransactions,
          totalTransactions: mockTransactions.length
        }
      });
    } catch (error) {
      logger.error('Error getting warehouse transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get transaction statistics
   * GET /api/transactions/stats
   */
  static async getTransactionStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Check if user has permission
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions to view transaction statistics'
        });
        return;
      }

      const period = req.query.period as string || '30d'; // 30d, 7d, 1d
      
      // In a real application, you would calculate these from the transactions table
      const mockStats = {
        period,
        totalTransactions: 150,
        totalIn: 2500,
        totalOut: 1800,
        totalAdjustments: 50,
        totalTransfers: 25,
        topProducts: [
          { productId: 1, productName: 'Product A', transactions: 45 },
          { productId: 2, productName: 'Product B', transactions: 32 },
          { productId: 3, productName: 'Product C', transactions: 28 }
        ],
        topReasons: [
          { reason: 'Sales order', count: 85 },
          { reason: 'Stock received', count: 45 },
          { reason: 'Inventory adjustment', count: 20 }
        ]
      };

      res.status(200).json({
        success: true,
        data: mockStats
      });
    } catch (error) {
      logger.error('Error getting transaction stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 