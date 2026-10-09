import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'admin', 'staff', 'care_admin'],
      default: 'student',
    },
    studentId: { type: String, trim: true },
    department: { type: String, trim: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    preferences: {
      notificationsEnabled: { type: Boolean, default: true },
      darkTheme: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export default User;
