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
    return sendResponse(res, 201, true, 'New facility registered in spatial repository', newLocation);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const updated = await campusService.updateLocation(req.params.id, req.body);
    if (!updated) {
      return sendResponse(res, 404, false, 'Campus facility not found');
    }
    return sendResponse(res, 200, true, 'Campus facility updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (req, res, next) => {
  try {
    const cascade = req.query.cascade === 'true' || req.body.cascade === true;
    const result = await campusService.deleteLocation(req.params.id, cascade);
    if (result.conflict) {
      return res.status(409).json({
        success: false,
        conflict: true,
        dependentCount: result.dependentCount,
        buildingName: result.buildingName,
        message: result.message,
      });
    }
    return sendResponse(res, 200, true, result.message, result);
  } catch (error) {
    next(error);
  }
};

