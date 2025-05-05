import { Router } from 'express';
import { authenticate } from '../Middleware/auth';
import { createEvent, getEvents, deleteEvent, updateEvent, attendEvent, unattendEvent, getEventById } from '../Controllers/Event';

const router = Router();

// Protected event routes - all require authentication
router.post('/create', authenticate, createEvent);
router.get('/list', authenticate, getEvents);
router.get('/:eventId', authenticate, getEventById);
router.delete('/:eventId', authenticate, deleteEvent);
router.put('/:eventId', authenticate, updateEvent);
router.post('/:eventId/attend', authenticate, attendEvent);
router.post('/:eventId/unattend', authenticate, unattendEvent);

export default router;
