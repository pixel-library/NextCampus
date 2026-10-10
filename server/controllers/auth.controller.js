import * as authService from '../services/auth.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleRegister = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendResponse(res, 201, true, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

export const handleLogin = async (req, res, next) => {
  try {
    const { email, identifier, password } = req.body;
    const lookup = email || identifier;
    const result = await authService.loginUser(lookup, password);
    return sendResponse(res, 200, true, 'User logged in successfully', result);
  } catch (error) {
    next(error);
  }
};

export const handleGetCurrentUser = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    return sendResponse(res, 200, true, 'Current authenticated user retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateProfile = async (req, res, next) => {
  try {
    // Only administrators can edit someone else's profile; regular users only edit their own
    const targetUserId = (req.user.role === 'admin' && req.body.userId) ? req.body.userId : req.user.id;
    const result = await authService.updateProfile(targetUserId, req.body, req.user.role);
    return sendResponse(res, 200, true, 'Profile updated successfully', result);
  } catch (error) {
    next(error);
  }
};

export const handleChangePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    return sendResponse(res, 200, true, 'Password changed successfully', result);
  } catch (error) {
    next(error);
  }
};
