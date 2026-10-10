import mongoose from 'mongoose';
import Room from '../models/Room.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

let IN_MEMORY_ROOMS = [
  {
    _id: 'rm_b204',
    roomNumber: 'B-204',
    name: 'Multi-Media Lecture Theatre',
    building: 'Alan Turing Hall',
    buildingCode: 'A-01',
    floor: 'Level 2',
    type: 'Multi-Media Theatre',
    capacity: 60,
    currentOccupancy: 18,
    temperature: 21.8,
    lightingStatus: 'on',
    status: 'occupied',
    features: ['Dual 4K Laser Projector', 'CO2 & Air Quality', 'NFC Smart Lock', 'Spatial Mic Array', 'Motorized Lectern'],
    timetableRule: 'Automated live lock sync via University Timetable Core API',
  },
  {
    _id: 'rm_b208',
    roomNumber: 'B-208',
    name: 'Autonomous Robotics Lab',
    building: 'Alan Turing Hall',
    buildingCode: 'A-01',
    floor: 'Level 2',
    type: 'Autonomous Robotics Lab',
    capacity: 30,
    currentOccupancy: 30,
    temperature: 20.5,
    lightingStatus: 'on',
    status: 'occupied',
    features: ['ROS2 Rigs', 'Motion Capture', 'Workstations', 'NFC Smart Lock', 'High-Amperage 3-Phase'],
    timetableRule: 'Automated live lock sync via University Timetable Core API',
  },
  {
    _id: 'rm_b212',
    roomNumber: 'B-212',
    name: 'Quiet Team Study Pod',
    building: 'Alan Turing Hall',
    buildingCode: 'A-01',
    floor: 'Level 2',
    type: 'Quiet Team Study Pod',
    capacity: 8,
    currentOccupancy: 0,
    temperature: 22.0,
    lightingStatus: 'on',
    status: 'available',
    features: ['65" Touch Display', 'Polycom Suite', 'NFC Smart Lock', 'Acoustic Glass Walls'],
    timetableRule: 'Automated live lock sync via University Timetable Core API',
  },
  {
    _id: 'rm_b203',
    roomNumber: 'B-203',
    name: 'Distributed Systems Lab',
    building: 'Alan Turing Hall',
    buildingCode: 'A-01',
    floor: 'Level 2',
    type: 'Computer Labs',
    capacity: 40,
    currentOccupancy: 10,
    temperature: 20.4,
    lightingStatus: 'on',
    status: 'available',
    features: ['30x RTX 4090 AI Workstations', '10GbE Fiber Drop', 'Dual OLED Monitors', 'Smart Access Control'],
    timetableRule: 'Automated live lock sync via University Timetable Core API',
  },
  {
    _id: 'rm_b201',
    roomNumber: 'B-201',
    name: 'Large Amphitheatre',
    building: 'Alan Turing Hall',
    buildingCode: 'A-01',
    floor: 'Level 2',
    type: 'Lecture Theatres',
    capacity: 120,
    currentOccupancy: 120,
    temperature: 23.1,
    lightingStatus: 'on',
    status: 'occupied',
    features: ['Tiered Acoustic Seating', 'Dual 4K Laser Projectors', 'Surround Broadcast Mics', 'ADA Hearing Loop'],
    timetableRule: 'Automated live lock sync via University Timetable Core API',
  },
  {
    _id: 'rm_lib101',
    roomNumber: 'LIB-101',
    name: 'Main Reading Room',
    building: 'Central Campus Library',
    buildingCode: 'B-02',
    floor: 'Floor 1',
    type: 'Quiet Study Pod',
    capacity: 80,
    currentOccupancy: 50,
    temperature: 21.0,
    lightingStatus: 'on',
    status: 'available',
    features: ['Silent Zone', 'Individual Power Pods', 'Air Quality Sensor', 'High-Speed Wi-Fi 7'],
    timetableRule: 'Open 24/7 Access with ID Card',
  },
  {
    _id: 'rm_c302',
    roomNumber: 'RMN-302',
    name: 'Materials Characterization Studio',
    building: 'Ramanujan Science Complex',
    buildingCode: 'C-03',
    floor: 'Floor 3',
    type: 'STEM & Cleanroom Labs',
    capacity: 25,
    currentOccupancy: 15,
    temperature: 19.5,
    lightingStatus: 'on',
    status: 'available',
    features: ['Cleanroom Grade ISO-6', 'Air Shower Airlock', 'Spectrometer Terminal', 'Emergency Exhaust'],
    timetableRule: 'Restricted Keycard Authorization Only',
  },
];

export const getRooms = async (filter = {}) => {
  if (isDbConnected()) {
    try {
      const mongoFilter = {};
      if (filter.building && filter.building !== 'all') {
        mongoFilter.$or = [
          { building: new RegExp(filter.building, 'i') },
          { buildingCode: new RegExp(filter.building, 'i') },
        ];
      }
      if (filter.floor && filter.floor !== 'all') {
        mongoFilter.floor = filter.floor;
      }
      if (filter.status && filter.status !== 'all') {
        mongoFilter.status = filter.status;
      }

      const rooms = await Room.find(mongoFilter).sort({ roomNumber: 1 });
      if (rooms && rooms.length > 0) return rooms;
    } catch (err) {
      console.warn('[NextCampus Room API] DB query fallback to in-memory rooms:', err.message);
    }
  }

  let results = [...IN_MEMORY_ROOMS];
  if (filter.building && filter.building !== 'all') {
    const q = filter.building.toLowerCase();
    results = results.filter(
      (r) =>
        r.building.toLowerCase().includes(q) ||
        (r.buildingCode && r.buildingCode.toLowerCase().includes(q))
    );
  }
  if (filter.floor && filter.floor !== 'all') {
    results = results.filter((r) => r.floor.toLowerCase() === filter.floor.toLowerCase());
  }
  if (filter.status && filter.status !== 'all') {
    results = results.filter((r) => r.status === filter.status);
  }
  return results;
};

export const getRoomById = async (roomId) => {
  if (isDbConnected()) {
    try {
      let room = await Room.findById(roomId);
      if (!room) room = await Room.findOne({ roomNumber: roomId });
      if (room) return room;
    } catch (err) {
      console.warn('[NextCampus Room API] DB query fallback for room:', roomId);
    }
  }
  return IN_MEMORY_ROOMS.find((r) => r._id === roomId || r.roomNumber === roomId) || null;
};

export const createRoom = async (roomData) => {
  if (!roomData.roomNumber) throw new Error('Room Number is required');
  if (!roomData.building) throw new Error('Building is required');
  if (!roomData.capacity || Number(roomData.capacity) <= 0) {
    throw new Error('Valid seating capacity is required');
  }

  const formatted = {
    ...roomData,
    roomNumber: roomData.roomNumber.trim().toUpperCase(),
    capacity: Number(roomData.capacity),
    features: Array.isArray(roomData.features)
      ? roomData.features
      : typeof roomData.features === 'string'
      ? roomData.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [],
    status: roomData.status || 'available',
  };

  if (isDbConnected()) {
    try {
      const created = await Room.create(formatted);
      if (created) {
        IN_MEMORY_ROOMS.push(created.toObject ? created.toObject() : created);
        return created;
      }
    } catch (err) {
      console.warn('[NextCampus Room API] DB Create fallback:', err.message);
    }
  }

  const memoryRoom = { ...formatted, _id: `rm_${Date.now()}` };
  IN_MEMORY_ROOMS.push(memoryRoom);
  return memoryRoom;
};

export const updateRoomStatus = async (roomId, updateData) => {
  if (isDbConnected()) {
    try {
      let updated = await Room.findByIdAndUpdate(roomId, updateData, { new: true });
      if (!updated) {
        updated = await Room.findOneAndUpdate({ roomNumber: roomId }, updateData, { new: true });
      }
      if (updated) return updated;
    } catch (err) {
      console.warn('[NextCampus Room API] DB Update fallback for room:', roomId);
    }
  }

  const index = IN_MEMORY_ROOMS.findIndex((r) => r._id === roomId || r.roomNumber === roomId);
  if (index !== -1) {
    IN_MEMORY_ROOMS[index] = { ...IN_MEMORY_ROOMS[index], ...updateData };
    return IN_MEMORY_ROOMS[index];
  }
  return null;
};

export const deleteRoom = async (roomId) => {
  if (isDbConnected()) {
    try {
      await Room.deleteOne({
        $or: [{ _id: roomId }, { roomNumber: roomId }],
      });
    } catch (err) {
      console.warn('[NextCampus Room API] DB Delete fallback for room:', roomId);
    }
  }

  const target = IN_MEMORY_ROOMS.find((r) => r._id === roomId || r.roomNumber === roomId);
  IN_MEMORY_ROOMS = IN_MEMORY_ROOMS.filter((r) => r._id !== roomId && r.roomNumber !== roomId);

  return {
    success: true,
    message: `Room ${target ? target.roomNumber : roomId} deleted successfully.`,
  };
};


