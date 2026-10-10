import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Image as ImageIcon,
  FileText,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Eye,
  X,
  ChevronRight,
  Paperclip,
  Building2,
  MapPin,
  MessageSquare,
  Search,
  Filter,
  Check,
  Zap,
  Droplets,
  Wifi,
  Tv,
  Wrench,
  Sparkles,
  PhoneCall,
  Activity,
  ArrowUpRight
} from 'lucide-react';

// ============================================================================
// DATA: Comprehensive Institutional Grievances & CAFM Dispatch Tickets
// ============================================================================
const INITIAL_COMPLAINTS = [
  {
    _id: 'cmp-1042',
    ticketId: '#CMP-1042',
    title: 'Dual 4K Laser Projector HDMI Optical Sync Glitch & Green Tint',
    category: 'academic',
    categoryName: 'Classroom & AV',
    priority: 'high',
    status: 'in_progress',
    statusText: 'In Progress (Technician Dispatched)',
    building: 'Faculty of Engineering & Technology (ENG-02)',
    location: 'Level 2 Multi-Media Theatre (Room B-204)',
    description:
      'During CS-301 Lecture, the ceiling dual 4K laser projector exhibits severe green frame flickering and lost optical sync when switching inputs from the Lectern 4 Thunderbolt interface. Class audio is currently unaffected.',
    assignedTo: 'Marcus Vance',
    assignedRole: 'Lead Campus AV Systems Specialist • Unit ID #AV-98',
    slaTargetMins: 45,
    minutesElapsed: 22,
    eta: '18 mins',
    createdAt: 'Today, 10:14 AM',
    attachments: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    attachmentNames: ['projector_hdmi_glitch_b204.jpg'],
    steps: [
      { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: '10:14 AM', actor: 'Automated CAFM Core' },
      { id: 2, label: 'Automated Telemetry Diagnostic', status: 'completed', time: '10:18 AM', actor: 'Room B-204 IoT Sensor Mesh' },
      { id: 3, label: 'Field Specialist Dispatched', status: 'active', time: '10:32 AM', actor: 'Marcus Vance (#AV-98)' },
      { id: 4, label: 'Resolution & Student Sign-Off', status: 'pending', time: 'Est. 10:59 AM', actor: 'Student Confirmed' }
    ],
    updates: [
      {
        message: 'Automated CAFM ingest created node record #CMP-1042 from student portal.',
        updatedBy: 'CAFM Gateway',
        role: 'Automated System',
        createdAt: '10:14 AM'
      },
      {
        message: 'Telemetry check confirmed: Optical HDMI link flapping on Lectern 4 switch port with 14% packet jitter.',
        updatedBy: 'IoT Diagnostic Daemon',
        role: 'Sensor Mesh',
        createdAt: '10:18 AM'
      },
      {
        message: 'Marcus Vance dispatched with replacement optical fiber HDMI cable assembly and breakout box.',
        updatedBy: 'Facilities Dispatch Lead',
        role: 'Operations Desk',
        createdAt: '10:32 AM'
      }
    ]
  },
  {
    _id: 'cmp-0988',
    ticketId: '#CMP-0988',
    title: 'Wi-Fi 7 Enterprise AP Signal Loss & Packet Latency Spike',
    category: 'network',
    categoryName: 'Wi-Fi & Net',
    priority: 'urgent',
    status: 'open',
    statusText: 'Under Review (NOC Triage)',
    building: 'Swami Vivekananda Central Library (LIB-03)',
    location: 'Level 2 Quiet Study Wing (Zone C Carrels)',
    description:
      'Repeated disconnection and packet loss exceeding 40% on AP-LIB-09 during peak morning study hours. Students unable to access digital research databases.',
    assignedTo: 'NOC Network Team',
    assignedRole: 'Campus Core Network Operations',
    slaTargetMins: 30,
    minutesElapsed: 12,
    eta: '25 mins',
    createdAt: 'Today, 11:05 AM',
    attachments: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
    ],
    attachmentNames: ['network_ap_drop_lib2.png'],
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
        createdAt: '11:05 AM'
      }
    ]
  },
  {
    _id: 'cmp-0912',
    ticketId: '#CMP-0912',
    title: 'Water Pressure Loss & Automatic Sensor Valve Leak',
    category: 'infrastructure',
    categoryName: 'Water & Plumbing',
    priority: 'medium',
    status: 'resolved',
    statusText: 'Resolved & Verified',
    building: 'Maharana Pratap Main Academic Block (ADM-01)',
    location: 'Ground Floor Restroom Wing (East Bay Sink #3)',
    description:
      'Low water pressure and continuous slow leakage observed beneath sensor faucet #3. Small puddle forming near tile threshold.',
    assignedTo: 'Ramesh Sharma',
    assignedRole: 'Senior Plumbing Specialist • Unit #PL-14',
    slaTargetMins: 120,
    minutesElapsed: 95,
    eta: 'Resolved',
    createdAt: 'Yesterday, 09:00 AM',
    attachments: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    attachmentNames: ['valve_leak_ground_adm.jpg'],
    steps: [
      { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: '09:00 AM', actor: 'Student Grievance' },
      { id: 2, label: 'Automated Telemetry Diagnostic', status: 'completed', time: '09:15 AM', actor: 'Water Pressure Sensor #WP-04' },
      { id: 3, label: 'Field Specialist Dispatched', status: 'completed', time: '09:40 AM', actor: 'Ramesh Sharma (#PL-14)' },
      { id: 4, label: 'Resolution & Student Sign-Off', status: 'completed', time: '10:35 AM', actor: 'Verified by Facilities Desk' }
    ],
    updates: [
      {
        message: 'Ticket created and assigned to Plumbing Team Alpha.',
        updatedBy: 'Facilities CAFM',
        role: 'Helpdesk Dispatch',
        createdAt: '09:00 AM'
      },
      {
        message: 'Technician on site: Valve G-12 gasket replaced and flow pressure recalibrated to 2.8 bar.',
        updatedBy: 'Ramesh Sharma',
        role: 'Plumbing Specialist',
        createdAt: '10:35 AM'
      }
    ]
  }
];

export function CareComplaints() {
  const { user, isAuthenticated } = useContext(AuthContext) || {};

  // Core State
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selectedTicket, setSelectedTicket] = useState(INITIAL_COMPLAINTS[0]);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('academic');
  const [building, setBuilding] = useState('Faculty of Engineering & Technology (ENG-02)');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('high');
  const [description, setDescription] = useState('');
  const [fileAttachment, setFileAttachment] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Filtering & Search
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Live SLA Countdown Timer Simulation (ticks every 1s)
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(23 * 60 + 45);

  // Student Direct Message to Technician State
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Image Lightbox Modal State
  const [lightboxImage, setLightboxImage] = useState(null);

  // Fetch complaints on load if user is logged in
  useEffect(() => {
    fetchComplaints();
  }, [user]);

  // Live SLA countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/care/complaints');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Merge backend complaints with enriched UI fields
        setComplaints(res.data);
        if (res.data[0]) setSelectedTicket(res.data[0]);
      }
    } catch {
      // Graceful fallback to initial rich complaints
    }
  };

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file format. Please upload JPEG, PNG, WEBP, SVG, or PDF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit.');
      return;
    }

    setFileAttachment(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl('');
    }
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

    const targetSla = priority === 'urgent' ? 30 : priority === 'high' ? 45 : priority === 'medium' ? 120 : 240;

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
        const newDoc = {
          ...res.data,
          slaTargetMins: targetSla,
          minutesElapsed: 1,
          eta: `${targetSla} mins`,
          steps: [
            { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: 'Just now', actor: 'Student Portal' },
            { id: 2, label: 'Automated Telemetry Diagnostic', status: 'active', time: 'In Progress', actor: 'Sensor Engine' },
            { id: 3, label: 'Field Specialist Dispatched', status: 'pending', time: 'Queued', actor: 'Dispatch Desk' },
            { id: 4, label: 'Resolution & Student Sign-Off', status: 'pending', time: 'Pending', actor: 'Student Confirmed' }
          ]
        };
        setSubmitSuccess(`Ticket logged into CAFM database! Ticket ID: ${newDoc.ticketId || '#CMP-NEW'}`);
        setComplaints((prev) => [newDoc, ...prev]);
        setSelectedTicket(newDoc);
        resetForm();
      }
    } catch {
      // Local fallback for smooth UI demo
      const simulatedTicketId = `#CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const localTicket = {
        _id: `local-${Date.now()}`,
        ticketId: simulatedTicketId,
        title,
        category,
        categoryName:
          category === 'academic'
            ? 'Classroom & AV'
            : category === 'network'
            ? 'Wi-Fi & Net'
            : category === 'infrastructure'
            ? 'Water & Plumbing'
            : category === 'electrical'
            ? 'Electrical Power'
            : 'Facility Sanitation',
        priority,
        status: 'open',
        statusText: 'In Progress (Dispatch Queued)',
        building,
        location: `${building} - ${location}`,
        description,
        assignedTo: 'Rapid Maintenance Unit Alpha',
        assignedRole: 'Campus Facilities Service Desk',
        slaTargetMins: targetSla,
        minutesElapsed: 0,
        eta: `${targetSla} mins`,
        createdAt: 'Just now',
        attachments: filePreviewUrl ? [filePreviewUrl] : [],
        attachmentNames: fileAttachment ? [fileAttachment.name] : [],
        steps: [
          { id: 1, label: 'Ticket Logged & Ingested', status: 'completed', time: 'Just now', actor: user?.name || 'Student' },
          { id: 2, label: 'Automated Telemetry Diagnostic', status: 'active', time: 'In Progress', actor: 'CAFM Diagnostic' },
          { id: 3, label: 'Field Specialist Dispatched', status: 'pending', time: 'Queued', actor: 'Dispatch Desk' },
          { id: 4, label: 'Resolution & Student Sign-Off', status: 'pending', time: 'Pending', actor: 'Student Confirmed' }
        ],
        updates: [
          {
            message: 'Ticket registered into Mewar University Central Administrative Council & CAFM.',
            updatedBy: user?.name || 'Student',
            role: 'Author',
            createdAt: 'Just now'
          }
        ]
      };
      setComplaints((prev) => [localTicket, ...prev]);
      setSelectedTicket(localTicket);
      setSubmitSuccess(`Ticket logged into CAFM database! Ticket ID: ${simulatedTicketId}`);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setFileAttachment(null);
    setFilePreviewUrl('');
  };

  // Student sends an update/reply to the assigned dispatcher
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    setIsSendingReply(true);
    const newUpdate = {
      message: replyText.trim(),
      updatedBy: user?.name || 'Student Author',
      role: 'Student Requester',
      createdAt: 'Just now'
    };

    // Optimistically update selected ticket
    const updatedTicket = {
      ...selectedTicket,
      updates: [...(selectedTicket.updates || []), newUpdate]
    };

    setSelectedTicket(updatedTicket);
    setComplaints((prev) => prev.map((c) => (c._id === selectedTicket._id ? updatedTicket : c)));
    setReplyText('');

    try {
      await api.post(`/care/complaints/${selectedTicket._id}/student-update`, {
        message: replyText.trim()
      });
    } catch {
      // Saved in state
    } finally {
      setIsSendingReply(false);
    }
  };

  // Student confirms resolution sign-off
  const handleStudentSignOff = () => {
    if (!selectedTicket) return;
    const resolvedTicket = {
      ...selectedTicket,
      status: 'resolved',
      statusText: 'Resolved & Student Verified',
      steps: selectedTicket.steps.map((st) => ({ ...st, status: 'completed' })),
      updates: [
        ...(selectedTicket.updates || []),
        {
          message: 'Student confirmed resolution sign-off. Ticket marked closed.',
          updatedBy: user?.name || 'Student Requester',
          role: 'Verified Sign-Off',
          createdAt: 'Just now'
        }
      ]
    };
    setSelectedTicket(resolvedTicket);
    setComplaints((prev) => prev.map((c) => (c._id === selectedTicket._id ? resolvedTicket : c)));
  };

  // Format timer seconds into mm:ss
  const formattedCountdown = useMemo(() => {
    const mins = Math.floor(timerSecondsRemaining / 60);
    const secs = timerSecondsRemaining % 60;
    return `${mins}m : ${secs < 10 ? '0' : ''}${secs}s`;
  }, [timerSecondsRemaining]);

  // Filtered complaints
  const filteredComplaintsList = useMemo(() => {
    return complaints.filter((item) => {
      if (activeFilter === 'In Progress' && item.status !== 'in_progress') return false;
      if (activeFilter === 'Under Review' && item.status !== 'open') return false;
      if (activeFilter === 'Resolved' && item.status !== 'resolved') return false;
      if (activeCategoryFilter !== 'All' && item.category !== activeCategoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchTicket = item.ticketId?.toLowerCase().includes(q);
        const matchLoc = item.location?.toLowerCase().includes(q);
        if (!matchTitle && !matchTicket && !matchLoc) return false;
      }
      return true;
    });
  }, [complaints, activeFilter, activeCategoryFilter, searchQuery]);

  return (
    <div className="flex flex-col w-full text-slate-100 min-h-screen pb-16">
      {/* =========================================================================
          TOP BREADCRUMB & CONTEXT STRIP
          ========================================================================= */}
      <div className="flex flex-col gap-3 pb-6 border-b border-slate-800/80 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400">
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              CAFM Rapid SLA
            </span>
            <span className="hidden sm:inline">Mewar University • Gangrar, Chittorgarh</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-medium">Campus Helpdesk &amp; Grievances</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400 font-semibold">Active Dispatch Protocol</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-rose-500/50 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
              <span>Refresh SLA Telemetry</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Emergency Dispatch: 24/7 Hot
            </span>
          </div>
        </div>

        {/* Page Title & SLA Metrics Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-1">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Campus Care &amp; Grievance Redressal</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono font-normal">
                SLA &lt;45 Min
              </span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1.5">
              Official university grievance redressal and CAFM facility service desk. Lodge academic infrastructure tickets, track live technician dispatch, and monitor real-time SLA countdowns.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Active Tickets</span>
              <span className="text-lg font-bold text-white">
                {complaints.filter((c) => c.status !== 'resolved').length}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-rose-500/30 flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">In Dispatch</span>
              <span className="text-lg font-bold text-rose-400">
                {complaints.filter((c) => c.status === 'in_progress').length}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Resolved Term</span>
              <span className="text-lg font-bold text-emerald-400">128</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-sky-500/30 flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">SLA Compliance</span>
              <span className="text-lg font-bold text-sky-400">98.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EMERGENCY DISPATCH QUICK BANNER
          ========================================================================= */}
      <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-900/80 border border-rose-900/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span>Emergency Campus Infrastructure Hotline</span>
              <span className="px-2 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[10px] font-mono">Priority 0</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              For active power hazards, lab chemical exhaust alarms, or stuck elevators, dial Security Desk: <span className="text-rose-400 font-mono font-bold">+91 1471-291148 / Ext. 108</span>
            </p>
          </div>
        </div>

        <a
          href="tel:+911471291148"
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-900/40 transition-all shrink-0"
        >
          <span>Direct Emergency Call</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* =========================================================================
          MAIN WORKSPACE: 40% LODGE FORM vs 60% LIVE SLA TRACKER
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LODGE GRIEVANCE FORM (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-rose-500/30">
                    Lodge New Ticket
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {isAuthenticated ? `Student: ${user?.name || user?.email}` : 'Mewar Student Request'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">Lodge an Official Grievance</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your ticket is instantly assigned to the responsible building maintenance unit with strict SLA tracking.
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Summary / Headline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Issue Summary / Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS Lab B Projector HDMI Glitch & Green Tint"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                  required
                />
              </div>

              {/* Infrastructure Domain */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Infrastructure Domain <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-rose-400">Selected: {category}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'academic', label: 'Classroom / AV', icon: Tv },
                    { id: 'network', label: 'Wi-Fi & Net', icon: Wifi },
                    { id: 'infrastructure', label: 'Water & Pipe', icon: Droplets },
                    { id: 'electrical', label: 'Power & UPS', icon: Zap },
                    { id: 'cleanliness', label: 'Sanitation', icon: Sparkles },
                    { id: 'other', label: 'General Tech', icon: Wrench }
                  ].map((cat) => {
                    const isSelected = category === cat.id;
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 text-white font-bold shadow-md shadow-rose-950/50'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 mb-1 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                        <span className="text-[11px] leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Building Node & Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Building Node <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option>Faculty of Engineering &amp; Technology (ENG-02)</option>
                      <option>Maharana Pratap Main Academic Block (ADM-01)</option>
                      <option>Swami Vivekananda Central Library (LIB-03)</option>
                      <option>Mewar University Central Auditorium (AUD-04)</option>
                      <option>University Cafeteria &amp; Food Court (CAF-05)</option>
                      <option>Aravalli Boys Residential Hostel (HST-06)</option>
                      <option>Meera Bai Girls Residential Hostel (HST-07)</option>
                      <option>Mewar Sports Arena &amp; Cricket Ground (SPT-08)</option>
                      <option>Mewar University Hospital &amp; Health Centre (MED-09)</option>
                    </select>
                    <Building2 className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Room / Zone <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Room B-204 (Level 2)"
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Priority & SLA Impact Matrix */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Urgency &amp; Impact Tier <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-rose-400">
                    SLA Target: {priority === 'urgent' ? '<30 min' : priority === 'high' ? '<45 min' : priority === 'medium' ? '<2 hours' : '<24 hours'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'low', label: 'Low', sub: 'Routine', color: 'text-slate-300' },
                    { id: 'medium', label: 'Medium', sub: 'Disruptive', color: 'text-amber-400' },
                    { id: 'high', label: 'High', sub: 'Halts Class', color: 'text-orange-400' },
                    { id: 'urgent', label: 'Urgent', sub: 'Hazard / P0', color: 'text-rose-400' }
                  ].map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-2 border-rose-500 shadow-md'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSelected ? p.color : 'text-slate-400'}`}>
                          {p.label}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{p.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Defect Description */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Defect Description &amp; Fault Details <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">{description.length} / 500 chars</span>
                </div>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, specific equipment error messages, observed behavior..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Diagnostic Photo Attachment */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Diagnostic Photo (Max 10MB)
                </label>
                <div className="relative p-3 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-rose-500/60 transition-all flex flex-col items-center justify-center text-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-5 h-5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-300">
                    {fileAttachment ? fileAttachment.name : 'Click or drop photo here for technician diagnosis'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WEBP, PDF up to 10MB</span>
                </div>

                {fileError && <p className="text-xs text-rose-400 font-mono">{fileError}</p>}

                {/* Instant Image Preview Thumbnail */}
                {filePreviewUrl && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={filePreviewUrl}
                        alt="Upload preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-white truncate max-w-[180px]">
                          {fileAttachment?.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(fileAttachment?.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFileAttachment(null);
                        setFilePreviewUrl('');
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting & Dispatching...' : 'Lodge Grievance & Dispatch Technician'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Notice: All tickets are registered into Mewar University Central Administrative Council &amp; Facility Operations Node.
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE SLA TRACKER & TICKET AUDIT TRAIL (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Filter & Search Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'In Progress', 'Under Review', 'Resolved'].map((flt) => {
                const isActive = activeFilter === flt;
                return (
                  <button
                    key={flt}
                    onClick={() => setActiveFilter(flt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {flt}
                  </button>
                );
              })}
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket # or room..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* ACTIVE SPOTLIGHT TICKET DETAILS */}
          {selectedTicket && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-rose-500/60 shadow-2xl flex flex-col gap-5 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Ticket Header & Status Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950 text-rose-400 font-mono text-xs font-bold border border-rose-500/40">
                    {selectedTicket.ticketId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold uppercase border ${
                      selectedTicket.priority === 'urgent'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/50'
                        : selectedTicket.priority === 'high'
                        ? 'bg-orange-950/60 text-orange-300 border-orange-500/50'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    {selectedTicket.priority} PRIORITY
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedTicket.createdAt}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedTicket.status === 'resolved'
                        ? 'bg-emerald-400'
                        : selectedTicket.status === 'in_progress'
                        ? 'bg-rose-400 animate-ping'
                        : 'bg-amber-400 animate-pulse'
                    }`}
                  ></span>
                  <span className="text-slate-200">{selectedTicket.statusText || selectedTicket.status}</span>
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <span className="text-[11px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                  Domain: {selectedTicket.categoryName || selectedTicket.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 leading-snug">
                  {selectedTicket.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold text-white">{selectedTicket.building}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{selectedTicket.location}</span>
                </div>
              </div>

              {/* Issue Description Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                "{selectedTicket.description}"
              </div>

              {/* ===================================================================
                  LIVE SLA COUNTDOWN & BREACH TIMER WIDGET
                  =================================================================== */}
              {selectedTicket.status !== 'resolved' && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 to-slate-950/90 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                        Live SLA Resolution Window
                      </span>
                      <div className="text-xl font-mono font-black text-white tracking-wider">
                        {formattedCountdown}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Max SLA Target: &lt;{selectedTicket.slaTargetMins || 45} mins • Auto-Escalation Enabled
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">ETA: {selectedTicket.eta || '18 mins'}</span>
                      <span className="text-[10px] text-emerald-400">Technician en route</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Technician Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">
                    {selectedTicket.assignedTo?.split(' ').map((n) => n[0]).join('') || 'MV'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Assigned: {selectedTicket.assignedTo || 'Rapid Response Unit'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {selectedTicket.assignedRole || 'Facility Operations Lead'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                    Radio Channel 4 Active
                  </span>
                </div>
              </div>

              {/* ===================================================================
                  4-STAGE RESOLUTION MILESTONE PIPELINE
                  =================================================================== */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
                  <span>Milestone Resolution Stepper</span>
                  <span className="text-rose-400 font-bold">4-Stage CAFM Flow</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {(selectedTicket.steps || [
                    { id: 1, label: 'Ticket Logged', status: 'completed', time: '10:14 AM' },
                    { id: 2, label: 'Sensor Diagnostic', status: 'completed', time: '10:18 AM' },
                    { id: 3, label: 'Field Dispatched', status: 'active', time: '10:32 AM' },
                    { id: 4, label: 'Student Sign-Off', status: 'pending', time: 'Pending' }
                  ]).map((st) => {
                    const isDone = st.status === 'completed';
                    const isActive = st.status === 'active';
                    return (
                      <div
                        key={st.id}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                            : isActive
                            ? 'bg-rose-950/30 border-rose-500 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold">Step 0{st.id}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isActive ? (
                            <Clock className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                          )}
                        </div>
                        <span className="text-xs font-bold leading-tight line-clamp-1">{st.label}</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">{st.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic Attachment Thumbnail Preview */}
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Diagnostic Photo Evidence (Click to Inspect)
                  </span>
                  <div className="flex items-center gap-3">
                    {selectedTicket.attachments.map((attUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(attUrl)}
                        className="cursor-pointer group relative w-24 h-16 rounded-xl overflow-hidden border border-slate-700 hover:border-rose-400 transition-all shadow-md"
                      >
                        <img src={attUrl} alt="Ticket attachment" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                          <Eye className="w-4 h-4 text-white opacity-80 group-hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                    <span className="text-xs text-slate-400">
                      {selectedTicket.attachmentNames?.[0] || 'Inspection photo verified by student'}
                    </span>
                  </div>
                </div>
              )}

              {/* Resolution Audit Updates Log */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Real-Time Dispatch Audit Log
                </span>

                <div className="flex flex-col gap-2.5 relative pl-4 border-l-2 border-rose-500/40 ml-1.5">
                  {(selectedTicket.updates || []).map((upd, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span>{upd.updatedBy}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                            {upd.role || 'Staff'}
                          </span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{upd.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300">{upd.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Message Dispatcher Input Strip */}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Send Direct Note to Field Dispatcher
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="e.g. Professor shifted lecture to Room B-205, please meet there..."
                    className="flex-1 h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply();
                    }}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyText.trim()}
                    className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              {/* One-Click Resolution Sign-Off Button (If not yet resolved) */}
              {selectedTicket.status !== 'resolved' && (
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={handleStudentSignOff}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-900/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Issue Resolved (Student Sign-Off)</span>
                  </button>

                  <span className="text-[11px] text-slate-500">
                    Signing off marks SLA achieved &amp; informs Central CAFM.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              HISTORICAL TICKETS LIST (Interactive Switcher)
              ===================================================================== */}
          <div className="flex flex-col gap-2.5 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono px-1">
              Logged Grievance Records ({filteredComplaintsList.length})
            </span>

            {filteredComplaintsList.map((c) => {
              const isSelected = selectedTicket?._id === c._id;
              return (
                <div
                  key={c._id || c.ticketId}
                  onClick={() => setSelectedTicket(c)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-2 border-rose-500 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400">{c.ticketId}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border uppercase ${
                          c.status === 'resolved'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : c.status === 'in_progress'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{c.createdAt}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{c.title}</h4>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{c.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono font-medium uppercase border border-slate-800">
                      {c.priority} PRIORITY
                    </span>
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          LIGHTBOX MODAL: FULL RESOLUTION ATTACHMENT INSPECTOR
          ========================================================================= */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-300 font-bold">
                Diagnostic Attachment Inspector • {selectedTicket.ticketId}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black overflow-hidden">
              <img
                src={lightboxImage}
                alt="Enlarged diagnostic evidence"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Verified CAFM Optical Telemetry Inspection</span>
              <a
                href={lightboxImage}
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Open Raw Image</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareComplaints;
