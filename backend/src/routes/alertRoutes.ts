import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';

const router = Router();

// All alert routes require authentication
router.get('/', authenticateToken, AlertController.getAlerts);
router.get('/stats', authenticateToken, requireManagerOrAdmin, AlertController.getAlertStats);
router.get('/reorder-suggestions', authenticateToken, requireManagerOrAdmin, AlertController.getReorderSuggestions);
router.get('/thresholds/:inventoryId', authenticateToken, AlertController.getAlertThresholds);
router.post('/thresholds', authenticateToken, requireManagerOrAdmin, AlertController.setAlertThresholds);
router.post('/:alertId/acknowledge', authenticateToken, AlertController.acknowledgeAlert);

export default router; 