import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All transaction routes require authentication and manager/admin permissions
router.post('/', authenticateToken, requireManagerOrAdmin, TransactionController.createTransaction);
router.get('/inventory/:inventoryId', authenticateToken, TransactionController.getInventoryTransactions);
router.get('/warehouse/:warehouseId', authenticateToken, TransactionController.getWarehouseTransactions);
router.get('/stats', authenticateToken, requireManagerOrAdmin, TransactionController.getTransactionStats);

export default router; 