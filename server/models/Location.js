import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['academic', 'facility', 'dining', 'hostel', 'sports', 'admin', 'research', 'library', 'cleanroom'],
      required: true,
    },
    code: { type: String, required: true, unique: true },
    precinct: { type: String, default: 'North Quadrangle' },
    totalFloors: { type: Number, default: 4 },
    departments: [{ type: String }],
    grossFloorArea: { type: Number, default: 14200 },
    cadSchema: { type: String, default: 'Auto-Import from Revit Cloud (IFC4)' },
    commissionedYear: { type: Number, default: 2021 },
    powerSubstation: { type: String, default: 'West 11kV' },
    loadPercentage: { type: Number, default: 75 },
    description: { type: String, default: '' },
    coordinates: {
      x: { type: Number, default: 500 },
      y: { type: Number, default: 400 },
      floor: { type: String, default: 'Ground Floor' },
    },
    openingHours: { type: String, default: '07:30 AM - 10:00 PM' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    status: { type: String, enum: ['open', 'restricted', 'closed', 'under_maintenance'], default: 'open' },
    image: { type: String, default: '' },
    floors: [
      {
        floorNumber: { type: String, required: true },
        name: { type: String, default: '' },
        cadVersion: { type: String, default: 'CAD v2.4' },
        roomsCount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Location = mongoose.model('Location', locationSchema);
export default Location;

