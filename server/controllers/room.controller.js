import * as roomService from '../services/room.service.js';
import { sendResponse } from '../utils/helpers.js';

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getRooms(req.query);
    return sendResponse(res, 200, true, 'SmartRooms retrieved successfully', rooms);
  } catch (error) {
    next(error);
  }
};

export const handleGetRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return sendResponse(res, 404, false, 'Room not found');
    return sendResponse(res, 200, true, 'SmartRoom retrieved', room);
  } catch (error) {
    next(error);
  }
};

export const handleCreateRoom = async (req, res, next) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    return sendResponse(res, 201, true, 'SmartRoom registered successfully', newRoom);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateRoom = async (req, res, next) => {
  try {
    const updated = await roomService.updateRoomStatus(req.params.id, req.body);
    if (!updated) return sendResponse(res, 404, false, 'SmartRoom not found');
    return sendResponse(res, 200, true, 'SmartRoom status and equipment updated', updated);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteRoom = async (req, res, next) => {
  try {
    const result = await roomService.deleteRoom(req.params.id);
    return sendResponse(res, 200, true, result.message, result);
  } catch (error) {
    next(error);
  }
};

