import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateFields } from '../middleware/validation.js';

const router = express.Router();

// Middleware to ensure either email or identifier and password are present
const validateLoginInput = (req, res, next) => {
  const { email, identifier, password } = req.body;
  if ((!email && !identifier) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Email/Identifier and password are required.',
    });
  }
  next();
};

router.post('/register', validateFields(['name', 'email', 'password']), authController.handleRegister);
router.post('/login', validateLoginInput, authController.handleLogin);
router.get('/me', authenticateUser, authController.handleGetCurrentUser);
router.put('/profile', authenticateUser, authController.handleUpdateProfile);
router.put('/change-password', authenticateUser, validateFields(['currentPassword', 'newPassword']), authController.handleChangePassword);

export default router;
