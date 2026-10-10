import express from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Support both base ('/') and prefixed ('/rooms') routes
router.get('/', roomController.getAllRooms);
router.get('/rooms', roomController.getAllRooms);

router.get('/:id', roomController.handleGetRoomById);
router.get('/rooms/:id', roomController.handleGetRoomById);

router.post('/', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleCreateRoom);
router.post('/rooms', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleCreateRoom);

router.patch('/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);
router.patch('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);

router.put('/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);
router.put('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleUpdateRoom);

router.delete('/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleDeleteRoom);
router.delete('/rooms/:id', authenticateUser, authorizeRoles('admin', 'staff'), roomController.handleDeleteRoom);

export default router;
