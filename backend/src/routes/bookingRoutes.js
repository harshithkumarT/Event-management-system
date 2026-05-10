import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { adminBookings, adminDecision, bookingDetails, bookingHistory, bookEvent, cancelBookingHandler } from '../controllers/bookingController.js';

const router = Router();

router.post('/', authenticate, bookEvent);
router.get('/me/history', authenticate, bookingHistory);
router.get('/admin', authenticate, authorizeRoles('admin'), adminBookings);
router.get('/:id', authenticate, bookingDetails);
router.patch('/:id/cancel', authenticate, cancelBookingHandler);
router.patch('/:id/decision', authenticate, authorizeRoles('admin'), adminDecision);

export default router;