import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export function ComplaintAdmin() {
  const { user } = useContext(AuthContext) || {};

  // Complaints and staff lists
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState('CMP-1042');
  const [successToast, setSuccessToast] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeQuickPill, setActiveQuickPill] = useState('all');

  // Interactive Composers in Right Inspector
  const [publicUpdateText, setPublicUpdateText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');

  // Modals
  const [showDispatchRulesModal, setShowDispatchRulesModal] = useState(false);
  const [showLogTicketModal, setShowLogTicketModal] = useState(false);
  const [zoomEvidenceUrl, setZoomEvidenceUrl] = useState(null);

  // New Ticket Form State
  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    category: 'av',
    priority: 'high',
    location: 'Alan Turing Hall, Room B-204',
    description: '',
    reporterName: 'Facilities Maintenance Dispatch',
  });

  useEffect(() => {
    fetchComplaintsData();
  }, []);

  const fetchComplaintsData = async () => {
    setLoading(true);
    try {
      const [compRes, staffRes] = await Promise.all([
        api.get('/care/complaints').catch(() => null),
        api.get('/care/staff').catch(() => null),
      ]);

      if (compRes && compRes.success && Array.isArray(compRes.data)) {
        setComplaints(compRes.data);
        if (compRes.data.length > 0 && !selectedTicketId) {
          setSelectedTicketId(compRes.data[0].ticketId);
        }
      }

      if (staffRes && staffRes.success && Array.isArray(staffRes.data)) {
        setStaffList(staffRes.data);
      } else {
        setStaffList([
          { id: '1', name: 'Marcus Vance', specialty: 'Senior AV Lead' },
          { id: '2', name: 'Elena Rostova', specialty: 'HVAC & Climate Lead' },
          { id: '3', name: 'T. Jenkins', specialty: 'Core Network Engineer' },
          { id: '4', name: 'Facilities Team 1', specialty: 'Electrical Systems' },
          { id: '5', name: 'Campus Logistics', specialty: 'Furniture & Sanitation' },
        ]);
      }
    } catch (err) {
      console.warn('Complaint data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Active Complaint in Inspector
  const activeComplaint =
    complaints.find((c) => c.ticketId === selectedTicketId || c._id === selectedTicketId) ||
    complaints[0] || {
      _id: 'default_1042',
      ticketId: 'CMP-1042',
      title: 'CS Lab B Projector HDMI Signal Loss & Flicker',
      category: 'av',
      priority: 'high',
      status: 'in_progress',
      description:
        'Intermittent black screening and magenta artifacts during lecture streaming. System restarts do not resolve. Wall jack warm to touch.',
      location: 'Alan Turing Hall, Room B-204',
      studentId: {
        name: 'Rudra Sharma',
        rollNumber: 'MU2026001',
        department: 'B.Tech Computer Science (2nd Year)',
        phone: '+91 98765 43210',
      },
      assignedToName: 'Marcus Vance',
      attachments: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBw7uQg4w8l-jkRzjUZU6--yRO7EQa8Qs-mw9brbhcaPHvG564vc-a7gIyCJ3Tcy7M1x0sJpcSDK-Gw4Me1KlEKDquom74fUxEQn_xeDtBZFMx8yNuDRIwO4Wi_vT0g8mPxtYuHM76BQi2B8b74zEU04zWKNT6rdUIfyUrhXj9GExTAA--X79VIVxBOqo3MyMCVG2FLW0LTwHzlXtKvXF45lm0BN6TMatag_GD-nu4bPJWo4BtC_zDw',
      ],
      updates: [
        {
          message: 'Technician Marcus Vance has been dispatched to Alan Turing Hall Room B-204 with replacement 4K optical HDMI transceiver.',
          updatedBy: 'Auto-Broadcast • Dispatch System',
          createdAt: new Date().toISOString(),
        },
      ],
      internalNotes: [
        {
          note: 'The wall plate HDMI extender is overheating; testing secondary optical feed. If failing, will swap whole Extron unit from spare locker #4 in server room.',
          authorName: 'M. Vance (Campus AV Lead)',
          createdAt: new Date().toISOString(),
        },
      ],
    };

  // Filtered complaints queue
  const filteredComplaints = complaints.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.ticketId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.studentId?.name && c.studentId.name.toLowerCase().includes(q)) ||
      (c.assignedToName && c.assignedToName.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

    let matchesPill = true;
    if (activeQuickPill === 'unassigned') {
      matchesPill = !c.assignedToName || c.assignedToName === 'Unassigned' || c.status === 'open';
    } else if (activeQuickPill === 'dispatched') {
      matchesPill = c.status === 'in_progress' || (c.assignedToName && c.assignedToName !== 'Unassigned');
    } else if (activeQuickPill === 'escalated') {
      matchesPill = c.priority === 'critical' || c.priority === 'high' || c.priority === 'urgent';
    } else if (activeQuickPill === 'resolved') {
      matchesPill = c.status === 'resolved' || c.status === 'closed';
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesPill;
  });

  // KPI Calculations
  const totalActiveTickets = complaints.length;
  const criticalCount = complaints.filter((c) => c.priority === 'critical' || c.priority === 'high').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const newTriageCount = complaints.filter((c) => c.status === 'open').length;

  // Handler: Assign Staff
  const handleAssignStaff = async (staffName) => {
    if (!activeComplaint) return;
    try {
      const staffObj = staffList.find((s) => s.name === staffName);
      const res = await api.post(`/care/complaints/${activeComplaint._id || activeComplaint.ticketId}/assign`, {
        assignedTo: staffObj?.id || staffObj?._id || undefined,
        assignedToName: staffName,
      });

      if (res && res.success) {
        showToast(`Dispatched to ${staffName}.`);
        setComplaints((prev) =>
          prev.map((c) => (c.ticketId === activeComplaint.ticketId || c._id === activeComplaint._id ? res.data : c))
        );
      }
    } catch (err) {
      alert(`Assignment error: ${err.message}`);
    }
  };

  // Handler: Update Workflow Status
  const handleUpdateStatus = async (newStatus) => {
    if (!activeComplaint) return;
    try {
      const message = `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`;
      const res = await api.post(`/care/complaints/${activeComplaint._id || activeComplaint.ticketId}/status`, {
        status: newStatus,
        message,
      });

      if (res && res.success) {
        showToast(`Workflow status updated to ${newStatus}.`);
        setComplaints((prev) =>
          prev.map((c) => (c.ticketId === activeComplaint.ticketId || c._id === activeComplaint._id ? res.data : c))
        );
      }
    } catch (err) {
      alert(`Status update error: ${err.message}`);
    }
  };

  // Handler: Update Priority
  const handleUpdatePriority = async (newPriority) => {
    if (!activeComplaint) return;
    try {
      const res = await api.patch(`/care/complaints/${activeComplaint._id || activeComplaint.ticketId}`, {
        priority: newPriority,
        message: `Triage priority escalated to ${newPriority.toUpperCase()}`,
      });

      if (res && res.success) {
        showToast(`Triage priority updated to ${newPriority}.`);
        setComplaints((prev) =>
          prev.map((c) => (c.ticketId === activeComplaint.ticketId || c._id === activeComplaint._id ? res.data : c))
        );
      }
    } catch (err) {
      alert(`Priority update error: ${err.message}`);
    }
  };

  // Handler: Add Student-Visible Update
  const handlePublishStudentUpdate = async (e) => {
    e.preventDefault();
    if (!publicUpdateText.trim()) return;

    try {
      const res = await api.post(
        `/care/complaints/${activeComplaint._id || activeComplaint.ticketId}/student-update`,
        {
          message: publicUpdateText.trim(),
        }
      );

      if (res && res.success) {
        showToast('Public student broadcast update published.');
        setPublicUpdateText('');
        setComplaints((prev) =>
          prev.map((c) => (c.ticketId === activeComplaint.ticketId || c._id === activeComplaint._id ? res.data : c))
        );
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  // Handler: Add Internal Confidential Staff Note
  const handleSaveInternalNote = async (e) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;

    try {
      const res = await api.post(
        `/care/complaints/${activeComplaint._id || activeComplaint.ticketId}/internal-notes`,
        {
          note: internalNoteText.trim(),
        }
      );

      if (res && res.success) {
        showToast('Confidential internal administrative note saved.');
        setInternalNoteText('');
        setComplaints((prev) =>
          prev.map((c) => (c.ticketId === activeComplaint.ticketId || c._id === activeComplaint._id ? res.data : c))
        );
      }
    } catch (err) {
      alert(`Note save failed: ${err.message}`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvHeader = 'Ticket ID,Title,Category,Priority,Status,Location,Technician,Reporter,Date\n';
    const csvRows = complaints
      .map(
        (c) =>
          `"${c.ticketId}","${c.title}","${c.category}","${c.priority}","${c.status}","${c.location}","${c.assignedToName || 'Unassigned'}","${c.studentId?.name || 'Student'}","${c.createdAt || ''}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NextCampus_Complaints_SLA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Complaints SLA Audit CSV downloaded.');
  };

  // Create New Internal Ticket
  const handleCreateNewTicket = async (e) => {
    e.preventDefault();
    if (!newTicketForm.title.trim() || !newTicketForm.description.trim()) {
      alert('Title and description are required');
      return;
    }

    try {
      const payload = {
        title: newTicketForm.title.trim(),
        category: newTicketForm.category,
        priority: newTicketForm.priority,
        location: newTicketForm.location.trim(),
        description: newTicketForm.description.trim(),
        authorName: newTicketForm.reporterName,
      };

      const res = await api.post('/care/complaints', payload);
      if (res && res.success) {
        showToast(`Internal ticket #${res.data.ticketId} logged successfully.`);
        setComplaints((prev) => [res.data, ...prev]);
        setSelectedTicketId(res.data.ticketId);
        setShowLogTicketModal(false);
        setNewTicketForm({
          title: '',
          category: 'av',
          priority: 'high',
          location: 'Alan Turing Hall, Room B-204',
          description: '',
          reporterName: 'Facilities Maintenance Dispatch',
        });
      }
    } catch (err) {
      alert(`Failed to log ticket: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col w-full text-on-surface space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-secondary-container text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-secondary animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md font-semibold">{successToast}</span>
        </div>
      )}

      {/* Operational Command Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="font-caption text-caption uppercase tracking-wider text-primary font-bold">
              CAMPUS HELPDESK &amp; GRIEVANCES
            </span>
            <span className="text-outline-variant font-caption text-caption">•</span>
            <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-medium">
              DEFECT TRIAGE &amp; INCIDENT WORKFLOW
            </span>
            <span className="text-outline-variant font-caption text-caption">•</span>
            <span className="font-caption text-caption uppercase tracking-wider text-secondary font-bold">
              CENTRAL OPERATIONS
            </span>
            <span className="text-outline-variant font-caption text-caption">•</span>
            <span className="font-caption text-caption uppercase tracking-wider text-outline">SLA ENGINE V2.4</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Helpdesk Administration &amp; Grievance Triage
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Review real-time ticket queues, allocate engineering dispatches, monitor SLA velocity thresholds, and
            broadcast dual-channel student/internal incident status updates.
          </p>
        </div>

        {/* Top Action Group */}
        <div className="flex flex-wrap items-center gap-space-sm pt-2 lg:pt-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-md py-2 rounded-lg font-label-md text-label-md transition-all shadow-sm border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">download</span>
            <span>Export CSV / SLA Audit</span>
          </button>
          <button
            onClick={() => setShowDispatchRulesModal(true)}
            className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-md py-2 rounded-lg font-label-md text-label-md transition-all shadow-sm border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            <span>Dispatch Rules</span>
          </button>
          <button
            onClick={() => setShowLogTicketModal(true)}
            className="flex items-center gap-2 bg-primary-container hover:bg-secondary-container text-on-primary-container px-space-md py-2 rounded-lg font-label-md text-label-md font-bold transition-all shadow-[0_0_16px_rgba(172,39,79,0.35)]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Log Internal Ticket</span>
          </button>
        </div>
      </header>

      {/* Complaint Summary Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
        {/* Card 1 */}
        <div className="bg-surface-container p-space-md rounded-xl shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Total Active Tickets</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">
                  {totalActiveTickets || 48}
                </span>
                <span className="font-caption text-caption text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full">
                  +4 vs yesterday
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low/60 rounded-lg p-2.5 flex items-center justify-between text-caption font-caption border border-outline-variant/10">
            <span className="text-on-surface">
              <strong className="text-primary font-semibold">{newTriageCount || 18}</strong> New Triage
            </span>
            <span className="text-outline">•</span>
            <span className="text-on-surface">
              <strong className="text-secondary font-semibold">{inProgressCount || 22}</strong> In Progress
            </span>
            <span className="text-outline">•</span>
            <span className="text-on-surface">
              <strong className="text-tertiary-fixed-dim font-semibold">8</strong> Pending
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container p-space-md rounded-xl shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Average First Response</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">
                  18<span className="text-headline-md font-semibold text-on-surface-variant">m</span>
                </span>
                <span className="font-caption text-caption text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full">
                  Target &lt; 30m
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-caption text-caption">
              <span className="text-on-surface-variant">SLA Compliance Rate</span>
              <span className="text-secondary font-semibold">94.2% Passed</span>
            </div>
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-outline-variant/20">
              <div className="bg-primary h-full rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container p-space-md rounded-xl shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">Critical &amp; High Priority</span>
                <span className="h-2 w-2 rounded-full bg-error animate-ping"></span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-hero text-display-hero text-error font-extrabold tracking-tight">
                  {criticalCount || 7}
                </span>
                <span className="font-label-md text-label-md text-on-error-container bg-error-container/40 px-2 py-0.5 rounded-full font-medium">
                  Urgent Dispatch
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-error-container/30 text-error">
              <span className="material-symbols-outlined text-[22px]">crisis_alert</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low/60 rounded-lg p-2.5 flex items-center justify-between text-caption font-caption text-on-surface-variant border border-outline-variant/10">
            <span>3 Electrical</span>
            <span className="text-outline">•</span>
            <span>2 Plumbing</span>
            <span className="text-outline">•</span>
            <span>2 Network Core</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container p-space-md rounded-xl shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">7-Day Resolution Velocity</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">
                  92.6<span className="text-headline-md font-semibold text-secondary">%</span>
                </span>
                <span className="font-caption text-caption text-primary font-semibold bg-primary-container/30 px-2 py-0.5 rounded-full">
                  142 Closed
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-[22px]">trending_up</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-caption font-caption">
            <span className="text-on-surface-variant">Mean Resolution Time:</span>
            <span className="text-on-surface font-semibold bg-surface-container-high px-2 py-0.5 rounded">
              1.8 Days / Ticket
            </span>
          </div>
        </div>
      </section>

      {/* Main Dual Workspace (Split 58% Left Queue / 42% Right Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* LEFT COLUMN: Searchable Complaints Queue (7 cols = ~58.3%) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Filter & Quick-Query Bar */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-md flex flex-col gap-space-md border border-outline-variant/20">
            {/* Search and Global Actions */}
            <div className="flex flex-col md:flex-row items-center gap-space-sm">
              <div className="relative w-full flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                  placeholder="Search Ticket ID, title, student, room (e.g. CMP-1042, Turing A-204)..."
                  type="text"
                />
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setActiveQuickPill('all');
                }}
                className="w-full md:w-auto px-space-md py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/30"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Filter Dropdown Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Category</label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-8 border border-outline-variant/30"
                  >
                    <option value="all">All Categories</option>
                    <option value="av">Classroom AV</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="network">IT &amp; Network</option>
                    <option value="hvac">HVAC / Climate</option>
                    <option value="furniture">Furniture</option>
                    <option value="sanitation">Sanitation</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Status</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-8 border border-outline-variant/30"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open / Unassigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="parts_ordered">Parts Ordered</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Priority</label>
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-8 border border-outline-variant/30"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical (&lt; 2h SLA)</option>
                    <option value="high">High (&lt; 4h SLA)</option>
                    <option value="medium">Medium (&lt; 24h SLA)</option>
                    <option value="low">Low (&lt; 48h SLA)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Date Range */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Date Range</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-8 border border-outline-variant/30">
                    <option>Today</option>
                    <option>Past 3 Days</option>
                    <option>This Week</option>
                    <option>Custom Window</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-[16px] pointer-events-none">
                    calendar_today
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Quick Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
              <button
                onClick={() => setActiveQuickPill('all')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap shadow-sm transition-colors ${
                  activeQuickPill === 'all'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                All Queue ({complaints.length})
              </button>
              <button
                onClick={() => setActiveQuickPill('unassigned')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                  activeQuickPill === 'unassigned'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                Unassigned ({complaints.filter((c) => c.status === 'open' || !c.assignedToName).length})
              </button>
              <button
                onClick={() => setActiveQuickPill('dispatched')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                  activeQuickPill === 'dispatched'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                Dispatched ({complaints.filter((c) => c.status === 'in_progress').length})
              </button>
              <button
                onClick={() => setActiveQuickPill('escalated')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeQuickPill === 'escalated'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-error'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                Escalated / High SLA ({criticalCount})
              </button>
              <button
                onClick={() => setActiveQuickPill('resolved')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                  activeQuickPill === 'resolved'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                Resolved ({complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length})
              </button>
            </div>
          </div>

          {/* Complaints Data Table Container */}
          <div className="bg-surface-container rounded-xl shadow-md overflow-hidden flex flex-col border border-outline-variant/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest font-caption text-caption text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
                    <th className="py-3 px-3 w-10 text-center">
                      <input className="rounded bg-surface-container-high text-primary focus:ring-0" type="checkbox" />
                    </th>
                    <th className="py-3 px-3">Ticket &amp; Title</th>
                    <th className="py-3 px-3 hidden sm:table-cell">Location</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 hidden md:table-cell">Technician</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 font-body-sm text-body-sm">
                  {filteredComplaints.map((c) => {
                    const isSelected = activeComplaint?.ticketId === c.ticketId;
                    const techInitials = (c.assignedToName || 'Unassigned')
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2);

                    return (
                      <tr
                        key={c.ticketId || c._id}
                        onClick={() => setSelectedTicketId(c.ticketId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-secondary-container/20 shadow-[inset_3px_0_0_0_#ffb2bf]'
                            : 'hover:bg-surface-container-high/40'
                        }`}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            checked={isSelected}
                            onChange={() => setSelectedTicketId(c.ticketId)}
                            className="rounded bg-surface-container-high text-primary focus:ring-0"
                            type="checkbox"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-label-sm text-label-sm font-semibold text-primary font-mono">
                                {c.ticketId}
                              </span>
                              <span className="font-caption text-caption text-on-surface-variant bg-surface-container-high px-1.5 py-0.2 rounded uppercase">
                                {c.category}
                              </span>
                            </div>
                            <span className="font-title-md text-title-md text-on-surface font-semibold truncate max-w-xs sm:max-w-sm mt-0.5">
                              {c.title}
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                              {c.studentId?.name || 'Student Reporter'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 hidden sm:table-cell">
                          <div className="flex flex-col">
                            <span className="text-on-surface font-medium truncate max-w-[140px]">
                              {c.buildingName || c.location?.split(',')[0] || 'Alan Turing Hall'}
                            </span>
                            <span className="font-caption text-caption text-outline truncate max-w-[140px]">
                              {c.roomNumber || c.location?.split(',')[1] || c.location}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold capitalize ${
                              c.priority === 'critical'
                                ? 'bg-error-container/70 text-error font-bold'
                                : c.priority === 'high'
                                ? 'bg-secondary-container/60 text-secondary'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 w-max">
                            {c.status === 'in_progress' && (
                              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                            )}
                            <span className="capitalize">{c.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 hidden md:table-cell whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm flex items-center justify-center font-bold">
                              {techInitials}
                            </div>
                            <span className="text-on-surface font-medium truncate max-w-[110px]">
                              {c.assignedToName || 'Unassigned'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedTicketId(c.ticketId)}
                            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-space-md bg-surface-container-lowest flex items-center justify-between text-caption font-caption text-on-surface-variant border-t border-outline-variant/20">
              <span>
                Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> complaints
              </span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">1</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Complaint Inspector (Focus on Active Ticket) (5 cols = ~41.7%) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Inspector Core Card */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-md flex flex-col gap-space-md relative border border-outline-variant/20">
            {/* Top Status Bar & Ticket Tags */}
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold tracking-wide font-mono">
                  TICKET #{activeComplaint.ticketId}
                </span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full font-label-sm text-label-sm uppercase">
                  {activeComplaint.category}
                </span>
                <span className="bg-secondary-container/60 text-secondary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold uppercase">
                  {activeComplaint.priority} SLA
                </span>
                <span className="bg-surface-container-highest text-primary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold flex items-center gap-1 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  {activeComplaint.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
                  title="Print Work Order"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                </button>
              </div>
            </div>

            {/* Issue Title & Description */}
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                {activeComplaint.title}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{activeComplaint.description}</p>
              <div className="flex items-center gap-2 mt-2 font-caption text-caption text-secondary">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>{activeComplaint.location}</span>
              </div>
            </div>

            {/* Reporter Profile Card with Evidence Thumbnail */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-start justify-between gap-space-sm border border-outline-variant/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                  {activeComplaint.studentId?.name ? activeComplaint.studentId.name[0] : 'S'}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      {activeComplaint.studentId?.name || 'Rudra Sharma'}
                    </span>
                    <span className="font-caption text-caption text-secondary bg-surface-container-high px-1.5 py-0.5 rounded font-mono">
                      {activeComplaint.studentId?.rollNumber || 'MU2026001'}
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    {activeComplaint.studentId?.department || 'Computer Science'} •{' '}
                    {activeComplaint.studentId?.phone || '+91 98765 43210'}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-outline font-caption text-caption">
                    <span className="material-symbols-outlined text-[14px] text-primary">smartphone</span>
                    <span>Submitted via NextCampus Student Care App</span>
                  </div>
                </div>
              </div>

              {/* Photo Evidence Attachment Thumbnail */}
              {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => setZoomEvidenceUrl(activeComplaint.attachments[0])}
                    className="w-14 h-14 rounded-lg bg-surface-container-highest overflow-hidden relative group cursor-pointer shadow-sm border border-outline-variant/30"
                  >
                    <img
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      alt="Defect evidence thumbnail"
                      src={activeComplaint.attachments[0]}
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="material-symbols-outlined text-white text-[18px]">zoom_in</span>
                    </div>
                  </div>
                  <span className="font-caption text-caption text-outline text-[10px] mt-1 text-center truncate max-w-[64px]">
                    evidence.jpg
                  </span>
                </div>
              )}
            </div>

            {/* Dispatch & Status Assignment Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* Assigned Technician Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Assigned Technician</label>
                <div className="relative">
                  <select
                    value={activeComplaint.assignedToName || 'Unassigned'}
                    onChange={(e) => handleAssignStaff(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-7 border border-outline-variant/30"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {staffList.map((s, idx) => (
                      <option key={idx} value={s.name}>
                        {s.name} ({s.specialty || 'Tech'})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-1.5 top-2 text-outline text-[16px] pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* Workflow Status Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Workflow Status</label>
                <div className="relative">
                  <select
                    value={activeComplaint.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-7 border border-outline-variant/30"
                  >
                    <option value="open">Open / Unassigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="parts_ordered">Awaiting Parts</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed / Archived</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-1.5 top-2 text-outline text-[16px] pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* Triage Priority Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-outline font-medium">Triage Priority</label>
                <div className="relative">
                  <select
                    value={activeComplaint.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary pr-7 border border-outline-variant/30"
                  >
                    <option value="critical">Critical (2hr SLA)</option>
                    <option value="high">High (4hr SLA)</option>
                    <option value="medium">Medium (24hr SLA)</option>
                    <option value="low">Low (48hr SLA)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-1.5 top-2 text-outline text-[16px] pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            {/* DUAL NOTE SYSTEM (STRICT VISUAL SEPARATION) */}
            <div className="flex flex-col gap-space-md pt-2">
              {/* Section A: Student-Visible Updates (Public) */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-space-sm relative border border-secondary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">public</span>
                    <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                      Student-Visible Updates (Public)
                    </span>
                  </div>
                  <span className="font-caption text-caption text-outline">Synced to Student App Feed</span>
                </div>

                {/* Feed History */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {activeComplaint.updates && activeComplaint.updates.length > 0 ? (
                    activeComplaint.updates.map((up, uIdx) => (
                      <div
                        key={uIdx}
                        className="bg-surface-container-low p-2.5 rounded-lg flex flex-col gap-1 text-body-sm font-body-sm border border-outline-variant/10"
                      >
                        <div className="flex items-center justify-between text-caption font-caption text-outline">
                          <span className="text-secondary font-medium">{up.updatedBy || 'Staff Dispatch'}</span>
                          <span>{new Date(up.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-on-surface leading-snug">{up.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-caption text-on-surface-variant italic">No public updates logged yet.</p>
                  )}
                </div>

                {/* Student Note Composer */}
                <form onSubmit={handlePublishStudentUpdate} className="flex flex-col gap-1.5 mt-1">
                  <textarea
                    value={publicUpdateText}
                    onChange={(e) => setPublicUpdateText(e.target.value)}
                    className="w-full bg-surface-container-high text-on-surface placeholder:text-outline font-body-sm text-body-sm p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary resize-none border border-outline-variant/20"
                    placeholder={`Draft public progress update visible to ${activeComplaint.studentId?.name || 'student'}...`}
                    rows="2"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      className="px-3 py-1 bg-surface-container-highest hover:bg-secondary-container text-on-secondary-container rounded-lg font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1.5 shadow"
                      type="submit"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Publish Student Update</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Section B: Internal Staff Notes (Confidential) */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-space-sm relative border border-error/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[20px]">lock</span>
                    <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-error">
                      Internal Staff Notes (Confidential)
                    </span>
                  </div>
                  <span className="font-caption text-caption text-error-container font-semibold bg-error/10 px-2 py-0.5 rounded-full border border-error/30">
                    Not Visible to Students
                  </span>
                </div>

                {/* Internal Notes History */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {activeComplaint.internalNotes && activeComplaint.internalNotes.length > 0 ? (
                    activeComplaint.internalNotes.map((note, nIdx) => (
                      <div
                        key={nIdx}
                        className="bg-surface-container-low p-2.5 rounded-lg flex flex-col gap-1 text-body-sm font-body-sm border border-error/20"
                      >
                        <div className="flex items-center justify-between text-caption font-caption text-outline">
                          <span className="text-error font-medium">{note.authorName || 'Internal Technician'}</span>
                          <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-on-surface leading-snug">{note.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-caption text-on-surface-variant italic">No confidential internal notes recorded yet.</p>
                  )}
                </div>

                {/* Internal Note Composer */}
                <form onSubmit={handleSaveInternalNote} className="flex flex-col gap-1.5 mt-1">
                  <textarea
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="w-full bg-surface-container-high text-on-surface placeholder:text-outline font-body-sm text-body-sm p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-outline-variant/20"
                    placeholder="Add confidential technician note, hardware serials, vendor RMA..."
                    rows="2"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      className="px-3 py-1 bg-primary-container hover:bg-secondary-container text-on-primary-container rounded-lg font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1.5 shadow"
                      type="submit"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Save Internal Note</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Resolution Timeline & Audit Stepper */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface">
                  Lifecycle &amp; Audit Progression
                </span>
                <span className="font-caption text-caption text-secondary font-mono">SLA Remaining: 02h 45m</span>
              </div>

              {/* Stepper Graphic */}
              <div className="relative pl-6 flex flex-col gap-3 py-1">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container-high"></div>

                {/* Step 1: Lodged */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="flex items-baseline justify-between w-full font-body-sm text-body-sm">
                    <span className="text-on-surface font-medium">1. Created by Student ({activeComplaint.studentId?.name || 'Rudra Sharma'})</span>
                    <span className="font-caption text-caption text-outline">08:35 AM</span>
                  </div>
                </div>

                {/* Step 2: Triaged */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="flex items-baseline justify-between w-full font-body-sm text-body-sm">
                    <span className="text-on-surface font-medium">2. Triaged by Admin Operations</span>
                    <span className="font-caption text-caption text-outline">08:48 AM</span>
                  </div>
                </div>

                {/* Step 3: Assigned */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="flex items-baseline justify-between w-full font-body-sm text-body-sm">
                    <span className="text-on-surface font-medium">
                      3. Dispatched to {activeComplaint.assignedToName || 'Marcus Vance'}
                    </span>
                    <span className="font-caption text-caption text-outline">09:25 AM</span>
                  </div>
                </div>

                {/* Step 4: Active In Progress */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse"></div>
                  <div className="flex items-baseline justify-between w-full font-body-sm text-body-sm">
                    <span className="text-primary font-bold">4. In Progress: Hardware diagnostic underway</span>
                    <span className="font-caption text-caption text-primary font-semibold">Active Now</span>
                  </div>
                </div>

                {/* Step 5: Sign-off */}
                <div className={`relative flex items-center gap-3 ${activeComplaint.status === 'resolved' ? '' : 'opacity-40'}`}>
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-surface-container-highest"></div>
                  <div className="flex items-baseline justify-between w-full font-body-sm text-body-sm">
                    <span className="text-on-surface">5. Student Verification &amp; Sign-off</span>
                    <span className="font-caption text-caption text-outline">
                      {activeComplaint.status === 'resolved' ? 'Signed Off' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Step 6: Resolved / Closed */}
                <div className={`relative flex items-center gap-3 ${activeComplaint.status === 'closed' ? '' : 'opacity-40'}`}>
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-surface-container-highest"></div>
                  <div className="flex items-baseline justify-between w-full font-body-sm text-body-sm">
                    <span className="text-on-surface">6. Resolved &amp; Archived into Facility Ledger</span>
                    <span className="font-caption text-caption text-outline">
                      {activeComplaint.status === 'closed' ? 'Archived' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar & Resolution Sign-off */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => alert(`Escalated ticket #${activeComplaint.ticketId} to OEM hardware vendor support.`)}
                  className="flex-1 px-space-md py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">forward</span>
                  <span>Escalate to Vendor</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('parts_ordered')}
                  className="px-space-md py-2 bg-surface-container-high hover:bg-surface-container-highest text-outline hover:text-on-surface font-label-md text-label-md rounded-lg transition-colors border border-outline-variant/30"
                  type="button"
                >
                  <span>Hold / Parts</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  className="flex-2 px-space-md py-2 bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-md text-label-md font-bold rounded-lg transition-all shadow-[0_0_16px_rgba(172,39,79,0.35)] flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Resolve &amp; Sign-off</span>
                </button>
              </div>

              {/* Simulation Mode Indicator */}
              <div className="bg-surface-container-low px-3 py-1.5 rounded-lg flex items-center justify-between text-caption font-caption text-outline border border-outline-variant/20">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
                  <span>Administrative mode: status transitions trigger audit ledger logs.</span>
                </span>
                <span className="text-primary font-mono font-medium">Session: ELEANOR-042</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Dispatch Rules */}
      {showDispatchRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
          <div className="bg-surface-variant w-full max-w-lg rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">tune</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Automated Dispatch &amp; SLA Rules
                </h3>
              </div>
              <button
                onClick={() => setShowDispatchRulesModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <h4 className="font-semibold text-on-surface mb-1 text-primary">Critical Priority (2-Hour SLA)</h4>
                <p>Applies to power failure, plumbing conduits near electrics, security breach, or total network outage.</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <h4 className="font-semibold text-on-surface mb-1 text-secondary">High Priority (4-Hour SLA)</h4>
                <p>Applies to active lecture theatre AV dropouts, lab workstation clusters, and climate control in data rooms.</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <h4 className="font-semibold text-on-surface mb-1">Dual Note Privacy Guarantee</h4>
                <p>
                  Any note placed in the <strong>Internal Staff Notes</strong> container is cryptographically guarded and
                  never transmitted across the public student API surface.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setShowDispatchRulesModal(false)}
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Log Internal Ticket */}
      {showLogTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
          <div className="bg-surface-variant w-full max-w-lg rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">add_circle</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Log Institutional Maintenance Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowLogTicketModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewTicket} className="space-y-3 font-body-sm text-body-sm">
              <div>
                <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC unit condenser vibrating loudly"
                  value={newTicketForm.title}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, title: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="av">Classroom AV</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="network">IT &amp; Network</option>
                    <option value="hvac">HVAC / Climate</option>
                    <option value="furniture">Furniture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="critical">Critical (&lt; 2h SLA)</option>
                    <option value="high">High (&lt; 4h SLA)</option>
                    <option value="medium">Medium (&lt; 24h SLA)</option>
                    <option value="low">Low (&lt; 48h SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                  Facility Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alan Turing Hall, Room B-204"
                  value={newTicketForm.location}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, location: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                  Defect Description *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide technical details, observed malfunction, and preliminary assessment..."
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full bg-surface-container-low p-2 rounded-lg text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowLogTicketModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary font-bold shadow"
                >
                  Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL: Evidence Zoom Preview */}
      {zoomEvidenceUrl && (
        <div
          onClick={() => setZoomEvidenceUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <img src={zoomEvidenceUrl} alt="Evidence zoomed" className="w-full h-full object-contain" />
            <button
              onClick={() => setZoomEvidenceUrl(null)}
              className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/90"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintAdmin;
