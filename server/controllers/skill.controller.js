import * as skillService from '../services/skill.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetProjects = async (req, res, next) => {
  try {
    const projects = await skillService.getProjects();
    return sendResponse(res, 200, true, 'SkillCampus projects retrieved', projects);
  } catch (error) {
    next(error);
  }
};

export const handleCreateProject = async (req, res, next) => {
  try {
    const leadStudent = req.user ? req.user.id : req.body.leadStudent;
    const project = await skillService.createProject({ ...req.body, leadStudent });
    return sendResponse(res, 201, true, 'SkillCampus project created', project);
  } catch (error) {
    next(error);
  }
};
