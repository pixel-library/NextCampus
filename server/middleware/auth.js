import { verifyToken, sendResponse } from '../utils/helpers.js';

/**
 * Authentication Middleware: Validates JWT Bearer Token in Authorization header
 */
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, 'Access denied. Authorization token missing or malformed.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Invalid, expired or revoked authentication token.');
  }
};

/**
 * Role-Based Authorization Middleware (RBAC)
 * @param  {...string} allowedRoles Roles authorized to perform this operation ('student', 'admin', 'staff', 'care_admin')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendResponse(res, 403, false, 'User identity not found or unauthenticated.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403, false, `Forbidden: Role '${req.user.role}' is not authorized for this resource.`);
    }

    next();
  };
};
