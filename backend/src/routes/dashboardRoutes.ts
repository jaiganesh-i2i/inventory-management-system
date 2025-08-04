import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.get('/overview', authenticateToken, DashboardController.getOverview);
router.get('/inventory-analytics', authenticateToken, DashboardController.getInventoryAnalytics);
router.get('/transaction-analytics', authenticateToken, DashboardController.getTransactionAnalytics);
router.get('/warehouse-analytics', authenticateToken, DashboardController.getWarehouseAnalytics);
router.get('/alert-analytics', authenticateToken, DashboardController.getAlertAnalytics);
router.get('/performance-metrics', authenticateToken, requireManagerOrAdmin, DashboardController.getPerformanceMetrics);
router.post('/reports', authenticateToken, requireManagerOrAdmin, DashboardController.generateReport);

export default router; 