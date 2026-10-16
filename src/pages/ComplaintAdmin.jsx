import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Star } from 'lucide-react';
import {
  getStoredComplaints,
  saveStoredComplaints,
  updateComplaintStatusInStorage,
  assignStaffInStorage,
  mergeServerComplaintsWithStorage,
  subscribeToComplaints
} from '../utils/complaintsStorage';

export function ComplaintAdmin() {
  const { user } = useContext(AuthContext) || {};

  // Complaints and staff lists (Initialized with shared client persistence so queue is never empty)
  const [complaints, setComplaints] = useState(() => getStoredComplaints());
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    const list = getStoredComplaints();
    return list[0]?.ticketId || 'CMP-1042';
  });
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
  const [showLogTicketModal, setShowLogTicketModal] = useState(false);
  const [zoomEvidenceUrl, setZoomEvidenceUrl] = useState(null);

  // New Ticket Form State
  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    category: 'av',
    priority: 'high',
    location: 'Faculty of Engineering & Technology, Room B-204',
    description: '',
    reporterName: 'Facilities Maintenance Dispatch',
  });

  useEffect(() => {
    fetchComplaintsData();
    const unsubscribe = subscribeToComplaints((updated) => {
      setComplaints(updated);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard accessibility: Escape to dismiss modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomEvidenceUrl) setZoomEvidenceUrl(null);
        else if (showLogTicketModal) setShowLogTicketModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomEvidenceUrl, showLogTicketModal]);

  const fetchComplaintsData = async () => {
    setLoading(true);
    try {
      const [compRes, staffRes] = await Promise.all([
        api.get('/care/complaints').catch(() => null),
        api.get('/care/staff').catch(() => null),
      ]);

      if (compRes && compRes.success && Array.isArray(compRes.data)) {
        const merged = mergeServerComplaintsWithStorage(compRes.data);
        setComplaints(merged);
        if (merged.length > 0 && !selectedTicketId) {
          setSelectedTicketId(merged[0].ticketId);
        }
      } else {
        const stored = getStoredComplaints();
        setComplaints(stored);
        if (stored.length > 0 && !selectedTicketId) {
          setSelectedTicketId(stored[0].ticketId);
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
      const stored = getStoredComplaints();
      setComplaints(stored);
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
      location: 'Faculty of Engineering & Technology, Room B-204',
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
          message: 'Technician Marcus Vance has been dispatched to Faculty of Engineering & Technology Room B-204 with replacement 4K optical HDMI transceiver.',
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
  const reviewedComplaints = complaints.filter((c) => c.review && c.review.rating);
  const reviewsCount = reviewedComplaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
  const avgSatisfaction = reviewsCount > 0
    ? (reviewedComplaints.reduce((acc, c) => acc + Number(c.review.rating), 0) / reviewsCount).toFixed(1)
    : '5.0';

  // Handler: Assign Staff
  const handleAssignStaff = async (staffName) => {
    if (!activeComplaint || staffName === 'Unassigned') return;
    const ticketKey = (activeComplaint.ticketId || activeComplaint._id || '').replace('#', '');
    try {
      const staffObj = staffList.find((s) => s.name === staffName);
      await api.post(`/care/complaints/${ticketKey}/assign`, {
        assignedTo: staffObj?.id || staffObj?._id || undefined,
        assignedToName: staffName,
      }).catch(() => null);

      assignStaffInStorage(activeComplaint.ticketId || activeComplaint._id, staffName, 'Facilities Specialist', user?.name || 'Admin');
      showToast(`Dispatched to ${staffName}.`);
    } catch {
      assignStaffInStorage(activeComplaint.ticketId || activeComplaint._id, staffName, 'Facilities Specialist', user?.name || 'Admin');
      showToast(`Dispatched to ${staffName}.`);
    }
  };

  // Handler: Update Workflow Status
  const handleUpdateStatus = async (newStatus) => {
    if (!activeComplaint) return;
    const ticketKey = (activeComplaint.ticketId || activeComplaint._id || '').replace('#', '');
    const message = `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`;
    try {
      await api.post(`/care/complaints/${ticketKey}/status`, {
        status: newStatus,
        message,
      }).catch(() => null);

      updateComplaintStatusInStorage(
        activeComplaint.ticketId || activeComplaint._id,
        newStatus,
        message,
        user?.name || 'Admin',
        activeComplaint.priority
      );
      showToast(`Workflow status updated to ${newStatus.replace('_', ' ')}.`);
    } catch {
      updateComplaintStatusInStorage(
        activeComplaint.ticketId || activeComplaint._id,
        newStatus,
        message,
        user?.name || 'Admin'
      );
      showToast(`Workflow status updated to ${newStatus.replace('_', ' ')}.`);
    }
  };

  // Handler: Update Priority
  const handleUpdatePriority = async (newPriority) => {
    if (!activeComplaint) return;
    const ticketKey = (activeComplaint.ticketId || activeComplaint._id || '').replace('#', '');
    const message = `Triage priority escalated to ${newPriority.toUpperCase()}`;
    try {
      await api.patch(`/care/complaints/${ticketKey}`, {
        priority: newPriority,
        message,
      }).catch(() => null);

      updateComplaintStatusInStorage(
        activeComplaint.ticketId || activeComplaint._id,
        activeComplaint.status,
        message,
        user?.name || 'Admin',
        newPriority
      );
      showToast(`Triage priority updated to ${newPriority}.`);
    } catch {
      updateComplaintStatusInStorage(
        activeComplaint.ticketId || activeComplaint._id,
        activeComplaint.status,
        message,
        user?.name || 'Admin',
        newPriority
      );
      showToast(`Triage priority updated to ${newPriority}.`);
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
          location: 'Faculty of Engineering & Technology, Room B-204',
          description: '',
          reporterName: 'Facilities Maintenance Dispatch',
        });
      }
    } catch (err) {
      alert(`Failed to log ticket: ${err.message}`);
    }
  };


  // ─── helpers ──────────────────────────────────────────────────────────────
  const priorityMeta = (p) => {
    if (p === 'critical') return { badge: 'bg-red-100 text-red-700 border border-red-200', label: 'CRITICAL' };
    if (p === 'high')     return { badge: 'bg-orange-100 text-orange-700 border border-orange-200', label: 'HIGH' };
    if (p === 'medium')   return { badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200', label: 'MED' };
    return                       { badge: 'bg-gray-100 text-gray-600 border border-gray-200', label: 'LOW' };
  };
  const statusMeta = (s) => {
    if (s === 'open')          return { cls: 'bg-blue-50 text-blue-700 border border-blue-200',      dot: '#3478B8', label: 'Open' };
    if (s === 'in_progress')   return { cls: 'bg-violet-50 text-violet-700 border border-violet-200', dot: '#7C3AED', label: 'In Progress' };
    if (s === 'parts_ordered') return { cls: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: '#D97706', label: 'Parts Ordered' };
    if (s === 'resolved')      return { cls: 'bg-green-50 text-green-700 border border-green-200',   dot: '#168567', label: 'Resolved' };
    if (s === 'closed')        return { cls: 'bg-gray-100 text-gray-600 border border-gray-200',     dot: '#9CA3AF', label: 'Closed' };
    return                            { cls: 'bg-gray-100 text-gray-600 border border-gray-200',     dot: '#9CA3AF', label: s };
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#202A27] pb-16">

      {/* Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold"
          style={{ background: 'var(--brand-primary)', border: '1px solid var(--brand-primary-hover)' }}>
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {successToast}
        </div>
      )}

      {/* Header — exact same structure as AdminDashboard */}
      <div className="bg-[#142D28] text-white pt-8 pb-10 px-4 sm:px-8 border-b border-[#20443D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#168567]/30 text-[#6CE0B8] border border-[#168567]/50 text-[10px] font-mono font-bold uppercase tracking-wider">
                Campus Helpdesk &amp; Grievances
              </span>
              <span className="text-xs text-[#A3B8AC]">Mewar University • Central Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Helpdesk Administration</h1>
            <p className="text-sm text-[#A3B8AC] mt-1 max-w-2xl">
              Real-time complaint triage, SLA monitoring, technician dispatch, and student satisfaction analytics.
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-[#E4EAE5]">
            <span className="material-symbols-outlined text-[16px] text-[#6CE0B8]">shield</span>
            <div className="flex flex-col">
              <span className="font-bold text-white">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-[#A3B8AC]">Super Admin Clearance</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards + rest of content — exact same -mt-6 + max-w-7xl container as AdminDashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* Total Tickets */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Total Tickets</span>
              <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">{totalActiveTickets || 0}</div>
              <p className="text-xs text-[#87968D] mt-1">
                <span className="text-[#168567] font-bold">{newTriageCount || 0} Open</span> • {inProgressCount || 0} Active • {resolvedCount || 0} Done
              </p>
            </div>
          </div>

          {/* Avg First Response */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#3478B8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Avg. First Response</span>
              <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">18 <span className="text-lg font-bold text-[#3478B8]">min</span></div>
              <p className="text-xs text-[#87968D] mt-1">
                <span className="text-[#168567] font-bold">Target &lt;30m</span> • SLA 94.2%
              </p>
            </div>
          </div>

          {/* Critical & High */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#C43D4B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Critical &amp; High</span>
              <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">{criticalCount || 0}</div>
              <p className="text-xs text-[#87968D] mt-1">
                {criticalCount > 0
                  ? <span className="text-[#C43D4B] font-bold">Requires Immediate Action</span>
                  : <span className="text-[#168567] font-bold">All Clear</span>}
              </p>
            </div>
          </div>

          {/* Student CSAT */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FFF9EB] text-[#B26A00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">reviews</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Student CSAT</span>
              <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">{avgSatisfaction} <span className="text-lg text-[#B26A00]">★</span></div>
              <p className="text-xs text-[#87968D] mt-1">
                {reviewsCount > 0
                  ? <><span className="text-[#B26A00] font-bold">{reviewsCount} review{reviewsCount > 1 ? 's' : ''}</span> submitted</>
                  : 'No reviews yet'}
              </p>
            </div>
          </div>

        </div>{/* end KPI grid */}

        {/* Main Split — inside the same max-w-7xl container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">

        {/* LEFT */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Filters */}
          <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px]" style={{ color: 'var(--text-secondary)' }}>search</span>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
                  style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }}
                  placeholder="Search ticket ID, title, student, location…" type="text" />
              </div>
              <button onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); setPriorityFilter('all'); setActiveQuickPill('all'); }}
                type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined text-[16px]">tune</span>Reset
              </button>
              <button onClick={handleExportCSV} type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined text-[16px]">download</span>Export CSV
              </button>
              <button onClick={() => setShowLogTicketModal(true)} type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white shadow-sm"
                style={{ background: 'var(--brand-primary)' }}>
                <span className="material-symbols-outlined text-[16px]">add_circle</span>Log Ticket
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: categoryFilter, setter: setCategoryFilter, options: [['all','All Categories'],['av','Classroom AV'],['electrical','Electrical'],['plumbing','Plumbing'],['network','IT & Network'],['hvac','HVAC/Climate'],['furniture','Furniture'],['sanitation','Sanitation']] },
                { value: statusFilter,   setter: setStatusFilter,   options: [['all','All Statuses'],['open','Open'],['in_progress','In Progress'],['parts_ordered','Parts Ordered'],['resolved','Resolved'],['closed','Closed']] },
                { value: priorityFilter, setter: setPriorityFilter, options: [['all','All Priorities'],['critical','Critical'],['high','High'],['medium','Medium'],['low','Low']] },
              ].map(({ value, setter, options }, idx) => (
                <div key={idx} className="relative">
                  <select value={value} onChange={(e) => setter(e.target.value)} className="w-full appearance-none px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                    style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }}>
                    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1.5 text-[14px] pointer-events-none" style={{ color: 'var(--text-secondary)' }}>expand_more</span>
                </div>
              ))}
              <div className="relative">
                <select className="w-full appearance-none px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                  style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }}>
                  <option>Today</option><option>Past 3 Days</option><option>This Week</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1.5 text-[14px] pointer-events-none" style={{ color: 'var(--text-secondary)' }}>calendar_today</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'all',        label: `All Queue (${complaints.length})` },
                { key: 'unassigned', label: `Unassigned (${complaints.filter(c => c.status === 'open' || !c.assignedToName).length})` },
                { key: 'dispatched', label: `Dispatched (${complaints.filter(c => c.status === 'in_progress').length})` },
                { key: 'escalated',  label: `Escalated (${criticalCount})`, alert: true },
                { key: 'resolved',   label: `Resolved (${complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length})` },
              ].map(({ key, label, alert }) => (
                <button key={key} onClick={() => setActiveQuickPill(key)} type="button"
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1"
                  style={activeQuickPill === key
                    ? { background: 'var(--brand-primary)', color: '#fff' }
                    : { background: 'var(--bg-canvas)', color: 'var(--text-secondary)', border: '1px solid var(--border-interactive)' }}>
                  {alert && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--status-danger)' }} />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="flex flex-col gap-2">
            {filteredComplaints.map((c) => {
              const isSelected = activeComplaint?.ticketId === c.ticketId;
              const pm = priorityMeta(c.priority);
              const sm = statusMeta(c.status);
              const ti = (c.assignedToName || 'U').split(' ').map(w => w[0]).join('').slice(0, 2);
              return (
                <div key={c.ticketId || c._id} onClick={() => setSelectedTicketId(c.ticketId)}
                  className="relative rounded-2xl p-4 cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'var(--brand-soft-bg)' : 'var(--bg-surface)',
                    border: isSelected ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? 'inset 3px 0 0 var(--brand-primary)' : 'none',
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,var(--brand-primary),var(--brand-forest))' }}>
                      {(c.studentId?.name || 'S')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-bold font-mono" style={{ color: 'var(--brand-primary)' }}>{c.ticketId}</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{c.category}</span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${pm.badge}`}>{pm.label}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${sm.cls}`}>
                          {c.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sm.dot }} />}
                          {sm.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.studentId?.name || 'Student Reporter'}</span>
                        {c.location && <span className="text-xs truncate max-w-[160px]" style={{ color: 'var(--border-interactive)' }}>📍 {c.location.split(',')[0]}</span>}
                      </div>
                      {c.review && c.review.rating ? (
                        <div className="mt-1.5 flex items-center gap-1.5 w-max px-2 py-0.5 rounded-lg"
                          style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)' }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className="material-symbols-outlined text-[12px]"
                              style={{ color: 'var(--status-warning)', fontVariationSettings: `'FILL' ${s <= Number(c.review.rating) ? 1 : 0}` }}>star</span>
                          ))}
                          <span className="text-[11px] font-bold ml-0.5" style={{ color: 'var(--status-warning)' }}>{c.review.rating}.0</span>
                          {c.review.comment && <span className="text-[11px] italic truncate max-w-[100px]" style={{ color: 'var(--text-secondary)' }}>"{c.review.comment}"</span>}
                        </div>
                      ) : (c.status === 'resolved' || c.status === 'closed') ? (
                        <div className="mt-1.5 flex items-center gap-1 w-max px-2 py-0.5 rounded-lg text-[11px]"
                          style={{ background: 'var(--brand-soft-bg)', border: '1px solid var(--brand-soft-border)', color: 'var(--brand-primary)' }}>
                          <span className="material-symbols-outlined text-[12px]">rate_review</span>
                          Awaiting student review
                        </div>
                      ) : null}
                    </div>
                    <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'var(--brand-primary)' }}>{ti}</div>
                  </div>
                </div>
              );
            })}
            {filteredComplaints.length === 0 && (
              <div className="flex flex-col items-center py-16" style={{ color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined text-[48px] mb-2" style={{ color: 'var(--border-interactive)' }}>inbox</span>
                <p className="text-sm font-medium">No tickets match the current filters</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs px-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredComplaints.length}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{complaints.length}</strong> tickets</span>
            <span className="px-2.5 py-1 rounded-lg font-semibold"
              style={{ background: 'var(--brand-soft-bg)', color: 'var(--brand-primary)', border: '1px solid var(--brand-soft-border)' }}>Page 1 of 1</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl p-5 flex flex-col gap-5 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>

            {/* Tags */}
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg font-mono"
                  style={{ background: 'var(--brand-soft-bg)', color: 'var(--brand-primary)', border: '1px solid var(--brand-soft-border)' }}>#{activeComplaint.ticketId}</span>
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg"
                  style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{activeComplaint.category}</span>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${priorityMeta(activeComplaint.priority).badge}`}>{activeComplaint.priority} SLA</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${statusMeta(activeComplaint.status).cls}`}>
                  {activeComplaint.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusMeta(activeComplaint.status).dot }} />}
                  {statusMeta(activeComplaint.status).label}
                </span>
              </div>
              <button onClick={() => window.print()} type="button" className="p-1.5 rounded-lg"
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined text-[16px]">print</span>
              </button>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-bold leading-snug" style={{ color: 'var(--brand-forest)' }}>{activeComplaint.title}</h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{activeComplaint.description}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                <span>{activeComplaint.location}</span>
              </div>
            </div>

            {/* Reporter */}
            <div className="rounded-xl p-3.5 flex items-start justify-between gap-3" style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,var(--brand-primary),var(--brand-forest))' }}>
                  {(activeComplaint.studentId?.name || 'S')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{activeComplaint.studentId?.name || 'Rudra Sharma'}</span>
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--brand-soft-bg)', color: 'var(--brand-primary)', border: '1px solid var(--brand-soft-border)' }}>
                      {activeComplaint.studentId?.rollNumber || 'MU2026001'}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {activeComplaint.studentId?.department || 'Computer Science'} • {activeComplaint.studentId?.phone || '+91 98765 43210'}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--border-interactive)' }}>
                    <span className="material-symbols-outlined text-[12px]" style={{ color: 'var(--brand-primary)' }}>smartphone</span>
                    NextCampus Student Care App
                  </div>
                </div>
              </div>
              {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
                <div onClick={() => setZoomEvidenceUrl(activeComplaint.attachments[0])}
                  className="w-14 h-14 rounded-xl overflow-hidden relative group cursor-pointer shrink-0"
                  style={{ border: '1px solid var(--border-subtle)' }}>
                  <img src={activeComplaint.attachments[0]} alt="Evidence" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(22,133,103,0.4)' }}>
                    <span className="material-symbols-outlined text-white text-[16px]">zoom_in</span>
                  </div>
                </div>
              )}
            </div>

            {/* CSAT */}
            {activeComplaint.review && activeComplaint.review.rating ? (
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--status-warning-border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--status-warning)' }}>verified</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Student Resolution Review</h3>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: 'var(--status-warning-border)', color: 'var(--status-warning)' }}>Verified CSAT</span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {activeComplaint.review.reviewedByName || activeComplaint.studentId?.name || 'Student'} • {new Date(activeComplaint.review.createdAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'var(--status-warning-border)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--status-warning)', fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-lg font-black" style={{ color: 'var(--status-warning)' }}>{activeComplaint.review.rating}</span>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--status-warning)' }}>/5</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-[22px]"
                      style={{ color: 'var(--status-warning)', fontVariationSettings: `'FILL' ${s <= Number(activeComplaint.review.rating) ? 1 : 0}` }}>star</span>
                  ))}
                  <span className="ml-2 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {Number(activeComplaint.review.rating) >= 5 ? 'Exceptional' : Number(activeComplaint.review.rating) >= 4 ? 'Satisfactory' : 'Acceptable'}
                  </span>
                </div>
                {activeComplaint.review.comment && (
                  <div className="rounded-lg p-3 relative text-sm italic leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--status-warning-border)', color: 'var(--text-primary)' }}>
                    <span className="material-symbols-outlined text-[14px] absolute top-2 right-2" style={{ color: 'var(--status-warning)' }}>format_quote</span>
                    "{activeComplaint.review.comment}"
                  </div>
                )}
                {activeComplaint.review.tags && activeComplaint.review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {activeComplaint.review.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--status-warning-border)', color: 'var(--status-warning)' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (activeComplaint.status === 'resolved' || activeComplaint.status === 'closed') ? (
              <div className="rounded-xl p-3.5 flex items-center justify-between gap-3" style={{ background: 'var(--brand-soft-bg)', border: '1px solid var(--brand-soft-border)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft-border)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--brand-primary)' }}>rate_review</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Awaiting Student Review</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ticket resolved — student feedback pending.</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-soft-border)', color: 'var(--brand-primary)' }}>Pending CSAT</span>
              </div>
            ) : null}

            {/* Assignment */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Technician', value: activeComplaint.assignedToName || 'Unassigned', onChange: handleAssignStaff,
                  options: [['Unassigned', 'Unassigned'], ...staffList.map(s => [s.name, `${s.name} (${s.specialty || 'Tech'})`])] },
                { label: 'Status', value: activeComplaint.status, onChange: handleUpdateStatus,
                  options: [['open','Open'],['in_progress','In Progress'],['parts_ordered','Awaiting Parts'],['resolved','Resolved'],['closed','Closed']] },
                { label: 'Priority', value: activeComplaint.priority, onChange: handleUpdatePriority,
                  options: [['critical','Critical (2h)'],['high','High (4h)'],['medium','Medium (24h)'],['low','Low (48h)']] },
              ].map(({ label, value, onChange, options }) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                  <div className="relative">
                    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none px-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                      style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }}>
                      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-1.5 top-1.5 text-[13px] pointer-events-none" style={{ color: 'var(--text-secondary)' }}>arrow_drop_down</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Admin Note */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Admin Note (optional)</label>
              <textarea
                value={publicUpdateText}
                onChange={(e) => setPublicUpdateText(e.target.value)}
                rows="3"
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none focus:outline-none"
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }}
                placeholder="Add a note about this complaint…"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleUpdateStatus('open')}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'var(--status-info-bg)', border: '1.5px solid var(--status-info-border)', color: 'var(--status-info)' }}>
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                Waiting
              </button>
              <button
                onClick={() => handleUpdateStatus('in_progress')}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'var(--status-warning-bg)', border: '1.5px solid var(--status-warning-border)', color: 'var(--status-warning)' }}>
                <span className="material-symbols-outlined text-[18px]">engineering</span>
                In Progress
              </button>
              <button
                onClick={() => handleUpdateStatus('resolved')}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Resolve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Log Ticket Modal */}
      {showLogTicketModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="log-ticket-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogTicketModal(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,45,40,0.55)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft-bg)' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--brand-primary)' }}>add_circle</span>
                </div>
                <h3 id="log-ticket-title" className="text-base font-bold" style={{ color: 'var(--brand-forest)' }}>Log Maintenance Ticket</h3>
              </div>
              <button type="button" onClick={() => setShowLogTicketModal(false)} className="p-1.5 rounded-lg"
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateNewTicket} className="space-y-3 text-sm">
              {[
                { label: 'Issue Title *', key: 'title', type: 'text', placeholder: 'e.g. AC condenser vibrating loudly' },
                { label: 'Facility Location *', key: 'location', type: 'text', placeholder: 'e.g. Faculty of Engineering, Room B-204' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={newTicketForm[key]}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Category', key: 'category', options: [['av','Classroom AV'],['electrical','Electrical'],['plumbing','Plumbing'],['network','IT & Network'],['hvac','HVAC'],['furniture','Furniture']] },
                  { label: 'Priority', key: 'priority', options: [['critical','Critical (<2h)'],['high','High (<4h)'],['medium','Medium (<24h)'],['low','Low (<48h)']] },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <select value={newTicketForm[key]} onChange={(e) => setNewTicketForm({ ...newTicketForm, [key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                      style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }}>
                      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Defect Description *</label>
                <textarea rows="3" required placeholder="Technical details, malfunction description…"
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm resize-none focus:outline-none"
                  style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)' }} />
              </div>
              <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setShowLogTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-interactive)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90"
                  style={{ background: 'var(--brand-primary)' }}>Log Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {zoomEvidenceUrl && (
        <div role="dialog" aria-modal="true" aria-label="Evidence lightbox"
          onClick={() => setZoomEvidenceUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
          style={{ background: 'rgba(20,45,40,0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid var(--border-interactive)' }}>
            <img src={zoomEvidenceUrl} alt="Evidence zoomed" className="w-full h-full object-contain" />
            <button type="button" onClick={() => setZoomEvidenceUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full"
              style={{ background: 'rgba(20,45,40,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="material-symbols-outlined text-white text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
      </div>{/* end max-w-7xl content container */}
    </div>
  );
}

export default ComplaintAdmin;
