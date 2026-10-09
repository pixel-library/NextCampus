import * as campusService from '../services/campus.service.js';
import { sendResponse } from '../utils/helpers.js';

export const getLocations = async (req, res, next) => {
  try {
    const locations = await campusService.getAllLocations(req.query);
    return sendResponse(res, 200, true, 'Campus locations retrieved successfully', locations);
  } catch (error) {
    next(error);
  }
};

export const getLocationDetails = async (req, res, next) => {
  try {
    const location = await campusService.getLocationByCode(req.params.code);
    if (!location) {
      return sendResponse(res, 404, false, 'Campus location not found');
    }
    return sendResponse(res, 200, true, 'Location details retrieved', location);
  } catch (error) {
    next(error);
  }
};

export const addLocation = async (req, res, next) => {
  try {
    const newLocation = await campusService.createLocation(req.body);
    return sendResponse(res, 201, true, 'New location added to campus map', newLocation);
  } catch (error) {
    next(error);
  }
};
