import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  BadgeCheck,
  School,
  Calendar,
  LogOut,
  Check,
  X,
  Key,
  Shield,
  Bell,
  Sliders,
  FolderGit2,
  LifeBuoy,
  Leaf,
  GraduationCap,
  Sparkles,
  Lock,
  Phone,
  Home,
  AlertTriangle,
  Radio,
  FileCode,
  Laptop,
  Smartphone,
  Plus,
  RefreshCw,
  Info,
  Layers,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  UserCheck
} from 'lucide-react';

export const ProfileSettings = () => {
  const { user, updateProfile, changePassword, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab: 'profile' | 'academics' | 'notifications' | 'accessibility' | 'security'
  const [activeTab, setActiveTab] = useState('profile');

  // Form State initialized from user
  const [formData, setFormData] = useState({
    name: 'Rudra Sharma',
    preferredName: 'Rudra',
    email: 'rudra@nextcampus.edu',
    studentId: 'MU2026001',
    phone: '+91 98765 43210',
    residence: 'Bhabha Boys Hostel • Room B-314',
    emergencyContact: 'Alok Sharma - Father (+91 98111 22334)',
    bio: 'Undergraduate CSE student working on distributed edge computing, ROS2 robotics stacks, and autonomous campus navigation telemetry.',
    department: 'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
    academicYear: 'Class of 2026',
    semester: '3rd Year • Semester 5',
    skills: [
      'Python 3.11',
      'ROS2 Humble',
      'Next.js & React',
      'Computer Vision (YOLOv8)',
      'Embedded IoT & ESP32',
      'UI/UX Systems Design',
    ],
    societies: [
      {
        name: 'Robotics & Automation Society',
        role: 'Lead Autonomous Navigation Developer',
        badge: 'Executive Lead',
      },
      {
        name: 'ACM Student Chapter',
        role: 'Competitive Programming & Workshop Mentor',
        badge: 'Active Member',
      },
      {
        name: 'Robotics & AI Student Chapter',
        role: 'Autonomous Systems & Edge AI Contributor',
        badge: 'Technical Lead',
      },
    ],
    preferences: {
      notifications: {
        scheduleAlerts: true,
        careUpdates: true,
        ecoDigests: false,
        skillInvites: true,
        emergencyBroadcasts: true,
      },
      accessibility: {
        highContrast: false,
        reduceMotion: true,
        screenReader: true,
        textScale: 'Default (100%)',
        themePreset: 'Dark Licorice',
      },
      privacy: {
        skillCampusVisible: true,
        directoryVisible: false,
      },
      twoFactorEnabled: true,
    },
  });

  // Track initial snapshot for discard
  const [initialData, setInitialData] = useState(null);

  // New skill input state
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  // Modals & Overlays
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: '',
    loading: false,
  });

  // Sessions list
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      name: 'macOS Chrome • Academic Block B',
      desc: 'Current Device • IPv6 Mesh',
      current: true,
      icon: Laptop,
    },
    {
      id: 'sess-2',
      name: 'NextCampus App • Android 14',
      desc: 'Last active 2 hrs ago • Hostel Wi-Fi',
      current: false,
      icon: Smartphone,
    },
  ]);

  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: '', submessage: '' });
  const [saving, setSaving] = useState(false);

  // Sync state when user object loads
  useEffect(() => {
    if (user) {
      const merged = {
        name: user.name || 'Rudra Sharma',
        preferredName: user.preferredName || user.name?.split(' ')[0] || 'Rudra',
        email: user.email || 'rudra@nextcampus.edu',
        studentId: user.studentId || user.enrollmentNumber || 'MU2026001',
        phone: user.phone || '+91 98765 43210',
        residence: user.residence || 'Bhabha Boys Hostel • Room B-314',
        emergencyContact: user.emergencyContact || 'Alok Sharma - Father (+91 98111 22334)',
        bio: user.bio || 'Undergraduate CSE student working on distributed edge computing, ROS2 robotics stacks, and autonomous campus navigation telemetry.',
        department: user.department || 'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
        academicYear: user.academicYear || 'Class of 2026',
        semester: user.semester || '3rd Year • Semester 5',
        skills: user.skills && user.skills.length > 0 ? user.skills : formData.skills,
        societies: user.societies && user.societies.length > 0 ? user.societies : formData.societies,
        preferences: {
          notifications: {
            scheduleAlerts: user.preferences?.notifications?.scheduleAlerts ?? true,
            careUpdates: user.preferences?.notifications?.careUpdates ?? true,
            ecoDigests: user.preferences?.notifications?.ecoDigests ?? false,
            skillInvites: user.preferences?.notifications?.skillInvites ?? true,
            emergencyBroadcasts: true,
          },
          accessibility: {
            highContrast: user.preferences?.accessibility?.highContrast ?? false,
            reduceMotion: user.preferences?.accessibility?.reduceMotion ?? true,
            screenReader: user.preferences?.accessibility?.screenReader ?? true,
            textScale: user.preferences?.accessibility?.textScale || 'Default (100%)',
            themePreset: user.preferences?.accessibility?.themePreset || 'Dark Licorice',
          },
          privacy: {
            skillCampusVisible: user.preferences?.privacy?.skillCampusVisible ?? true,
            directoryVisible: user.preferences?.privacy?.directoryVisible ?? false,
          },
          twoFactorEnabled: user.preferences?.twoFactorEnabled ?? true,
        },
      };
      setFormData(merged);
      setInitialData(JSON.parse(JSON.stringify(merged)));
    }
  }, [user]);

  // Show toast notification
  const triggerToast = (message, submessage) => {
    setToast({ show: true, message, submessage });
    setTimeout(() => {
      setToast({ show: false, message: '', submessage: '' });
    }, 3500);
  };

  // Discard changes
  const handleDiscard = () => {
    if (initialData) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
      triggerToast('Changes Discarded', 'Reverted form values back to saved profile records.');
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile(formData);
      }
      setInitialData(JSON.parse(JSON.stringify(formData)));
      triggerToast('Changes Synchronized', 'All preferences securely persisted in NextCampus database.');
    } catch (err) {
      triggerToast('Save Failed', err.message || 'Could not update profile records.');
    } finally {
      setSaving(false);
    }
  };

  // Handle skill addition
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!formData.skills.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
      });
    }
    setNewSkillInput('');
    setShowAddSkillInput(false);
  };

  // Handle skill removal
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordState((prev) => ({ ...prev, error: '', success: '', loading: true }));

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordState((prev) => ({
        ...prev,
        error: 'New passwords do not match.',
        loading: false,
      }));
      return;
    }

    if (passwordState.newPassword.length < 6) {
      setPasswordState((prev) => ({
        ...prev,
        error: 'Password must be at least 6 characters.',
        loading: false,
      }));
      return;
    }

    try {
      await changePassword(passwordState.currentPassword, passwordState.newPassword);
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        success: 'Credentials updated successfully!',
        loading: false,
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        triggerToast('Password Updated', 'Master credentials successfully hashed and saved.');
      }, 1200);
    } catch (err) {
      setPasswordState((prev) => ({
        ...prev,
        error: err.message || 'Failed to update password.',
        loading: false,
      }));
    }
  };

  // Handle Sign Out
  const handleSignOutConfirm = () => {
    logout();
    setShowSignOutModal(false);
    navigate('/auth');
  };

  // Revoke sessions
  const handleRevokeSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    triggerToast('Sessions Revoked', 'Terminated all remote active campus mesh sessions.');
  };

  const getInitials = (name) => {
    if (!name) return 'NC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-900 min-h-screen pb-16 font-sans">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-lg animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-xl bg-[#EAF5EF] text-[#168567] flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">{toast.message}</span>
            <span className="text-[11px] text-slate-500">{toast.submessage}</span>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Action Header */}
      <section className="flex flex-col gap-3 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-500">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168567] animate-pulse"></span>
              NextCampus Identity Node
            </span>
            <span className="hidden sm:inline">Mewar University SSO</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Account Settings</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-[#168567] hover:bg-[#116951] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Check size={15} />
              <span>{saving ? 'Synchronizing...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Profile &amp; Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Manage your verified student credentials, academic skills, communication routing, accessibility tools, and account security.
            </p>
          </div>
        </div>
      </section>

      {/* Student Identity Hero Card */}
      <section className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#EAF5EF] text-[#168567] border-2 border-[#168567]/20 flex items-center justify-center font-black text-2xl shadow-xs">
              {getInitials(formData.name)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 text-[#168567] flex items-center justify-center shadow-xs">
              <BadgeCheck size={15} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Roll: {formData.studentId}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 uppercase font-mono">
                {user?.role || 'STUDENT'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
              <School size={14} className="text-[#168567] shrink-0" />
              <span>{formData.department}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formData.semester} ({formData.academicYear})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Verified Institutional SSO</span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSignOutModal(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer shadow-xs"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </section>

      {/* Segmented Settings Navigation Tabs */}
      <section className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
        {[
          { id: 'profile', label: 'Profile Information', icon: User },
          { id: 'academics', label: 'Academic & Skills', icon: School },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'accessibility', label: 'Accessibility & Display', icon: Sliders },
          { id: 'security', label: 'Privacy & Security', icon: Shield },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <IconComp size={15} className={isActive ? 'text-[#168567]' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* =========================================================================
          TAB 1: PROFILE INFORMATION
          ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Personal &amp; Contact Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your preferred name, direct contact channels, and campus living arrangements.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EAF5EF] text-[#168567] border border-[#168567]/20">
                  EDITABLE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Legal Name (Read Only) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Full Legal Name
                    </label>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Lock size={11} /> Registrar Record
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                {/* Preferred Name (Editable) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Preferred Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.preferredName}
                    onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-1 focus:ring-[#168567]/20 transition-all font-medium"
                  />
                </div>

                {/* University Email (Read Only) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      University Email
                    </label>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Lock size={11} /> Institutional SSO
                    </span>
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>

                {/* Mobile Phone (Editable) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-1 focus:ring-[#168567]/20 transition-all font-mono"
                  />
                </div>

                {/* Campus Residence (Editable) */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Campus Residence / Hostel Room
                  </label>
                  <input
                    type="text"
                    value={formData.residence}
                    onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                    placeholder="e.g. Bhabha Boys Hostel • Room B-314"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-1 focus:ring-[#168567]/20 transition-all font-medium"
                  />
                </div>

                {/* Emergency Contact (Editable) */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Primary Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="e.g. Alok Sharma - Father (+91 98111 22334)"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-1 focus:ring-[#168567]/20 transition-all font-medium"
                  />
                </div>

                {/* Personal Academic Bio */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Personal Statement &amp; Academic Bio
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formData.bio.length} / 300 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-1 focus:ring-[#168567]/20 transition-all resize-none leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Verification Information */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#168567] uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Verified Credentials</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official academic records, including degree program, examination roll number, and term progress, are managed directly by the University Registrar Office.
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Enrolment No:</span>
                  <span className="font-bold text-slate-900">{formData.studentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Degree:</span>
                  <span className="font-bold text-slate-900">B.Tech (CSE)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700">Good Standing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACADEMIC & SKILLS
          ========================================================================= */}
      {activeTab === 'academics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Technical Skills Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Technical Skills &amp; Competencies</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Skills highlighted here are discoverable by peers across SkillCampus and campus research labs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSkillInput(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#EAF5EF] text-[#168567] hover:bg-[#dceee3] border border-[#168567]/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Inline Add Skill Input */}
              {showAddSkillInput && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="e.g. PyTorch, Kubernetes, CAD Drafting..."
                    className="flex-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#168567]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSkill();
                      if (e.key === 'Escape') setShowAddSkillInput(false);
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-lg bg-[#168567] text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSkillInput(false)}
                    className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-800 flex items-center gap-2 group hover:border-slate-300 transition-all"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove skill"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Campus Societies & Leadership */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Campus Societies &amp; Student Chapters</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified extracurricular memberships and student leadership designations.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {formData.societies.map((soc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#168567] flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{soc.name}</h4>
                        <p className="text-xs text-slate-500">{soc.role}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono font-semibold text-slate-700">
                      {soc.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">
                Academic Program Roster
              </h4>
              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">Academic Department:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{formData.department}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">Term Progress:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{formData.semester}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">Graduating Class:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{formData.academicYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NOTIFICATIONS & COMMUNICATION
          ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="max-w-3xl flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Notification Routing Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure which alerts and digests you receive on the portal and mobile device.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {/* Academic Schedule Alerts */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Academic Schedule Alerts</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time notifications for lecture hall changes, schedule cancellations, and exams.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications.scheduleAlerts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        notifications: {
                          ...formData.preferences.notifications,
                          scheduleAlerts: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>

              {/* Care Grievance Updates */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Campus Care &amp; Helpdesk Updates</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant alerts when a maintenance technician is dispatched or your grievance status updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications.careUpdates}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        notifications: {
                          ...formData.preferences.notifications,
                          careUpdates: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>

              {/* SkillCampus Invites */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">SkillCampus Collaboration Requests</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Receive team invites and project recruitment inquiries from campus students.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications.skillInvites}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        notifications: {
                          ...formData.preferences.notifications,
                          skillInvites: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>

              {/* EcoCampus Sustainability Digest */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">EcoCampus Weekly Digests</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Weekly summaries of campus energy optimization, green credits, and carbon offsets.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications.ecoDigests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        notifications: {
                          ...formData.preferences.notifications,
                          ecoDigests: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>

              {/* Emergency Broadcasts (Always True / Locked) */}
              <div className="py-3.5 flex items-center justify-between gap-4 bg-slate-50/60 p-3 rounded-xl mt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Institutional Emergency Broadcasts</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      MANDATORY
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Campus-wide health, fire, meteorological, and security alerts cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 rounded text-slate-400 cursor-not-allowed opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ACCESSIBILITY & DISPLAY
          ========================================================================= */}
      {activeTab === 'accessibility' && (
        <div className="max-w-3xl flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Accessibility &amp; Assistive Controls</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize text sizing, motion dynamics, and screen-reading aids for optimal readability.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {/* Text Scaling */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Display Text Scale</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scale typography across campus dashboards and navigational views.
                  </p>
                </div>
                <select
                  value={formData.preferences.accessibility.textScale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        accessibility: {
                          ...formData.preferences.accessibility,
                          textScale: e.target.value,
                        },
                      },
                    })
                  }
                  className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#168567]"
                >
                  <option value="Default (100%)">Default (100%)</option>
                  <option value="Large (110%)">Large (110%)</option>
                  <option value="Extra Large (125%)">Extra Large (125%)</option>
                </select>
              </div>

              {/* Reduced Motion */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Reduced Motion</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Disable dynamic canvas transitions, pulsating badges, and smooth scroll animations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.accessibility.reduceMotion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        accessibility: {
                          ...formData.preferences.accessibility,
                          reduceMotion: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>

              {/* High Contrast Mode */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">High Contrast Palette</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enhance text boundaries, status indicators, and CAD room outlines for high ambient light.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.accessibility.highContrast}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        accessibility: {
                          ...formData.preferences.accessibility,
                          highContrast: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>

              {/* Screen Reader Optimization */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Screen Reader Optimization</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provides descriptive aria labels and live regions for telemetry sensor readings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.accessibility.screenReader}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        accessibility: {
                          ...formData.preferences.accessibility,
                          screenReader: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: PRIVACY & SECURITY
          ========================================================================= */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Password & Authentication Security Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Authentication &amp; Credentials</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your master institutional password and multi-factor security credentials.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ENCRYPTED
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#168567] flex items-center justify-center shrink-0">
                    <Key size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Master Password</h4>
                    <p className="text-xs text-slate-500">Last verified during registration • Bcrypt Salted</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
                >
                  Change Password
                </button>
              </div>

              {/* Peer Privacy & Visibility */}
              <div className="pt-2 flex flex-col divide-y divide-slate-100">
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Campus Directory Visibility</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Allow your student profile and contact details to appear in the campus directory.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.preferences.privacy.directoryVisible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          privacy: {
                            ...formData.preferences.privacy,
                            directoryVisible: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">SkillCampus Peer Discovery</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Allow classmates to find your technical competencies and invite you to hackathon projects.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.preferences.privacy.skillCampusVisible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          privacy: {
                            ...formData.preferences.privacy,
                            skillCampusVisible: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Active Campus Mesh Sessions */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Campus Mesh Sessions</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized hardware devices currently connected to your student profile token.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRevokeSessions}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  Revoke Remote
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {sessions.map((sess) => {
                  const IconComp = sess.icon;
                  return (
                    <div
                      key={sess.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                          <IconComp size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{sess.name}</h4>
                            {sess.current && (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                THIS DEVICE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{sess.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Zero-Trust Architecture</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tokens are signed with secure HMAC-SHA256 keys. Password rotation immediately invalidates past authentication grants across all remote access nodes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CHANGE PASSWORD
          ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#168567]" />
                <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {passwordState.error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{passwordState.error}</span>
              </div>
            )}

            {passwordState.success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{passwordState.success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                    className="w-full h-10 pl-3 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">New Password (min 6 chars)</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    required
                    minLength={6}
                    placeholder="Enter strong new password"
                    className="w-full h-10 pl-3 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  required
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordState.loading}
                  className="px-4 py-2 rounded-xl bg-[#168567] hover:bg-[#116951] text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {passwordState.loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CONFIRM SIGN OUT
          ========================================================================= */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <LogOut size={22} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Sign Out</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Signing out will securely terminate your current browser session token and require re-authentication.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOutConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
