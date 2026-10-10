import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    preferredName: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'admin', 'staff', 'care_admin'],
      default: 'student',
    },
    studentId: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: 'Computer Science & Engineering' },
    academicYear: { type: String, trim: true, default: 'Class of 2026' },
    semester: { type: String, trim: true, default: '3rd Year • Semester 5' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    residence: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    societies: [
      {
        name: { type: String, trim: true },
        role: { type: String, trim: true },
        badge: { type: String, trim: true },
      },
    ],
    preferences: {
      notifications: {
        scheduleAlerts: { type: Boolean, default: true },
        careUpdates: { type: Boolean, default: true },
        ecoDigests: { type: Boolean, default: false },
        skillInvites: { type: Boolean, default: true },
        emergencyBroadcasts: { type: Boolean, default: true },
      },
      accessibility: {
        highContrast: { type: Boolean, default: false },
        reduceMotion: { type: Boolean, default: true },
        screenReader: { type: Boolean, default: true },
        textScale: { type: String, default: 'Default (100%)' },
        themePreset: { type: String, default: 'Dark Licorice' },
      },
      privacy: {
        skillCampusVisible: { type: Boolean, default: true },
        directoryVisible: { type: Boolean, default: false },
      },
      twoFactorEnabled: { type: Boolean, default: true },
      notificationsEnabled: { type: Boolean, default: true },
      darkTheme: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export default User;

