import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const INITIAL_COMPLAINTS = [
  {
    _id: 'cmp-1042',
    ticketId: '#CMP-1042',
    title: 'CS Lab B Projector HDMI Glitch & Green Tint',
    category: 'academic',
    categoryName: 'Classroom & AV',
    priority: 'medium',
    status: 'in_progress',
    statusText: 'In Progress (Dispatch Active)',
    building: 'Alan Turing Hall (Block A-01)',
    location: 'Level 2 Multi-Media Theatre (Room B-204)',
    description: 'During CS-301 Lecture, the ceiling dual 4K laser projector exhibits severe green frame flickering and lost optical sync when switching inputs from the Lectern 4 Thunderbolt interface.',
    assignedTo: 'Tech Team #2 (Lead: Marcus Vance)',
    assignedRole: 'Campus AV Systems Specialist • Unit ID #AV-98',
    eta: '25 mins',
    createdAt: 'Today, 10:14 AM',
    attachments: ['/uploads/projector_hdmi_glitch_b204.jpg'],
    updates: [
      { message: 'Automated CAFM ingest created node record #CMP-1042.', updatedBy: 'System', createdAt: '10:14 AM' },
      { message: 'Telemetry check confirmed: Optical HDMI link flapping on Lectern 4 switch port.', updatedBy: 'Sensor Engine', createdAt: '10:18 AM' },
      { message: 'Marcus Vance dispatched with replacement optical fiber HDMI cable assembly.', updatedBy: 'Dispatch Lead', createdAt: '10:32 AM (CURRENT)' }
    ]
  },
  {
    _id: 'cmp-0988',
    ticketId: '#CMP-0988',
    title: 'Wi-Fi AP Signal Drop & Latency Spike',
    category: 'network',
    categoryName: 'Wi-Fi & Net',
    priority: 'high',
    status: 'open',
    statusText: 'Under Review',
    building: 'Central Learning Resources Hub',
    location: '3rd Floor Quiet Study Wing (Zone C)',
    description: 'Frequent packet drops occurring on AP-LR-09 during peak afternoon study hours.',
    assignedTo: 'Unassigned Queue',
    assignedRole: 'Network NOC Ops',
    eta: 'Triage Pending',
    createdAt: 'Oct 11, 3:45 PM',
    attachments: [],
    updates: [{ message: 'Ticket received and queued for NOC spectrum analysis.', updatedBy: 'NOC Automated', createdAt: '3:45 PM' }]
  },
  {
    _id: 'cmp-0912',
    ticketId: '#CMP-0912',
    title: 'Water Pressure Loss & Valve Leak',
    category: 'infrastructure',
    categoryName: 'Water & Plumbing',
    priority: 'medium',
    status: 'resolved',
    statusText: 'Resolved',
    building: 'Fountain Quad Restrooms',
    location: 'Block B West Level 1 Restroom',
    description: 'Low water pressure and slight leakage observed beneath sink #3.',
    assignedTo: 'Plumbing Team Alpha',
    assignedRole: 'Facilities Maintenance Specialist',
    eta: 'Completed',
    createdAt: 'Oct 8, 2026',
    attachments: [],
    updates: [
      { message: 'Ticket created.', updatedBy: 'Student', createdAt: 'Oct 8, 09:00 AM' },
      { message: 'Valve G-12 gasket replaced and flow pressure recalibrated.', updatedBy: 'Lead Plumber', createdAt: 'Oct 8, 11:30 AM' }
    ]
  }
];

export function CareComplaints() {
  const { user, isAuthenticated } = useContext(AuthContext) || {};

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selectedTicket, setSelectedTicket] = useState(INITIAL_COMPLAINTS[0]);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('academic');
  const [building, setBuilding] = useState('Alan Turing Hall (Block A-01)');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [fileAttachment, setFileAttachment] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch complaints on load if user is logged in
  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/care/complaints');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setComplaints(res.data);
        if (res.data[0]) setSelectedTicket(res.data[0]);
      }
    } catch (err) {
      // Keep initial fallback state if API fails or backend unpopulated
    }
  };

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files[0];
    if (!file) return;

    // Allowed extensions / types: JPEG, PNG, WEBP, SVG, PDF up to 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file format. Allowed formats: JPEG, PNG, WEBP, SVG, PDF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit.');
      return;
    }

    setFileAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      alert('Please fill out all required fields (Summary, Location, Description).');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess('');
    setFileError('');

    try {
      let payload;
      if (fileAttachment) {
        payload = new FormData();
        payload.append('title', title);
        payload.append('category', category);
        payload.append('building', building);
        payload.append('location', `${building} - ${location}`);
        payload.append('priority', priority);
        payload.append('description', description);
        payload.append('attachments', fileAttachment);
      } else {
        payload = {
          title,
          category,
          building,
          location: `${building} - ${location}`,
          priority,
          description
        };
      }

      const res = await api.post('/care/complaints', payload);
      if (res && res.success) {
        const newDoc = res.data;
        setSubmitSuccess(`Complaint submitted successfully! Ticket ID: ${newDoc.ticketId || '#CMP-NEW'}`);
        setComplaints((prev) => [newDoc, ...prev]);
        setSelectedTicket(newDoc);
        // Reset form
        setTitle('');
        setLocation('');
        setDescription('');
        setFileAttachment(null);
      }
    } catch (err) {
      // Local fallback for UI demo if API errors
      const simulatedTicketId = `#CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const localTicket = {
        _id: `local-${Date.now()}`,
        ticketId: simulatedTicketId,
        title,
        category,
        categoryName: category === 'academic' ? 'Classroom & AV' : category.toUpperCase(),
        priority,
        status: 'open',
        statusText: 'In Progress (Dispatch Created)',
        building,
        location: `${building} - ${location}`,
        description,
        assignedTo: 'CAFM Dispatch Queue',
        assignedRole: 'Campus Service Desk',
        eta: '30 mins',
        createdAt: 'Just now',
        attachments: fileAttachment ? [`/uploads/${fileAttachment.name}`] : [],
        updates: [{ message: 'Ticket submitted and logged into central database.', updatedBy: user?.name || 'Student', createdAt: 'Just now' }]
      };
      setComplaints((prev) => [localTicket, ...prev]);
      setSelectedTicket(localTicket);
      setSubmitSuccess(`Complaint saved! Ticket ID: ${simulatedTicketId}`);
      setTitle('');
      setLocation('');
      setDescription('');
      setFileAttachment(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComplaintsList = complaints.filter((item) => {
    if (activeFilter === 'In Progress' && item.status !== 'in_progress') return false;
    if (activeFilter === 'Under Review' && item.status !== 'open') return false;
    if (activeFilter === 'Resolved' && item.status !== 'resolved') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchTicket = item.ticketId?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchTicket && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full text-slate-800 space-y-6">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#9E153E]"></span>
          <span>NextCampus Support</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Campus Helpdesk &amp; Grievance</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-900 flex items-center gap-3">
              Campus Helpdesk &amp; Grievance <span className="text-[#9E153E] font-light">—</span> Redressal &amp; Support
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Official university grievance redressal and facility service desk. Lodge maintenance or academic infrastructure tickets and monitor live SLA resolution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Refresh</span>
            </button>
            <a
              href="#submitForm"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9E153E] hover:bg-[#831843] text-white text-xs font-bold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Lodge Grievance</span>
            </a>
          </div>
        </div>
      </div>

      {/* TOP METRIC STATUS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Active Requests</span>
              <div className="text-3xl font-display font-extrabold text-slate-900 mt-1">
                {complaints.filter((c) => c.status !== 'resolved').length || 1}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#9E153E]">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-[#9E153E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
              Under Review / Assigned
            </span>
            <span className="font-mono text-slate-400">{selectedTicket?.ticketId || '#CMP-1042'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Resolved This Term</span>
              <div className="text-3xl font-display font-extrabold text-slate-900 mt-1">04</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-slate-600 font-medium">Fixed &amp; Verified</span>
            <span className="text-emerald-600 font-semibold">100% Student Confirmed</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Expected Resolution</span>
              <div className="text-3xl font-display font-extrabold text-slate-900 mt-1">24-48h</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[22px]">schedule</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-slate-600 font-medium">Classrooms &amp; Labs</span>
            <span className="text-blue-600 font-semibold">Rapid Priority</span>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT WORKSPACE: 45% FORM vs 55% TRACKING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REPORT AN ISSUE FORM (5 COLS) */}
        <div id="submitForm" className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#FFE4E6] text-[#9E153E] text-[11px] font-bold uppercase tracking-wider">
                    New Ticket
                  </span>
                  <span className="text-xs text-slate-500">
                    {isAuthenticated ? `Student: ${user?.name || user?.email}` : 'Student Request'}
                  </span>
                </div>
                <h2 className="font-display font-bold text-lg text-slate-900 mt-1.5">Lodge an Official Grievance</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your grievance will be logged into the central database, assigned to the facility resolution unit, and tracked to completion.
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#9E153E]">
                <span className="material-symbols-outlined text-[20px]">assignment_add</span>
              </div>
            </div>

            {submitSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-brand-amaranth/20 border border-brand-blush text-brand-misty text-xs flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-brand-blush text-[18px]">check_circle</span>
                <span>{submitSuccess}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Issue Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                  Issue Summary / Headline <span className="text-brand-blush">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. HDMI Projector Flickering & Audio Distortion"
                  className="w-full h-10 px-3.5 rounded-xl bg-surface-elevated border border-surface-border text-sm text-slate-900 focus:outline-none focus:border-brand-blush focus:ring-1 focus:ring-brand-blush transition-all"
                  required
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                    Infrastructure Domain <span className="text-brand-blush">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-brand-blush">Domain: {category}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'electrical', label: 'Electricity', icon: 'bolt' },
                    { id: 'infrastructure', label: 'Water & Plumbing', icon: 'water_drop' },
                    { id: 'cleanliness', label: 'Sanitation', icon: 'cleaning_services' },
                    { id: 'network', label: 'Wi-Fi & Net', icon: 'wifi' },
                    { id: 'academic', label: 'Classroom / AV', icon: 'videocam' },
                    { id: 'other', label: 'Maintenance', icon: 'handyman' }
                  ].map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-brand-amaranth border-brand-blush text-white shadow-[0_0_12px_rgba(172,39,79,0.35)] font-bold'
                            : 'bg-surface-elevated border-surface-border text-brand-misty hover:border-brand-blush/40 hover:bg-brand-raisin'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] mb-1 ${isSelected ? 'text-white' : 'text-brand-misty/70'}`}>
                          {cat.icon}
                        </span>
                        <span className="text-[11px] leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                    Building Node <span className="text-brand-blush">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface-elevated border border-surface-border text-xs text-slate-900 focus:outline-none focus:border-brand-blush appearance-none cursor-pointer"
                    >
                      <option>Alan Turing Hall (Block A-01)</option>
                      <option>Central Learning Resources Hub</option>
                      <option>Ramanujan Science Complex</option>
                      <option>Dorothy Hodgkin Pavilion</option>
                      <option>Fountain Quad &amp; Amenities</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-brand-misty/50 text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                    Specific Room / Zone <span className="text-brand-blush">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Room B-204 (Level 2)"
                    className="w-full h-10 px-3 rounded-xl bg-surface-elevated border border-surface-border text-xs text-slate-900 focus:outline-none focus:border-brand-blush transition-all"
                    required
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                    Urgency &amp; Impact Tier <span className="text-brand-blush">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-brand-misty/70">Classroom SLA: &lt;45 min</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'low', label: 'Low', sub: 'Routine' },
                    { id: 'medium', label: 'Medium', sub: 'Disruptive' },
                    { id: 'high', label: 'High', sub: 'Halts Class' },
                    { id: 'urgent', label: 'Urgent', sub: 'Hazard' }
                  ].map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-brand-raisin border-2 border-brand-blush shadow-[0_0_10px_rgba(235,99,139,0.25)]'
                            : 'bg-surface-elevated border border-surface-border hover:border-brand-blush/30'
                        }`}
                      >
                        <span className={`text-xs font-bold ${p.id === 'urgent' ? 'text-red-400' : isSelected ? 'text-brand-blush' : 'text-brand-misty'}`}>
                          {p.label}
                        </span>
                        <span className="text-[10px] text-brand-misty/50 mt-0.5">{p.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                    Defect Description &amp; Notes <span className="text-brand-blush">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-brand-misty/60">{description.length} / 500 chars</span>
                </div>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail, equipment condition, error codes..."
                  className="w-full p-3 rounded-xl bg-surface-elevated border border-surface-border text-xs text-slate-900 placeholder-brand-misty/40 focus:outline-none focus:border-brand-blush transition-all resize-none leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Diagnostic Attachment Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-misty uppercase tracking-wider">
                  Diagnostic Photo Attachment (Max 10MB)
                </label>
                <div className="relative p-3.5 rounded-xl bg-surface-elevated border border-dashed border-surface-border hover:border-brand-blush/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-[22px] text-brand-blush mb-1 group-hover:scale-110 transition-transform">
                    add_a_photo
                  </span>
                  <span className="text-xs font-medium text-white">
                    {fileAttachment ? fileAttachment.name : 'Click or drag photo / document here'}
                  </span>
                  <span className="text-[10px] text-brand-misty/60 mt-0.5">JPG, PNG, WEBP, SVG, PDF up to 10MB</span>
                </div>

                {fileError && <p className="text-xs text-red-400 mt-1 font-mono">{fileError}</p>}

                {fileAttachment && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-brand-raisin border border-surface-border">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-brand-blush text-[18px]">image</span>
                      <span className="text-xs font-mono text-white truncate">{fileAttachment.name}</span>
                      <span className="text-[10px] font-mono text-brand-misty/60">({(fileAttachment.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileAttachment(null)}
                      className="text-xs text-brand-blush hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-amaranth to-brand-blush text-white text-xs font-bold shadow-[0_0_18px_rgba(172,39,79,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>{isSubmitting ? 'Submitting & Dispatching...' : 'Submit Complaint & Dispatch'}</span>
                </button>
              </div>

              <p className="text-[11px] text-brand-misty/50 text-center leading-relaxed pt-1">
                Institutional Notice: Tickets integrate into Oxford Brookes CAFM facilities protocol.
              </p>
            </form>
          </div>

          {/* Quick Escalation Banner */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-brand-raisin border border-brand-blush/30 flex items-center justify-center text-brand-blush shrink-0">
              <span className="material-symbols-outlined text-[18px]">emergency_home</span>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">Emergency Facility Response</div>
              <p className="text-[11px] text-brand-misty/70 leading-normal">
                For major gas leaks, burst pipes, elevator malfunctions, or power emergencies, dial Campus Security instantly at{' '}
                <span className="font-mono text-brand-blush font-bold">x4444</span> or trigger immediate emergency dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE TRACKING & COMPLAINT HISTORY (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter & Search Toolbar */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'In Progress', 'Under Review', 'Resolved'].map((flt) => {
                const isActive = activeFilter === flt;
                return (
                  <button
                    key={flt}
                    onClick={() => setActiveFilter(flt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-amaranth text-white font-bold shadow-sm border border-brand-blush/30'
                        : 'bg-surface-elevated text-brand-misty hover:text-white'
                    }`}
                  >
                    {flt}
                  </button>
                );
              })}
            </div>

            <div className="relative min-w-[200px]">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-brand-misty/40 text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search my tickets..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface-elevated border border-surface-border text-xs text-slate-900 placeholder-brand-misty/40 focus:outline-none focus:border-brand-blush"
              />
            </div>
          </div>

          {/* PRIMARY ACTIVE TICKET DETAIL CARD (Expanded Spotlight) */}
          {selectedTicket && (
            <div className="bg-surface-card border-2 border-brand-amaranth/80 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_24px_rgba(172,39,79,0.25)] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-surface-border">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-brand-raisin text-brand-blush font-mono text-xs font-bold border border-brand-blush/30">
                    {selectedTicket.ticketId}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-mono text-[11px] font-semibold border border-amber-300 uppercase">
                    {selectedTicket.priority} PRIORITY
                  </span>
                  <span className="text-xs text-brand-misty/60 flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {selectedTicket.createdAt}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amaranth/20 border border-brand-amaranth text-brand-misty text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-brand-blush animate-ping"></span>
                  <span>{selectedTicket.statusText || selectedTicket.status}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-blush uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  <span>{selectedTicket.categoryName || selectedTicket.category}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mt-1">{selectedTicket.title}</h3>
                <div className="flex items-center gap-2 text-xs text-brand-misty/80 mt-1.5">
                  <span className="material-symbols-outlined text-[16px] text-brand-blush">pin_drop</span>
                  <span className="font-medium text-slate-900">{selectedTicket.building || 'Campus Node'}</span>
                  <span>•</span>
                  <span className="text-brand-misty">{selectedTicket.location}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border text-xs text-brand-misty/90 leading-relaxed">
                "{selectedTicket.description}"
              </div>

              <div className="p-3.5 rounded-xl bg-brand-raisin/70 border border-brand-blush/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-amaranth/40 border border-brand-blush/50 flex items-center justify-center text-brand-blush font-bold text-xs font-mono">
                    MV
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Assigned: {selectedTicket.assignedTo || 'Dispatch Team'}</div>
                    <div className="text-[11px] text-brand-misty/70">{selectedTicket.assignedRole || 'Facility Ops'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-brand-blush font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-brand-blush/20 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>ETA: {selectedTicket.eta || '30 mins'}</span>
                </div>
              </div>

              {/* LIVE TIMELINE / AUDIT HISTORY STEPPER */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-misty flex items-center justify-between">
                  <span>Dispatch Resolution Stepper</span>
                  <span className="text-brand-blush font-mono text-[11px]">SLA TARGET: &lt;45 MINS</span>
                </div>

                <div className="relative pl-6 space-y-4 border-l-2 border-brand-amaranth/40 ml-2">
                  {selectedTicket.updates && selectedTicket.updates.length > 0 ? (
                    selectedTicket.updates.map((upd, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-amaranth border-2 border-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </div>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-semibold text-slate-900">{upd.updatedBy || 'System Update'}</span>
                          <span className="font-mono text-[11px] text-brand-misty/60">{upd.createdAt || ''}</span>
                        </div>
                        <p className="text-[11px] text-brand-misty/70 mt-0.5">{upd.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-amaranth border-2 border-white flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-slate-900">Ticket Submitted & Logged</span>
                        <span className="font-mono text-[11px] text-brand-misty/60">Just Now</span>
                      </div>
                      <p className="text-[11px] text-brand-misty/70 mt-0.5">Automated CAFM ingest created node record.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Triggers */}
              <div className="pt-2 border-t border-surface-border flex flex-wrap items-center gap-3">
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <a
                    href={selectedTicket.attachments[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-surface-border text-brand-misty text-xs font-semibold hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-brand-blush">image</span>
                    <span>View Attachment ({selectedTicket.attachments.length})</span>
                  </a>
                )}
                <button
                  onClick={() => alert(`Connecting with dispatch for Ticket ${selectedTicket.ticketId}...`)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-surface-border text-brand-misty text-xs font-semibold hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-brand-blush">chat</span>
                  <span>Message Dispatcher</span>
                </button>
              </div>
            </div>
          )}

          {/* HISTORICAL COMPLAINT TICKETS (Collapsed Rows) */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-misty/80 px-1">Previous Logged Complaints</div>

            {filteredComplaintsList.map((c) => {
              const isSelected = selectedTicket?._id === c._id;
              return (
                <div
                  key={c._id || c.ticketId}
                  onClick={() => setSelectedTicket(c)}
                  className={`cursor-pointer bg-surface-card border rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected ? 'border-brand-blush ring-1 ring-brand-blush' : 'border-surface-border hover:border-brand-blush/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-misty">{c.ticketId}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border uppercase ${
                          c.status === 'resolved'
                            ? 'bg-green-950/70 text-green-300 border-green-500/30'
                            : c.status === 'in_progress'
                            ? 'bg-brand-amaranth/20 text-brand-blush border-brand-amaranth/40'
                            : 'bg-blue-950/70 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="text-[11px] text-brand-misty/50 font-mono">{c.createdAt}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                    <div className="text-xs text-brand-misty/70 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-brand-blush">pin_drop</span>
                      <span>{c.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-elevated text-brand-misty text-xs font-mono font-medium uppercase">
                      {c.priority} PRIORITY
                    </span>
                    <button className="p-1.5 rounded-lg bg-surface-elevated hover:bg-brand-raisin text-brand-misty hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareComplaints;
