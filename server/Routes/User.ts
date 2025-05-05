import { Router } from 'express';
import { register, login, logout, getUserList, getUser } from '../Controllers/User';
import { authenticate } from '../Middleware/auth';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/list', authenticate, getUserList);
router.get('/get-auth', authenticate, getUser);

export default router;
