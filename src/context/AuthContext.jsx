import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

// Canonical demo user profiles for resilient fallback when backend is unreachable or sleeping
const DEMO_USERS = {
  'rakesh@nextcampus.edu': {
    id: 'usr_student_01',
    _id: 'usr_student_01',
    name: 'Rakesh Kumar',
    preferredName: 'Rakesh',
    email: 'rakesh@nextcampus.edu',
    role: 'student',
    studentId: 'MUR2502101',
    enrollmentNumber: 'MUR2502101',
    department: 'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
    academicYear: 'Class of 2029',
    semester: '1st Year • Semester 1',
    bio: 'First-year computer science undergraduate specializing in AI & Machine Learning.',
    phone: '+91 98765 43210',
    residence: 'Aryabhata Residence Hall (Block C, Room 314)',
    emergencyContact: 'Mr. Sharma (+91 98765 00000)',
    skills: ['Python', 'Machine Learning', 'FastAPI', 'React'],
    societies: ['ACM Student Chapter', 'AI Robotics Club'],
    preferences: {
      notifications: { scheduleAlerts: true, careUpdates: true, ecoDigests: false, skillInvites: true, emergencyBroadcasts: true },
      accessibility: { highContrast: false, reduceMotion: false, screenReader: false, textScale: 'Default (100%)', themePreset: 'Light' },
      privacy: { skillCampusVisible: false, directoryVisible: true },
      twoFactorEnabled: false,
      notificationsEnabled: true,
      darkTheme: false,
      emailAlerts: true,
    },
  },
  'admin@nextcampus.edu': {
    id: 'usr_admin_01',
    _id: 'usr_admin_01',
    name: 'Campus Administrator',
    preferredName: 'Admin',
    email: 'admin@nextcampus.edu',
    role: 'admin',
    studentId: 'ADM-001',
    enrollmentNumber: 'ADM-001',
    department: 'Campus Operations & Security',
    academicYear: 'Staff',
    semester: 'Administration',
    bio: 'Chief Systems Administrator for NextCampus Node at State University.',
    phone: '+91 98000 11223',
    residence: 'Staff Quarters Block A-12',
    emergencyContact: 'Campus Operations Security Desk (Ext 4000)',
    skills: ['Campus Network Topology', 'Identity & Access Management', 'Facility Automation'],
    societies: [],
    preferences: {
      notifications: { scheduleAlerts: true, careUpdates: true, ecoDigests: true, skillInvites: false, emergencyBroadcasts: true },
      accessibility: { highContrast: false, reduceMotion: false, screenReader: false, textScale: 'Default (100%)', themePreset: 'Dark Licorice' },
      privacy: { skillCampusVisible: true, directoryVisible: true },
      twoFactorEnabled: true,
      notificationsEnabled: true,
      darkTheme: true,
      emailAlerts: true,
    },
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nextcampus_token');
      if (token) {
        if (token.startsWith('demo_token_')) {
          const role = localStorage.getItem('nextcampus_demo_role');
          const demoUser = role === 'admin' ? DEMO_USERS['admin@nextcampus.edu'] : DEMO_USERS['rakesh@nextcampus.edu'];
          setUser(demoUser);
          setLoading(false);
          return;
        }
        try {
          const res = await api.get('/auth/me');
          if (res && res.success && res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('[NextCampus Auth] Session expired or invalid token');
          localStorage.removeItem('nextcampus_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrId, password) => {
    try {
      const res = await api.post('/auth/login', { identifier: emailOrId, email: emailOrId, password });
      if (res && res.success && res.data?.token) {
        localStorage.setItem('nextcampus_token', res.data.token);
        localStorage.removeItem('nextcampus_demo_role');
        setUser(res.data.user);
        return res;
      }
      throw new Error(res?.message || 'Authentication failed. Please verify credentials.');
    } catch (err) {
      // Offline fallback: Check if credentials match canonical Quick Demo Credentials
      const normalizedQuery = (emailOrId || '').toLowerCase().trim();
      const isDemoRakesh = normalizedQuery === 'rakesh@nextcampus.edu' || normalizedQuery === 'mur2502101';
      const isDemoAdmin = normalizedQuery === 'admin@nextcampus.edu' || normalizedQuery === 'adm-001';

      const isRakeshPass = password === 'password123';
      const isAdminPass = password === 'admin123' || password === 'adminpassword123';

      if ((isDemoRakesh && isRakeshPass) || (isDemoAdmin && isAdminPass)) {
        const demoUser = isDemoRakesh ? DEMO_USERS['rakesh@nextcampus.edu'] : DEMO_USERS['admin@nextcampus.edu'];
        const mockToken = `demo_token_${Date.now()}`;
        localStorage.setItem('nextcampus_token', mockToken);
        localStorage.setItem('nextcampus_demo_role', demoUser.role);
        setUser(demoUser);
        console.info('[NextCampus Auth] Connected via resilient demo fallback:', demoUser.email);
        return {
          success: true,
          message: 'Authenticated in resilient demo mode (server offline or sleeping)',
          data: {
            user: demoUser,
            token: mockToken,
          },
        };
      }
      throw err;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res && res.success && res.data?.token) {
      localStorage.setItem('nextcampus_token', res.data.token);
      localStorage.removeItem('nextcampus_demo_role');
      setUser(res.data.user);
      return res;
    }
    throw new Error(res?.message || 'Registration failed. Please check your submission.');
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res && res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('nextcampus_token');
    localStorage.removeItem('nextcampus_demo_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
