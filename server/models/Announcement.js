import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['academic', 'event', 'urgent', 'general'], default: 'general' },
    author: { type: String, default: 'Campus Administration' },
    priority: { type: String, enum: ['normal', 'high', 'pinned'], default: 'normal' },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
