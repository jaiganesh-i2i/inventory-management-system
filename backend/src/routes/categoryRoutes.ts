import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All category routes require authentication
router.post('/', authenticateToken, requireManagerOrAdmin, CategoryController.create);
router.get('/', authenticateToken, CategoryController.getAll);
router.get('/tree', authenticateToken, CategoryController.getCategoryTree);
router.get('/hierarchy', authenticateToken, CategoryController.getCategoryHierarchy);
router.get('/with-product-count', authenticateToken, CategoryController.getCategoriesWithProductCount);
router.get('/stats', authenticateToken, CategoryController.getStats);
router.get('/:id', authenticateToken, CategoryController.getById);
router.get('/:id/subcategories', authenticateToken, CategoryController.getSubcategories);
router.get('/:id/parents', authenticateToken, CategoryController.getParentCategories);
router.put('/:id', authenticateToken, requireManagerOrAdmin, CategoryController.update);
router.delete('/:id', authenticateToken, requireManagerOrAdmin, CategoryController.delete);

export default router; 