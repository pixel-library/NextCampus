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
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendResponse(res, 200, true, 'User logged in successfully', result);
  } catch (error) {
    next(error);
  }
};

export const handleGetCurrentUser = async (req, res, next) => {
  try {
    return sendResponse(res, 200, true, 'Current authenticated user retrieved', { user: req.user });
  } catch (error) {
    next(error);
  }
};
