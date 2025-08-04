import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken, rateLimit } from '../middleware/auth';

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit(100, 15 * 60 * 1000); // 100 requests per 15 minutes for development

// Public routes (no authentication required)
router.post('/register', authRateLimit, AuthController.register);
router.post('/login', authRateLimit, AuthController.login);
router.post('/refresh', authRateLimit, AuthController.refreshToken);
router.post('/forgot-password', authRateLimit, AuthController.forgotPassword);
router.post('/reset-password', authRateLimit, AuthController.resetPassword);

// Protected routes (authentication required)
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/me', authenticateToken, AuthController.getProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);

export default router; 