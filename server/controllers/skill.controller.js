import * as skillService from '../services/skill.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const projects = await skillService.getProjects(filter);
    return sendResponse(res, 200, true, 'SkillCampus projects retrieved', projects);
  } catch (error) {
    next(error);
  }
};

export const handleCreateProject = async (req, res, next) => {
  try {
    const leadStudent = req.user ? (req.user.id || req.user._id) : req.body.leadStudent;
    const project = await skillService.createProject({ ...req.body, leadStudent });
    return sendResponse(res, 201, true, 'SkillCampus project created', project);
  } catch (error) {
    next(error);
  }
};

export const handleJoinProject = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : req.body.userId;
    if (!userId) {
      return sendResponse(res, 401, false, 'Authentication required to join project');
    }
    const updatedProject = await skillService.joinProject(req.params.id, userId);
    return sendResponse(res, 200, true, 'Successfully joined project', updatedProject);
  } catch (error) {
    if (error.status === 400 || error.status === 404) {
      return sendResponse(res, error.status, false, error.message);
    }
    next(error);
  }
};
