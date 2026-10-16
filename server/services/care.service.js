import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const DEMO_STAFF = [
  { id: 'staff_1', name: 'Marcus Vance', role: 'staff', specialty: 'Senior AV Lead', email: 'm.vance@nextcampus.edu' },
  { id: 'staff_2', name: 'Elena Rostova', role: 'staff', specialty: 'HVAC & Climate Lead', email: 'e.rostova@nextcampus.edu' },
  { id: 'staff_3', name: 'T. Jenkins', role: 'staff', specialty: 'Core Network Engineer', email: 't.jenkins@nextcampus.edu' },
  { id: 'staff_4', name: 'Facilities Team 1', role: 'staff', specialty: 'Electrical Systems', email: 'electrical@nextcampus.edu' },
  { id: 'staff_5', name: 'Campus Logistics', role: 'staff', specialty: 'Furniture & Sanitation', email: 'logistics@nextcampus.edu' },
];

let IN_MEMORY_COMPLAINTS = [
  {
    _id: 'cmp_1042',
    ticketId: 'CMP-1042',
    title: 'CS Lab B Projector HDMI Signal Loss & Flicker',
    category: 'av',
    priority: 'high',
    status: 'in_progress',
    description: 'Intermittent black screening and magenta artifacts during lecture streaming. System restarts do not resolve. Wall jack warm to touch.',
    location: 'Alan Turing Hall, Room B-204',
    buildingName: 'Alan Turing Hall (Block A-01)',
    roomNumber: 'B-204',
    studentId: {
      _id: 'student_1',
      name: 'Rakesh Kumar',
      email: 'rakesh@nextcampus.edu',
      department: 'Computer Science',
      rollNumber: 'MUR2502101',
      phone: '+91 98765 43210',
    },
    assignedToName: 'Marcus Vance',
    slaHours: 4,
    slaDue: new Date(Date.now() + 2 * 3600 * 1000),
    attachments: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBw7uQg4w8l-jkRzjUZU6--yRO7EQa8Qs-mw9brbhcaPHvG564vc-a7gIyCJ3Tcy7M1x0sJpcSDK-Gw4Me1KlEKDquom74fUxEQn_xeDtBZFMx8yNuDRIwO4Wi_vT0g8mPxtYuHM76BQi2B8b74zEU04zWKNT6rdUIfyUrhXj9GExTAA--X79VIVxBOqo3MyMCVG2FLW0LTwHzlXtKvXF45lm0BN6TMatag_GD-nu4bPJWo4BtC_zDw',
    ],
    updates: [
      {
        message: 'Ticket created via NextCampus Student Care App',
        updatedBy: 'Rakesh Kumar',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        message: 'Ticket triaged by Administrative Operations',
        updatedBy: 'Dr. Eleanor Vance',
        createdAt: new Date(Date.now() - 3.5 * 3600 * 1000),
      },
      {
        message: 'Technician Marcus Vance dispatched with replacement 4K optical HDMI transceiver to Alan Turing Hall B-204.',
        updatedBy: 'Auto-Broadcast SLA Dispatcher',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
    internalNotes: [
      {
        note: 'Wall plate HDMI extender is overheating; testing secondary optical feed. If failing, will swap whole Extron unit from spare locker #4.',
        authorName: 'Marcus Vance (Campus AV Lead)',
        createdAt: new Date(Date.now() - 1.8 * 3600 * 1000),
      },
      {
        note: 'Escalated vendor ticket #EXT-9921 for RMA replacement warranty claim on batch 2024-C.',
        authorName: 'Dr. Eleanor Vance (SuperAdmin)',
        createdAt: new Date(Date.now() - 1.2 * 3600 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 4 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: 'cmp_1044',
    ticketId: 'CMP-1044',
    title: 'Water Pressure Loss & Valve Leakage',
    category: 'plumbing',
    priority: 'critical',
    status: 'open',
    description: 'Main pressure regulator failing on 2nd floor restroom block. Continuous water trickle near electrical conduit.',
    location: 'Central Library, 2F Restroom',
    buildingName: 'Central Campus Library (Block B-02)',
    roomNumber: 'Restroom 2F',
    studentId: {
      _id: 'student_2',
      name: 'Facilities Sensor Bot',
      email: 'sensors@nextcampus.edu',
      department: 'Building Automation',
    },
    assignedToName: 'Unassigned',
    slaHours: 2,
    slaDue: new Date(Date.now() + 1 * 3600 * 1000),
    attachments: [],
    updates: [
      {
        message: 'Telemetry alarm triggered: Water flow differential detected.',
        updatedBy: 'IoT Building Telemetry',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
    internalNotes: [
      {
        note: 'Critical priority dispatch issued to primary plumbing contractor. Shutoff valve B-2 isolated.',
        authorName: 'Dr. Eleanor Vance',
        createdAt: new Date(Date.now() - 1.5 * 3600 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: 'cmp_1040',
    ticketId: 'CMP-1040',
    title: 'Core Mesh AP Dropping 5GHz Packets',
    category: 'network',
    priority: 'high',
    status: 'in_progress',
    description: 'Access Point AP-RMN-304 suffering intermittent SSID beacon loss under >60 client load.',
    location: 'Ramanujan Science Complex, West Lab',
    buildingName: 'Ramanujan Science Complex (Block C-03)',
    roomNumber: 'West Lab',
    studentId: {
      _id: 'student_3',
      name: 'Network Monitor',
      email: 'netops@nextcampus.edu',
      department: 'Network Operations',
    },
    assignedToName: 'T. Jenkins',
    slaHours: 4,
    slaDue: new Date(Date.now() + 3 * 3600 * 1000),
    attachments: [],
    updates: [
      {
        message: 'Packet drops flagged by SysMon Core Mesh daemon.',
        updatedBy: 'SysMon Network Core',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
    ],
    internalNotes: [
      {
        note: 'Firmware rollback from v4.18.2 to stable v4.17 scheduled during lunch window.',
        authorName: 'T. Jenkins (Core Network)',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: 'cmp_1038',
    ticketId: 'CMP-1038',
    title: 'LED Driver Flickering in Main Lecture Theatre',
    category: 'electrical',
    priority: 'medium',
    status: 'parts_ordered',
    description: 'Overhead stage luminaire array flickering rhythmically at 50Hz, causing visual fatigue during seminars.',
    location: 'Alan Turing Hall, Theatre 1',
    buildingName: 'Alan Turing Hall (Block A-01)',
    roomNumber: 'Theatre 1',
    studentId: {
      _id: 'student_4',
      name: 'Prof. Althaus',
      email: 'althaus@nextcampus.edu',
      department: 'School of Computing',
    },
    assignedToName: 'Facilities Team 1',
    slaHours: 24,
    slaDue: new Date(Date.now() + 18 * 3600 * 1000),
    attachments: [],
    updates: [
      {
        message: 'Replacement DALI dimming driver requisitioned from electrical warehouse.',
        updatedBy: 'Facilities Team 1',
        createdAt: new Date(Date.now() - 16 * 3600 * 1000),
      },
    ],
    internalNotes: [
      {
        note: 'Awaiting Philips DALI 150W driver delivery by Thursday 10:00 AM.',
        authorName: 'Lead Electrician',
        createdAt: new Date(Date.now() - 15 * 3600 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 18 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: 'cmp_1035',
    ticketId: 'CMP-1035',
    title: 'HVAC Thermostat Stuck on Max Heat',
    category: 'hvac',
    priority: 'medium',
    status: 'in_progress',
    description: 'Zone sensor reading 27.5°C despite setpoint of 21.0°C in cafeteria seating zone.',
    location: 'Student Union Hub, Dining Lounge',
    buildingName: 'Student Union & Dining Hub (Block D-04)',
    roomNumber: 'Dining Lounge',
    studentId: {
      _id: 'student_5',
      name: 'Sara Croft',
      email: 'scroft@nextcampus.edu',
      department: 'Student Affairs',
    },
    assignedToName: 'Elena Rostova',
    slaHours: 24,
    slaDue: new Date(Date.now() + 12 * 3600 * 1000),
    attachments: [],
    updates: [
      {
        message: 'Elena Rostova dispatched with actuator diagnostic tool.',
        updatedBy: 'BMS Scheduler',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
    ],
    internalNotes: [
      {
        note: 'BACnet damper actuator jammed at 80% open; manual bypass applied until part arrives.',
        authorName: 'Elena Rostova (HVAC Lead)',
        createdAt: new Date(Date.now() - 7 * 3600 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 20 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: 'cmp_1031',
    ticketId: 'CMP-1031',
    title: 'Broken Ergonomic Drafting Chairs (3 units)',
    category: 'furniture',
    priority: 'low',
    status: 'resolved',
    description: 'Three hydraulic gas cylinders failing in Studio 302.',
    location: 'Ramanujan Science Complex, Room 302',
    buildingName: 'Ramanujan Science Complex (Block C-03)',
    roomNumber: 'Room 302',
    studentId: {
      _id: 'student_6',
      name: 'Arch Studio Lead',
      email: 'archstudio@nextcampus.edu',
      department: 'Architecture & Design',
    },
    assignedToName: 'Campus Logistics',
    slaHours: 48,
    slaDue: new Date(Date.now() - 2 * 3600 * 1000),
    attachments: [],
    updates: [
      {
        message: 'Replaced with 3 brand-new Herman Miller drafting chairs from central storage.',
        updatedBy: 'Campus Logistics',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        message: 'Verified and signed off by studio representative.',
        updatedBy: 'Arch Studio Lead',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
    internalNotes: [
      {
        note: 'Damaged chairs scrapped and cataloged into disposal asset ledger.',
        authorName: 'Dr. Eleanor Vance',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 36 * 3600 * 1000),
    updatedAt: new Date(),
  },
];

/**
 * Sanitize complaint object to strictly omit internalNotes if not admin/staff.
 */
export const sanitizeForStudent = (complaint) => {
  if (!complaint) return null;
  const raw = complaint.toObject ? complaint.toObject() : { ...complaint };
  delete raw.internalNotes;
  return raw;
};

export const getComplaints = async (filter = {}, isAdmin = false) => {
  if (isDbConnected()) {
    try {
      const mongoFilter = {};
      if (filter.studentId) mongoFilter.studentId = filter.studentId;
      if (filter.category && filter.category !== 'all') mongoFilter.category = filter.category;
      if (filter.status && filter.status !== 'all') mongoFilter.status = filter.status;
      if (filter.priority && filter.priority !== 'all') mongoFilter.priority = filter.priority;

      let query = Complaint.find(mongoFilter)
        .populate('studentId', 'name email department rollNumber phone')
        .sort({ createdAt: -1 });

      if (!isAdmin) {
        query = query.select('-internalNotes');
      }

      const complaints = await query.exec();
      if (complaints && complaints.length > 0) {
        if (!isAdmin) {
          return complaints.map((c) => sanitizeForStudent(c));
        }
        return complaints;
      }
    } catch (err) {
      console.warn('[NextCampus Care API] DB query fallback to in-memory complaints:', err.message);
    }
  }

  // Fallback to in-memory complaints
  let result = [...IN_MEMORY_COMPLAINTS];
  if (filter.category && filter.category !== 'all') {
    result = result.filter((c) => c.category === filter.category);
  }
  if (filter.status && filter.status !== 'all') {
    result = result.filter((c) => c.status === filter.status);
  }
  if (filter.priority && filter.priority !== 'all') {
    result = result.filter((c) => c.priority === filter.priority);
  }

  if (!isAdmin) {
    return result.map((c) => sanitizeForStudent(c));
  }
  return result;
};

export const getComplaintById = async (id, isAdmin = false) => {
  if (isDbConnected()) {
    try {
      let complaint = await Complaint.findById(id).populate('studentId', 'name email department rollNumber phone');
      if (!complaint) {
        complaint = await Complaint.findOne({ ticketId: id }).populate('studentId', 'name email department rollNumber phone');
      }
      if (complaint) {
        return isAdmin ? complaint : sanitizeForStudent(complaint);
      }
    } catch (err) {
      console.warn('[NextCampus Care API] DB query fallback for ID:', id);
    }
  }

  const found = IN_MEMORY_COMPLAINTS.find((c) => c._id === id || c.ticketId === id);
  return isAdmin ? found : sanitizeForStudent(found);
};

export const createComplaint = async (complaintData) => {
  const count = IN_MEMORY_COMPLAINTS.length + 1045;
  const ticketId = `CMP-${count}`;
  const authorName = complaintData.authorName || 'Student';
  const studentRawId = complaintData.studentId || 'usr_student_01';
  const studentObj = {
    _id: studentRawId,
    id: studentRawId,
    name: authorName,
    email: complaintData.email || 'student@nextcampus.edu',
    department: complaintData.department || 'Department of Computer Science & Engineering',
    rollNumber: complaintData.rollNumber || 'MUR2502101',
    phone: complaintData.phone || '+91 98765 43210',
  };

  const newTicket = {
    ...complaintData,
    ticketId,
    status: 'open',
    priority: complaintData.priority || 'medium',
    studentId: studentObj,
    student: studentObj,
    authorName,
    review: null,
    updates: [
      {
        message: 'Ticket lodged by student in NextCampus Care system.',
        updatedBy: authorName,
        createdAt: new Date(),
      },
    ],
    internalNotes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const created = await Complaint.create(newTicket);
      if (created) {
        IN_MEMORY_COMPLAINTS.unshift(created.toObject ? created.toObject() : created);
        return created;
      }
    } catch (err) {
      console.warn('[NextCampus Care API] DB creation fallback to in-memory:', err.message);
    }
  }

  const memoryTicket = { ...newTicket, _id: `mem_${Date.now()}` };
  IN_MEMORY_COMPLAINTS.unshift(memoryTicket);
  return memoryTicket;
};

export const updateComplaintStatus = async (id, status, updateMessage, updatedBy, priority = null) => {
  const updateObj = { status, updatedAt: new Date() };
  if (priority) updateObj.priority = priority;

  const pushObj = updateMessage ? { updates: { message: updateMessage, updatedBy, createdAt: new Date() } } : null;

  if (isDbConnected()) {
    try {
      const mongoUpdate = pushObj ? { $set: updateObj, $push: pushObj } : { $set: updateObj };
      const updated = await Complaint.findByIdAndUpdate(id, mongoUpdate, { new: true });
      if (updated) return updated;
    } catch (err) {
      console.warn('[NextCampus Care API] DB status update fallback for ID:', id);
    }
  }

  const item = IN_MEMORY_COMPLAINTS.find((c) => c._id === id || c.ticketId === id);
  if (item) {
    item.status = status;
    if (priority) item.priority = priority;
    item.updatedAt = new Date();
    if (updateMessage) {
      item.updates.push({
        message: updateMessage,
        updatedBy: updatedBy || 'System',
        createdAt: new Date(),
      });
    }
    return item;
  }
  return null;
};

export const assignStaff = async (id, assignedToId, assignedToName, updatedBy) => {
  const message = `Technician ${assignedToName} assigned to ticket and dispatched.`;
  const updateObj = {
    assignedTo: assignedToId || undefined,
    assignedToName,
    updatedAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        id,
        {
          $set: updateObj,
          $push: { updates: { message, updatedBy: updatedBy || 'Admin', createdAt: new Date() } },
        },
        { new: true }
      );
      if (updated) return updated;
    } catch (err) {
      console.warn('[NextCampus Care API] DB assign fallback:', err.message);
    }
  }

  const item = IN_MEMORY_COMPLAINTS.find((c) => c._id === id || c.ticketId === id);
  if (item) {
    item.assignedToName = assignedToName;
    item.assignedTo = assignedToId;
    if (item.status === 'open') item.status = 'in_progress';
    item.updates.push({
      message,
      updatedBy: updatedBy || 'Admin',
      createdAt: new Date(),
    });
    return item;
  }
  return null;
};

export const addPublicUpdate = async (id, message, updatedBy) => {
  const updateEntry = {
    message,
    updatedBy: updatedBy || 'Operations Admin',
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        id,
        { $push: { updates: updateEntry }, $set: { updatedAt: new Date() } },
        { new: true }
      );
      if (updated) return updated;
    } catch (err) {
      console.warn('[NextCampus Care API] DB public update fallback:', err.message);
    }
  }

  const item = IN_MEMORY_COMPLAINTS.find((c) => c._id === id || c.ticketId === id);
  if (item) {
    item.updates.push(updateEntry);
    item.updatedAt = new Date();
    return item;
  }
  return null;
};

export const addInternalNote = async (id, note, authorId, authorName) => {
  const noteEntry = {
    note,
    author: authorId || undefined,
    authorName: authorName || 'Admin Operator',
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        id,
        { $push: { internalNotes: noteEntry }, $set: { updatedAt: new Date() } },
        { new: true }
      );
      if (updated) return updated;
    } catch (err) {
      console.warn('[NextCampus Care API] DB internal note fallback:', err.message);
    }
  }

  const item = IN_MEMORY_COMPLAINTS.find((c) => c._id === id || c.ticketId === id);
  if (item) {
    if (!item.internalNotes) item.internalNotes = [];
    item.internalNotes.push(noteEntry);
    item.updatedAt = new Date();
    return item;
  }
  return null;
};


export const addComplaintReview = async (id, rating, comment = '', tags = [], reviewedBy = 'Student', studentId = null) => {
  const reviewEntry = {
    rating: Number(rating),
    comment: comment || '',
    tags: Array.isArray(tags) ? tags : [],
    reviewedBy: reviewedBy || 'Student',
    studentId: studentId || undefined,
    createdAt: new Date(),
  };

  const updateMessage = `Student verified resolution with ${rating}-star rating: "${comment.length > 70 ? comment.slice(0, 70) + '...' : (comment || 'Satisfaction confirmed')}"`;
  const pushUpdate = {
    message: updateMessage,
    updatedBy: reviewedBy || 'Student Requester',
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        id,
        {
          $set: { review: reviewEntry, updatedAt: new Date() },
          $push: { updates: pushUpdate },
        },
        { new: true }
      );
      if (updated) return updated;
    } catch (err) {
      console.warn('[NextCampus Care API] DB review update fallback:', err.message);
    }
  }

  const item = IN_MEMORY_COMPLAINTS.find((c) => c._id === id || c.ticketId === id);
  if (item) {
    item.review = reviewEntry;
    if (!item.updates) item.updates = [];
    item.updates.push(pushUpdate);
    item.updatedAt = new Date();
    return item;
  }
  return null;
};

export const getAvailableStaff = async () => {
  try {
    const staffFromDb = await User.find({ role: { $in: ['staff', 'admin'] } }).select('name email role department');
    if (staffFromDb && staffFromDb.length > 0) {
      return staffFromDb.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        role: s.role,
        specialty: s.department || 'Operations Specialist',
        email: s.email,
      }));
    }
  } catch (err) {
    console.warn('[NextCampus Care API] DB user query fallback for staff:', err.message);
  }
  return DEMO_STAFF;
};



