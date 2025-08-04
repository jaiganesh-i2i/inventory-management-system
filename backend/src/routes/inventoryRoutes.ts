import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All inventory routes require authentication
router.post('/', authenticateToken, requireManagerOrAdmin, InventoryController.create);
router.get('/', authenticateToken, InventoryController.getAll);
router.get('/with-details', authenticateToken, InventoryController.getAllWithDetails);
router.get('/low-stock', authenticateToken, InventoryController.getLowStock);
router.get('/out-of-stock', authenticateToken, InventoryController.getOutOfStock);
router.get('/summary/warehouse', authenticateToken, InventoryController.getSummaryByWarehouse);
router.get('/total-value', authenticateToken, InventoryController.getTotalValue);
router.get('/product/:productId', authenticateToken, InventoryController.getByProduct);
router.get('/warehouse/:warehouseId', authenticateToken, InventoryController.getByWarehouse);
router.get('/:id', authenticateToken, InventoryController.getById);
router.get('/:id/with-details', authenticateToken, InventoryController.getByIdWithDetails);
router.put('/:id', authenticateToken, requireManagerOrAdmin, InventoryController.update);
router.put('/:id/quantity', authenticateToken, requireManagerOrAdmin, InventoryController.updateQuantity);
router.put('/:id/reserve', authenticateToken, requireManagerOrAdmin, InventoryController.reserveQuantity);
router.put('/:id/release', authenticateToken, requireManagerOrAdmin, InventoryController.releaseReservedQuantity);
router.delete('/:id', authenticateToken, requireManagerOrAdmin, InventoryController.delete);

export default router; 