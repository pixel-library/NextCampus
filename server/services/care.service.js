import Complaint from '../models/Complaint.js';

export const getComplaints = async (filter = {}) => {
  return await Complaint.find(filter).populate('studentId', 'name email department').sort({ createdAt: -1 });
};

export const createComplaint = async (complaintData) => {
  const count = await Complaint.countDocuments();
  const ticketId = `TICK-${1000 + count + 1}`;
  return await Complaint.create({ ...complaintData, ticketId });
};

export const updateComplaintStatus = async (id, status, updateMessage, updatedBy) => {
  return await Complaint.findByIdAndUpdate(
    id,
    {
      status,
      $push: { updates: { message: updateMessage, updatedBy } },
    },
    { new: true }
  );
};
