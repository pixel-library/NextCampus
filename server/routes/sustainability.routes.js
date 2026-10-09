import express from 'express';
import * as sustainabilityController from '../controllers/sustainability.controller.js';

const router = express.Router();

router.get('/metrics', sustainabilityController.handleGetMetrics);

export default router;
