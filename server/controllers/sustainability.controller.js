import * as sustainabilityService from '../services/sustainability.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetMetrics = async (req, res, next) => {
  try {
    const metrics = await sustainabilityService.getMetrics();
    return sendResponse(res, 200, true, 'EcoCampus metrics retrieved', metrics);
  } catch (error) {
    next(error);
  }
};
