import { query, getClient } from '../config/database';
import { User, CreateUserInput, UpdateUserInput, QueryParams, PaginatedResponse } from '../types/database';
import bcrypt from 'bcrypt';

export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: CreateUserInput): Promise<User> {
    const { username, email, password, role = 'user' } = userData;
    
    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const result = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [username, email, password_hash, role]
    );
    
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get all users with pagination and filtering
   */
  static async findAll(params: QueryParams = {}): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
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
      whereConditions.push(`(username ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (role) {
      paramCount++;
      whereConditions.push(`role = $${paramCount}`);
      queryParams.push(role);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramCount++;
    const dataResult = await query(
      `SELECT * FROM users 
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
   * Update user
   */
  static async update(id: number, updateData: UpdateUserInput): Promise<User | null> {
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
      `UPDATE users 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Update user's last login
   */
  static async updateLastLogin(id: number): Promise<void> {
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  /**
   * Delete user (soft delete by setting is_active to false)
   */
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Hard delete user (use with caution)
   */
  static async hardDelete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Verify password
   */
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  /**
   * Change password
   */
  static async changePassword(id: number, newPassword: string): Promise<boolean> {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    const result = await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [password_hash, id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Get users by role
   */
  static async findByRole(role: string): Promise<User[]> {
    const result = await query(
      'SELECT * FROM users WHERE role = $1 AND is_active = true ORDER BY created_at DESC',
      [role]
    );
    
    return result.rows;
  }

  /**
   * Get active users count
   */
  static async getActiveCount(): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) FROM users WHERE is_active = true'
    );
    
    return parseInt(result.rows[0].count);
  }

  /**
   * Get users count by role
   */
  static async getCountByRole(): Promise<{ role: string; count: number }[]> {
    const result = await query(
      `SELECT role, COUNT(*) as count 
       FROM users 
       WHERE is_active = true 
       GROUP BY role 
       ORDER BY count DESC`
    );
    
    return result.rows;
  }
} 