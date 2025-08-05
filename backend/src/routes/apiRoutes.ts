import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import inventoryRoutes from './inventoryRoutes';
import categoryRoutes from './categoryRoutes';
import warehouseRoutes from './warehouseRoutes';
import transactionRoutes from './transactionRoutes';
import alertRoutes from './alertRoutes';
import dashboardRoutes from './dashboardRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();
const API_VERSION = '/v1';

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management API',
    version: '1.0.0',
    endpoints: {
      auth: `${API_VERSION}/auth`,
      users: `${API_VERSION}/users`,
      products: `${API_VERSION}/products`,
      inventory: `${API_VERSION}/inventory`,
      categories: `${API_VERSION}/categories`,
      warehouses: `${API_VERSION}/warehouses`,
      transactions: `${API_VERSION}/transactions`,
      alerts: `${API_VERSION}/alerts`,
      dashboard: `${API_VERSION}/dashboard`,
      analytics: `${API_VERSION}/analytics`
    },
    documentation: 'API documentation will be available here'
  });
});

// Mount all routes
// Authentication routes (public)
router.use(`${API_VERSION}/auth`, authRoutes);

// Protected routes (require authentication)
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/products`, productRoutes);
router.use(`${API_VERSION}/inventory`, inventoryRoutes);
router.use(`${API_VERSION}/categories`, categoryRoutes);
router.use(`${API_VERSION}/warehouses`, warehouseRoutes);

// Advanced features (require authentication)
router.use(`${API_VERSION}/transactions`, transactionRoutes);
router.use(`${API_VERSION}/alerts`, alertRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardRoutes);
router.use(`${API_VERSION}/analytics`, analyticsRoutes);

export default router; 