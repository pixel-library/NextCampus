import Room from '../models/Room.js';

export const getRooms = async () => {
  return await Room.find().sort({ roomNumber: 1 });
};

export const updateRoomStatus = async (roomId, updateData) => {
  return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
};
