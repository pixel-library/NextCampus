import express from 'express';
import * as campusController from '../controllers/campus.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/locations', campusController.getLocations);
router.get('/locations/:code', campusController.getLocationDetails);
router.post('/locations', authenticateUser, authorizeRoles('admin', 'staff'), campusController.addLocation);
router.put('/locations/:id', authenticateUser, authorizeRoles('admin', 'staff'), campusController.updateLocation);
router.delete('/locations/:id', authenticateUser, authorizeRoles('admin', 'staff'), campusController.deleteLocation);

export default router;

