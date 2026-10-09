import Location from '../models/Location.js';

export const getAllLocations = async (filter = {}) => {
  return await Location.find(filter).sort({ name: 1 });
};

export const getLocationByCode = async (code) => {
  return await Location.findOne({ code });
};

export const createLocation = async (locationData) => {
  return await Location.create(locationData);
};
