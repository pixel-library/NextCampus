import { sendResponse } from '../utils/helpers.js';

/**
 * Global REST API Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[NextCampus Server Error]: ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendResponse(res, statusCode, false, message, null, {
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
