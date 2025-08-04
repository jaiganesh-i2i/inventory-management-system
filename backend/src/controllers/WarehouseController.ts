import { Request, Response } from 'express';
import { WarehouseModel } from '../models/WarehouseModel';
import { CreateWarehouseInput, UpdateWarehouseInput, QueryParams } from '../types/database';
import { logger } from '../utils/logger';
import { safeParseInt, safeParseBoolean, safeParseSortOrder } from '../utils/helpers';

export class WarehouseController {
  /**
   * Create a new warehouse
   * POST /api/warehouses
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const warehouseData: CreateWarehouseInput = req.body;
      
      // Validate required fields
      if (!warehouseData.name || !warehouseData.location) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, location'
        });
        return;
      }

      // Check if warehouse name already exists
      const existingWarehouse = await WarehouseModel.findByName(warehouseData.name);
      if (existingWarehouse) {
        res.status(409).json({
          success: false,
          error: 'Warehouse name already exists'
        });
        return;
      }

      const warehouse = await WarehouseModel.create(warehouseData);
      
      res.status(201).json({
        success: true,
        data: warehouse,
        message: 'Warehouse created successfully'
      });
    } catch (error) {
      logger.error('Error creating warehouse:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all warehouses with pagination and filtering
   * GET /api/warehouses
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        manager_id: req.query.manager_id ? safeParseInt(req.query.manager_id as string) : undefined,
        is_active: safeParseBoolean(req.query.is_active as string),
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await WarehouseModel.findAll(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching warehouses:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all warehouses with manager information
   * GET /api/warehouses/with-managers
   */
  static async getAllWithManagers(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        manager_id: req.query.manager_id ? safeParseInt(req.query.manager_id as string) : undefined,
        is_active: safeParseBoolean(req.query.is_active as string),
        sortBy: req.query.sortBy as string || 'w.created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await WarehouseModel.findAllWithManagers(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching warehouses with managers:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouse by ID
   * GET /api/warehouses/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid warehouse ID'
        });
        return;
      }

      const warehouse = await WarehouseModel.findById(id);
      
      if (!warehouse) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: warehouse
      });
    } catch (error) {
      logger.error('Error fetching warehouse:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouse by ID with manager information
   * GET /api/warehouses/:id/with-manager
   */
  static async getByIdWithManager(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid warehouse ID'
        });
        return;
      }

      const warehouse = await WarehouseModel.findByIdWithManager(id);
      
      if (!warehouse) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: warehouse
      });
    } catch (error) {
      logger.error('Error fetching warehouse with manager:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update warehouse
   * PUT /api/warehouses/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid warehouse ID'
        });
        return;
      }

      const updateData: UpdateWarehouseInput = req.body;
      
      // Check if warehouse exists
      const existingWarehouse = await WarehouseModel.findById(id);
      if (!existingWarehouse) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      // Check for name conflicts if name is being updated
      if (updateData.name && updateData.name !== existingWarehouse.name) {
        const nameExists = await WarehouseModel.nameExists(updateData.name, id);
        if (nameExists) {
          res.status(409).json({
            success: false,
            error: 'Warehouse name already exists'
          });
          return;
        }
      }

      const updatedWarehouse = await WarehouseModel.update(id, updateData);
      
      if (!updatedWarehouse) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedWarehouse,
        message: 'Warehouse updated successfully'
      });
    } catch (error) {
      logger.error('Error updating warehouse:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete warehouse (soft delete)
   * DELETE /api/warehouses/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid warehouse ID'
        });
        return;
      }

      // Check if warehouse exists
      const existingWarehouse = await WarehouseModel.findById(id);
      if (!existingWarehouse) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      const deleted = await WarehouseModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Warehouse deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting warehouse:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouses by manager
   * GET /api/warehouses/manager/:managerId
   */
  static async getByManager(req: Request, res: Response): Promise<void> {
    try {
      const managerId = safeParseInt(req.params.managerId);
      
      if (managerId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid manager ID'
        });
        return;
      }

      const warehouses = await WarehouseModel.findByManager(managerId);

      res.status(200).json({
        success: true,
        data: warehouses
      });
    } catch (error) {
      logger.error('Error fetching warehouses by manager:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouses with inventory summary
   * GET /api/warehouses/with-inventory-summary
   */
  static async getWarehousesWithInventorySummary(req: Request, res: Response): Promise<void> {
    try {
      const warehouses = await WarehouseModel.getWarehousesWithInventorySummary();

      res.status(200).json({
        success: true,
        data: warehouses
      });
    } catch (error) {
      logger.error('Error fetching warehouses with inventory summary:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouse capacity utilization
   * GET /api/warehouses/capacity-utilization
   */
  static async getCapacityUtilization(req: Request, res: Response): Promise<void> {
    try {
      const utilization = await WarehouseModel.getCapacityUtilization();

      res.status(200).json({
        success: true,
        data: utilization
      });
    } catch (error) {
      logger.error('Error fetching warehouse capacity utilization:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouses without managers
   * GET /api/warehouses/without-managers
   */
  static async getWarehousesWithoutManagers(req: Request, res: Response): Promise<void> {
    try {
      const warehouses = await WarehouseModel.getWarehousesWithoutManagers();

      res.status(200).json({
        success: true,
        data: warehouses
      });
    } catch (error) {
      logger.error('Error fetching warehouses without managers:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get warehouse statistics
   * GET /api/warehouses/stats
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const [totalCount, statistics] = await Promise.all([
        WarehouseModel.getTotalCount(),
        WarehouseModel.getWarehouseStatistics()
      ]);

      res.status(200).json({
        success: true,
        data: {
          total_warehouses: totalCount,
          statistics: statistics
        }
      });
    } catch (error) {
      logger.error('Error fetching warehouse statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 