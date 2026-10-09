import * as careService from '../services/care.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetComplaints = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user && req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.role !== 'care_admin') {
      filter.studentId = req.user.id || req.user._id;
    }
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const complaints = await careService.getComplaints(filter);
    return sendResponse(res, 200, true, 'Complaints retrieved successfully', complaints);
  } catch (error) {
    next(error);
  }
};

export const handleCreateComplaint = async (req, res, next) => {
  try {
    const studentId = req.user ? (req.user.id || req.user._id) : req.body.studentId;
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((f) => `/uploads/${f.filename}`);
    } else if (req.body.attachments) {
      attachments = Array.isArray(req.body.attachments) ? req.body.attachments : [req.body.attachments];
    }
    const complaint = await careService.createComplaint({ ...req.body, studentId, attachments });
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

