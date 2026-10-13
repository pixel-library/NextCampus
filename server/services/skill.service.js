import mongoose from 'mongoose';
import Project from '../models/Project.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

let IN_MEMORY_PROJECTS = [
  {
    _id: 'proj_01',
    title: 'Autonomous Campus Quad Rover Navigation',
    category: 'Robotics',
    description: 'Building ROS2 SLAM stack for micro-deliveries across campus pathways.',
    tags: ['ROS2', 'Python', 'Computer Vision', 'Embedded IoT'],
    status: 'recruiting',
    leadStudent: {
      _id: 'usr_student_01',
      name: 'Rakesh Kumar',
      department: 'Computer Science & Engineering',
    },
    membersNeeded: 3,
    currentMembers: [
      {
        _id: 'usr_student_01',
        name: 'Rakesh Kumar',
        department: 'Computer Science & Engineering',
      },
    ],
    githubRepo: 'https://github.com/nextcampus/quad-rover-ros2',
    createdAt: new Date('2025-09-01T10:00:00Z'),
  },
  {
    _id: 'proj_02',
    title: 'AI Smart Grid Solar Energy Optimization',
    category: 'AI & Data',
    description: 'Predictive neural models for solar panel generation in Turing Quad.',
    tags: ['Python', 'PyTorch', 'IoT Telemetry'],
    status: 'recruiting',
    leadStudent: {
      _id: 'usr_student_02',
      name: 'Priya Patel',
      department: 'Artificial Intelligence & Data',
    },
    membersNeeded: 2,
    currentMembers: [
      {
        _id: 'usr_student_02',
        name: 'Priya Patel',
        department: 'Artificial Intelligence & Data',
      },
    ],
    githubRepo: '',
    createdAt: new Date('2025-09-10T14:30:00Z'),
  },
];

export const getProjects = async (filter = {}) => {
  if (isDbConnected()) {
    try {
      const records = await Project.find(filter)
        .populate('leadStudent', 'name department avatar email')
        .populate('currentMembers', 'name department avatar email')
        .sort({ createdAt: -1 });
      if (records && records.length > 0) return records;
    } catch (err) {
      console.warn('[NextCampus SkillCampus] DB query fallback to memory:', err.message);
    }
  }

  let filtered = [...IN_MEMORY_PROJECTS];
  if (filter.category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === filter.category.toLowerCase());
  }
  return filtered;
};

export const createProject = async (projectData) => {
  const lead = projectData.leadStudent || projectData.authorId || 'usr_student_01';
  const category = projectData.category || 'Robotics';
  const membersNeeded = projectData.membersNeeded || projectData.teamSize || 3;

  if (isDbConnected()) {
    try {
      const newProject = await Project.create({
        ...projectData,
        leadStudent: lead,
        category,
        membersNeeded,
        currentMembers: [lead],
      });
      return await Project.findById(newProject._id).populate('leadStudent', 'name department avatar');
    } catch (err) {
      console.warn('[NextCampus SkillCampus] DB create failed, saving to memory:', err.message);
    }
  }

  const memProject = {
    _id: `proj_${Date.now()}`,
    title: projectData.title,
    category,
    description: projectData.description,
    tags: projectData.tags || [],
    status: 'recruiting',
    leadStudent: {
      _id: lead,
      name: projectData.authorName || 'Lead Student',
      department: 'Computer Science & Engineering',
    },
    membersNeeded,
    currentMembers: [
      {
        _id: lead,
        name: projectData.authorName || 'Lead Student',
      },
    ],
    githubRepo: projectData.githubRepo || '',
    createdAt: new Date(),
  };

  IN_MEMORY_PROJECTS.unshift(memProject);
  return memProject;
};

export const joinProject = async (projectId, userId, userName = 'Student Member') => {
  if (isDbConnected()) {
    try {
      const project = await Project.findById(projectId);
      if (project) {
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
      }
    } catch (err) {
      if (err.status === 400) throw err;
      console.warn('[NextCampus SkillCampus] DB join fallback to memory:', err.message);
    }
  }

  const memProject = IN_MEMORY_PROJECTS.find((p) => p._id === projectId || p._id.toString() === projectId);
  if (!memProject) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  const userIdStr = userId.toString();
  const isLead = (memProject.leadStudent?._id || memProject.leadStudent)?.toString() === userIdStr;
  const isMember = memProject.currentMembers?.some((m) => (m._id || m).toString() === userIdStr);

  if (isLead || isMember) {
    const error = new Error('You are already a member or lead of this project.');
    error.status = 400;
    throw error;
  }

  memProject.currentMembers.push({
    _id: userId,
    name: userName,
  });

  return memProject;
};

export default { getProjects, createProject, joinProject };
