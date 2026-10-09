import jwt from 'jsonwebtoken';

/**
 * Standardized API Response Helper
 */
export const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
    timestamp: new Date().toISOString()
  });
};

/**
 * Generate JWT Authentication Token
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'nextcampus_dev_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'nextcampus_dev_secret_key_2026';
  return jwt.verify(token, secret);
};
