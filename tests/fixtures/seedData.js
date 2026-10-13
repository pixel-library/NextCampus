/**
 * NextCampus Master Test Fixtures and Initial Seed Data
 */

export const seedUsers = [
  {
    name: 'Rakesh Kumar',
    email: 'rakesh@nextcampus.edu',
    password: 'password123',
    role: 'student',
    studentId: 'MUR2502101',
    department: 'Computer Science & Engineering',
  },
  {
    name: 'Campus Administrator',
    email: 'admin@nextcampus.edu',
    password: 'adminpassword123',
    role: 'admin',
    department: 'Campus Operations',
  },
];

export const seedLocations = [
  {
    name: 'Central Academic Block A',
    code: 'BUILD-A',
    category: 'academic',
    coordinates: { x: 45.2, y: 68.4, floor: '2nd Floor' },
    status: 'open',
  },
  {
    name: 'NextCampus Central Library',
    code: 'LIB-CENTRAL',
    category: 'facility',
    coordinates: { x: 30.1, y: 40.5, floor: 'Ground Floor' },
    status: 'open',
  },
];

export const seedRooms = [
  {
    roomNumber: 'A-201',
    building: 'Central Academic Block A',
    capacity: 60,
    currentOccupancy: 24,
    temperature: 22,
    status: 'occupied',
  },
  {
    roomNumber: 'A-204 (AI Lab)',
    building: 'Central Academic Block A',
    capacity: 35,
    currentOccupancy: 0,
    temperature: 20,
    status: 'available',
  },
];
