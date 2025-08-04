import { Request, Response } from 'express';
import { InventoryModel } from '../models/InventoryModel';
import { CreateInventoryInput, UpdateInventoryInput, QueryParams } from '../types/database';
import { logger } from '../utils/logger';
import { safeParseInt, safeParseBoolean, safeParseSortOrder } from '../utils/helpers';

export class InventoryController {
  /**
   * Create a new inventory record
   * POST /api/inventory
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const inventoryData: CreateInventoryInput = req.body;
      
      // Validate required fields
      if (!inventoryData.product_id || !inventoryData.warehouse_id) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: product_id, warehouse_id'
        });
        return;
      }

      // Check if inventory record already exists for this product and warehouse
      const existingInventory = await InventoryModel.findByProductAndWarehouse(
        inventoryData.product_id,
        inventoryData.warehouse_id
      );
      
      if (existingInventory) {
        res.status(409).json({
          success: false,
          error: 'Inventory record already exists for this product and warehouse'
        });
        return;
      }

      const inventory = await InventoryModel.create(inventoryData);
      
      res.status(201).json({
        success: true,
        data: inventory,
        message: 'Inventory record created successfully'
      });
    } catch (error) {
      logger.error('Error creating inventory record:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all inventory records with pagination and filtering
   * GET /api/inventory
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        product_id: req.query.product_id ? safeParseInt(req.query.product_id as string) : undefined,
        warehouse_id: req.query.warehouse_id ? safeParseInt(req.query.warehouse_id as string) : undefined,
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await InventoryModel.findAll(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching inventory records:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all inventory records with detailed information
   * GET /api/inventory/with-details
   */
  static async getAllWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        product_id: req.query.product_id ? safeParseInt(req.query.product_id as string) : undefined,
        warehouse_id: req.query.warehouse_id ? safeParseInt(req.query.warehouse_id as string) : undefined,
        sortBy: req.query.sortBy as string || 'i.created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await InventoryModel.findAllWithDetails(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching inventory records with details:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get inventory record by ID
   * GET /api/inventory/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      const inventory = await InventoryModel.findById(id);
      
      if (!inventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      logger.error('Error fetching inventory record:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get inventory record by ID with detailed information
   * GET /api/inventory/:id/with-details
   */
  static async getByIdWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      const inventory = await InventoryModel.findByIdWithDetails(id);
      
      if (!inventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      logger.error('Error fetching inventory record with details:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update inventory record
   * PUT /api/inventory/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      const updateData: UpdateInventoryInput = req.body;
      
      // Check if inventory record exists
      const existingInventory = await InventoryModel.findById(id);
      if (!existingInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      const updatedInventory = await InventoryModel.update(id, updateData);
      
      if (!updatedInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedInventory,
        message: 'Inventory record updated successfully'
      });
    } catch (error) {
      logger.error('Error updating inventory record:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update inventory quantity (transaction-safe)
   * PUT /api/inventory/:id/quantity
   */
  static async updateQuantity(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      const { quantityChange } = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      if (typeof quantityChange !== 'number') {
        res.status(400).json({
          success: false,
          error: 'quantityChange must be a number'
        });
        return;
      }

      // Check if inventory record exists
      const existingInventory = await InventoryModel.findById(id);
      if (!existingInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      const updatedInventory = await InventoryModel.updateQuantity(id, quantityChange);
      
      if (!updatedInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedInventory,
        message: 'Inventory quantity updated successfully'
      });
    } catch (error) {
      logger.error('Error updating inventory quantity:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Reserve inventory quantity
   * PUT /api/inventory/:id/reserve
   */
  static async reserveQuantity(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      const { quantity } = req.body;
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      if (typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
        return;
      }

      // Check if inventory record exists
      const existingInventory = await InventoryModel.findById(id);
      if (!existingInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      const updatedInventory = await InventoryModel.reserveQuantity(id, quantity);
      
      if (!updatedInventory) {
        res.status(400).json({
          success: false,
          error: 'Insufficient available quantity for reservation'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedInventory,
        message: 'Quantity reserved successfully'
      });
    } catch (error) {
      logger.error('Error reserving inventory quantity:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Release reserved inventory quantity
   * PUT /api/inventory/:id/release
   */
  static async releaseReservedQuantity(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      const { quantity } = req.body;
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      if (typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
        return;
      }

      // Check if inventory record exists
      const existingInventory = await InventoryModel.findById(id);
      if (!existingInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      const updatedInventory = await InventoryModel.releaseReservedQuantity(id, quantity);
      
      if (!updatedInventory) {
        res.status(400).json({
          success: false,
          error: 'Insufficient reserved quantity to release'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedInventory,
        message: 'Reserved quantity released successfully'
      });
    } catch (error) {
      logger.error('Error releasing reserved inventory quantity:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete inventory record
   * DELETE /api/inventory/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory ID'
        });
        return;
      }

      // Check if inventory record exists
      const existingInventory = await InventoryModel.findById(id);
      if (!existingInventory) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      const deleted = await InventoryModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Inventory record not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Inventory record deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting inventory record:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get inventory records by product
   * GET /api/inventory/product/:productId
   */
  static async getByProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = safeParseInt(req.params.productId);
      
      if (productId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const inventory = await InventoryModel.findByProduct(productId);

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      logger.error('Error fetching inventory by product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get inventory records by warehouse
   * GET /api/inventory/warehouse/:warehouseId
   */
  static async getByWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const warehouseId = safeParseInt(req.params.warehouseId);
      
      if (warehouseId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid warehouse ID'
        });
        return;
      }

      const inventory = await InventoryModel.findByWarehouse(warehouseId);

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      logger.error('Error fetching inventory by warehouse:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get low stock inventory
   * GET /api/inventory/low-stock
   */
  static async getLowStock(req: Request, res: Response): Promise<void> {
    try {
      const inventory = await InventoryModel.getLowStockInventory();

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      logger.error('Error fetching low stock inventory:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get out of stock inventory
   * GET /api/inventory/out-of-stock
   */
  static async getOutOfStock(req: Request, res: Response): Promise<void> {
    try {
      const inventory = await InventoryModel.getOutOfStockInventory();

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      logger.error('Error fetching out of stock inventory:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get inventory summary by warehouse
   * GET /api/inventory/summary/warehouse
   */
  static async getSummaryByWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const summary = await InventoryModel.getSummaryByWarehouse();

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      logger.error('Error fetching inventory summary by warehouse:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get total inventory value
   * GET /api/inventory/total-value
   */
  static async getTotalValue(req: Request, res: Response): Promise<void> {
    try {
      const totalValue = await InventoryModel.getTotalValue();

      res.status(200).json({
        success: true,
        data: {
          total_value: totalValue
        }
      });
    } catch (error) {
      logger.error('Error fetching total inventory value:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 