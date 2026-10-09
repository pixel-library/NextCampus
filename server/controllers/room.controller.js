import * as roomService from '../services/room.service.js';
import { sendResponse } from '../utils/helpers.js';

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getRooms();
    return sendResponse(res, 200, true, 'SmartRooms retrieved successfully', rooms);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateRoom = async (req, res, next) => {
  try {
    const updated = await roomService.updateRoomStatus(req.params.id, req.body);
    return sendResponse(res, 200, true, 'SmartRoom status updated', updated);
  } catch (error) {
    next(error);
  }
};
