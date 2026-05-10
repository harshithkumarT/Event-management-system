import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { myNotifications, readAllNotifications, readNotification } from '../controllers/notificationController.js';

const router = Router();

router.get('/', authenticate, myNotifications);
router.patch('/read-all', authenticate, readAllNotifications);
router.patch('/:id/read', authenticate, readNotification);

export default router;