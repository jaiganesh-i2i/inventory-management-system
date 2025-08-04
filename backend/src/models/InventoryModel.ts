import { query, getClient } from '../config/database';
import { 
  Inventory, 
  InventoryWithDetails,
  CreateInventoryInput, 
  UpdateInventoryInput, 
  QueryParams, 
  PaginatedResponse 
} from '../types/database';

export class InventoryModel {
  /**
   * Create a new inventory record
   */
  static async create(inventoryData: CreateInventoryInput): Promise<Inventory> {
    const { product_id, warehouse_id, quantity, min_threshold = 0, max_threshold } = inventoryData;
    
    const result = await query(
      `INSERT INTO inventory (product_id, warehouse_id, quantity, min_threshold, max_threshold)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [product_id, warehouse_id, quantity, min_threshold, max_threshold]
    );
    
    return result.rows[0];
  }

  /**
   * Find inventory by ID
   */
  static async findById(id: number): Promise<Inventory | null> {
    const result = await query(
      'SELECT * FROM inventory WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find inventory by product and warehouse
   */
  static async findByProductAndWarehouse(productId: number, warehouseId: number): Promise<Inventory | null> {
    const result = await query(
      'SELECT * FROM inventory WHERE product_id = $1 AND warehouse_id = $2',
      [productId, warehouseId]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get inventory with product and warehouse details
   */
  static async findByIdWithDetails(id: number): Promise<InventoryWithDetails | null> {
    const result = await query(
      `SELECT i.*, p.name as product_name, p.sku, p.description as product_description,
              w.name as warehouse_name, w.location as warehouse_location
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       JOIN warehouses w ON i.warehouse_id = w.id
       WHERE i.id = $1`,
      [id]
    );
    
    if (!result.rows[0]) return null;

    const inventory = result.rows[0];
    return {
      ...inventory,
      product: {
        id: inventory.product_id,
        name: inventory.product_name,
        sku: inventory.sku,
        description: inventory.product_description,
        is_active: true,
        created_at: inventory.created_at,
        updated_at: inventory.updated_at
      },
      warehouse: {
        id: inventory.warehouse_id,
        name: inventory.warehouse_name,
        location: inventory.warehouse_location,
        is_active: true,
        created_at: inventory.created_at,
        updated_at: inventory.updated_at
      }
    };
  }

  /**
   * Get all inventory with pagination and filtering
   */
  static async findAll(params: QueryParams = {}): Promise<PaginatedResponse<Inventory>> {
    const {
      page = 1,
      limit = 10,
      product_id,
      warehouse_id,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = params;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (product_id) {
      paramCount++;
      whereConditions.push(`i.product_id = $${paramCount}`);
      queryParams.push(product_id);
    }

    if (warehouse_id) {
      paramCount++;
      whereConditions.push(`i.warehouse_id = $${paramCount}`);
      queryParams.push(warehouse_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM inventory i ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT i.* FROM inventory i
       ${whereClause}
       ORDER BY i.${sortBy} ${sortOrder.toUpperCase()}
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
   * Get all inventory with product and warehouse details
   */
  static async findAllWithDetails(params: QueryParams = {}): Promise<PaginatedResponse<InventoryWithDetails>> {
    const {
      page = 1,
      limit = 10,
      product_id,
      warehouse_id,
      sortBy = 'i.created_at',
      sortOrder = 'desc'
    } = params;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (product_id) {
      paramCount++;
      whereConditions.push(`i.product_id = $${paramCount}`);
      queryParams.push(product_id);
    }

    if (warehouse_id) {
      paramCount++;
      whereConditions.push(`i.warehouse_id = $${paramCount}`);
      queryParams.push(warehouse_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM inventory i ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT i.*, p.name as product_name, p.sku, p.description as product_description,
              w.name as warehouse_name, w.location as warehouse_location
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       JOIN warehouses w ON i.warehouse_id = w.id
       ${whereClause}
       ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...queryParams, limit, offset]
    );

    const inventory = dataResult.rows.map((row: any) => ({
      ...row,
      product: {
        id: row.product_id,
        name: row.product_name,
        sku: row.sku,
        description: row.product_description,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      },
      warehouse: {
        id: row.warehouse_id,
        name: row.warehouse_name,
        location: row.warehouse_location,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      }
    }));

    return {
      data: inventory,
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
   * Update inventory
   */
  static async update(id: number, updateData: UpdateInventoryInput): Promise<Inventory | null> {
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
      `UPDATE inventory 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Update inventory quantity (with transaction safety)
   */
  static async updateQuantity(id: number, quantityChange: number): Promise<Inventory | null> {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get current inventory
      const currentResult = await client.query(
        'SELECT * FROM inventory WHERE id = $1 FOR UPDATE',
        [id]
      );
      
      if (!currentResult.rows[0]) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const current = currentResult.rows[0];
      const newQuantity = Math.max(0, current.quantity + quantityChange);
      
      // Update inventory
      const updateResult = await client.query(
        `UPDATE inventory 
         SET quantity = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [newQuantity, id]
      );
      
      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reserve inventory quantity
   */
  static async reserveQuantity(id: number, quantity: number): Promise<Inventory | null> {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get current inventory
      const currentResult = await client.query(
        'SELECT * FROM inventory WHERE id = $1 FOR UPDATE',
        [id]
      );
      
      if (!currentResult.rows[0]) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const current = currentResult.rows[0];
      const availableQuantity = current.quantity - current.reserved_quantity;
      
      if (availableQuantity < quantity) {
        await client.query('ROLLBACK');
        throw new Error('Insufficient available quantity');
      }
      
      const newReservedQuantity = current.reserved_quantity + quantity;
      
      // Update inventory
      const updateResult = await client.query(
        `UPDATE inventory 
         SET reserved_quantity = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [newReservedQuantity, id]
      );
      
      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Release reserved inventory quantity
   */
  static async releaseReservedQuantity(id: number, quantity: number): Promise<Inventory | null> {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get current inventory
      const currentResult = await client.query(
        'SELECT * FROM inventory WHERE id = $1 FOR UPDATE',
        [id]
      );
      
      if (!currentResult.rows[0]) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const current = currentResult.rows[0];
      const newReservedQuantity = Math.max(0, current.reserved_quantity - quantity);
      
      // Update inventory
      const updateResult = await client.query(
        `UPDATE inventory 
         SET reserved_quantity = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [newReservedQuantity, id]
      );
      
      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete inventory record
   */
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM inventory WHERE id = $1',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Get inventory by product
   */
  static async findByProduct(productId: number): Promise<Inventory[]> {
    const result = await query(
      'SELECT * FROM inventory WHERE product_id = $1 ORDER BY warehouse_id',
      [productId]
    );
    
    return result.rows;
  }

  /**
   * Get inventory by warehouse
   */
  static async findByWarehouse(warehouseId: number): Promise<Inventory[]> {
    const result = await query(
      'SELECT * FROM inventory WHERE warehouse_id = $1 ORDER BY product_id',
      [warehouseId]
    );
    
    return result.rows;
  }

  /**
   * Get low stock inventory
   */
  static async getLowStockInventory(): Promise<InventoryWithDetails[]> {
    const result = await query(
      `SELECT i.*, p.name as product_name, p.sku, p.description as product_description,
              w.name as warehouse_name, w.location as warehouse_location
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       JOIN warehouses w ON i.warehouse_id = w.id
       WHERE i.quantity <= i.min_threshold
       ORDER BY i.quantity ASC`
    );
    
    return result.rows.map((row: any) => ({
      ...row,
      product: {
        id: row.product_id,
        name: row.product_name,
        sku: row.sku,
        description: row.product_description,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      },
      warehouse: {
        id: row.warehouse_id,
        name: row.warehouse_name,
        location: row.warehouse_location,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      }
    }));
  }

  /**
   * Get out of stock inventory
   */
  static async getOutOfStockInventory(): Promise<InventoryWithDetails[]> {
    const result = await query(
      `SELECT i.*, p.name as product_name, p.sku, p.description as product_description,
              w.name as warehouse_name, w.location as warehouse_location
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       JOIN warehouses w ON i.warehouse_id = w.id
       WHERE i.quantity = 0
       ORDER BY p.name`
    );
    
    return result.rows.map((row: any) => ({
      ...row,
      product: {
        id: row.product_id,
        name: row.product_name,
        sku: row.sku,
        description: row.product_description,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      },
      warehouse: {
        id: row.warehouse_id,
        name: row.warehouse_name,
        location: row.warehouse_location,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      }
    }));
  }

  /**
   * Get total inventory value
   */
  static async getTotalValue(): Promise<number> {
    const result = await query(
      `SELECT SUM(i.quantity) as total_quantity
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       WHERE p.is_active = true`
    );
    
    return parseInt(result.rows[0].total_quantity) || 0;
  }

  /**
   * Get inventory summary by warehouse
   */
  static async getSummaryByWarehouse(): Promise<{ warehouse_id: number; warehouse_name: string; total_items: number; total_products: number }[]> {
    const result = await query(
      `SELECT w.id as warehouse_id, w.name as warehouse_name,
              COUNT(DISTINCT i.product_id) as total_products,
              SUM(i.quantity) as total_items
       FROM warehouses w
       LEFT JOIN inventory i ON w.id = i.warehouse_id
       WHERE w.is_active = true
       GROUP BY w.id, w.name
       ORDER BY total_items DESC`
    );
    
    return result.rows;
  }

  /**
   * Check if inventory exists for product and warehouse
   */
  static async exists(productId: number, warehouseId: number): Promise<boolean> {
    const result = await query(
      'SELECT COUNT(*) FROM inventory WHERE product_id = $1 AND warehouse_id = $2',
      [productId, warehouseId]
    );
    
    return parseInt(result.rows[0].count) > 0;
  }
} 