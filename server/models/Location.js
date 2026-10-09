import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['academic', 'facility', 'dining', 'hostel', 'sports', 'admin'],
      required: true,
    },
    code: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      floor: { type: String, default: 'Ground Floor' },
    },
    openingHours: { type: String, default: '08:00 AM - 08:00 PM' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    status: { type: String, enum: ['open', 'restricted', 'closed', 'under_maintenance'], default: 'open' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Location = mongoose.model('Location', locationSchema);
export default Location;
