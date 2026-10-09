import Project from '../models/Project.js';

export const getProjects = async () => {
  return await Project.find().populate('leadStudent', 'name department avatar').sort({ createdAt: -1 });
};

export const createProject = async (projectData) => {
  return await Project.create(projectData);
};
