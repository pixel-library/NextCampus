import Sustainability from '../models/Sustainability.js';

export const getMetrics = async () => {
  return await Sustainability.find().sort({ metricName: 1 });
};
