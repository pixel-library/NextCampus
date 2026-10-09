import express from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/rooms', roomController.getAllRooms);
router.patch('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);

export default router;
