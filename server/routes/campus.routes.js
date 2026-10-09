import express from 'express';
import * as campusController from '../controllers/campus.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/locations', campusController.getLocations);
router.get('/locations/:code', campusController.getLocationDetails);
router.post('/locations', authenticateUser, authorizeRoles('admin'), campusController.addLocation);

export default router;
