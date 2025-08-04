import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';

const router = Router();

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, UserController.create);
router.get('/', authenticateToken, requireAdmin, UserController.getAll);
router.get('/stats', authenticateToken, requireAdmin, UserController.getStats);
router.get('/role/:role', authenticateToken, requireAdmin, UserController.getByRole);

// Protected routes with ownership check
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, UserController.getById);
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, UserController.update);
router.put('/:id/password', authenticateToken, requireOwnershipOrAdmin, UserController.changePassword);

// Admin-only delete
router.delete('/:id', authenticateToken, requireAdmin, UserController.delete);

export default router; 