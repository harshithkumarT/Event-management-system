import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { changeUserRole, changeUserStatus, dashboardAnalytics, revenueReport, usersList } from '../controllers/adminController.js';

const router = Router();

router.get('/analytics', authenticate, authorizeRoles('admin'), dashboardAnalytics);
router.get('/users', authenticate, authorizeRoles('admin'), usersList);
router.patch('/users/:id/role', authenticate, authorizeRoles('admin'), changeUserRole);
router.patch('/users/:id/status', authenticate, authorizeRoles('admin'), changeUserStatus);
router.get('/reports/revenue', authenticate, authorizeRoles('admin'), revenueReport);

export default router;