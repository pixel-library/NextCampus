import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateFields } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateFields(['name', 'email', 'password']), authController.handleRegister);
router.post('/login', validateFields(['email', 'password']), authController.handleLogin);
router.get('/me', authenticateUser, authController.handleGetCurrentUser);

export default router;
