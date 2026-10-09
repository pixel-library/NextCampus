import { sendResponse } from '../utils/helpers.js';

/**
 * Validate required fields in request body
 */
export const validateFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const val = req.body[field];
      return val === undefined || val === null || val === '';
    });

    if (missing.length > 0) {
      return sendResponse(
        res,
        400,
        false,
        `Validation failed. Missing required fields: ${missing.join(', ')}`
      );
    }

    next();
  };
};
