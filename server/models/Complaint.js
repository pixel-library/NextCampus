import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'infrastructure',
        'network',
        'cleanliness',
        'electrical',
        'academic',
        'av',
        'plumbing',
        'hvac',
        'furniture',
        'sanitation',
        'other',
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'parts_ordered', 'in_review', 'resolved', 'closed'],
      default: 'open',
    },
    description: { type: String, required: true },
    location: { type: String, required: true },
    buildingName: { type: String, default: '' },
    roomNumber: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedToName: { type: String, default: '' },
    slaDue: { type: Date },
    slaHours: { type: Number, default: 24 },
    attachments: [{ type: String }],
    updates: [
      {
        message: { type: String, required: true },
        updatedBy: { type: String, default: 'System' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    internalNotes: [
      {
        note: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        authorName: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;

