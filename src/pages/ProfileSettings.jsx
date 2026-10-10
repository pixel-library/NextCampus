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
  Eye,
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
        studentId: user.studentId || 'MU2026001',
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 16px 48px 16px',
        color: 'var(--text-primary)',
      }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '28px',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 18px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-soft-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
            }}
          >
            <Check size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{toast.message}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{toast.submessage}</span>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Action Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              STUDENT IDENTITY & PREFERENCES • NEXTCAMPUS ID NODE • [YOUR COLLEGE NAME]
            </span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Student Profile & Settings
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '680px' }}>
            Manage your institutional identity, notification routing, accessibility needs, and campus security preferences.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDiscard}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-brand-glow)',
              transition: 'all 0.2s ease',
            }}
          >
            <Check size={16} />
            <span>{saving ? 'Synchronizing...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Student Profile Hero Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '18px',
          padding: '28px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            backgroundColor: 'rgba(158, 21, 62, 0.05)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Student Identity Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'var(--grad-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '28px',
                  boxShadow: 'var(--shadow-brand-glow)',
                  border: '3px solid var(--bg-surface-subtle)',
                }}
              >
                {getInitials(formData.name)}
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <BadgeCheck size={16} />
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {formData.name}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    color: 'var(--brand-primary)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Roll: {formData.studentId}
                </span>
                {user?.role && user.role !== 'student' && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--brand-soft-bg)',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    Role: {user.role.toUpperCase()}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <School size={16} style={{ color: 'var(--brand-primary)' }} />
                <span>{formData.department}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  marginTop: '4px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                  <span>
                    {formData.semester} ({formData.academicYear})
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  <span>Active Full-time Student • Verified Institutional SSO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Sign Out Action */}
          <button
            type="button"
            onClick={() => setShowSignOutModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Metrics Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <FolderGit2 size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>4</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Campus Projects
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-accent)',
              }}
            >
              <LifeBuoy size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>1 Active</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Open Care Ticket
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
              }}
            >
              <Leaf size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>340 pts</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Academic Merit Tier 2
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>94.2%</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Semester Attendance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tab Controls */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          backgroundColor: 'var(--bg-surface-subtle)',
          padding: '6px',
          borderRadius: '14px',
          overflowX: 'auto',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {[
          { id: 'profile', label: 'Profile Information', icon: User },
          { id: 'academics', label: 'Academic & Skills', icon: School },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'accessibility', label: 'Accessibility & Display', icon: Sliders },
          { id: 'security', label: 'Privacy & Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: Profile Information                                    */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Left Form: Editable Personal & Contact Details */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              gridColumn: 'span 2',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  Institutional & Personal Info
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Synchronized with Academic Affairs & Hostel Wardenship
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--brand-soft-bg)',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                }}
              >
                Read/Write Access
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Legal Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Preferred First Name
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Institutional Email (Federated)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{formData.email}</span>
                  <Lock size={14} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Managed via Institutional Keycloak Identity Provider
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Personal Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Campus Residence / Hostel Allocation
                </label>
                <input
                  type="text"
                  value={formData.residence}
                  onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Emergency Contact & Relation
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Academic Bio / Research Statement
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-interactive)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Right Column: Digital Student ID & Quick Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Digital RFID Student Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #9E153E 0%, #700E2B 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(158, 21, 62, 0.4)',
                boxShadow: 'var(--shadow-brand-glow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFE4E6' }}>
                  <Radio size={20} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Campus RFID Active
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#FFE4E6', fontWeight: 600 }}>AY 2025-26</span>
              </div>

              <div style={{ margin: '20px 0' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.05em' }}>
                  {formData.studentId}
                </div>
                <div style={{ fontSize: '11px', color: '#FFE4E6', marginTop: '4px' }}>
                  Hostel Gate • Library • Lab Access Tier A
                </div>
              </div>

              {/* Simulated Barcode */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  height: '36px',
                }}
              >
                {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${(w % 3) + 1}px`,
                      height: '100%',
                      backgroundColor: i % 2 === 0 ? '#FFE4E6' : '#FFFFFF',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Setting Modules */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                Quick Setting Modules
              </h4>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--brand-soft-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <Key size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Change Master Password</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Last updated 42 days ago</div>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>›</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--brand-soft-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <Bell size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Notification Channels</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Emergency, LMS, Care</div>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>›</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--brand-soft-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <Shield size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Security & 2FA Status</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Campus Authenticator TOTP</div>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>›</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Academic & Skills                                      */}
      {/* ============================================================ */}
      {activeTab === 'academics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Skills & Domains */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  Technical Skills & Competencies
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Skills highlighted here are visible on your verified academic profile
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--brand-soft-bg)',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                }}
              >
                Campus Verified
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '8px' }}>
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}

              {showAddSkillInput ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. Docker, Rust..."
                    autoFocus
                    style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--brand-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--brand-primary)',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSkillInput(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddSkillInput(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--brand-primary)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>Add Skill Tag</span>
                </button>
              )}
            </div>
          </div>

          {/* Society & Clubs Affiliations */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  Campus Society & Club Roles
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dean of Student Affairs Approved</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--brand-soft-bg)',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                }}
              >
                Official
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.societies.map((soc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      <School size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{soc.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{soc.role}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--brand-soft-bg)',
                      color: 'var(--brand-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {soc.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Notifications                                          */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              Campus Routing & Push Notification Channels
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Configure how urgent class shifts, care desk tickets, and green challenge announcements reach your device.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Switch 1: Schedule Alerts */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Class Schedule & Room Relocation Alerts
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Instant SMS & Mobile push for last-minute venue or lecture time alterations.
                  </div>
                </div>
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
                style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 2: Care Tickets */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-accent)',
                  }}
                >
                  <LifeBuoy size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    NextCampus Care Ticket Updates
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Real-time alerts when facility technicians or wardens update ticket statuses.
                  </div>
                </div>
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
                style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 3: EcoCampus */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a',
                  }}
                >
                  <Leaf size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Campus Announcements & Event Digests
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Weekly roundup of campus guest lectures, workshops, and student notices.
                  </div>
                </div>
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
                style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 4: Study Groups */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Study Group & Peer Invites
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    In-app alerts when fellow students invite you to join academic project teams.
                  </div>
                </div>
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
                style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 5: Mandatory Emergency */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: '#FEF2F2',
                borderRadius: '12px',
                border: '1px solid #FECACA',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#991B1B' }}>
                      Campus Emergency & Security Broadcasts
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                      }}
                    >
                      MANDATORY
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#B91C1C' }}>
                    Critical weather, fire protocols, and lockdown notices cannot be disabled.
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Lock size={12} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Accessibility & Display                                */}
      {/* ============================================================ */}
      {activeTab === 'accessibility' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Assistive Controls */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                Accessibility & Assistive Tools
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                WCAG 2.1 AAA Compliant student interface controls
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>High-Contrast Mode</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forces 7:1 minimum contrast across all cards</div>
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
                  style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Reduce Motion</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Disables heavy 3D transformations and transitions</div>
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
                  style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Screen Reader Optimization</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Injects ARIA live regions for realtime telemetry</div>
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
                  style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Display & Presets */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                Display & Scale Presets
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Adjust interface font scale and visual temperature
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Text Scale Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['Default (100%)', 'Large (110%)', 'Max (120%)'].map((scale) => {
                  const isSelected = formData.preferences.accessibility.textScale === scale;
                  return (
                    <button
                      key={scale}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            accessibility: {
                              ...formData.preferences.accessibility,
                              textScale: scale,
                            },
                          },
                        })
                      }
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {scale}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Portal Color Theme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>White Light (Default)</div>
                    <div style={{ fontSize: '10px', color: 'var(--brand-primary)', fontWeight: 600 }}>Active Preset</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: 0.8,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#1E293B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E11D48' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Midnight Slate</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>High Contrast</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: Privacy & Security                                     */}
      {/* ============================================================ */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Privacy Preferences */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                Directory & Peer Privacy
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Control visibility in campus searches and directory records
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Peer Collaboration Visibility
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Allow fellow students and study project leads to find your profile by skill tags.
                  </div>
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
                  style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Campus Directory Listing</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Expose hostel block & room allotment in student peer phonebooks.
                  </div>
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
                  style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Authentication & Active Sessions */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                Authentication & Active Sessions
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Zero-trust campus network security status</span>
            </div>

            {/* 2FA Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-soft-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Two-Factor Authentication (2FA)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 600 }}>Active via Campus Authenticator (TOTP)</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('2FA Verified', 'Campus Authenticator is active.')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Reconfigure
              </button>
            </div>

            {/* Active Sessions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Logged In Terminals
                </span>
                <button
                  type="button"
                  onClick={handleRevokeSessions}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Revoke All Others
                </button>
              </div>

              {sessions.map((sess) => {
                const Icon = sess.icon;
                return (
                  <div
                    key={sess.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} style={{ color: sess.current ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{sess.name}</div>
                        <div style={{ fontSize: '10px', color: sess.current ? 'var(--brand-primary)' : 'var(--text-muted)' }}>{sess.desc}</div>
                      </div>
                    </div>
                    {sess.current ? (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSessions(sessions.filter((s) => s.id !== sess.id))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Ribbon / Institutional Security Protocol */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginTop: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-soft-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Institutional Security Protocol
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Always sign out when leaving computer lab terminals or shared kiosk stations.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleDiscard}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(158, 21, 62, 0.25)',
            }}
          >
            Save Profile Changes
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SIGN OUT CONFIRMATION MODAL                                  */}
      {/* ============================================================ */}
      {showSignOutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--brand-soft-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <LogOut size={22} />
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Sign out of NextCampus?
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                You are currently logged in across the Campus Mesh. Ensure you terminate your session on shared lab
                terminals.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOutConfirm}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(158, 21, 62, 0.25)',
                }}
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHANGE MASTER PASSWORD MODAL                                 */}
      {/* ============================================================ */}
      {showPasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', spaceBetween: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-soft-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <Key size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Change Master Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {passwordState.error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '12px',
                }}
              >
                {passwordState.error}
              </div>
            )}

            {passwordState.success && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  color: '#16A34A',
                  fontSize: '12px',
                }}
              >
                {passwordState.success}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  New Secure Password
                </label>
                <input
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  placeholder="Enter new strong passphrase"
                  required
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--border-subtle)',
                    borderRadius: '9999px',
                    marginTop: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: passwordState.newPassword.length >= 8 ? '100%' : passwordState.newPassword.length >= 6 ? '65%' : '25%',
                      backgroundColor: passwordState.newPassword.length >= 8 ? '#22c55e' : passwordState.newPassword.length >= 6 ? 'var(--brand-primary)' : '#EF4444',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Requires minimum 6 characters with mixed entropy
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  placeholder="Re-enter new passphrase"
                  required
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordState.loading}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: passwordState.loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(158, 21, 62, 0.25)',
                  }}
                >
                  {passwordState.loading ? 'Updating...' : 'Update Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
