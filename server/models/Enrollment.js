import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // e.g. "MUR2502162"
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      default: 'Computer Science & Engineering',
    },
    academicYear: {
      type: String,
      trim: true,
      default: 'Class of 2029',
    },
    admissionYear: {
      type: Number,
      default: 2025,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
