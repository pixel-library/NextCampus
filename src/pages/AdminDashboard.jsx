import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  Utensils,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  UserX,
  UserCheck,
  DoorOpen,
  LifeBuoy,
  Building,
  Plus,
  Trash2,
  RefreshCw,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Timer,
  Megaphone,
} from 'lucide-react';
import { getOutpassTimeInfo } from '../utils/outpassHelpers';
import AnnouncementsPanel from '../components/dashboard/AnnouncementsPanel';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  
  // Tab state: 'overview' | 'students' | 'gatepass' | 'timetable' | 'mess' | 'announcements'
  const [activeTab, setActiveTabState] = useState(
    urlTab && ['overview', 'students', 'gatepass', 'timetable', 'mess', 'announcements'].includes(urlTab)
      ? urlTab
      : 'overview'
  );

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (tab === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  useEffect(() => {
    if (urlTab && ['overview', 'students', 'gatepass', 'timetable', 'mess', 'announcements'].includes(urlTab)) {
      setActiveTabState(urlTab);
    } else if (!urlTab) {
      setActiveTabState('overview');
    }
  }, [urlTab]);

  const pageMeta = useMemo(() => {
    switch (activeTab) {
      case 'announcements':
        return {
          tag: 'CAMPUS BROADCAST',
          title: 'Campus Announcements & Circulars Manager',
          description: 'Publish permanent notices, time-limited advisories with auto-expiry, pin priority bulletins, and attach posters for students.',
        };
      case 'gatepass':
        return {
          tag: 'GATE PASS DESK',
          title: 'Digital Gate Pass Approval Desk',
          description: 'Review student out-pass appeals, verify transit reasons & curfew times, and authorize RFID turnstile passes.',
        };
      case 'students':
        return {
          tag: 'STUDENT REGISTRY',
          title: 'Student Directory & Access Control',
          description: 'Comprehensive database of all enrolled university students, account registration tracking, and security access suspension.',
        };
      case 'timetable':
        return {
          tag: 'ACADEMIC TIMETABLE',
          title: 'Timetable Studio & Faculty Allocations',
          description: 'Hierarchical schedule management: Department → Course → Year → Semester → Section → Day-wise class slots with assigned teachers.',
        };
      case 'mess':
        return {
          tag: 'DINING OPERATIONS',
          title: 'Mess Menu Control & Dining Schedules',
          description: 'Manage and publish day-wise meals (Breakfast, Lunch, Snacks, Dinner) for campus residential dining halls.',
        };
      default:
        return {
          tag: 'CENTRAL ADMIN NODE',
          title: 'Campus Administrative Console',
          description: 'Central operational command hub for Mewar University. Select a department from the sidebar or click a quick action below.',
        };
    }
  }, [activeTab]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // =========================================================================
  // 1. STUDENT DIRECTORY & ACCESS CONTROL STATE
  // =========================================================================
  const [students, setStudents] = useState([]);
  const [studentStats, setStudentStats] = useState({
    totalRoster: 0,
    registered: 0,
    unclaimed: 0,
    blocked: 0,
    active: 0,
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [blockingTarget, setBlockingTarget] = useState(null);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const params = new URLSearchParams();
      if (studentSearch) params.append('search', studentSearch);
      if (studentDeptFilter !== 'all') params.append('department', studentDeptFilter);
      if (studentStatusFilter !== 'all') params.append('status', studentStatusFilter);

      const res = await api.get(`/admin/students?${params.toString()}`);
      if (res.success && res.data) {
        setStudents(res.data.students || []);
        if (res.data.stats) setStudentStats(res.data.stats);
      }
    } catch (err) {
      console.error('[Admin] Failed to load students:', err);
      showToast('Could not fetch student directory', 'error');
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students' || activeTab === 'overview') {
      const timer = setTimeout(() => {
        fetchStudents();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [studentSearch, studentDeptFilter, studentStatusFilter, activeTab]);

  const handleToggleBlock = async (student) => {
    try {
      const res = await api.patch(`/admin/students/${student.id || student.enrollmentNumber}/toggle-block`, {});
      if (res.success) {
        const isNowBlocked = res.data.isBlocked;
        showToast(
          `Student ${student.name} is now ${isNowBlocked ? 'SUSPENDED / BLOCKED' : 'UNBLOCKED / ACTIVE'}`,
          isNowBlocked ? 'warning' : 'success'
        );
        // Refresh local student state
        setStudents((prev) =>
          prev.map((s) =>
            s.id === student.id || s.enrollmentNumber === student.enrollmentNumber
              ? { ...s, isBlocked: isNowBlocked }
              : s
          )
        );
        setStudentStats((prev) => ({
          ...prev,
          blocked: isNowBlocked ? prev.blocked + 1 : Math.max(0, prev.blocked - 1),
          active: isNowBlocked ? Math.max(0, prev.active - 1) : prev.active + 1,
        }));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update student access', 'error');
    } finally {
      setBlockingTarget(null);
    }
  };

  // =========================================================================
  // 2. GATE PASS APPROVAL DESK STATE
  // =========================================================================
  const [gatePasses, setGatePasses] = useState([]);
  const [loadingPasses, setLoadingPasses] = useState(false);
  const [gatePassFilter, setGatePassFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [reviewModalPass, setReviewModalPass] = useState(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewAction, setReviewAction] = useState('APPROVE');

  const fetchGatePasses = async () => {
    setLoadingPasses(true);
    try {
      const res = await api.get(`/gatepass/admin/all${gatePassFilter !== 'ALL' ? `?status=${gatePassFilter}` : ''}`);
      if (res.success && res.data?.passes) {
        setGatePasses(res.data.passes);
      }
    } catch (err) {
      console.error('[Admin] Failed to load gate passes:', err);
    } finally {
      setLoadingPasses(false);
    }
  };

  useEffect(() => {
    fetchGatePasses();
    fetchHierarchy();
    fetchMessMenu();
  }, []);

  useEffect(() => {
    if (activeTab === 'gatepass' || activeTab === 'overview') {
      fetchGatePasses();
    }
  }, [activeTab, gatePassFilter]);

  const handleProcessPass = async () => {
    if (!reviewModalPass) return;
    try {
      const res = await api.post(`/gatepass/admin/${reviewModalPass.id || reviewModalPass.passCode}/action`, {
        action: reviewAction,
        remarks: reviewRemarks.trim() || (reviewAction === 'APPROVE' ? 'Approved by campus authority.' : 'Request declined.'),
      });
      if (res.success) {
        showToast(
          `Gate pass for ${reviewModalPass.studentName} has been ${reviewAction === 'APPROVE' ? 'APPROVED' : 'REJECTED'}`,
          reviewAction === 'APPROVE' ? 'success' : 'warning'
        );
        setReviewModalPass(null);
        setReviewRemarks('');
        fetchGatePasses();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const pendingPassesCount = useMemo(() => {
    return gatePasses.filter((p) => p.status === 'PENDING').length;
  }, [gatePasses]);

  // =========================================================================
  // 3. TIMETABLE STUDIO (HIERARCHY: DEPT -> COURSE -> YEAR -> SEM -> SEC -> DAY)
  // =========================================================================
  const [hierarchy, setHierarchy] = useState(null);
  const [selectedDept, setSelectedDept] = useState('Computer Science & Engineering');
  const [selectedCourse, setSelectedCourse] = useState('B.Tech CSE');
  const [selectedYear, setSelectedYear] = useState(2);
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [slotForm, setSlotForm] = useState({
    subject: '',
    subjectCode: '',
    faculty: '',
    startTime: '09:30',
    endTime: '10:30',
    room: 'Room B-204',
    building: 'Faculty of Engineering & Technology (ENG-02)',
  });

  const fetchHierarchy = async () => {
    try {
      const res = await api.get('/timetable/hierarchy');
      if (res.success && res.data) {
        setHierarchy(res.data);
      }
    } catch (err) {
      console.warn('[Admin] Failed to load timetable hierarchy:', err);
    }
  };

  const fetchTimetable = async () => {
    setLoadingTimetable(true);
    try {
      const res = await api.get(
        `/timetable/query?department=${encodeURIComponent(selectedDept)}&semester=${selectedSemester}&section=${selectedSection}&day=${selectedDay}`
      );
      if (res.success && res.data?.entries) {
        setTimetableEntries(res.data.entries);
      } else {
        setTimetableEntries([]);
      }
    } catch (err) {
      console.error('[Admin] Failed to load timetable:', err);
      setTimetableEntries([]);
    } finally {
      setLoadingTimetable(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'timetable') {
      fetchHierarchy();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'timetable') {
      fetchTimetable();
    }
  }, [activeTab, selectedDept, selectedSemester, selectedSection, selectedDay]);

  const handleOpenSlotModal = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setSlotForm({
        subject: slot.subject || '',
        subjectCode: slot.subjectCode || '',
        faculty: slot.faculty || '',
        startTime: slot.startTime || '09:30',
        endTime: slot.endTime || '10:30',
        room: slot.room || 'Room B-204',
        building: slot.building || 'Faculty of Engineering & Technology (ENG-02)',
      });
    } else {
      setEditingSlot(null);
      setSlotForm({
        subject: '',
        subjectCode: '',
        faculty: '',
        startTime: '09:30',
        endTime: '10:30',
        room: 'Room B-204',
        building: 'Faculty of Engineering & Technology (ENG-02)',
      });
    }
    setSlotModalOpen(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!slotForm.subject || !slotForm.faculty) {
      showToast('Subject name and Faculty / Teacher are required', 'error');
      return;
    }

    try {
      const payload = {
        id: editingSlot ? editingSlot.id : undefined,
        department: selectedDept,
        course: selectedCourse,
        year: selectedYear,
        semester: selectedSemester,
        section: selectedSection,
        dayOfWeek: selectedDay,
        ...slotForm,
      };

      const res = await api.post('/timetable/slot', payload);
      if (res.success) {
        showToast(
          editingSlot
            ? `Updated ${slotForm.subject} taught by ${slotForm.faculty}`
            : `Added new class slot: ${slotForm.subject} (${slotForm.faculty})`,
          'success'
        );
        setSlotModalOpen(false);
        fetchTimetable();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save class slot', 'error');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this class slot?')) return;
    try {
      const res = await api.delete(`/timetable/slot/${slotId}`);
      if (res.success) {
        showToast('Class slot removed from schedule', 'info');
        fetchTimetable();
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove slot', 'error');
    }
  };

  // =========================================================================
  // 4. MESS MENU MANAGER STATE
  // =========================================================================
  const [messDay, setMessDay] = useState('Monday');
  const [messMealType, setMessMealType] = useState('lunch');
  const [currentMenuData, setCurrentMenuData] = useState(null);
  const [loadingMess, setLoadingMess] = useState(false);
  const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [menuItemsText, setMenuItemsText] = useState('');

  const fetchMessMenu = async () => {
    setLoadingMess(true);
    try {
      const res = await api.get(`/mess/query?day=${messDay}`);
      if (res.success && res.data) {
        setCurrentMenuData(res.data);
      }
    } catch (err) {
      console.warn('[Admin] Failed to load mess menu:', err);
    } finally {
      setLoadingMess(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mess' || activeTab === 'overview') {
      fetchMessMenu();
    }
  }, [activeTab, messDay]);

  const handleOpenEditMenuModal = () => {
    const meal = currentMenuData?.meals?.[messMealType];
    const items = meal?.items || [];
    setMenuItemsText(items.join('\n'));
    setEditMenuModalOpen(true);
  };

  const handleSaveMenu = async () => {
    const lines = menuItemsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      showToast('Please provide at least one menu item', 'error');
      return;
    }

    try {
      const updatedMeals = {
        ...(currentMenuData?.meals || {}),
        [messMealType]: {
          ...(currentMenuData?.meals?.[messMealType] || {}),
          items: lines,
        },
      };

      const res = await api.post('/mess/update-day', {
        dayOfWeek: messDay,
        meals: updatedMeals,
      });

      if (res.success) {
        showToast(`Updated ${messDay} ${messMealType.toUpperCase()} menu successfully!`, 'success');
        setEditMenuModalOpen(false);
        fetchMessMenu();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update mess menu', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#202A27] pb-16">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-[#FDF2F3] border-[#F1C2C6] text-[#C43D4B]'
              : toastMessage.type === 'warning'
              ? 'bg-[#FFF9EB] border-[#F9E2AF] text-[#B26A00]'
              : 'bg-[#EAF5EF] border-[#B7DEC9] text-[#142D28]'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <XCircle size={18} className="text-[#C43D4B]" />
          ) : toastMessage.type === 'warning' ? (
            <AlertTriangle size={18} className="text-[#B26A00]" />
          ) : (
            <CheckCircle2 size={18} className="text-[#168567]" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-inherit hover:opacity-75 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-[#142D28] text-white pt-8 pb-12 px-4 sm:px-8 border-b border-[#20443D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#168567]/30 text-[#6CE0B8] border border-[#168567]/50 text-[10px] font-mono font-bold uppercase tracking-wider">
                {pageMeta.tag}
              </span>
              <span className="text-xs text-[#A3B8AC]">Mewar University • Identity & Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{pageMeta.title}</h1>
            <p className="text-sm text-[#A3B8AC] mt-1 max-w-2xl">
              {pageMeta.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/campus-map?admin=true')}
              className="px-4 py-2 rounded-xl bg-[#168567] hover:bg-[#126b53] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border border-[#6CE0B8]/40"
              title="Launch Campus Map & Facility Details Editor"
            >
              <MapPin size={15} />
              <span>Campus Map &amp; Facility Editor</span>
            </button>

            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5 text-xs text-[#E4EAE5]">
              <Shield size={16} className="text-[#6CE0B8]" />
              <div className="flex flex-col">
                <span className="font-bold text-white">{user?.name || 'Administrator'}</span>
                <span className="text-[10px] text-[#A3B8AC]">Super Admin Clearance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        {/* =========================================================================
            TAB 0: EXECUTIVE ADMIN CONSOLE OVERVIEW
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div
                onClick={() => setActiveTab('announcements')}
                className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:border-[#168567]/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center font-bold">
                    <Megaphone size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#168567] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Campus Circulars</span>
                  <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">Live</div>
                  <p className="text-xs text-[#87968D] mt-1">
                    <span className="text-[#168567] font-bold">Broadcast Notices</span> • Timed / Pinned
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('students')}
                className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:border-[#168567]/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center font-bold">
                    <Users size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#168567] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Student Roster</span>
                  <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">{studentStats.totalRoster}</div>
                  <p className="text-xs text-[#87968D] mt-1">
                    <span className="text-[#168567] font-bold">{studentStats.registered} Registered</span> • {studentStats.unclaimed} Unclaimed
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('gatepass')}
                className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:border-[#C43D4B]/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#C43D4B] flex items-center justify-center font-bold">
                    <DoorOpen size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#C43D4B] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Gate Pass Appeals</span>
                  <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">{pendingPassesCount}</div>
                  <p className="text-xs text-[#87968D] mt-1">
                    {pendingPassesCount > 0 ? (
                      <span className="text-[#C43D4B] font-bold">Requires Action</span>
                    ) : (
                      <span className="text-[#168567] font-bold">All Requests Cleared</span>
                    )}
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('timetable')}
                className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:border-[#142D28]/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4F1] text-[#142D28] flex items-center justify-center font-bold">
                    <Calendar size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#142D28] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Academic Schedules</span>
                  <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">{hierarchy?.departments?.length || 5}</div>
                  <p className="text-xs text-[#87968D] mt-1">
                    Departments with live faculty time tables
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('mess')}
                className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:border-[#B26A00]/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9EB] text-[#B26A00] flex items-center justify-center font-bold">
                    <Utensils size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#B26A00] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Mess & Dining</span>
                  <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">4 Meals</div>
                  <p className="text-xs text-[#87968D] mt-1">
                    Breakfast, Lunch, Snacks & Dinner
                  </p>
                </div>
              </div>

              <div
                onClick={() => navigate('/campus-map?admin=true')}
                className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs hover:border-[#168567]/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center font-bold">
                    <MapPin size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#168567] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Campus Map &amp; GIS</span>
                  <div className="text-3xl font-extrabold text-[#202A27] mt-0.5">26 Places</div>
                  <p className="text-xs text-[#87968D] mt-1">
                    <span className="text-[#168567] font-bold">Edit Details &amp; Photos</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Module 0: Campus Map & Facility Details Editor */}
              <div className="p-6 rounded-2xl bg-white border-2 border-[#168567]/30 shadow-xs flex flex-col justify-between md:col-span-2 bg-gradient-to-br from-white via-white to-[#EAF5EF]/40">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#168567] text-white flex items-center justify-center shadow-xs">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#202A27]">Campus Map &amp; Facility Details Editor</h3>
                        <p className="text-[11px] text-[#65736B]">Interactive GIS 2D &amp; 3D Campus Infrastructure Management</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9] tracking-wider uppercase">
                      MAP &amp; PHOTO EDITOR
                    </span>
                  </div>
                  <p className="text-xs text-[#65736B] leading-relaxed max-w-3xl">
                    Update facility display details on the live map including building names, operating hours, department titles, live occupancy and HVAC telemetry, featured space rooms, and upload high-resolution campus building photographs directly from your computer.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#404D46]">
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#168567]" /> 26 Mewar University Landmarks</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#168567]" /> Upload &amp; Replace Facility Images</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#168567]" /> Live Telemetry &amp; GPS Coordinates</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E4EAE5] flex items-center justify-between flex-wrap gap-3">
                  <span className="text-[11px] text-[#87968D]">Saved changes persist locally and update 2D &amp; 3D view engines immediately.</span>
                  <button
                    onClick={() => navigate('/campus-map?admin=true')}
                    className="px-5 py-2.5 rounded-xl bg-[#168567] hover:bg-[#126b53] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Launch Campus Map Editor</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              {/* Module 1: Student Registry */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center">
                        <Users size={18} />
                      </div>
                      <h3 className="text-base font-extrabold text-[#202A27]">Student Database & Access Control</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                      DATABASE
                    </span>
                  </div>
                  <p className="text-xs text-[#65736B] leading-relaxed">
                    View complete student records from the database. Identify who is registered vs. pre-enrolled, manage profile information, and toggle suspension/blocking to revoke student platform access instantly.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#404D46]">
                    <span>• {studentStats.totalRoster} Total Enrollees</span>
                    <span>• {studentStats.registered} Web Accounts</span>
                    <span className="text-[#C43D4B]">• {studentStats.blocked} Suspended</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E4EAE5] flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab('students')}
                    className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f423b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Student Directory</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Module 2: Gate Pass Appeals Desk */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF0F2] text-[#C43D4B] flex items-center justify-center">
                        <ShieldCheck size={18} />
                      </div>
                      <h3 className="text-base font-extrabold text-[#202A27]">Gate Pass Appeal Approvals</h3>
                    </div>
                    {pendingPassesCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C43D4B] text-white animate-pulse">
                        {pendingPassesCount} PENDING
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                        CLEARED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#65736B] leading-relaxed">
                    Review digital gate out-pass appeals submitted by students. Verify reason, destination, departure time, and expected return. Approve or reject with warden remarks to unlock biometric turnstiles.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#404D46]">
                    <span className="text-[#B26A00]">• {pendingPassesCount} Awaiting Review</span>
                    <span>• {gatePasses.filter(p => p.status === 'APPROVED').length} Approved Today</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E4EAE5] flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab('gatepass')}
                    className="px-4 py-2 rounded-xl bg-[#168567] hover:bg-[#126b53] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Gate Pass Desk</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Module 3: Timetable Studio */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F4F1] text-[#142D28] flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                      <h3 className="text-base font-extrabold text-[#202A27]">Academic Timetable Studio</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F4F1] text-[#142D28] border border-[#D5E0D8]">
                      HIERARCHICAL
                    </span>
                  </div>
                  <p className="text-xs text-[#65736B] leading-relaxed">
                    Organize schedules by Department $\rightarrow$ Course $\rightarrow$ Year $\rightarrow$ Semester $\rightarrow$ Section $\rightarrow$ Day. Assign faculty members to lectures, manage room allocations, and integrate directly with campus AI queries.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#404D46]">
                    <span>• Computer Science, Mech, Electrical & more</span>
                    <span>• Multi-section support</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E4EAE5] flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f423b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Configure Timetables</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Module 4: Mess Menu Control */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF9EB] text-[#B26A00] flex items-center justify-center">
                        <Utensils size={18} />
                      </div>
                      <h3 className="text-base font-extrabold text-[#202A27]">Hostel Mess & Dining Control</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF9EB] text-[#B26A00] border border-[#F9E2AF]">
                      DAILY DINING
                    </span>
                  </div>
                  <p className="text-xs text-[#65736B] leading-relaxed">
                    Configure and publish weekly meal menus across Breakfast, Lunch, Evening Snacks, and Dinner. Update menu items in real time so students can check the dining schedule from their dashboard and AI Copilot.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#404D46]">
                    <span>• 7 Days Schedule</span>
                    <span>• Live Vegetarian & Special Diet Tracking</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E4EAE5] flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab('mess')}
                    className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f423b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Manage Mess Menus</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Module 5: Helpdesk & Grievance Triage */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#AC274F] flex items-center justify-center shrink-0">
                      <LifeBuoy size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-[#202A27]">Helpdesk & Grievance Triage</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F2] text-[#AC274F] border border-[#F2BDCA]">
                          CARE OPERATIONS
                        </span>
                      </div>
                      <p className="text-xs text-[#65736B] leading-relaxed mt-1">
                        Monitor incoming student complaints, assign facilities engineering technicians, track resolution SLAs, broadcast progress updates, and inspect student CSAT reviews and sign-offs.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/admin/complaints')}
                    className="px-5 py-2.5 rounded-xl bg-[#AC274F] hover:bg-[#8e1d3e] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Open Complaints Admin</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Module 6: Campus Announcements & Broadcast */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between md:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center shrink-0">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-[#202A27]">Campus Announcements & Circulars Manager</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                          STUDENT BROADCAST
                        </span>
                      </div>
                      <p className="text-xs text-[#65736B] leading-relaxed mt-1">
                        Broadcast official university notices, exams, and facility alerts directly to all student dashboards. Configure permanent notices, time-bound advisories with automatic countdown expiry, pin urgent circulars to the spotlight, and attach posters or images.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2.5 rounded-xl bg-[#F0F4F1] hover:bg-[#E4EAE5] text-[#202A27] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Preview Student View</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className="px-5 py-2.5 rounded-xl bg-[#168567] hover:bg-[#126b53] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Manage Circulars</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status & Infrastructure Strip */}
            <div className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#168567] flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#202A27]">NextCampus Security & Operations Engine</h4>
                  <p className="text-[11px] text-[#65736B]">All institutional microservices, AI copilot engines, and digital gate nodes are operational.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                  <span className="w-2 h-2 rounded-full bg-[#168567] animate-pulse" />
                  GATE PASS ENGINE READY
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 1: STUDENT REGISTRY & BLOCKING CONTROLS
            ========================================================================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs">
                <span className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider">Total In Database</span>
                <div className="text-2xl font-extrabold text-[#202A27] mt-1">{studentStats.totalRoster}</div>
                <span className="text-[10px] text-[#87968D]">Active enrollment roster</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs">
                <span className="text-[11px] font-bold text-[#168567] uppercase tracking-wider">Registered Accounts</span>
                <div className="text-2xl font-extrabold text-[#168567] mt-1">{studentStats.registered}</div>
                <span className="text-[10px] text-[#87968D]">Claimed web access</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs">
                <span className="text-[11px] font-bold text-[#B26A00] uppercase tracking-wider">Unclaimed Roster</span>
                <div className="text-2xl font-extrabold text-[#B26A00] mt-1">{studentStats.unclaimed}</div>
                <span className="text-[10px] text-[#87968D]">Pre-enrolled enrollees</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs">
                <span className="text-[11px] font-bold text-[#C43D4B] uppercase tracking-wider">Suspended / Blocked</span>
                <div className="text-2xl font-extrabold text-[#C43D4B] mt-1">{studentStats.blocked}</div>
                <span className="text-[10px] text-[#87968D]">Access revoked</span>
              </div>

              <div
                onClick={() => setActiveTab('gatepass')}
                className="p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#C43D4B]/50 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#C43D4B] uppercase tracking-wider">Gate Passes</span>
                  <ArrowRight size={14} className="text-[#C43D4B] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl font-extrabold text-[#C43D4B] mt-1">{pendingPassesCount}</div>
                <span className="text-[10px] text-[#87968D]">Appeals pending review</span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Field */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87968D]" />
                <input
                  type="text"
                  placeholder="Search student by name, MUR, email, or department..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/10"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'registered', 'unclaimed', 'blocked', 'active'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStudentStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                      studentStatusFilter === s
                        ? 'bg-[#142D28] text-white'
                        : 'bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27]'
                    }`}
                  >
                    {s}
                  </button>
                ))}

                <button
                  onClick={fetchStudents}
                  title="Refresh records"
                  className="p-2 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} className={loadingStudents ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-[#E4EAE5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F6F8F6] border-b border-[#E4EAE5] text-[11px] font-bold text-[#65736B] uppercase tracking-wider">
                      <th className="py-3 px-4">Student Profile</th>
                      <th className="py-3 px-4">MUR / Enrollment</th>
                      <th className="py-3 px-4">Department & Class</th>
                      <th className="py-3 px-4">Registration</th>
                      <th className="py-3 px-4">Access Status</th>
                      <th className="py-3 px-4 text-right">Administrative Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4EAE5] text-xs">
                    {loadingStudents ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-[#87968D]">
                          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#168567]" />
                          Querying student database registry...
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-[#87968D]">
                          No student records matching current filters.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr
                          key={student.id || student.enrollmentNumber}
                          className="hover:bg-[#F9FAF9] transition-colors"
                        >
                          {/* Name & Avatar */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#168567] to-[#142D28] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-[#202A27]">{student.name}</span>
                                <span className="text-[11px] text-[#65736B]">{student.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Enrollment MUR */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-[#142D28] bg-[#F0F4F1] px-2.5 py-1 rounded-md border border-[#E4EAE5]">
                              {student.enrollmentNumber}
                            </span>
                          </td>

                          {/* Dept */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-[#202A27] max-w-xs truncate">
                                {student.department}
                              </span>
                              <span className="text-[10.5px] text-[#87968D]">
                                {student.academicYear} • {student.semester}
                              </span>
                            </div>
                          </td>

                          {/* Registration Status */}
                          <td className="py-3 px-4">
                            {student.isClaimed ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[10.5px] font-bold bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                                <Check size={11} /> Registered
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[10.5px] font-bold bg-[#FFF9EB] text-[#B26A00] border border-[#F9E2AF]">
                                <Clock size={11} /> Unclaimed
                              </span>
                            )}
                          </td>

                          {/* Block Status */}
                          <td className="py-3 px-4">
                            {student.isBlocked ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[10.5px] font-bold bg-[#FDF2F3] text-[#C43D4B] border border-[#F1C2C6]">
                                <UserX size={12} /> Suspended / Blocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[10.5px] font-bold bg-[#EAF5EF] text-[#142D28] border border-[#B7DEC9]">
                                <UserCheck size={12} /> Active Access
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedStudentDetail(student)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#F0F4F1] hover:bg-[#E4EAE5] text-[#404D46] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                title="View full profile details"
                              >
                                <Eye size={13} /> Details
                              </button>

                              <button
                                onClick={() => handleToggleBlock(student)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                                  student.isBlocked
                                    ? 'bg-[#168567] hover:bg-[#126b53] text-white'
                                    : 'bg-[#FDF2F3] hover:bg-[#C43D4B] text-[#C43D4B] hover:text-white border border-[#F1C2C6]'
                                }`}
                                title={student.isBlocked ? 'Restore student access' : 'Block student account'}
                              >
                                {student.isBlocked ? (
                                  <>
                                    <UserCheck size={13} /> Unblock
                                  </>
                                ) : (
                                  <>
                                    <UserX size={13} /> Block Student
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: GATE PASS APPROVAL DESK
            ========================================================================= */}
        {activeTab === 'gatepass' && (
          <div className="space-y-6">
            {/* Filter pills & refresh */}
            <div className="p-4 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#65736B] uppercase tracking-wider mr-1">Filter Passes:</span>
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setGatePassFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      gatePassFilter === st
                        ? 'bg-[#142D28] text-white shadow-xs'
                        : 'bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27]'
                    }`}
                  >
                    {st === 'PENDING' ? `Pending (${pendingPassesCount})` : st}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchGatePasses}
                className="px-3 py-1.5 rounded-xl bg-[#F0F4F1] text-[#404D46] hover:text-[#202A27] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} className={loadingPasses ? 'animate-spin' : ''} />
                Refresh Appeals
              </button>
            </div>

            {/* Passes Grid */}
            {loadingPasses ? (
              <div className="p-12 text-center text-[#87968D]">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#168567]" />
                Loading gate pass requests...
              </div>
            ) : gatePasses.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white border border-[#E4EAE5] text-center text-[#87968D]">
                <ShieldCheck size={36} className="mx-auto mb-2 text-[#87968D]" />
                No gate pass requests found for the selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gatePasses.map((pass) => {
                  const isPending = pass.status === 'PENDING';
                  const isApproved = pass.status === 'APPROVED';
                  const isRejected = pass.status === 'REJECTED';
                  const timeInfo = getOutpassTimeInfo(pass);
                  const isExpired = isApproved && timeInfo.isExpired;

                  return (
                    <div
                      key={pass.id || pass.passCode}
                      className={`p-5 rounded-2xl bg-white border transition-all shadow-xs flex flex-col justify-between gap-4 ${
                        isPending
                          ? 'border-[#B26A00]/40 ring-2 ring-[#B26A00]/10'
                          : isApproved && !isExpired
                          ? 'border-[#168567]/30 shadow-xs'
                          : isApproved && isExpired
                          ? 'border-[#C43D4B]/30'
                          : 'border-[#E4EAE5]'
                      }`}
                    >
                      {/* Pass Card Top */}
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#142D28] bg-[#F0F4F1] px-2 py-0.5 rounded border border-[#E4EAE5]">
                              {pass.passCode || 'GP-OUTPASS'}
                            </span>
                          </div>

                          {isPending && (
                            <span className="px-2.5 py-0.8 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#FFF9EB] text-[#B26A00] border border-[#F9E2AF]">
                              PENDING
                            </span>
                          )}

                          {isApproved && !isExpired && (
                            <span className="px-2.5 py-0.8 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                              ACTIVE PERMIT
                            </span>
                          )}

                          {isApproved && isExpired && (
                            <span className="px-2.5 py-0.8 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#FDF2F3] text-[#C43D4B] border border-[#F1C2C6]">
                              EXPIRED
                            </span>
                          )}

                          {isRejected && (
                            <span className="px-2.5 py-0.8 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#FDF2F3] text-[#C43D4B] border border-[#F1C2C6]">
                              REJECTED
                            </span>
                          )}
                        </div>

                        {/* Student Info */}
                        <div className="mt-3.5">
                          <h4 className="text-base font-extrabold text-[#202A27]">{pass.studentName}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#65736B]">
                            <span className="font-mono font-bold text-[#168567]">{pass.enrollmentNumber}</span>
                            <span>•</span>
                            <span className="truncate">{pass.course || pass.department}</span>
                          </div>
                          {pass.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[#87968D] mt-1 font-mono">
                              <Phone size={12} /> {pass.phone}
                            </div>
                          )}
                        </div>

                        {/* Destination & Reason Details */}
                        <div className="mt-4 p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#87968D]">Destination</span>
                            <p className="font-bold text-[#202A27]">{pass.destination}</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#87968D]">Purpose / Reason</span>
                            <p className="text-[#404D46]">{pass.reason}</p>
                          </div>

                          {/* Time & Expire Limit Grid */}
                          <div className="pt-2 border-t border-[#E4EAE5]/60 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[#404D46] flex items-center gap-1">
                                <Timer size={12} className="text-[#168567]" /> Expire Limit:
                              </span>
                              <span className="font-extrabold text-[#168567] bg-white px-2 py-0.5 rounded border border-[#E4EAE5]">
                                {timeInfo.durationText}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <span className="text-[9.5px] font-bold uppercase text-[#87968D] block">Departure</span>
                                <p className="font-semibold text-[#202A27]">{timeInfo.outFormatted}</p>
                                <span className="text-[9.5px] text-[#87968D]">{timeInfo.outDateFormatted}</span>
                              </div>
                              <div>
                                <span className="text-[9.5px] font-bold uppercase text-[#87968D] block">Expires / Return</span>
                                <p className={`font-semibold ${isExpired ? 'text-[#C43D4B]' : 'text-[#202A27]'}`}>
                                  {timeInfo.inFormatted}
                                </p>
                                <span className="text-[9.5px] text-[#87968D]">{timeInfo.inDateFormatted}</span>
                              </div>
                            </div>

                            {isApproved && (
                              <div className="pt-1 text-[10.5px] font-semibold text-[#65736B]">
                                {isExpired ? (
                                  <span className="text-[#C43D4B]">⚠️ {timeInfo.remainingText}</span>
                                ) : (
                                  <span className="text-[#168567]">🟢 {timeInfo.remainingText} remaining</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {pass.adminRemarks && (
                          <div className="mt-3 text-[11px] text-[#65736B] bg-[#FFF9EB] p-2 rounded-lg border border-[#F9E2AF]">
                            <span className="font-bold">Warden Note:</span> {pass.adminRemarks}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {isPending ? (
                        <div className="pt-3 border-t border-[#E4EAE5] flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReviewModalPass(pass);
                              setReviewAction('APPROVE');
                              setReviewRemarks(`Approved for ${timeInfo.durationText}. Return strictly before curfew time.`);
                            }}
                            className="flex-1 py-2 rounded-xl bg-[#168567] hover:bg-[#126b53] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Check size={14} /> Approve ({timeInfo.durationText})
                          </button>

                          <button
                            onClick={() => {
                              setReviewModalPass(pass);
                              setReviewAction('REJECT');
                              setReviewRemarks('Declined due to security / curriculum regulations.');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#FDF2F3] hover:bg-[#C43D4B] text-[#C43D4B] hover:text-white font-bold text-xs flex items-center justify-center gap-1 border border-[#F1C2C6] transition-colors cursor-pointer"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 text-[11px] text-[#87968D] flex items-center justify-between border-t border-[#E4EAE5]">
                          <span>Reviewed by: {pass.approvedBy || 'Admin Desk'}</span>
                          <span className="font-bold text-[#168567]">Gate Permit Verified</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: TIMETABLE STUDIO (HIERARCHY DEPT -> TEACHER)
            ========================================================================= */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            {/* Cascading Hierarchy Control Bar */}
            <div className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4EAE5]">
                <div>
                  <h3 className="text-base font-extrabold text-[#202A27]">Departmental Academic Schedule</h3>
                  <p className="text-xs text-[#65736B]">
                    Select Department $\rightarrow$ Course $\rightarrow$ Year $\rightarrow$ Semester $\rightarrow$ Section to organize and assign faculty.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenSlotModal()}
                  className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f3f38] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus size={15} /> Add Class Slot
                </button>
              </div>

              {/* Cascade Selectors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {/* 1. Department */}
                <div>
                  <label className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider block mb-1">
                    1. Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      if (hierarchy?.courses?.[e.target.value]?.[0]) {
                        setSelectedCourse(hierarchy.courses[e.target.value][0]);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs font-semibold text-[#202A27] focus:outline-hidden focus:border-[#168567]"
                  >
                    {(hierarchy?.departments || [selectedDept]).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Course */}
                <div>
                  <label className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider block mb-1">
                    2. Course / Degree
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs font-semibold text-[#202A27] focus:outline-hidden focus:border-[#168567]"
                  >
                    {(hierarchy?.courses?.[selectedDept] || [selectedCourse]).map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Year */}
                <div>
                  <label className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider block mb-1">
                    3. Academic Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      const yr = parseInt(e.target.value, 10);
                      setSelectedYear(yr);
                      setSelectedSemester(yr * 2 - 1);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs font-semibold text-[#202A27] focus:outline-hidden focus:border-[#168567]"
                  >
                    <option value={1}>1st Year (UG)</option>
                    <option value={2}>2nd Year (UG)</option>
                    <option value={3}>3rd Year (UG)</option>
                    <option value={4}>4th Year (UG)</option>
                  </select>
                </div>

                {/* 4. Semester */}
                <div>
                  <label className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider block mb-1">
                    4. Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs font-semibold text-[#202A27] focus:outline-hidden focus:border-[#168567]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Section */}
                <div>
                  <label className="text-[11px] font-bold text-[#65736B] uppercase tracking-wider block mb-1">
                    5. Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs font-semibold text-[#202A27] focus:outline-hidden focus:border-[#168567]"
                  >
                    {['A', 'B', 'C'].map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E4EAE5' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-[#142D28] text-white shadow-sm'
                      : 'text-[#65736B] hover:text-[#202A27] hover:bg-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule Classes Display */}
            <div className="bg-white rounded-2xl border border-[#E4EAE5] shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4EAE5]">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#168567]" />
                  <span className="font-extrabold text-sm text-[#202A27]">
                    {selectedDay} Schedule • {selectedCourse} (Sem {selectedSemester} - Sec {selectedSection})
                  </span>
                </div>
                <span className="text-xs text-[#87968D] font-medium">
                  {timetableEntries.length} Classes Scheduled
                </span>
              </div>

              {loadingTimetable ? (
                <div className="py-12 text-center text-[#87968D]">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#168567]" />
                  Loading schedule entries...
                </div>
              ) : timetableEntries.length === 0 ? (
                <div className="py-12 text-center text-[#87968D]">
                  <BookOpen size={32} className="mx-auto mb-2 text-[#87968D]" />
                  <p className="font-semibold text-sm">No class slots scheduled for {selectedDay}.</p>
                  <p className="text-xs mt-1">Click "Add Class Slot" above to assign faculty and classrooms.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timetableEntries.map((slot) => (
                    <div
                      key={slot.id || slot._id}
                      className="p-4 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#168567]/40 transition-all"
                    >
                      {/* Time and Subject */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="px-3 py-2 rounded-xl bg-white border border-[#E4EAE5] text-center min-w-[100px] shadow-2xs">
                          <span className="text-[10px] font-bold text-[#87968D] uppercase block">Slot</span>
                          <span className="font-mono text-xs font-extrabold text-[#142D28]">
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-[#202A27]">{slot.subject}</h4>
                            {slot.subjectCode && (
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                                {slot.subjectCode}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#65736B]">
                            <span className="font-bold text-[#142D28] flex items-center gap-1">
                              👨‍🏫 Teacher: {slot.faculty}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <DoorOpen size={13} /> {slot.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenSlotModal(slot)}
                          className="p-2 rounded-lg bg-white border border-[#E4EAE5] hover:bg-[#F0F4F1] text-[#404D46] transition-colors cursor-pointer"
                          title="Edit slot details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id || slot._id)}
                          className="p-2 rounded-lg bg-white border border-[#E4EAE5] hover:bg-[#FDF2F3] text-[#C43D4B] transition-colors cursor-pointer"
                          title="Delete slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Assistant Timetable Info */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#142D28] to-[#1C433C] text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-[#6CE0B8]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AI Timetable Intelligence Connected</h4>
                  <p className="text-xs text-[#A3B8AC]">
                    All timetable modifications sync instantly with the NextCampus AI Assistant, allowing students to ask naturally for their schedules and assigned faculty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MESS MENU MANAGER
            ========================================================================= */}
        {activeTab === 'mess' && (
          <div className="space-y-6">
            {/* Day selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E4EAE5' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setMessDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    messDay === day
                      ? 'bg-[#142D28] text-white shadow-sm'
                      : 'text-[#65736B] hover:text-[#202A27] hover:bg-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Meals Grid for the Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { type: 'breakfast', title: 'Breakfast', time: '07:30 AM – 09:30 AM' },
                { type: 'lunch', title: 'Lunch', time: '12:30 PM – 02:30 PM' },
                { type: 'snacks', title: 'High-Tea & Snacks', time: '05:00 PM – 06:15 PM' },
                { type: 'dinner', title: 'Dinner', time: '07:45 PM – 09:45 PM' },
              ].map((m) => {
                const mealData = currentMenuData?.meals?.[m.type];
                const items = mealData?.items || ['No items configured for this meal slot'];

                return (
                  <div
                    key={m.type}
                    className="p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
                        <h4 className="font-extrabold text-sm text-[#202A27]">{m.title}</h4>
                        <button
                          onClick={() => {
                            setMessMealType(m.type);
                            handleOpenEditMenuModal();
                          }}
                          className="p-1.5 rounded-lg bg-[#F0F4F1] hover:bg-[#E4EAE5] text-[#142D28] transition-colors cursor-pointer"
                          title="Edit meal items"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>

                      <span className="text-[11px] font-mono font-semibold text-[#87968D] block mt-1.5">
                        {m.time}
                      </span>

                      <div className="mt-3.5 space-y-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-[#202A27] p-2 rounded-lg bg-[#F6F8F6] border border-[#E4EAE5]/60"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#168567]" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E4EAE5] flex items-center justify-between text-[11px] text-[#87968D]">
                      <span>Diet: Vegetarian</span>
                      <span className="font-bold text-[#168567]">Published ✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: CAMPUS ANNOUNCEMENTS & CIRCULARS
            ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <AnnouncementsPanel forcedAdmin={true} />
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: STUDENT DETAILS VIEW
          ========================================================================= */}
      {selectedStudentDetail && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedStudentDetail(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D28]/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-6 flex flex-col gap-4 text-[#202A27]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#168567]" />
                <h3 className="font-extrabold text-sm">Official University Student Record</h3>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1.5 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#168567] to-[#142D28] text-white flex items-center justify-center font-extrabold text-base">
                  {selectedStudentDetail.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#202A27]">{selectedStudentDetail.name}</h4>
                  <span className="font-mono text-xs font-bold text-[#168567] bg-[#EAF5EF] px-2 py-0.5 rounded">
                    {selectedStudentDetail.enrollmentNumber}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#87968D]">Email:</span>
                  <span className="font-semibold text-[#202A27]">{selectedStudentDetail.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#87968D]">Phone:</span>
                  <span className="font-semibold text-[#202A27]">{selectedStudentDetail.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#87968D]">Department:</span>
                  <span className="font-semibold text-[#202A27] truncate max-w-[200px]">
                    {selectedStudentDetail.department}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#87968D]">Hostel Residence:</span>
                  <span className="font-semibold text-[#202A27]">{selectedStudentDetail.residence || 'Campus Hostel'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#87968D]">Account Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      selectedStudentDetail.isBlocked
                        ? 'bg-[#FDF2F3] text-[#C43D4B]'
                        : 'bg-[#EAF5EF] text-[#168567]'
                    }`}
                  >
                    {selectedStudentDetail.isBlocked ? 'SUSPENDED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleToggleBlock(selectedStudentDetail);
                setSelectedStudentDetail(null);
              }}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors ${
                selectedStudentDetail.isBlocked
                  ? 'bg-[#168567] hover:bg-[#126b53] text-white'
                  : 'bg-[#C43D4B] hover:bg-[#a32e3a] text-white'
              }`}
            >
              {selectedStudentDetail.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
              {selectedStudentDetail.isBlocked ? 'Restore Student Access' : 'Suspend / Block Student Access'}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: GATE PASS REVIEW / ACTION
          ========================================================================= */}
      {reviewModalPass && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewModalPass(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D28]/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-6 flex flex-col gap-4 text-[#202A27]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#168567]" />
                <h3 className="font-extrabold text-sm">
                  {reviewAction === 'APPROVE' ? 'Approve Gate Pass' : 'Reject Out-Pass Request'}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalPass(null)}
                className="p-1.5 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p>
                Student: <span className="font-bold">{reviewModalPass.studentName}</span> (
                <span className="font-mono text-[#168567]">{reviewModalPass.enrollmentNumber}</span>)
              </p>
              <p>
                Destination: <span className="font-bold">{reviewModalPass.destination}</span>
              </p>
              <p className="text-[#65736B]">Reason: {reviewModalPass.reason}</p>

              {(() => {
                const modalTime = getOutpassTimeInfo(reviewModalPass);
                return (
                  <div className="p-2.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#142D28]">
                      <span className="flex items-center gap-1.5">
                        <Timer size={13} className="text-[#168567]" /> Expire Limit:
                      </span>
                      <span className="text-[#168567] font-extrabold">{modalTime.durationText}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#65736B]">
                      <span>Departure: <b>{modalTime.outFormatted}</b></span>
                      <span>Return: <b>{modalTime.inFormatted}</b></span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2">
                <label className="font-bold text-[#404D46] block mb-1">
                  Warden / Admin Remarks (Visible to Student):
                </label>
                <textarea
                  rows="3"
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Enter any conditions or reason for decision..."
                  className="w-full p-2.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#E4EAE5]">
              <button
                onClick={() => setReviewModalPass(null)}
                className="flex-1 py-2 rounded-xl bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleProcessPass}
                className={`flex-1 py-2 rounded-xl text-white font-bold text-xs shadow-xs cursor-pointer ${
                  reviewAction === 'APPROVE' ? 'bg-[#168567] hover:bg-[#126b53]' : 'bg-[#C43D4B] hover:bg-[#a32e3a]'
                }`}
              >
                Confirm {reviewAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT TIMETABLE SLOT
          ========================================================================= */}
      {slotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSlotModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D28]/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-6 flex flex-col gap-4 text-[#202A27]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#168567]" />
                <h3 className="font-extrabold text-sm">
                  {editingSlot ? 'Edit Class Slot' : 'Add Class Slot to Schedule'}
                </h3>
              </div>
              <button
                onClick={() => setSlotModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-[#65736B]">
                <span className="font-bold text-[#142D28]">Schedule Target:</span> {selectedDept} • {selectedCourse} • {selectedDay} (Sem {selectedSemester} - Sec {selectedSection})
              </div>

              <div>
                <label className="font-bold text-[#404D46] block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database Management"
                  value={slotForm.subject}
                  onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-302"
                    value={slotForm.subjectCode}
                    onChange={(e) => setSlotForm({ ...slotForm, subjectCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Faculty / Teacher Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah Chen"
                    value={slotForm.faculty}
                    onChange={(e) => setSlotForm({ ...slotForm, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Start Time</label>
                  <input
                    type="text"
                    placeholder="09:30"
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#404D46] block mb-1">End Time</label>
                  <input
                    type="text"
                    placeholder="10:30"
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Room / Lab Number</label>
                  <input
                    type="text"
                    placeholder="Room B-204"
                    value={slotForm.room}
                    onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Campus Building</label>
                  <input
                    type="text"
                    placeholder="Turing Hall"
                    value={slotForm.building}
                    onChange={(e) => setSlotForm({ ...slotForm, building: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] focus:outline-hidden focus:border-[#168567]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4EAE5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f3f38] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Class Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT MESS MENU ITEMS
          ========================================================================= */}
      {editMenuModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditMenuModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D28]/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-6 flex flex-col gap-4 text-[#202A27]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-[#168567]" />
                <h3 className="font-extrabold text-sm capitalize">
                  Edit {messDay} {messMealType} Menu
                </h3>
              </div>
              <button
                onClick={() => setEditMenuModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <label className="font-bold text-[#404D46] block">
                Dishes / Menu Items (One per line):
              </label>
              <textarea
                rows="7"
                value={menuItemsText}
                onChange={(e) => setMenuItemsText(e.target.value)}
                placeholder="Paneer Butter Masala&#10;Jeera Rice&#10;Tandoori Roti&#10;Gulab Jamun"
                className="w-full p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs font-medium focus:outline-hidden focus:border-[#168567]"
              />
              <span className="text-[10.5px] text-[#87968D]">
                These items will update the live dining schedule for all students.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#E4EAE5]">
              <button
                onClick={() => setEditMenuModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#F0F4F1] text-[#65736B] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMenu}
                className="flex-1 py-2 rounded-xl bg-[#168567] hover:bg-[#126b53] text-white font-bold shadow-xs cursor-pointer"
              >
                Publish Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
