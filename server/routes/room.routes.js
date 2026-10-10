import express from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:id', roomController.handleGetRoomById);
router.post('/rooms', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleCreateRoom);
router.patch('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);
router.put('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);
router.delete('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleDeleteRoom);

export default router;

