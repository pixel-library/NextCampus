import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['infrastructure', 'network', 'cleanliness', 'electrical', 'academic', 'other'],
      required: true,
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    description: { type: String, required: true },
    location: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachments: [{ type: String }],
    updates: [
      {
        message: String,
        updatedBy: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
