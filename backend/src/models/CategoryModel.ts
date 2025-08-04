import { query } from '../config/database';
import { Category, QueryParams, PaginatedResponse } from '../types/database';

export class CategoryModel {
  /**
   * Create a new category
   */
  static async create(categoryData: { name: string; description?: string; parent_id?: number }): Promise<Category> {
    const { name, description, parent_id } = categoryData;
    
    const result = await query(
      `INSERT INTO categories (name, description, parent_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, parent_id]
    );
    
    return result.rows[0];
  }

  /**
   * Find category by ID
   */
  static async findById(id: number): Promise<Category | null> {
    const result = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find category by name
   */
  static async findByName(name: string): Promise<Category | null> {
    const result = await query(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get all categories with pagination and filtering
   */
  static async findAll(params: QueryParams = {}): Promise<PaginatedResponse<Category>> {
    const {
      page = 1,
      limit = 10,
      search,
      parent_id,
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
      whereConditions.push(`name ILIKE $${paramCount}`);
      queryParams.push(`%${search}%`);
    }

    if (parent_id !== undefined) {
      paramCount++;
      whereConditions.push(`parent_id = $${paramCount}`);
      queryParams.push(parent_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM categories ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT * FROM categories 
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
   * Get all categories as a tree structure
   */
  static async getCategoryTree(): Promise<Category[]> {
    const result = await query(
      `SELECT * FROM categories 
       WHERE is_active = true 
       ORDER BY parent_id NULLS FIRST, name`
    );
    
    return result.rows;
  }

  /**
   * Get subcategories of a parent category
   */
  static async getSubcategories(parentId: number): Promise<Category[]> {
    const result = await query(
      'SELECT * FROM categories WHERE parent_id = $1 AND is_active = true ORDER BY name',
      [parentId]
    );
    
    return result.rows;
  }

  /**
   * Get parent categories (categories with no parent)
   */
  static async getParentCategories(): Promise<Category[]> {
    const result = await query(
      'SELECT * FROM categories WHERE parent_id IS NULL AND is_active = true ORDER BY name'
    );
    
    return result.rows;
  }

  /**
   * Update category
   */
  static async update(id: number, updateData: { name?: string; description?: string; parent_id?: number; is_active?: boolean }): Promise<Category | null> {
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
      `UPDATE categories 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete category (soft delete by setting is_active to false)
   */
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'UPDATE categories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    return result.rowCount > 0;
  }

  /**
   * Hard delete category (use with caution)
   */
  static async hardDelete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );
    
    return result.rowCount > 0;
  }

  /**
   * Get categories with product count
   */
  static async getCategoriesWithProductCount(): Promise<{ id: number; name: string; description?: string; product_count: number }[]> {
    const result = await query(
      `SELECT c.id, c.name, c.description, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
       WHERE c.is_active = true
       GROUP BY c.id, c.name, c.description
       ORDER BY product_count DESC, c.name`
    );
    
    return result.rows;
  }

  /**
   * Get total categories count
   */
  static async getTotalCount(): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) FROM categories WHERE is_active = true'
    );
    
    return parseInt(result.rows[0].count);
  }

  /**
   * Check if category name exists
   */
  static async nameExists(name: string, excludeId?: number): Promise<boolean> {
    const queryText = excludeId 
      ? 'SELECT COUNT(*) FROM categories WHERE name = $1 AND id != $2'
      : 'SELECT COUNT(*) FROM categories WHERE name = $1';
    
    const params = excludeId ? [name, excludeId] : [name];
    const result = await query(queryText, params);
    
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Get category hierarchy (parent -> child relationships)
   */
  static async getCategoryHierarchy(): Promise<{ id: number; name: string; parent_id?: number; level: number }[]> {
    const result = await query(
      `WITH RECURSIVE category_tree AS (
         SELECT id, name, parent_id, 0 as level
         FROM categories
         WHERE parent_id IS NULL AND is_active = true
         
         UNION ALL
         
         SELECT c.id, c.name, c.parent_id, ct.level + 1
         FROM categories c
         JOIN category_tree ct ON c.parent_id = ct.id
         WHERE c.is_active = true
       )
       SELECT * FROM category_tree
       ORDER BY level, name`
    );
    
    return result.rows;
  }
} 