import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all analytics routes
router.use(authenticateToken);

/**
 * @route GET /api/v1/analytics/overview
 * @desc Get comprehensive analytics overview
 * @access Private
 */
router.get('/overview', AnalyticsController.getAnalyticsOverview);

/**
 * @route GET /api/v1/analytics/sales-trends
 * @desc Get sales trends with predictions
 * @access Private
 */
router.get('/sales-trends', AnalyticsController.getSalesTrends);

/**
 * @route GET /api/v1/analytics/inventory-metrics
 * @desc Get inventory metrics by category
 * @access Private
 */
router.get('/inventory-metrics', AnalyticsController.getInventoryMetrics);

/**
 * @route GET /api/v1/analytics/category-performance
 * @desc Get category performance analysis
 * @access Private
 */
router.get('/category-performance', AnalyticsController.getCategoryPerformance);

/**
 * @route GET /api/v1/analytics/predictive-insights
 * @desc Get predictive insights and recommendations
 * @access Private
 */
router.get('/predictive-insights', AnalyticsController.getPredictiveInsights);

/**
 * @route GET /api/v1/analytics/correlation-analysis
 * @desc Get correlation analysis between factors
 * @access Private
 */
router.get('/correlation-analysis', AnalyticsController.getCorrelationAnalysis);

/**
 * @route GET /api/v1/analytics/seasonality
 * @desc Get seasonality data and patterns
 * @access Private
 */
router.get('/seasonality', AnalyticsController.getSeasonalityData);

/**
 * @route POST /api/v1/analytics/custom-report
 * @desc Generate custom report based on parameters
 * @access Private
 */
router.post('/custom-report', AnalyticsController.generateCustomReport);

/**
 * @route GET /api/v1/analytics/export/:reportId
 * @desc Export report in specified format (PDF, Excel, CSV)
 * @access Private
 */
router.get('/export/:reportId', AnalyticsController.exportReport);

/**
 * @route POST /api/v1/analytics/save-template
 * @desc Save report template for future use
 * @access Private
 */
router.post('/save-template', AnalyticsController.saveReportTemplate);

/**
 * @route GET /api/v1/analytics/templates
 * @desc Get saved report templates
 * @access Private
 */
router.get('/templates', AnalyticsController.getReportTemplates);

export default router; 