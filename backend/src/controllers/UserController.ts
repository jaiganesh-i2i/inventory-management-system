import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { CreateUserInput, UpdateUserInput, QueryParams } from '../types/database';
import { logger } from '../utils/logger';
import { safeParseInt, safeParseBoolean, safeParseSortOrder } from '../utils/helpers';

export class UserController {
  /**
   * Create a new user
   * POST /api/users
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserInput = req.body;
      
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: username, email, password'
        });
        return;
      }

      // Check if username already exists
      const existingUser = await UserModel.findByUsername(userData.username);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'Username already exists'
        });
        return;
      }

      // Check if email already exists
      const existingEmail = await UserModel.findByEmail(userData.email);
      if (existingEmail) {
        res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
        return;
      }

      const user = await UserModel.create(userData);
      
      // Remove password from response
      const { password_hash, ...userResponse } = user;
      
      res.status(201).json({
        success: true,
        data: userResponse,
        message: 'User created successfully'
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all users with pagination and filtering
   * GET /api/users
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        role: req.query.role as string,
        is_active: safeParseBoolean(req.query.is_active as string),
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await UserModel.findAll(queryParams);
      
      // Remove password_hash from all users
      const usersWithoutPassword = result.data.map(user => {
        const { password_hash, ...userResponse } = user;
        return userResponse;
      });

      res.status(200).json({
        success: true,
        data: usersWithoutPassword,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      const user = await UserModel.findById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Remove password from response
      const { password_hash, ...userResponse } = user;
      
      res.status(200).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      logger.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update user
   * PUT /api/users/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      const updateData: UpdateUserInput = req.body;
      
      // Check if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Check for username conflicts if username is being updated
      if (updateData.username && updateData.username !== existingUser.username) {
        const usernameExists = await UserModel.findByUsername(updateData.username);
        if (usernameExists) {
          res.status(409).json({
            success: false,
            error: 'Username already exists'
          });
          return;
        }
      }

      // Check for email conflicts if email is being updated
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await UserModel.findByEmail(updateData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: 'Email already exists'
          });
          return;
        }
      }

      const updatedUser = await UserModel.update(id, updateData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Remove password from response
      const { password_hash, ...userResponse } = updatedUser;
      
      res.status(200).json({
        success: true,
        data: userResponse,
        message: 'User updated successfully'
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/users/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      // Check if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const deleted = await UserModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get users by role
   * GET /api/users/role/:role
   */
  static async getByRole(req: Request, res: Response): Promise<void> {
    try {
      const role = req.params.role;
      
      if (!role) {
        res.status(400).json({
          success: false,
          error: 'Role parameter is required'
        });
        return;
      }

      const users = await UserModel.findByRole(role);
      
      // Remove password_hash from all users
      const usersWithoutPassword = users.map(user => {
        const { password_hash, ...userResponse } = user;
        return userResponse;
      });

      res.status(200).json({
        success: true,
        data: usersWithoutPassword
      });
    } catch (error) {
      logger.error('Error fetching users by role:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user statistics
   * GET /api/users/stats
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const [activeCount, countByRole] = await Promise.all([
        UserModel.getActiveCount(),
        UserModel.getCountByRole()
      ]);

      res.status(200).json({
        success: true,
        data: {
          active_users: activeCount,
          users_by_role: countByRole
        }
      });
    } catch (error) {
      logger.error('Error fetching user statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Change user password
   * PUT /api/users/:id/password
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      const { newPassword } = req.body;
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      if (!newPassword) {
        res.status(400).json({
          success: false,
          error: 'New password is required'
        });
        return;
      }

      // Check if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const success = await UserModel.changePassword(id, newPassword);
      
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 