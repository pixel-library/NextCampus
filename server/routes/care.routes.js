import express from 'express';
import * as careController from '../controllers/care.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/complaints', authenticateUser, careController.handleGetComplaints);
router.post('/complaints', authenticateUser, upload.array('attachments', 3), careController.handleCreateComplaint);
router.patch('/complaints/:id', authenticateUser, authorizeRoles('admin', 'care_admin', 'staff'), careController.handleUpdateComplaint);

export default router;
