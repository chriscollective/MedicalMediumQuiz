import express from 'express';
import {
  login,
  verifyToken,
  logout,
  getCurrentAdmin,\n  changePassword
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/verify', verifyToken);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentAdmin,\n  changePassword);

export default router;
