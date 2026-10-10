import express from 'express';
import * as careController from '../controllers/care.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// General & Student Routes
router.get('/complaints', authenticateUser, careController.handleGetComplaints);
router.get('/complaints/:id', authenticateUser, careController.handleGetComplaintById);
router.post('/complaints', authenticateUser, upload.array('attachments', 3), careController.handleCreateComplaint);

// Administrative & Technician Routes (Protected: Admin & Staff only)
router.get('/staff', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleGetStaffList);
router.patch('/complaints/:id', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);
router.post('/complaints/:id/assign', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAssignStaff);
router.post('/complaints/:id/status', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);
router.post('/complaints/:id/student-update', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddPublicUpdate);
router.post('/complaints/:id/internal-notes', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddInternalNote);

export default router;

