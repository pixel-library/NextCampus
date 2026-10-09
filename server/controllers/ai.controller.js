import * as aiService from '../services/ai.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleAiQuery = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return sendResponse(res, 400, false, 'Prompt text is required for AI processing');
    }
    const response = await aiService.processAiQuery(prompt, req.user);
    return sendResponse(res, 200, true, 'AI query processed successfully', response);
  } catch (error) {
    next(error);
  }
};
