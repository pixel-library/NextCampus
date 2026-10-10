import mongoose from 'mongoose';
import Location from '../models/Location.js';
import Room from '../models/Room.js';
import * as roomService from './room.service.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

let IN_MEMORY_LOCATIONS = [
  {

    _id: 'loc_a01',
    name: 'Alan Turing Hall',
    code: 'A-01',
    category: 'academic',
    precinct: 'North Quadrangle',
    totalFloors: 4,
    departments: ['School of Computing', 'Autonomous Systems', 'Robotics', 'AI Lab', 'Data Sci'],
    grossFloorArea: 14200,
    cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
    commissionedYear: 2021,
    powerSubstation: 'West 11kV',
    loadPercentage: 84,
    description: 'School of Computing, AI Labs, and Multi-media Lecture Theatres B-201 to B-208.',
    coordinates: { x: 750, y: 340, floor: 'Level 2' },
    openingHours: '07:30 AM - 10:00 PM',
    status: 'open',
    contactEmail: 'computing.dept@nextcampus.edu',
    contactPhone: 'Ext: 4821',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
    floors: [
      { floorNumber: 'Level 2', name: 'Cybernetics & High-Perf Computing', cadVersion: 'CAD v2.4', roomsCount: 16 },
      { floorNumber: 'Level 1', name: 'Undergraduate Laboratories & Dean’s Office', cadVersion: 'CAD v2.2', roomsCount: 14 },
      { floorNumber: 'Level 3', name: 'Faculty Research Suites & AI Incubator', cadVersion: 'CAD v2.1', roomsCount: 12 },
      { floorNumber: 'Ground Floor', name: 'Foyer, Atrium & Cafe Hub', cadVersion: 'CAD v2.0', roomsCount: 8 },
    ],
  },
  {
    _id: 'loc_b02',
    name: 'Central Campus Library',
    code: 'B-02',
    category: 'facility',
    precinct: 'East Residential Commons',
    totalFloors: 3,
    departments: ['Library Services', 'Digital Archives', 'Scholar Hub', 'Quiet Study'],
    grossFloorArea: 18600,
    cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
    commissionedYear: 2019,
    powerSubstation: 'East 11kV',
    loadPercentage: 91,
    description: 'Quiet study zones, high-speed digital research terminals, reserve desks, and thesis archives.',
    coordinates: { x: 290, y: 500, floor: 'Ground Floor' },
    openingHours: 'Open 24/7 with ID',
    status: 'open',
    contactEmail: 'library@nextcampus.edu',
    contactPhone: 'Ext: 1100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q',
    floors: [
      { floorNumber: 'Ground Floor', name: 'Main Circulation & Cafe', cadVersion: 'CAD v3.0', roomsCount: 10 },
      { floorNumber: 'Floor 1', name: 'Monograph Stacks & Reading Rooms', cadVersion: 'CAD v3.0', roomsCount: 12 },
      { floorNumber: 'Floor 2', name: 'Digital Scholar Labs & Media Pods', cadVersion: 'CAD v3.1', roomsCount: 6 },
    ],
  },
  {
    _id: 'loc_c03',
    name: 'Ramanujan Science Complex',
    code: 'C-03',
    category: 'academic',
    precinct: 'South Tech Precinct',
    totalFloors: 5,
    departments: ['Physics & Materials', 'Photonics', 'Nano-fab', 'Chemistry'],
    grossFloorArea: 26400,
    cadSchema: 'Manual DXF / DWG Upload',
    commissionedYear: 2018,
    powerSubstation: 'South Sub-02',
    loadPercentage: 76,
    description: 'Applied Physics, Computational Mathematics, and Hardware Prototyping Cleanrooms.',
    coordinates: { x: 1245, y: 260, floor: 'Floor 3' },
    openingHours: '08:00 AM - 09:00 PM',
    status: 'open',
    contactEmail: 'science@nextcampus.edu',
    contactPhone: 'Ext: 4310',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnsBFmdYqr6jHc-tYoJj9aCEEbfKyFo5L3SLupQ0ikKDdXvkE8ZnSUMjdGmIop8z5KCO7QmVOsIqHy9HYbjtta90SqR4wGPlU-2wqtRGDiq5rUGxAyV903zRKjRYWmoztCiNad357-F5wzNP-stQIagLuV-V9RJTr5eWXoeezLsB_Qjl-q6e13GHym0Nopm46ykpFUvv08rbvxuEQW96J72Y2DHoTV7V4NV_eChXmGJjkKxk7Yk9JxWA',
    floors: [
      { floorNumber: 'Basement', name: 'Cryogenics & Heavy Optics', cadVersion: 'CAD v1.9', roomsCount: 8 },
      { floorNumber: 'Floor 1', name: 'Applied Chemistry Suites', cadVersion: 'CAD v1.9', roomsCount: 14 },
      { floorNumber: 'Floor 2', name: 'Micro-Fluidics & Nano-Fab', cadVersion: 'CAD v2.0', roomsCount: 12 },
      { floorNumber: 'Floor 3', name: 'Theoretical Physics Center', cadVersion: 'CAD v2.0', roomsCount: 12 },
      { floorNumber: 'Floor 4', name: 'Post-Doctoral Cleanrooms', cadVersion: 'CAD v2.1', roomsCount: 10 },
    ],
  },
  {
    _id: 'loc_d04',
    name: 'Student Union & Dining Hub',
    code: 'D-04',
    category: 'facility',
    precinct: 'North Quadrangle',
    totalFloors: 2,
    departments: ['Student Affairs', 'Governance', 'Wellbeing', 'Student Union'],
    grossFloorArea: 9800,
    cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
    commissionedYear: 2022,
    powerSubstation: 'North 11kV',
    loadPercentage: 68,
    description: 'Central cafeteria, student union lounge, club desks, and recreation commons.',
    coordinates: { x: 810, y: 740, floor: 'Ground Floor' },
    openingHours: '07:00 AM - 11:00 PM',
    status: 'open',
    contactEmail: 'sac@nextcampus.edu',
    contactPhone: 'Ext: 2200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
    floors: [
      { floorNumber: 'Ground Floor', name: 'Main Food Hall & Event Stage', cadVersion: 'CAD v1.4', roomsCount: 8 },
      { floorNumber: 'Floor 1', name: 'Clubs & Societies Offices', cadVersion: 'CAD v1.4', roomsCount: 10 },
    ],
  },
  {
    _id: 'loc_m05',
    name: 'Medical & Clinical Sciences Hub',
    code: 'M-05',
    category: 'academic',
    precinct: 'West Innovation District',
    totalFloors: 4,
    departments: ['Health Sciences', 'Bio-Informatics', 'Nursing Sim', 'Clinical Skills'],
    grossFloorArea: 21100,
    cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
    commissionedYear: 2023,
    powerSubstation: 'West Sub-01',
    loadPercentage: 80,
    description: 'Simulation Theatres, Anatomy Lab, and Virtual Surgical Demonstration Suites.',
    coordinates: { x: 1255, y: 515, floor: 'Floor 1' },
    openingHours: '08:00 AM - 10:00 PM',
    status: 'open',
    contactEmail: 'clinical@nextcampus.edu',
    contactPhone: 'Ext: 5102',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1V6NaAN18Lf9daDEOiUCcg0Qz9TKAJTZEk9ECU3aySgNV_3O2hapiSnHSeUeScEXSjx47TLmk0cx0dsb_ZVA9EORszw3fNNN0V5EICouIgNfcs0lFyeVR0z0-fBJTvFLwabJeDl7KTSnD62my8TfA-M8AVfxPtiTO4SRRFQokqKIaWdLNfZtih4yUWkpusJLlN7f8edtZ98cv56xSSZJgS1akZwa_mq0qR3mAERMOY_rHpGJyiEVsGYmjpP',
    floors: [
      { floorNumber: 'Ground Floor', name: 'Outpatient Simulation & Reception', cadVersion: 'CAD v1.0', roomsCount: 10 },
      { floorNumber: 'Floor 1', name: 'Intensive Care Skills Laboratory', cadVersion: 'CAD v1.0', roomsCount: 12 },
      { floorNumber: 'Floor 2', name: 'Virtual Surgical Observation Suite', cadVersion: 'CAD v1.0', roomsCount: 10 },
      { floorNumber: 'Floor 3', name: 'Bio-Informatics High-Compute Center', cadVersion: 'CAD v1.0', roomsCount: 8 },
    ],
  },
];

export const getAllLocations = async (filter = {}) => {
  try {
    const mongoFilter = {};
    if (filter.category && filter.category !== 'all') mongoFilter.category = filter.category;
    if (filter.status && filter.status !== 'all') mongoFilter.status = filter.status;

    const locations = await Location.find(mongoFilter).sort({ name: 1 });
    if (locations && locations.length > 0) return locations;
  } catch (err) {
    console.warn('[NextCampus API] DB Query fallback to demo locations:', err.message);
  }

  let results = [...IN_MEMORY_LOCATIONS];
  if (filter.category && filter.category !== 'all') {
    results = results.filter((l) => l.category === filter.category);
  }
  if (filter.status && filter.status !== 'all') {
    results = results.filter((l) => l.status === filter.status);
  }
  return results;
};

export const getLocationByCode = async (codeOrId) => {
  try {
    let loc = await Location.findOne({ code: codeOrId });
    if (!loc) loc = await Location.findById(codeOrId);
    if (loc) return loc;
  } catch (err) {
    console.warn('[NextCampus API] DB Query fallback for codeOrId:', codeOrId);
  }
  return (
    IN_MEMORY_LOCATIONS.find((l) => l.code === codeOrId || l._id === codeOrId) ||
    IN_MEMORY_LOCATIONS[0]
  );
};

export const createLocation = async (locationData) => {
  const code = (locationData.code || '').trim().toUpperCase();
  if (!code) throw new Error('Building code is required');
  if (!locationData.name) throw new Error('Building name is required');

  const formatted = {
    ...locationData,
    code,
    totalFloors: Number(locationData.totalFloors) || 4,
    grossFloorArea: Number(locationData.grossFloorArea) || 15000,
    departments: Array.isArray(locationData.departments)
      ? locationData.departments
      : typeof locationData.departments === 'string'
      ? locationData.departments.split(',').map((d) => d.trim()).filter(Boolean)
      : [],
    floors: locationData.floors || [
      { floorNumber: 'Level 2', name: 'Academic Labs', cadVersion: 'CAD v2.0', roomsCount: 12 },
      { floorNumber: 'Level 1', name: 'Lecture Halls', cadVersion: 'CAD v2.0', roomsCount: 10 },
      { floorNumber: 'Ground Floor', name: 'Atrium & Offices', cadVersion: 'CAD v2.0', roomsCount: 8 },
    ],
  };

  try {
    const created = await Location.create(formatted);
    if (created) {
      IN_MEMORY_LOCATIONS.push(created.toObject ? created.toObject() : created);
      return created;
    }
  } catch (err) {
    console.warn('[NextCampus API] DB Create fallback:', err.message);
  }

  const memoryBuilding = { ...formatted, _id: `bld_${Date.now()}` };
  IN_MEMORY_LOCATIONS.push(memoryBuilding);
  return memoryBuilding;
};

export const updateLocation = async (idOrCode, updateData) => {
  try {
    let updated = await Location.findByIdAndUpdate(idOrCode, updateData, { new: true });
    if (!updated) {
      updated = await Location.findOneAndUpdate({ code: idOrCode }, updateData, { new: true });
    }
    if (updated) return updated;
  } catch (err) {
    console.warn('[NextCampus API] DB Update fallback for ID:', idOrCode);
  }

  const index = IN_MEMORY_LOCATIONS.findIndex((l) => l._id === idOrCode || l.code === idOrCode);
  if (index !== -1) {
    IN_MEMORY_LOCATIONS[index] = { ...IN_MEMORY_LOCATIONS[index], ...updateData };
    return IN_MEMORY_LOCATIONS[index];
  }
  return null;
};

/**
 * Delete a building/facility safely.
 * Checks for dependent rooms. If rooms exist and cascade is false, rejects deletion.
 */
export const deleteLocation = async (idOrCode, cascade = false) => {
  const building = await getLocationByCode(idOrCode);
  if (!building) {
    throw new Error('Building not found');
  }

  // Count dependent rooms referencing this building
  let dependentRoomsCount = 0;
  if (isDbConnected()) {
    try {
      dependentRoomsCount = await Room.countDocuments({
        $or: [{ building: building.name }, { buildingCode: building.code }],
      });
    } catch (err) {
      console.warn('[NextCampus API] Room count DB fallback');
    }
  } else {
    const allRooms = await roomService.getRooms();
    dependentRoomsCount = allRooms.filter(
      (r) => r.buildingCode === building.code || r.building === building.name
    ).length;
  }

  if (dependentRoomsCount > 0 && !cascade) {
    return {
      success: false,
      conflict: true,
      dependentCount: dependentRoomsCount,
      buildingName: building.name,
      message: `Cannot delete building "${building.name}": ${dependentRoomsCount} dependent room(s) are registered in this facility. Please reassign rooms or confirm cascade deletion.`,
    };
  }

  // Cascade deletion if requested
  if (dependentRoomsCount > 0 && cascade) {
    if (isDbConnected()) {
      try {
        await Room.deleteMany({
          $or: [{ building: building.name }, { buildingCode: building.code }],
        });
      } catch (err) {
        console.warn('[NextCampus API] Cascade room deletion DB fallback');
      }
    } else {
      const allRooms = await roomService.getRooms();
      for (const r of allRooms) {
        if (r.buildingCode === building.code || r.building === building.name) {
          await roomService.deleteRoom(r._id || r.roomNumber);
        }
      }
    }
  }

  // Delete building record
  if (isDbConnected()) {
    try {
      await Location.deleteOne({
        $or: [{ _id: building._id }, { code: building.code }],
      });
    } catch (err) {
      console.warn('[NextCampus API] Delete location DB fallback');
    }
  }


  IN_MEMORY_LOCATIONS = IN_MEMORY_LOCATIONS.filter(
    (l) => l.code !== building.code && l._id !== building._id
  );

  return {
    success: true,
    message: `Building "${building.name}" and ${cascade ? dependentRoomsCount : 0} dependent records successfully removed.`,
    deletedRooms: cascade ? dependentRoomsCount : 0,
  };
};

