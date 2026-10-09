import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    building: { type: String, required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    temperature: { type: Number, default: 22 },
    lightingStatus: { type: String, enum: ['on', 'off', 'dimmed'], default: 'on' },
    status: { type: String, enum: ['available', 'occupied', 'reserved', 'maintenance'], default: 'available' },
    features: [{ type: String }],
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
