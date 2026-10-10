import mongoose from 'mongoose';
import Sustainability from '../models/Sustainability.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const IN_MEMORY_METRICS = [
  {
    _id: 'sust_01',
    metricName: 'Campus Sustainability Score',
    category: 'carbon',
    value: 78,
    unit: '% (Grade A-)',
    trendPercentage: 4.2,
    status: 'optimal',
  },
  {
    _id: 'sust_02',
    metricName: 'Electricity Usage',
    category: 'solar',
    value: 12450,
    unit: 'kWh',
    trendPercentage: -8.0,
    status: 'optimal',
  },
  {
    _id: 'sust_03',
    metricName: 'Water Saved via Greywater',
    category: 'water',
    value: 8230,
    unit: 'Litres',
    trendPercentage: 12.5,
    status: 'optimal',
  },
  {
    _id: 'sust_04',
    metricName: 'Circular Waste Diverted',
    category: 'waste',
    value: 480,
    unit: 'kg',
    trendPercentage: 82.0,
    status: 'optimal',
  },
];

export const getMetrics = async () => {
  if (isDbConnected()) {
    try {
      const records = await Sustainability.find().sort({ metricName: 1 });
      if (records && records.length > 0) return records;
    } catch (err) {
      console.warn('[NextCampus EcoCampus] DB query fallback to memory:', err.message);
    }
  }
  return IN_MEMORY_METRICS;
};

export const getSustainabilityMetrics = async () => {
  const metrics = await getMetrics();
  return {
    overallScore: 78,
    energyUsage: 12450,
    waterSaved: 8230,
    wasteDiverted: 480,
    carbonOffset: 88.8,
    metrics,
  };
};

export default { getMetrics, getSustainabilityMetrics };
