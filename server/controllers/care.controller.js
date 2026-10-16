import * as careService from '../services/care.service.js';
import { sendResponse } from '../utils/helpers.js';

export const handleGetComplaints = async (req, res, next) => {
  try {
    const isAdmin = req.user && ['admin', 'staff', 'care_admin'].includes(req.user.role);
    const filter = {};
    if (!isAdmin) {
      filter.studentId = req.user ? (req.user.id || req.user._id) : null;
    }
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.query.priority && req.query.priority !== 'all') filter.priority = req.query.priority;

    const complaints = await careService.getComplaints(filter, isAdmin);
    return sendResponse(res, 200, true, 'Complaints retrieved successfully', complaints);
  } catch (error) {
    next(error);
  }
};

export const handleGetComplaintById = async (req, res, next) => {
  try {
    const isAdmin = req.user && ['admin', 'staff', 'care_admin'].includes(req.user.role);
    const complaint = await careService.getComplaintById(req.params.id, isAdmin);
    if (!complaint) {
      return sendResponse(res, 404, false, 'Complaint ticket not found');
    }

    if (!isAdmin) {
      const studentOwnerId = complaint.studentId?._id?.toString() || complaint.studentId?.toString();
      const currentUserId = (req.user?.id || req.user?._id)?.toString();
      if (studentOwnerId && currentUserId && studentOwnerId !== currentUserId) {
        return sendResponse(res, 403, false, 'Unauthorized to view this complaint ticket');
      }
    }

    return sendResponse(res, 200, true, 'Complaint ticket retrieved', complaint);
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
    const authorName = req.user ? req.user.name : req.body.authorName;
    const complaint = await careService.createComplaint({ ...req.body, studentId, attachments, authorName });
    return sendResponse(res, 201, true, 'Complaint ticket submitted', complaint);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateComplaint = async (req, res, next) => {
  try {
    const { status, message, priority } = req.body;
    const updatedBy = req.user ? req.user.name || 'Admin' : 'System';
    const updated = await careService.updateComplaintStatus(req.params.id, status, message, updatedBy, priority);
    if (!updated) {
      return sendResponse(res, 404, false, 'Complaint ticket not found');
    }
    return sendResponse(res, 200, true, 'Complaint status updated', updated);
  } catch (error) {
    next(error);
  }
};

export const handleAssignStaff = async (req, res, next) => {
  try {
    const { assignedTo, assignedToName } = req.body;
    if (!assignedToName) {
      return sendResponse(res, 400, false, 'Staff or technician name is required for assignment');
    }
    const updatedBy = req.user ? req.user.name || 'Admin' : 'System';
    const updated = await careService.assignStaff(req.params.id, assignedTo, assignedToName, updatedBy);
    if (!updated) {
      return sendResponse(res, 404, false, 'Complaint ticket not found');
    }
    return sendResponse(res, 200, true, 'Staff assigned successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const handleAddPublicUpdate = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return sendResponse(res, 400, false, 'Update message content is required');
    }
    const updatedBy = req.user ? req.user.name || 'Admin' : 'Operations Admin';
    const updated = await careService.addPublicUpdate(req.params.id, message.trim(), updatedBy);
    if (!updated) {
      return sendResponse(res, 404, false, 'Complaint ticket not found');
    }
    return sendResponse(res, 200, true, 'Public student update published', updated);
  } catch (error) {
    next(error);
  }
};

export const handleAddInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return sendResponse(res, 400, false, 'Internal note text is required');
    }
    const authorId = req.user ? (req.user.id || req.user._id) : null;
    const authorName = req.user ? req.user.name || 'Admin' : 'Admin';
    const updated = await careService.addInternalNote(req.params.id, note.trim(), authorId, authorName);
    if (!updated) {
      return sendResponse(res, 404, false, 'Complaint ticket not found');
    }
    return sendResponse(res, 200, true, 'Internal administrative note recorded', updated);
  } catch (error) {
    next(error);
  }
};

export const handleGetStaffList = async (req, res, next) => {
  try {
    const staff = await careService.getAvailableStaff();
    return sendResponse(res, 200, true, 'Available technicians and staff retrieved', staff);
  } catch (error) {
    next(error);
  }
};

export const handleCreateComplaintReview = async (req, res, next) => {
  try {
    const { rating, comment, tags } = req.body;
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return sendResponse(res, 400, false, 'Valid rating between 1 and 5 stars is required');
    }
    const studentId = req.user ? (req.user.id || req.user._id) : null;
    const reviewedBy = req.user ? req.user.name || 'Student' : 'Student';
    const updated = await careService.addComplaintReview(
      req.params.id,
      rating,
      comment || '',
      tags || [],
      reviewedBy,
      studentId
    );
    if (!updated) {
      return sendResponse(res, 404, false, 'Complaint ticket not found');
    }
    return sendResponse(res, 200, true, 'Complaint review recorded successfully', updated);
  } catch (error) {
    next(error);
  }
};



