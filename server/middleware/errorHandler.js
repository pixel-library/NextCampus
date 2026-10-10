import { sendResponse } from '../utils/helpers.js';

/**
 * Global REST API Error Handler Middleware
 * Sanitizes sensitive internal driver traces and maps standard error codes
 */
export const errorHandler = (err, req, res, next) => {
  // Determine appropriate HTTP status code
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Multer upload errors cleanly
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File upload failed: File size exceeds the permitted 10MB limit.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'File upload failed: Too many files or unexpected field name.';
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate key violation: A record with this ${field} already exists.`;
  }

  // Handle JWT Malformed or Expired Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token provided.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication session has expired. Please sign in again.';
  }

  // In production, mask raw server 500 details to prevent information disclosure
  const isDev = process.env.NODE_ENV === 'development';
  if (statusCode === 500 && !isDev) {
    message = 'An unexpected server error occurred. Please contact NextCampus IT Helpdesk.';
  }

  console.error(`[NextCampus Server Error] [${req.method} ${req.originalUrl}] ${statusCode}: ${err.message}`);

  return sendResponse(res, statusCode, false, message, null, {
    path: req.originalUrl,
    method: req.method,
    stack: isDev ? err.stack : undefined,
  });
};

export default errorHandler;
