import { query } from '../config/database';
import { 
  Product, 
  ProductWithCategory, 
  ProductWithInventory,
  CreateProductInput, 
  UpdateProductInput, 
  QueryParams, 
  PaginatedResponse 
} from '../types/database';

export class ProductModel {
  /**
   * Create a new product
   */
  static async create(productData: CreateProductInput): Promise<Product> {
    const { 
      name, 
      description, 
      category_id, 
      sku, 
      barcode, 
      specifications, 
      unit_of_measure = 'piece' 
    } = productData;
    
    const result = await query(
      `INSERT INTO products (name, description, category_id, sku, barcode, specifications, unit_of_measure)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, category_id, sku, barcode, specifications, unit_of_measure]
    );
    
    return result.rows[0];
  }

  /**
   * Find product by ID
   */
  static async findById(id: number): Promise<Product | null> {
    const result = await query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find product by SKU
   */
  static async findBySku(sku: string): Promise<Product | null> {
    const result = await query(
      'SELECT * FROM products WHERE sku = $1',
      [sku]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find product by barcode
   */
  static async findByBarcode(barcode: string): Promise<Product | null> {
    const result = await query(
      'SELECT * FROM products WHERE barcode = $1',
      [barcode]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get product with category information
   */
  static async findByIdWithCategory(id: number): Promise<ProductWithCategory | null> {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.description as category_description
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (!result.rows[0]) return null;

    const product = result.rows[0];
    return {
      ...product,
      category: product.category_id ? {
        id: product.category_id,
        name: product.category_name,
        description: product.category_description,
        is_active: true,
        created_at: product.created_at,
        updated_at: product.updated_at
      } : undefined
    };
  }

  /**
   * Get product with inventory information
   */
  static async findByIdWithInventory(id: number): Promise<ProductWithInventory | null> {
    const result = await query(
      `SELECT p.*, 
              i.id as inventory_id, i.warehouse_id, i.quantity, i.min_threshold, 
              i.max_threshold, i.reserved_quantity, i.created_at as inventory_created_at,
              w.name as warehouse_name, w.location as warehouse_location
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       LEFT JOIN warehouses w ON i.warehouse_id = w.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (!result.rows[0]) return null;

    const product = result.rows[0];
    const inventory = result.rows.map((row: any) => ({
      id: row.inventory_id,
      product_id: row.id,
      warehouse_id: row.warehouse_id,
      quantity: row.quantity,
      min_threshold: row.min_threshold,
      max_threshold: row.max_threshold,
      reserved_quantity: row.reserved_quantity,
      created_at: row.inventory_created_at,
      updated_at: row.inventory_created_at
    })).filter((inv: any) => inv.id !== null);

    return {
      ...product,
      inventory
    };
  }

  /**
   * Get all products with pagination and filtering
   */
  static async findAll(params: QueryParams = {}): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      is_active,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = params;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (category_id) {
      paramCount++;
      whereConditions.push(`p.category_id = $${paramCount}`);
      queryParams.push(category_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`p.is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM products p ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT p.* FROM products p
       ${whereClause}
       ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}
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
   * Get all products with category information
   */
  static async findAllWithCategory(params: QueryParams = {}): Promise<PaginatedResponse<ProductWithCategory>> {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      is_active,
      sortBy = 'p.created_at',
      sortOrder = 'desc'
    } = params;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (category_id) {
      paramCount++;
      whereConditions.push(`p.category_id = $${paramCount}`);
      queryParams.push(category_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`p.is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM products p ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT p.*, c.name as category_name, c.description as category_description
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...queryParams, limit, offset]
    );

    const products = dataResult.rows.map((row: any) => ({
      ...row,
      category: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        is_active: true,
        created_at: row.created_at,
        updated_at: row.updated_at
      } : undefined
    }));

    return {
      data: products,
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
   * Update product
   */
  static async update(id: number, updateData: UpdateProductInput): Promise<Product | null> {
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
      `UPDATE products 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete product (soft delete by setting is_active to false)
   */
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Hard delete product (use with caution)
   */
  static async hardDelete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Get products by category
   */
  static async findByCategory(categoryId: number): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE category_id = $1 AND is_active = true ORDER BY name',
      [categoryId]
    );
    
    return result.rows;
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(): Promise<Product[]> {
    const result = await query(
      `SELECT DISTINCT p.* 
       FROM products p
       JOIN inventory i ON p.id = i.product_id
       WHERE i.quantity <= i.min_threshold AND p.is_active = true
       ORDER BY p.name`
    );
    
    return result.rows;
  }

  /**
   * Get out of stock products
   */
  static async getOutOfStockProducts(): Promise<Product[]> {
    const result = await query(
      `SELECT DISTINCT p.* 
       FROM products p
       JOIN inventory i ON p.id = i.product_id
       WHERE i.quantity = 0 AND p.is_active = true
       ORDER BY p.name`
    );
    
    return result.rows;
  }

  /**
   * Get products count by category
   */
  static async getCountByCategory(): Promise<{ category_id: number; category_name: string; count: number }[]> {
    const result = await query(
      `SELECT p.category_id, c.name as category_name, COUNT(*) as count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true
       GROUP BY p.category_id, c.name
       ORDER BY count DESC`
    );
    
    return result.rows;
  }

  /**
   * Get total products count
   */
  static async getTotalCount(): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) FROM products WHERE is_active = true'
    );
    
    return parseInt(result.rows[0].count);
  }

  /**
   * Check if SKU exists
   */
  static async skuExists(sku: string, excludeId?: number): Promise<boolean> {
    const queryText = excludeId 
      ? 'SELECT COUNT(*) FROM products WHERE sku = $1 AND id != $2'
      : 'SELECT COUNT(*) FROM products WHERE sku = $1';
    
    const params = excludeId ? [sku, excludeId] : [sku];
    const result = await query(queryText, params);
    
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Check if barcode exists
   */
  static async barcodeExists(barcode: string, excludeId?: number): Promise<boolean> {
    const queryText = excludeId 
      ? 'SELECT COUNT(*) FROM products WHERE barcode = $1 AND id != $2'
      : 'SELECT COUNT(*) FROM products WHERE barcode = $1';
    
    const params = excludeId ? [barcode, excludeId] : [barcode];
    const result = await query(queryText, params);
    
    return parseInt(result.rows[0].count) > 0;
  }
} 