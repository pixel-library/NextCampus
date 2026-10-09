import Project from '../models/Project.js';

export const getProjects = async (filter = {}) => {
  return await Project.find(filter)
    .populate('leadStudent', 'name department avatar email')
    .populate('currentMembers', 'name department avatar email')
    .sort({ createdAt: -1 });
};

export const createProject = async (projectData) => {
  const newProject = await Project.create({
    ...projectData,
    currentMembers: projectData.leadStudent ? [projectData.leadStudent] : []
  });
  return await Project.findById(newProject._id).populate('leadStudent', 'name department avatar');
};

export const joinProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  const userIdStr = userId.toString();
  const isLead = project.leadStudent && project.leadStudent.toString() === userIdStr;
  const isMember = project.currentMembers && project.currentMembers.some((m) => m.toString() === userIdStr);

  if (isLead || isMember) {
    const error = new Error('You are already a member or lead of this project.');
    error.status = 400;
    throw error;
  }

  project.currentMembers.push(userId);
  await project.save();

  return await Project.findById(projectId)
    .populate('leadStudent', 'name department avatar')
    .populate('currentMembers', 'name department avatar');
};
