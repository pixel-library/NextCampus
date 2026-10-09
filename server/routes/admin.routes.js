import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Protected admin endpoint requiring JWT authentication & admin role
router.get('/stats', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), adminController.handleGetAdminStats);

export default router;
