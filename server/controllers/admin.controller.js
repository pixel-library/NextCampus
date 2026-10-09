import * as adminService from '../services/admin.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetAdminStats = async (req, res, next) => {
  try {
    const stats = await adminService.getAdminStats();
    return sendResponse(res, 200, true, 'Executive administrative statistics retrieved', stats);
  } catch (error) {
    next(error);
  }
};
