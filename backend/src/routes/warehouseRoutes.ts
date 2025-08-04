import { Router } from 'express';
import { WarehouseController } from '../controllers/WarehouseController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All warehouse routes require authentication
router.post('/', authenticateToken, requireManagerOrAdmin, WarehouseController.create);
router.get('/', authenticateToken, WarehouseController.getAll);
router.get('/with-managers', authenticateToken, WarehouseController.getAllWithManagers);
router.get('/with-inventory-summary', authenticateToken, WarehouseController.getWarehousesWithInventorySummary);
router.get('/capacity-utilization', authenticateToken, WarehouseController.getCapacityUtilization);
router.get('/without-managers', authenticateToken, WarehouseController.getWarehousesWithoutManagers);
router.get('/stats', authenticateToken, WarehouseController.getStats);
router.get('/manager/:managerId', authenticateToken, WarehouseController.getByManager);
router.get('/:id', authenticateToken, WarehouseController.getById);
router.get('/:id/with-manager', authenticateToken, WarehouseController.getByIdWithManager);
router.put('/:id', authenticateToken, requireManagerOrAdmin, WarehouseController.update);
router.delete('/:id', authenticateToken, requireManagerOrAdmin, WarehouseController.delete);

export default router; 