/**
 * NextCampus Care & Grievance Shared Persistence & Realtime Synchronization Helper
 * Ensures complaints filed by students are immediately accessible to Admin,
 * and status updates/reviews are synchronized across both roles regardless of
 * server connectivity or demo session mode.
 */

const STORAGE_KEY = 'nextcampus_care_complaints';
const SYNC_EVENT = 'nextcampus_complaints_sync';

// Canonical initial institutional complaints
export const DEFAULT_COMPLAINTS = [
  {
    _id: 'cmp-1042',
    ticketId: 'CMP-1042',
    title: 'Dual 4K Laser Projector HDMI Optical Sync Glitch & Green Tint',
    category: 'academic',
    categoryName: 'Classroom & AV',
    priority: 'high',
    status: 'in_progress',
    statusText: 'In Progress (Technician Dispatched)',
    building: 'Faculty of Engineering & Technology (ENG-02)',
    location: 'Faculty of Engineering & Technology (ENG-02) - Level 2 Multi-Media Theatre (Room B-204)',
    description:
      'During CS-301 Lecture, the ceiling dual 4K laser projector exhibits severe green frame flickering and lost optical sync when switching inputs from the Lectern 4 Thunderbolt interface. Class audio is currently unaffected.',
    assignedTo: 'Marcus Vance',
    assignedToName: 'Marcus Vance',
    assignedRole: 'Lead Campus AV Systems Specialist • Unit ID #AV-98',
    slaTargetMins: 45,
    slaHours: 1,
    minutesElapsed: 22,
    eta: '18 mins',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    attachments: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    studentId: {
      _id: 'usr_student_01',
      id: 'usr_student_01',
      name: 'Rakesh Kumar',
      email: 'rakesh@nextcampus.edu',
      department: 'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
      rollNumber: 'MUR2502101',
      phone: '+91 98765 43210'
    },
    authorName: 'Rakesh Kumar',
    steps: [
      { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: '10:14 AM', actor: 'Automated CAFM Core' },
      { id: 2, label: 'Automated Telemetry Diagnostic', status: 'completed', time: '10:18 AM', actor: 'Room B-204 IoT Sensor Mesh' },
      { id: 3, label: 'Field Specialist Dispatched', status: 'active', time: '10:32 AM', actor: 'Marcus Vance (#AV-98)' },
      { id: 4, label: 'Resolution & Student Sign-Off', status: 'pending', time: 'Est. 10:59 AM', actor: 'Student Confirmed' }
    ],
    updates: [
      {
        message: 'Automated CAFM ingest created node record CMP-1042 from student portal.',
        updatedBy: 'CAFM Gateway',
        role: 'Automated System',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        message: 'Telemetry check confirmed: Optical HDMI link flapping on Lectern 4 switch port with 14% packet jitter.',
        updatedBy: 'IoT Diagnostic Daemon',
        role: 'Sensor Mesh',
        createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString()
      },
      {
        message: 'Marcus Vance dispatched with replacement optical fiber HDMI cable assembly and breakout box.',
        updatedBy: 'Facilities Dispatch Lead',
        role: 'Operations Desk',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ],
    internalNotes: [
      {
        note: 'Wall plate HDMI extender is overheating; testing secondary optical feed. If failing, will swap whole Extron unit from spare locker #4.',
        authorName: 'Marcus Vance (Campus AV Lead)',
        createdAt: new Date(Date.now() - 1.8 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    _id: 'cmp-0988',
    ticketId: 'CMP-0988',
    title: 'Wi-Fi 7 Enterprise AP Signal Loss & Packet Latency Spike',
    category: 'network',
    categoryName: 'Wi-Fi & Net',
    priority: 'urgent',
    status: 'open',
    statusText: 'Under Review (NOC Triage)',
    building: 'Swami Vivekananda Central Library (LIB-03)',
    location: 'Swami Vivekananda Central Library (LIB-03) - Level 2 Quiet Study Wing (Zone C Carrels)',
    description:
      'Repeated disconnection and packet loss exceeding 40% on AP-LIB-09 during peak morning study hours. Students unable to access digital research databases.',
    assignedTo: 'NOC Network Team',
    assignedToName: 'T. Jenkins',
    assignedRole: 'Campus Core Network Operations • Unit ID #NET-04',
    slaTargetMins: 30,
    slaHours: 0.5,
    minutesElapsed: 12,
    eta: '25 mins',
    createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    attachments: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
    ],
    studentId: {
      _id: 'usr_student_02',
      id: 'usr_student_02',
      name: 'Aditi Verma',
      email: 'aditi.v@nextcampus.edu',
      department: 'School of Biotechnology',
      rollNumber: 'MUR2501044',
      phone: '+91 98111 22334'
    },
    authorName: 'Aditi Verma',
    steps: [
      { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: '11:05 AM', actor: 'Student Portal' },
      { id: 2, label: 'Automated Telemetry Diagnostic', status: 'active', time: '11:08 AM', actor: 'NOC Spectrum Analyzer' },
      { id: 3, label: 'Field Specialist Dispatched', status: 'pending', time: 'Pending Triage', actor: 'Network Ops' },
      { id: 4, label: 'Resolution & Student Sign-Off', status: 'pending', time: 'Est. 11:35 AM', actor: 'Student Confirmed' }
    ],
    updates: [
      {
        message: 'Ticket received and queued for NOC spectrum analysis and channel reallocation.',
        updatedBy: 'NOC Automated',
        role: 'Network Operations',
        createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString()
      }
    ],
    internalNotes: []
  },
  {
    _id: 'cmp-0912',
    ticketId: 'CMP-0912',
    title: 'Water Pressure Loss & Automatic Sensor Valve Leak',
    category: 'infrastructure',
    categoryName: 'Water & Plumbing',
    priority: 'medium',
    status: 'resolved',
    statusText: 'Resolved & Verified',
    building: 'Maharana Pratap Main Academic Block (ADM-01)',
    location: 'Maharana Pratap Main Academic Block (ADM-01) - Ground Floor Restroom Wing (East Bay Sink #3)',
    description:
      'Low water pressure and continuous slow leakage observed beneath sensor faucet #3. Small puddle forming near tile threshold.',
    assignedTo: 'Ramesh Sharma',
    assignedToName: 'Facilities Team 1',
    assignedRole: 'Senior Plumbing Specialist • Unit #PL-14',
    slaTargetMins: 120,
    slaHours: 2,
    minutesElapsed: 95,
    eta: 'Resolved',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    attachments: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    studentId: {
      _id: 'usr_student_01',
      id: 'usr_student_01',
      name: 'Rakesh Kumar',
      email: 'rakesh@nextcampus.edu',
      department: 'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
      rollNumber: 'MUR2502101',
      phone: '+91 98765 43210'
    },
    authorName: 'Rakesh Kumar',
    review: {
      rating: 5,
      comment: 'Technician arrived promptly and replaced the faulty sensor valve within 40 minutes. Clean and professional job!',
      tags: ['Fast Resolution', 'Polite Staff', 'Clean Work Area'],
      reviewedBy: 'Rakesh Kumar',
      createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
    },
    steps: [
      { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: '09:00 AM', actor: 'Student Grievance' },
      { id: 2, label: 'Automated Telemetry Diagnostic', status: 'completed', time: '09:15 AM', actor: 'Water Pressure Sensor #WP-04' },
      { id: 3, label: 'Field Specialist Dispatched', status: 'completed', time: '09:40 AM', actor: 'Facilities Team 1' },
      { id: 4, label: 'Resolution & Student Sign-Off', status: 'completed', time: '10:35 AM', actor: 'Verified by Facilities Desk' }
    ],
    updates: [
      {
        message: 'Ticket created and assigned to Plumbing Team Alpha.',
        updatedBy: 'Facilities CAFM',
        role: 'Helpdesk Dispatch',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        message: 'Technician on site: Valve G-12 gasket replaced and flow pressure recalibrated to 2.8 bar.',
        updatedBy: 'Facilities Team 1',
        role: 'Plumbing Specialist',
        createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString()
      }
    ],
    internalNotes: [
      {
        note: 'Gasket replacement signed off under warranty repair pool.',
        authorName: 'Campus Maintenance Desk',
        createdAt: new Date(Date.now() - 21 * 3600 * 1000).toISOString()
      }
    ]
  }
];

/**
 * Retrieve current complaints stored in client persistence
 */
export function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredComplaints(DEFAULT_COMPLAINTS);
      return DEFAULT_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredComplaints(DEFAULT_COMPLAINTS);
    return DEFAULT_COMPLAINTS;
  } catch (e) {
    console.warn('[ComplaintsStorage] Fallback to default records:', e);
    return DEFAULT_COMPLAINTS;
  }
}

/**
 * Overwrite client storage and broadcast update
 */
export function saveStoredComplaints(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    broadcastUpdate();
  } catch (e) {
    console.error('[ComplaintsStorage] Save failed:', e);
  }
}

/**
 * Upsert a complaint (inserts new ticket at top or replaces existing matching ticketId/_id)
 */
export function upsertComplaint(complaint) {
  const current = getStoredComplaints();
  const index = current.findIndex(
    (c) =>
      c.ticketId === complaint.ticketId ||
      c._id === complaint._id ||
      (c.ticketId && complaint.ticketId && c.ticketId.replace('#', '') === complaint.ticketId.replace('#', ''))
  );

  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...complaint };
  } else {
    updated = [complaint, ...current];
  }

  saveStoredComplaints(updated);
  return complaint;
}

/**
 * Update complaint status
 */
export function updateComplaintStatusInStorage(ticketId, status, message, updatedBy = 'Admin', priority = null) {
  const current = getStoredComplaints();
  const updated = current.map((c) => {
    const match =
      c.ticketId === ticketId ||
      c._id === ticketId ||
      (c.ticketId && ticketId && c.ticketId.replace('#', '') === ticketId.replace('#', ''));
    if (!match) return c;

    const newUpdates = [...(c.updates || [])];
    if (message) {
      newUpdates.push({
        message,
        updatedBy: updatedBy || 'Operations Desk',
        role: 'Admin Dispatch',
        createdAt: new Date().toISOString()
      });
    }

    const updatedSteps = (c.steps || []).map((step) => {
      if (status === 'resolved' || status === 'closed') {
        return { ...step, status: 'completed' };
      }
      if (status === 'in_progress' && step.id <= 3) {
        return { ...step, status: step.id === 3 ? 'active' : 'completed' };
      }
      return step;
    });

    return {
      ...c,
      status,
      priority: priority || c.priority,
      statusText: formatStatusText(status),
      steps: updatedSteps,
      updates: newUpdates,
      updatedAt: new Date().toISOString()
    };
  });

  saveStoredComplaints(updated);
}

/**
 * Assign staff in storage
 */
export function assignStaffInStorage(ticketId, assignedToName, assignedRole = 'Campus Operations Specialist', updatedBy = 'Admin') {
  const current = getStoredComplaints();
  const updated = current.map((c) => {
    const match =
      c.ticketId === ticketId ||
      c._id === ticketId ||
      (c.ticketId && ticketId && c.ticketId.replace('#', '') === ticketId.replace('#', ''));
    if (!match) return c;

    const newUpdates = [
      ...(c.updates || []),
      {
        message: `Technician ${assignedToName} assigned to ticket and dispatched.`,
        updatedBy: updatedBy || 'Operations Desk',
        role: 'Dispatch Desk',
        createdAt: new Date().toISOString()
      }
    ];

    const updatedSteps = (c.steps || []).map((st) => {
      if (st.id === 3) return { ...st, status: 'active', actor: assignedToName };
      return st;
    });

    return {
      ...c,
      assignedTo: assignedToName,
      assignedToName,
      assignedRole,
      status: c.status === 'open' ? 'in_progress' : c.status,
      statusText: formatStatusText(c.status === 'open' ? 'in_progress' : c.status),
      steps: updatedSteps,
      updates: newUpdates,
      updatedAt: new Date().toISOString()
    };
  });

  saveStoredComplaints(updated);
}

/**
 * Add or update student review on a completed/resolved complaint
 */
export function addComplaintReviewInStorage(ticketId, reviewData) {
  const current = getStoredComplaints();
  const updated = current.map((c) => {
    const match =
      c.ticketId === ticketId ||
      c._id === ticketId ||
      (c.ticketId && ticketId && c.ticketId.replace('#', '') === ticketId.replace('#', ''));
    if (!match) return c;

    const review = {
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      tags: reviewData.tags || [],
      reviewedBy: reviewData.reviewedBy || c.authorName || 'Student',
      createdAt: new Date().toISOString()
    };

    const newUpdates = [
      ...(c.updates || []),
      {
        message: `Student verified resolution and submitted ${reviewData.rating}-star review: "${reviewData.comment ? reviewData.comment.slice(0, 75) + '...' : 'Satisfaction confirmed'}"`,
        updatedBy: reviewData.reviewedBy || 'Student Requester',
        role: 'Student Reviewer',
        createdAt: new Date().toISOString()
      }
    ];

    return {
      ...c,
      review,
      updates: newUpdates,
      updatedAt: new Date().toISOString()
    };
  });

  saveStoredComplaints(updated);
  return updated.find(
    (c) =>
      c.ticketId === ticketId ||
      c._id === ticketId ||
      (c.ticketId && ticketId && c.ticketId.replace('#', '') === ticketId.replace('#', ''))
  );
}

/**
 * Merge complaints retrieved from server with client stored complaints.
 * Server records take precedence for status updates; client-created student tickets
 * not yet on server are preserved.
 */
export function mergeServerComplaintsWithStorage(serverComplaints = []) {
  if (!Array.isArray(serverComplaints) || serverComplaints.length === 0) {
    return getStoredComplaints();
  }

  const stored = getStoredComplaints();
  const map = new Map();

  // 1. Put stored complaints in map
  stored.forEach((item) => {
    const key = (item.ticketId || item._id || '').replace('#', '');
    if (key) map.set(key, item);
  });

  // 2. Overlay server complaints
  serverComplaints.forEach((sItem) => {
    const key = (sItem.ticketId || sItem._id || '').replace('#', '');
    if (!key) return;

    const existing = map.get(key);
    // Keep review from storage if server didn't return one
    const mergedReview = sItem.review || existing?.review || null;

    map.set(key, {
      ...existing,
      ...sItem,
      review: mergedReview,
      ticketId: sItem.ticketId || existing?.ticketId || `#CMP-${key.slice(-4)}`,
      statusText: formatStatusText(sItem.status)
    });
  });

  const merged = Array.from(map.values());
  saveStoredComplaints(merged);
  return merged;
}

/**
 * Listen for realtime updates from other components or tabs
 */
export function subscribeToComplaints(callback) {
  const handler = () => {
    callback(getStoredComplaints());
  };

  window.addEventListener(SYNC_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(SYNC_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function broadcastUpdate() {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT));
}

function formatStatusText(status) {
  switch (status) {
    case 'in_progress':
      return 'In Progress (Technician Dispatched)';
    case 'parts_ordered':
      return 'Parts Requisitioned • Waiting Spares';
    case 'resolved':
    case 'closed':
      return 'Resolved & Student Verified';
    case 'open':
    default:
      return 'Under Review (Triage Queued)';
  }
}
