import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { createEventHandler, deleteEventHandler, featuredEvents, listEvents, singleEvent, updateEventHandler } from '../controllers/eventController.js';

const router = Router();

router.get('/', listEvents);
router.get('/featured', featuredEvents);
router.get('/:id', singleEvent);
router.post('/', authenticate, authorizeRoles('admin'), createEventHandler);
router.put('/:id', authenticate, authorizeRoles('admin'), updateEventHandler);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteEventHandler);

export default router;