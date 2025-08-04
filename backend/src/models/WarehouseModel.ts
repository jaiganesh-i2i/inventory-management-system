import { query } from '../config/database';
import { Warehouse, QueryParams, PaginatedResponse } from '../types/database';

export class WarehouseModel {
  /**
   * Create a new warehouse
   */
  static async create(warehouseData: { 
    name: string; 
    location?: string; 
    address?: string; 
    capacity?: number; 
    manager_id?: number 
  }): Promise<Warehouse> {
    const { name, location, address, capacity, manager_id } = warehouseData;
    
    const result = await query(
      `INSERT INTO warehouses (name, location, address, capacity, manager_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, location, address, capacity, manager_id]
    );
    
    return result.rows[0];
  }

  /**
   * Find warehouse by ID
   */
  static async findById(id: number): Promise<Warehouse | null> {
    const result = await query(
      'SELECT * FROM warehouses WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find warehouse by name
   */
  static async findByName(name: string): Promise<Warehouse | null> {
    const result = await query(
      'SELECT * FROM warehouses WHERE name = $1',
      [name]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get warehouse with manager details
   */
  static async findByIdWithManager(id: number): Promise<Warehouse & { manager_name?: string; manager_email?: string } | null> {
    const result = await query(
      `SELECT w.*, u.username as manager_name, u.email as manager_email
       FROM warehouses w
       LEFT JOIN users u ON w.manager_id = u.id
       WHERE w.id = $1`,
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get all warehouses with pagination and filtering
   */
  static async findAll(params: QueryParams = {}): Promise<PaginatedResponse<Warehouse>> {
    const {
      page = 1,
      limit = 10,
      search,
      manager_id,
      is_active,
      sortBy = 'name',
      sortOrder = 'asc'
    } = params;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(`(w.name ILIKE $${paramCount} OR w.location ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (manager_id) {
      paramCount++;
      whereConditions.push(`w.manager_id = $${paramCount}`);
      queryParams.push(manager_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`w.is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM warehouses w ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT w.* FROM warehouses w
       ${whereClause}
       ORDER BY w.${sortBy} ${sortOrder.toUpperCase()}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...queryParams, limit, offset]
    );

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get all warehouses with manager details
   */
  static async findAllWithManagers(params: QueryParams = {}): Promise<PaginatedResponse<Warehouse & { manager_name?: string; manager_email?: string }>> {
    const {
      page = 1,
      limit = 10,
      search,
      manager_id,
      is_active,
      sortBy = 'w.name',
      sortOrder = 'asc'
    } = params;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(`(w.name ILIKE $${paramCount} OR w.location ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (manager_id) {
      paramCount++;
      whereConditions.push(`w.manager_id = $${paramCount}`);
      queryParams.push(manager_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`w.is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM warehouses w ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT w.*, u.username as manager_name, u.email as manager_email
       FROM warehouses w
       LEFT JOIN users u ON w.manager_id = u.id
       ${whereClause}
       ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...queryParams, limit, offset]
    );

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Update warehouse
   */
  static async update(id: number, updateData: { 
    name?: string; 
    location?: string; 
    address?: string; 
    capacity?: number; 
    manager_id?: number; 
    is_active?: boolean 
  }): Promise<Warehouse | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    paramCount++;
    values.push(id);

    const result = await query(
      `UPDATE warehouses 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete warehouse (soft delete by setting is_active to false)
   */
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'UPDATE warehouses SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    return result.rowCount > 0;
  }

  /**
   * Hard delete warehouse (use with caution)
   */
  static async hardDelete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM warehouses WHERE id = $1',
      [id]
    );
    
    return result.rowCount > 0;
  }

  /**
   * Get warehouses by manager
   */
  static async findByManager(managerId: number): Promise<Warehouse[]> {
    const result = await query(
      'SELECT * FROM warehouses WHERE manager_id = $1 AND is_active = true ORDER BY name',
      [managerId]
    );
    
    return result.rows;
  }

  /**
   * Get warehouses with inventory summary
   */
  static async getWarehousesWithInventorySummary(): Promise<{
    id: number;
    name: string;
    location?: string;
    total_products: number;
    total_items: number;
    low_stock_items: number;
    out_of_stock_items: number;
  }[]> {
    const result = await query(
      `SELECT w.id, w.name, w.location,
              COUNT(DISTINCT i.product_id) as total_products,
              SUM(i.quantity) as total_items,
              COUNT(CASE WHEN i.quantity <= i.min_threshold THEN 1 END) as low_stock_items,
              COUNT(CASE WHEN i.quantity = 0 THEN 1 END) as out_of_stock_items
       FROM warehouses w
       LEFT JOIN inventory i ON w.id = i.warehouse_id
       WHERE w.is_active = true
       GROUP BY w.id, w.name, w.location
       ORDER BY total_items DESC NULLS LAST`
    );
    
    return result.rows;
  }

  /**
   * Get warehouse capacity utilization
   */
  static async getCapacityUtilization(): Promise<{
    id: number;
    name: string;
    capacity?: number;
    total_items: number;
    utilization_percentage: number;
  }[]> {
    const result = await query(
      `SELECT w.id, w.name, w.capacity,
              SUM(i.quantity) as total_items,
              CASE 
                WHEN w.capacity > 0 THEN 
                  ROUND((SUM(i.quantity)::DECIMAL / w.capacity) * 100, 2)
                ELSE 0 
              END as utilization_percentage
       FROM warehouses w
       LEFT JOIN inventory i ON w.id = i.warehouse_id
       WHERE w.is_active = true
       GROUP BY w.id, w.name, w.capacity
       ORDER BY utilization_percentage DESC`
    );
    
    return result.rows;
  }

  /**
   * Get total warehouses count
   */
  static async getTotalCount(): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) FROM warehouses WHERE is_active = true'
    );
    
    return parseInt(result.rows[0].count);
  }

  /**
   * Get warehouses without managers
   */
  static async getWarehousesWithoutManagers(): Promise<Warehouse[]> {
    const result = await query(
      'SELECT * FROM warehouses WHERE manager_id IS NULL AND is_active = true ORDER BY name'
    );
    
    return result.rows;
  }

  /**
   * Check if warehouse name exists
   */
  static async nameExists(name: string, excludeId?: number): Promise<boolean> {
    const queryText = excludeId 
      ? 'SELECT COUNT(*) FROM warehouses WHERE name = $1 AND id != $2'
      : 'SELECT COUNT(*) FROM warehouses WHERE name = $1';
    
    const params = excludeId ? [name, excludeId] : [name];
    const result = await query(queryText, params);
    
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Get warehouse statistics
   */
  static async getWarehouseStatistics(): Promise<{
    total_warehouses: number;
    active_warehouses: number;
    warehouses_with_managers: number;
    total_capacity: number;
    total_utilized_capacity: number;
  }> {
    const result = await query(
      `SELECT 
         COUNT(*) as total_warehouses,
         COUNT(CASE WHEN is_active = true THEN 1 END) as active_warehouses,
         COUNT(CASE WHEN manager_id IS NOT NULL THEN 1 END) as warehouses_with_managers,
         COALESCE(SUM(capacity), 0) as total_capacity,
         COALESCE(SUM(
           CASE 
             WHEN capacity > 0 THEN 
               (SELECT SUM(quantity) FROM inventory WHERE warehouse_id = w.id)
             ELSE 0 
           END
         ), 0) as total_utilized_capacity
       FROM warehouses w`
    );
    
    return result.rows[0];
  }
} 