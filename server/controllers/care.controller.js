import * as careService from '../services/care.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetComplaints = async (req, res, next) => {
  try {
    const complaints = await careService.getComplaints(req.query);
    return sendResponse(res, 200, true, 'Complaints retrieved successfully', complaints);
  } catch (error) {
    next(error);
  }
};

export const handleCreateComplaint = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : req.body.studentId;
    const complaint = await careService.createComplaint({ ...req.body, studentId });
    return sendResponse(res, 201, true, 'Complaint ticket submitted', complaint);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateComplaint = async (req, res, next) => {
  try {
    const { status, message } = req.body;
    const updatedBy = req.user ? req.user.name || 'Admin' : 'System';
    const updated = await careService.updateComplaintStatus(req.params.id, status, message, updatedBy);
    return sendResponse(res, 200, true, 'Complaint status updated', updated);
  } catch (error) {
    next(error);
  }
};
