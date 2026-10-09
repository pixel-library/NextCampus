import express from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/query', aiController.handleAiQuery);

export default router;
