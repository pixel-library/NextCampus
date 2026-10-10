import express from 'express';
import * as careController from '../controllers/care.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// General & Student Routes
router.get('/complaints', authenticateUser, careController.handleGetComplaints);
router.get('/complaints/:id', authenticateUser, careController.handleGetComplaintById);
router.post('/complaints', authenticateUser, upload.array('attachments', 3), careController.handleCreateComplaint);
router.get('/my-complaints', authenticateUser, careController.handleGetComplaints);

// Administrative & Technician Routes (Protected: Admin & Staff only)
router.get('/staff', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleGetStaffList);
router.get('/admin/complaints', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleGetComplaints);

router.patch('/complaints/:id', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);
router.put('/complaints/:id', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);

router.post('/complaints/:id/assign', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAssignStaff);
router.patch('/complaints/:id/assign', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAssignStaff);
router.post('/admin/complaints/:id/assign', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAssignStaff);
router.patch('/admin/complaints/:id/assign', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAssignStaff);

router.post('/complaints/:id/status', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);
router.patch('/complaints/:id/status', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);
router.post('/admin/complaints/:id/status', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);
router.patch('/admin/complaints/:id/status', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);

router.post('/complaints/:id/student-update', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddPublicUpdate);
router.post('/complaints/:id/public-updates', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddPublicUpdate);
router.post('/admin/complaints/:id/student-update', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddPublicUpdate);
router.post('/admin/complaints/:id/public-updates', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddPublicUpdate);

router.post('/complaints/:id/internal-notes', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddInternalNote);
router.post('/admin/complaints/:id/internal-notes', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleAddInternalNote);

export default router;
