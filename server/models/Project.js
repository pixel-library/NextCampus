import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['recruiting', 'in_progress', 'completed'], default: 'recruiting' },
    leadStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membersNeeded: { type: Number, default: 3 },
    currentMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    githubRepo: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
export default Project;
