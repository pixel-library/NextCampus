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
        name: 'Green Campus Initiative (EcoCampus)',
        role: 'IoT Energy Monitor Contributor',
        badge: 'Volunteer',
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
        color: '#EAE0E1',
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
            backgroundColor: '#2D292A',
            border: '1px solid #AC274F',
            borderRadius: '12px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(172, 39, 79, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFB2BF',
            }}
          >
            <Check size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{toast.message}</span>
            <span style={{ fontSize: '11px', color: '#DFBFC3' }}>{toast.submessage}</span>
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
                backgroundColor: '#FFB2BF',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                color: '#A68A8D',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              STUDENT IDENTITY & PREFERENCES • NEXTCAMPUS ID NODE • [YOUR COLLEGE NAME]
            </span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Student Profile & Settings
          </h1>
          <p style={{ fontSize: '13px', color: '#DFBFC3', margin: 0, maxWidth: '680px' }}>
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
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 217, 218, 0.15)',
              color: '#DFBFC3',
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
              backgroundColor: '#AC274F',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(172, 39, 79, 0.35)',
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
          backgroundColor: '#231E1F',
          borderRadius: '18px',
          padding: '28px',
          border: '1px solid rgba(255, 217, 218, 0.12)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
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
            backgroundColor: 'rgba(172, 39, 79, 0.12)',
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
                  background: 'linear-gradient(135deg, #AC274F 0%, #8C1844 50%, #383335 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '28px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  border: '3px solid #2D292A',
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
                  backgroundColor: '#231E1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFB2BF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                <BadgeCheck size={16} />
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {formData.name}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#2D292A',
                    color: '#FFB2BF',
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
                      backgroundColor: 'rgba(235, 99, 139, 0.2)',
                      color: '#EB638B',
                    }}
                  >
                    Role: {user.role.toUpperCase()}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DFBFC3', fontSize: '13px' }}>
                <School size={16} style={{ color: '#FFB2BF' }} />
                <span>{formData.department}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  color: '#A68A8D',
                  fontSize: '11px',
                  marginTop: '4px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={13} style={{ color: '#E2BEBF' }} />
                  <span>
                    {formData.semester} ({formData.academicYear})
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: '#1F1A1B',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    color: '#EAE0E1',
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
              backgroundColor: '#2D292A',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              color: '#DFBFC3',
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
            borderTop: '1px solid rgba(255, 217, 218, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: '#1F1A1B',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#2D292A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFB2BF',
              }}
            >
              <FolderGit2 size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>4</span>
              <span style={{ fontSize: '10px', color: '#A68A8D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
              backgroundColor: '#1F1A1B',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#2D292A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFB1C2',
              }}
            >
              <LifeBuoy size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>1 Active</span>
              <span style={{ fontSize: '10px', color: '#A68A8D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
              backgroundColor: '#1F1A1B',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#2D292A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E2BEBF',
              }}
            >
              <Leaf size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>340 pts</span>
              <span style={{ fontSize: '10px', color: '#A68A8D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                EcoCampus Tier 2
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: '#1F1A1B',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#2D292A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFC7D0',
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>94.2%</span>
              <span style={{ fontSize: '10px', color: '#A68A8D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
          backgroundColor: '#1F1A1B',
          padding: '6px',
          borderRadius: '14px',
          overflowX: 'auto',
          border: '1px solid rgba(255, 217, 218, 0.08)',
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
                color: isActive ? '#FFC7D0' : '#A68A8D',
                backgroundColor: isActive ? '#AC274F' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 8px rgba(172, 39, 79, 0.3)' : 'none',
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
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              gridColumn: 'span 2',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                  Institutional & Personal Info
                </h3>
                <span style={{ fontSize: '12px', color: '#A68A8D' }}>
                  Synchronized with Academic Affairs & Hostel Wardenship
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#1F1A1B',
                  color: '#FFB1C2',
                  fontWeight: 600,
                }}
              >
                Read/Write Access
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Legal Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    backgroundColor: '#161213',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Preferred First Name
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  style={{
                    backgroundColor: '#161213',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Institutional Email (Federated)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#110D0E',
                    border: '1px solid rgba(255, 217, 218, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#DFBFC3',
                  }}
                >
                  <span>{formData.email}</span>
                  <Lock size={14} style={{ color: '#FFB2BF' }} />
                </div>
                <span style={{ fontSize: '10px', color: '#A68A8D' }}>
                  Managed via Institutional Keycloak Identity Provider
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Personal Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    backgroundColor: '#161213',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Campus Residence / Hostel Allocation
                </label>
                <input
                  type="text"
                  value={formData.residence}
                  onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                  style={{
                    backgroundColor: '#161213',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Emergency Contact & Relation
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  style={{
                    backgroundColor: '#161213',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                Academic Bio / Research Statement
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{
                  backgroundColor: '#161213',
                  border: '1px solid #584144',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
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
                background: 'linear-gradient(135deg, #2D292A 0%, #110D0E 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 217, 218, 0.12)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB2BF' }}>
                  <Radio size={20} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Campus RFID Active
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#FFB1C2', fontWeight: 600 }}>AY 2025-26</span>
              </div>

              <div style={{ margin: '20px 0' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.05em' }}>
                  {formData.studentId}
                </div>
                <div style={{ fontSize: '11px', color: '#DFBFC3', marginTop: '4px' }}>
                  Hostel Gate • Library • Lab Access Tier A
                </div>
              </div>

              {/* Simulated Barcode */}
              <div
                style={{
                  backgroundColor: '#231E1F',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  height: '36px',
                  opacity: 0.85,
                }}
              >
                {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${(w % 3) + 1}px`,
                      height: '100%',
                      backgroundColor: i % 2 === 0 ? '#FFB2BF' : '#FFFFFF',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Setting Modules */}
            <div
              style={{
                backgroundColor: '#231E1F',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 217, 218, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px 0' }}>
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
                  backgroundColor: '#1F1A1B',
                  border: '1px solid rgba(255, 217, 218, 0.06)',
                  color: '#FFFFFF',
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
                      backgroundColor: 'rgba(172, 39, 79, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFB2BF',
                    }}
                  >
                    <Key size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Change Master Password</div>
                    <div style={{ fontSize: '10px', color: '#A68A8D' }}>Last updated 42 days ago</div>
                  </div>
                </div>
                <span style={{ color: '#DFBFC3', fontSize: '16px' }}>›</span>
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
                  backgroundColor: '#1F1A1B',
                  border: '1px solid rgba(255, 217, 218, 0.06)',
                  color: '#FFFFFF',
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
                      backgroundColor: 'rgba(140, 24, 68, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFB1C2',
                    }}
                  >
                    <Bell size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Notification Channels</div>
                    <div style={{ fontSize: '10px', color: '#A68A8D' }}>Emergency, LMS, Care</div>
                  </div>
                </div>
                <span style={{ color: '#DFBFC3', fontSize: '16px' }}>›</span>
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
                  backgroundColor: '#1F1A1B',
                  border: '1px solid rgba(255, 217, 218, 0.06)',
                  color: '#FFFFFF',
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
                      backgroundColor: 'rgba(113, 85, 86, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E2BEBF',
                    }}
                  >
                    <Shield size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Security & 2FA Status</div>
                    <div style={{ fontSize: '10px', color: '#A68A8D' }}>Campus Authenticator TOTP</div>
                  </div>
                </div>
                <span style={{ color: '#DFBFC3', fontSize: '16px' }}>›</span>
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
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                  Technical Skills & Competencies
                </h3>
                <span style={{ fontSize: '12px', color: '#A68A8D' }}>
                  Badges highlighted here are visible to project recruiters across SkillCampus
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#1F1A1B',
                  color: '#FFB2BF',
                  fontWeight: 600,
                }}
              >
                SkillCampus Verified
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
                    backgroundColor: '#2D292A',
                    border: '1px solid rgba(255, 217, 218, 0.1)',
                    color: '#FFFFFF',
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
                      color: '#A68A8D',
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
                      backgroundColor: '#110D0E',
                      border: '1px solid #AC274F',
                      color: '#FFFFFF',
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
                      backgroundColor: '#AC274F',
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
                      color: '#A68A8D',
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
                    backgroundColor: '#AC274F',
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
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                  Campus Society & Club Roles
                </h3>
                <span style={{ fontSize: '12px', color: '#A68A8D' }}>Dean of Student Affairs Approved</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#1F1A1B',
                  color: '#FFB1C2',
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
                    backgroundColor: '#1F1A1B',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 217, 218, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#2D292A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFB2BF',
                      }}
                    >
                      <School size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{soc.name}</div>
                      <div style={{ fontSize: '11px', color: '#A68A8D' }}>{soc.role}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(172, 39, 79, 0.25)',
                      color: '#FFB2BF',
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
            backgroundColor: '#231E1F',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255, 217, 218, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
              Campus Routing & Push Notification Channels
            </h3>
            <p style={{ fontSize: '13px', color: '#DFBFC3', margin: 0 }}>
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
                backgroundColor: '#1F1A1B',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#2D292A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB2BF',
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    Class Schedule & Room Relocation Alerts
                  </div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
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
                style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 2: Care Tickets */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: '#1F1A1B',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#2D292A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB1C2',
                  }}
                >
                  <LifeBuoy size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    NextCampus Care Ticket Updates
                  </div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
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
                style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 3: EcoCampus */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: '#1F1A1B',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#2D292A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E2BEBF',
                  }}
                >
                  <Leaf size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    EcoCampus & Green Initiative Digests
                  </div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
                    Weekly roundup of campus sustainability leaderboards and active hostel challenges.
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
                style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 4: SkillCampus */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: '#1F1A1B',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#2D292A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB2BF',
                  }}
                >
                  <FolderGit2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    SkillCampus Collaboration Invites
                  </div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
                    In-app alerts when fellow students request your participation in project teams.
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
                style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Switch 5: Mandatory Emergency */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: '#110D0E',
                borderRadius: '12px',
                opacity: 0.9,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#2D292A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB4AB',
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                      Campus Emergency & Security Broadcasts
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#AC274F',
                        color: '#FFFFFF',
                        fontWeight: 700,
                      }}
                    >
                      MANDATORY
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
                    Critical weather, fire protocols, and lockdown notices cannot be disabled.
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#AC274F',
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
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                Accessibility & Assistive Tools
              </h3>
              <span style={{ fontSize: '12px', color: '#A68A8D' }}>
                WCAG 2.1 AAA Compliant student interface controls
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>High-Contrast Mode</div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>Forces 7:1 minimum contrast across all cards</div>
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
                  style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Reduce Motion</div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>Disables heavy 3D transformations and transitions</div>
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
                  style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Screen Reader Optimization</div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>Injects ARIA live regions for realtime telemetry</div>
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
                  style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Display & Presets */}
          <div
            style={{
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                Display & Scale Presets
              </h3>
              <span style={{ fontSize: '12px', color: '#A68A8D' }}>
                Adjust interface font scale and visual temperature
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
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
                        backgroundColor: isSelected ? '#AC274F' : '#1F1A1B',
                        color: isSelected ? '#FFFFFF' : '#DFBFC3',
                        border: '1px solid rgba(255, 217, 218, 0.1)',
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
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                Portal Color Theme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#1F1A1B',
                    border: '1px solid #AC274F',
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
                      backgroundColor: '#110D0E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFB2BF' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>Dark Licorice</div>
                    <div style={{ fontSize: '10px', color: '#FFB2BF' }}>Active Preset</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#1F1A1B',
                    border: '1px solid rgba(255, 217, 218, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: 0.7,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#3D3839',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFB1C2' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>Charcoal Steel</div>
                    <div style={{ fontSize: '10px', color: '#A68A8D' }}>High Luminance</div>
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
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                Directory & Peer Privacy
              </h3>
              <span style={{ fontSize: '12px', color: '#A68A8D' }}>
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
                  backgroundColor: '#1F1A1B',
                  borderRadius: '10px',
                }}
              >
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    SkillCampus Project Visibility
                  </div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
                    Allow student project leads and researchers to find your profile by skill tags.
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
                  style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  backgroundColor: '#1F1A1B',
                  borderRadius: '10px',
                }}
              >
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Campus Directory Listing</div>
                  <div style={{ fontSize: '11px', color: '#A68A8D' }}>
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
                  style={{ accentColor: '#AC274F', width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Authentication & Active Sessions */}
          <div
            style={{
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 217, 218, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                Authentication & Active Sessions
              </h3>
              <span style={{ fontSize: '12px', color: '#A68A8D' }}>Zero-trust campus network security status</span>
            </div>

            {/* 2FA Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#1F1A1B',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#2D292A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB2BF',
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    Two-Factor Authentication (2FA)
                  </div>
                  <div style={{ fontSize: '11px', color: '#FFB1C2' }}>Active via Campus Authenticator (TOTP)</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('2FA Verified', 'Campus Authenticator is active.')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#2D292A',
                  border: '1px solid rgba(255, 217, 218, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Reconfigure
              </button>
            </div>

            {/* Active Sessions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Logged In Terminals
                </span>
                <button
                  type="button"
                  onClick={handleRevokeSessions}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFB2BF',
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
                      backgroundColor: '#1F1A1B',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} style={{ color: sess.current ? '#FFB2BF' : '#A68A8D' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>{sess.name}</div>
                        <div style={{ fontSize: '10px', color: sess.current ? '#FFB1C2' : '#A68A8D' }}>{sess.desc}</div>
                      </div>
                    </div>
                    {sess.current ? (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSessions(sessions.filter((s) => s.id !== sess.id))}
                        style={{ background: 'none', border: 'none', color: '#A68A8D', cursor: 'pointer' }}
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
          backgroundColor: '#1F1A1B',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: '1px solid rgba(255, 217, 218, 0.08)',
          marginTop: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={22} style={{ color: '#FFB2BF' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
              Institutional Security Protocol
            </div>
            <div style={{ fontSize: '11px', color: '#DFBFC3' }}>
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
              color: '#DFBFC3',
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
              backgroundColor: '#AC274F',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(172, 39, 79, 0.35)',
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
            backgroundColor: 'rgba(17, 13, 14, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              border: '1px solid rgba(255, 217, 218, 0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
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
                backgroundColor: 'rgba(172, 39, 79, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFB2BF',
              }}
            >
              <LogOut size={22} />
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                Sign out of NextCampus?
              </h3>
              <p style={{ fontSize: '13px', color: '#DFBFC3', margin: 0, lineHeight: 1.5 }}>
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
                  backgroundColor: '#2D292A',
                  color: '#DFBFC3',
                  border: 'none',
                  fontSize: '13px',
                  cursor: 'pointer',
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
                  backgroundColor: '#AC274F',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(172, 39, 79, 0.35)',
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
            backgroundColor: 'rgba(17, 13, 14, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              border: '1px solid rgba(255, 217, 218, 0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(172, 39, 79, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB2BF',
                  }}
                >
                  <Key size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Change Master Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                style={{ background: 'none', border: 'none', color: '#A68A8D', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {passwordState.error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(147, 0, 10, 0.35)',
                  border: '1px solid #FFB4AB',
                  color: '#FFDAD6',
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
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  color: '#86efac',
                  fontSize: '12px',
                }}
              >
                {passwordState.success}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  style={{
                    backgroundColor: '#110D0E',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  New Secure Password
                </label>
                <input
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  placeholder="Enter new strong passphrase"
                  required
                  style={{
                    backgroundColor: '#110D0E',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#110D0E',
                    borderRadius: '9999px',
                    marginTop: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: passwordState.newPassword.length >= 8 ? '100%' : passwordState.newPassword.length >= 6 ? '65%' : '25%',
                      backgroundColor: passwordState.newPassword.length >= 8 ? '#22c55e' : passwordState.newPassword.length >= 6 ? '#FFB1C2' : '#FFB4AB',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: '#DFBFC3' }}>
                  Requires minimum 6 characters with mixed entropy
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#DFBFC3', textTransform: 'uppercase' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  placeholder="Re-enter new passphrase"
                  required
                  style={{
                    backgroundColor: '#110D0E',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
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
                    backgroundColor: '#2D292A',
                    color: '#DFBFC3',
                    border: 'none',
                    fontSize: '13px',
                    cursor: 'pointer',
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
                    backgroundColor: '#AC274F',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: passwordState.loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(172, 39, 79, 0.35)',
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
