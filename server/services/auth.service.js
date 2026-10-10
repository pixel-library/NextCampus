import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/helpers.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Pre-seeded mock users with real bcrypt hashes for decoupled/test/offline operations
 */
let IN_MEMORY_USERS = [
  {
    _id: 'usr_student_01',
    name: 'Rudra Sharma',
    preferredName: 'Rudra',
    email: 'rudra@nextcampus.edu',
    password: bcrypt.hashSync('password123', 10),
    role: 'student',
    studentId: 'MU2026001',
    department: 'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
    academicYear: 'Class of 2026',
    semester: '3rd Year • Semester 5',
    bio: 'Undergraduate CSE student working on distributed edge computing, ROS2 robotics stacks, and autonomous campus navigation telemetry.',
    phone: '+91 98765 43210',
    residence: 'Bhabha Boys Hostel • Room B-314',
    emergencyContact: 'Alok Sharma - Father (+91 98111 22334)',
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
      notificationsEnabled: true,
      darkTheme: true,
      emailAlerts: true,
    },
    createdAt: new Date('2025-08-15T09:00:00Z'),
    updatedAt: new Date(),
  },
  {
    _id: 'usr_admin_01',
    name: 'Campus Administrator',
    preferredName: 'Admin',
    email: 'admin@nextcampus.edu',
    password: bcrypt.hashSync('adminpassword123', 10),
    role: 'admin',
    studentId: 'ADM-001',
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
      notifications: {
        scheduleAlerts: true,
        careUpdates: true,
        ecoDigests: true,
        skillInvites: false,
        emergencyBroadcasts: true,
      },
      accessibility: {
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        textScale: 'Default (100%)',
        themePreset: 'Dark Licorice',
      },
      privacy: {
        skillCampusVisible: true,
        directoryVisible: true,
      },
      twoFactorEnabled: true,
      notificationsEnabled: true,
      darkTheme: true,
      emailAlerts: true,
    },
    createdAt: new Date('2025-08-01T08:00:00Z'),
    updatedAt: new Date(),
  },
];

/**
 * Remove sensitive password and internals before transmitting to clients
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  const doc = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete doc.password;
  delete doc.__v;
  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
  };
};

/**
 * Register a new user account with secure password hashing and strict role isolation
 */
export const registerUser = async (userData) => {
  const { name, email, password, studentId, department, academicYear, preferredName } = userData;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required fields.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check email uniqueness in DB or in-memory store
  if (isDbConnected()) {
    try {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        throw new Error('User with this email already exists.');
      }
    } catch (err) {
      if (err.message.includes('already exists')) throw err;
      console.warn('[NextCampus Auth] DB check fallback to in-memory store');
    }
  }

  const memExisting = IN_MEMORY_USERS.find((u) => u.email === normalizedEmail);
  if (memExisting) {
    throw new Error('User with this email already exists.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Hash password securely with bcrypt salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // CRITICAL SECURITY: Force role to 'student'. Never allow self-promotion to admin
  const assignedRole = 'student';

  const newUserRecord = {
    _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    preferredName: preferredName ? preferredName.trim() : name.split(' ')[0],
    email: normalizedEmail,
    password: hashedPassword,
    role: assignedRole,
    studentId: studentId ? studentId.trim() : `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    department: department ? department.trim() : 'Computer Science & Engineering',
    academicYear: academicYear || 'Class of 2028',
    semester: '1st Year • Semester 1',
    bio: '',
    phone: '',
    residence: '',
    emergencyContact: '',
    skills: [],
    societies: [],
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
        reduceMotion: false,
        screenReader: false,
        textScale: 'Default (100%)',
        themePreset: 'Dark Licorice',
      },
      privacy: {
        skillCampusVisible: true,
        directoryVisible: false,
      },
      twoFactorEnabled: false,
      notificationsEnabled: true,
      darkTheme: true,
      emailAlerts: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let savedUser = newUserRecord;

  if (isDbConnected()) {
    try {
      const created = await User.create(newUserRecord);
      savedUser = created;
    } catch (err) {
      console.warn('[NextCampus Auth] DB create failed, saving to in-memory store:', err.message);
      IN_MEMORY_USERS.unshift(newUserRecord);
    }
  } else {
    IN_MEMORY_USERS.unshift(newUserRecord);
  }

  const sanitized = sanitizeUser(savedUser);
  const token = generateToken({
    id: sanitized.id,
    role: sanitized.role,
    email: sanitized.email,
  });

  return {
    user: sanitized,
    token,
  };
};

/**
 * Authenticate existing user by email or student ID
 */
export const loginUser = async (emailOrId, password) => {
  if (!emailOrId || !password) {
    throw new Error('Email and password credentials are required.');
  }

  const query = emailOrId.toLowerCase().trim();
  let user = null;

  if (isDbConnected()) {
    try {
      user = await User.findOne({
        $or: [{ email: query }, { studentId: emailOrId.trim() }],
      }).select('+password');
    } catch (err) {
      console.warn('[NextCampus Auth] DB query fallback to memory:', err.message);
    }
  }

  if (!user) {
    user = IN_MEMORY_USERS.find(
      (u) =>
        u.email.toLowerCase() === query ||
        (u.studentId && u.studentId.toLowerCase() === query)
    );
  }

  if (!user) {
    throw new Error('Invalid credentials provided.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials provided.');
  }

  const sanitized = sanitizeUser(user);
  const token = generateToken({
    id: sanitized.id,
    role: sanitized.role,
    email: sanitized.email,
  });

  return {
    user: sanitized,
    token,
  };
};

/**
 * Retrieve current user profile details
 */
export const getCurrentUser = async (userId) => {
  let user = null;

  if (isDbConnected()) {
    try {
      user = await User.findById(userId);
    } catch (err) {
      console.warn('[NextCampus Auth] DB findById fallback to memory');
    }
  }

  if (!user) {
    user = IN_MEMORY_USERS.find(
      (u) => u._id === userId || u.id === userId || (u._id && u._id.toString() === userId)
    );
  }

  if (!user) {
    throw new Error('User account not found.');
  }

  return {
    user: sanitizeUser(user),
  };
};

/**
 * Update student profile and preference configuration
 * Prevents unauthorized role modifications and cross-user tampering
 */
export const updateProfile = async (targetUserId, updateData, requesterRole) => {
  let user = null;

  if (isDbConnected()) {
    try {
      user = await User.findById(targetUserId);
    } catch (err) {
      console.warn('[NextCampus Auth] DB lookup fallback to memory');
    }
  }

  let memoryIndex = -1;
  if (!user) {
    memoryIndex = IN_MEMORY_USERS.findIndex(
      (u) => u._id === targetUserId || u.id === targetUserId || (u._id && u._id.toString() === targetUserId)
    );
    if (memoryIndex !== -1) {
      user = IN_MEMORY_USERS[memoryIndex];
    }
  }

  if (!user) {
    throw new Error('User profile record not found.');
  }

  // Whitelist editable fields and strictly protect sensitive security fields
  const allowedFields = [
    'name',
    'preferredName',
    'phone',
    'residence',
    'emergencyContact',
    'bio',
    'department',
    'academicYear',
    'semester',
    'skills',
    'societies',
    'preferences',
  ];

  // Disallow unauthorized role changes
  if (updateData.role && updateData.role !== user.role && requesterRole !== 'admin') {
    throw new Error('Unauthorized: Only system administrators may alter account roles.');
  }

  const updates = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      if (key === 'preferences' && typeof updateData[key] === 'object') {
        updates.preferences = {
          ...user.preferences,
          ...updateData.preferences,
          notifications: {
            ...user.preferences?.notifications,
            ...updateData.preferences?.notifications,
            // Emergency broadcasts are mandatory and cannot be disabled
            emergencyBroadcasts: true,
          },
          accessibility: {
            ...user.preferences?.accessibility,
            ...updateData.preferences?.accessibility,
          },
          privacy: {
            ...user.preferences?.privacy,
            ...updateData.preferences?.privacy,
          },
        };
      } else {
        updates[key] = updateData[key];
      }
    }
  }

  updates.updatedAt = new Date();

  let updatedDoc = null;

  if (isDbConnected()) {
    try {
      updatedDoc = await User.findByIdAndUpdate(targetUserId, { $set: updates }, { new: true });
    } catch (err) {
      console.warn('[NextCampus Auth] DB update failed, falling back to memory');
    }
  }

  if (!updatedDoc) {
    if (memoryIndex === -1) {
      memoryIndex = IN_MEMORY_USERS.findIndex(
        (u) => u._id === targetUserId || u.id === targetUserId || (u._id && u._id.toString() === targetUserId)
      );
    }
    if (memoryIndex !== -1) {
      IN_MEMORY_USERS[memoryIndex] = {
        ...IN_MEMORY_USERS[memoryIndex],
        ...updates,
      };
      updatedDoc = IN_MEMORY_USERS[memoryIndex];
    } else {
      updatedDoc = { ...user, ...updates };
    }
  }

  return {
    user: sanitizeUser(updatedDoc),
  };
};

/**
 * Change master password with current password verification
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new Error('Both current and new passwords are required.');
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  let user = null;
  let memoryIndex = -1;

  if (isDbConnected()) {
    try {
      user = await User.findById(userId).select('+password');
    } catch (err) {
      console.warn('[NextCampus Auth] DB password query fallback');
    }
  }

  if (!user) {
    memoryIndex = IN_MEMORY_USERS.findIndex(
      (u) => u._id === userId || u.id === userId || (u._id && u._id.toString() === userId)
    );
    if (memoryIndex !== -1) {
      user = IN_MEMORY_USERS[memoryIndex];
    }
  }

  if (!user) {
    throw new Error('User account not found.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password does not match records.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  if (isDbConnected()) {
    try {
      await User.findByIdAndUpdate(userId, { password: hashedPassword, updatedAt: new Date() });
    } catch (err) {
      console.warn('[NextCampus Auth] DB password update failed, memory sync used');
    }
  }

  if (memoryIndex !== -1) {
    IN_MEMORY_USERS[memoryIndex].password = hashedPassword;
    IN_MEMORY_USERS[memoryIndex].updatedAt = new Date();
  }

  return {
    success: true,
    message: 'Master password updated securely.',
  };
};
