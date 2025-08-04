import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All product routes require authentication
router.post('/', authenticateToken, requireManagerOrAdmin, ProductController.create);
router.get('/', authenticateToken, ProductController.getAll);
router.get('/with-category', authenticateToken, ProductController.getAllWithCategory);
router.get('/low-stock', authenticateToken, ProductController.getLowStock);
router.get('/out-of-stock', authenticateToken, ProductController.getOutOfStock);
router.get('/stats', authenticateToken, ProductController.getStats);
router.get('/search/:identifier', authenticateToken, ProductController.searchByIdentifier);
router.get('/category/:categoryId', authenticateToken, ProductController.getByCategory);
router.get('/:id', authenticateToken, ProductController.getById);
router.get('/:id/with-category', authenticateToken, ProductController.getByIdWithCategory);
router.get('/:id/with-inventory', authenticateToken, ProductController.getByIdWithInventory);
router.put('/:id', authenticateToken, requireManagerOrAdmin, ProductController.update);
router.delete('/:id', authenticateToken, requireManagerOrAdmin, ProductController.delete);

export default router; 