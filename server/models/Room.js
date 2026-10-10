import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    building: { type: String, required: true },
    buildingCode: { type: String, default: '' },
    floor: { type: String, default: 'Level 2' },
    type: { type: String, default: 'Multi-Media Theatre' },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    temperature: { type: Number, default: 22 },
    lightingStatus: { type: String, enum: ['on', 'off', 'dimmed'], default: 'on' },
    status: { type: String, enum: ['available', 'occupied', 'reserved', 'maintenance'], default: 'available' },
    features: [{ type: String }],
    timetableRule: {
      type: String,
      default: 'Automated live lock sync via University Timetable Core API',
    },
    schedule: [
      {
        subject: String,
        instructor: String,
        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

export const Room = mongoose.model('Room', roomSchema);
export default Room;

