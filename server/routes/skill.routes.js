import express from 'express';
import * as skillController from '../controllers/skill.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/projects', skillController.handleGetProjects);
router.post('/projects', authenticateUser, skillController.handleCreateProject);

export default router;
