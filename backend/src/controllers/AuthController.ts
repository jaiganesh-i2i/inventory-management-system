import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { 
  hashPassword, 
  comparePassword, 
  generateTokenPair, 
  verifyToken, 
  validatePasswordStrength,
  generateSecureToken
} from '../utils/auth';
import { logger } from '../utils/logger';
import { CreateUserInput } from '../types/database';

export class AuthController {
  /**
   * User registration
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
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

      // Validate password strength
      const passwordValidation = validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Password does not meet requirements',
          details: passwordValidation.errors
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

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user with hashed password
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword
      });

      // Generate tokens
      const tokens = generateTokenPair({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password_hash, ...userResponse } = user;
      
      res.status(201).json({
        success: true,
        data: {
          user: userResponse,
          tokens
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      logger.error('Error during registration:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * User login
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      // Validate required fields
      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
        return;
      }

      // Find user by username or email
      let user = await UserModel.findByUsername(username);
      if (!user) {
        user = await UserModel.findByEmail(username);
      }

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        res.status(401).json({
          success: false,
          error: 'Account is deactivated'
        });
        return;
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Generate tokens
      const tokens = generateTokenPair({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password_hash, ...userResponse } = user;
      
      res.status(200).json({
        success: true,
        data: {
          user: userResponse,
          tokens
        },
        message: 'Login successful'
      });
    } catch (error) {
      logger.error('Error during login:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
        return;
      }

      // Verify refresh token
      const decoded = verifyToken(refreshToken);
      
      // Get current user data
      const user = await UserModel.findById(decoded.userId);
      if (!user || !user.is_active) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
        return;
      }

      // Generate new token pair
      const tokens = generateTokenPair({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      res.status(200).json({
        success: true,
        data: { tokens },
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      logger.error('Error refreshing token:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  }

  /**
   * Logout (client-side token invalidation)
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success response
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
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
      logger.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Current password and new password are required'
        });
        return;
      }

      // Validate new password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: 'New password does not meet requirements',
          details: passwordValidation.errors
        });
        return;
      }

      // Get current user
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
        return;
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      const success = await UserModel.changePassword(req.user.userId, hashedPassword);
      
      if (!success) {
        res.status(500).json({
          success: false,
          error: 'Failed to update password'
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

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        });
        return;
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        res.status(200).json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
        return;
      }

      // Generate reset token
      const resetToken = generateSecureToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // In a real application, you would:
      // 1. Store the reset token in the database
      // 2. Send an email with the reset link
      // 3. Use a proper email service

      logger.info(`Password reset requested for user ${user.id}. Reset token: ${resetToken}`);

      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    } catch (error) {
      logger.error('Error requesting password reset:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Token and new password are required'
        });
        return;
      }

      // Validate new password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: 'New password does not meet requirements',
          details: passwordValidation.errors
        });
        return;
      }

      // In a real application, you would:
      // 1. Verify the reset token from the database
      // 2. Check if the token has expired
      // 3. Update the user's password
      // 4. Invalidate the reset token

      logger.info(`Password reset attempted with token: ${token}`);

      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      logger.error('Error resetting password:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 