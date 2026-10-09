import mongoose from 'mongoose';

const sustainabilitySchema = new mongoose.Schema(
  {
    metricName: { type: String, required: true },
    category: { type: String, enum: ['solar', 'water', 'waste', 'carbon'], required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    trendPercentage: { type: Number, default: 0 },
    status: { type: String, enum: ['optimal', 'warning', 'critical'], default: 'optimal' },
    historicalData: [
      {
        timestamp: { type: Date, default: Date.now },
        val: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Sustainability = mongoose.model('Sustainability', sustainabilitySchema);
export default Sustainability;
