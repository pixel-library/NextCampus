import Location from '../models/Location.js';

const DEMO_LOCATIONS = [
  {
    name: 'Alan Turing Hall (Academic Block A)',
    code: 'turing',
    category: 'academic',
    description: 'School of Computing, AI Labs, and Multi-media Lecture Theatres B-201 to B-208.',
    coordinates: { x: 750, y: 340, floor: 'Floor 2' },
    openingHours: '07:30 AM - 10:00 PM',
    status: 'open',
    contactEmail: 'computing.dept@nextcampus.edu',
    contactPhone: 'Ext: 4821',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
  },
  {
    name: 'Central Campus Library & Knowledge Commons',
    code: 'library',
    category: 'facility',
    description: 'Quiet study zones, high-speed digital research terminals, reserve desks, and thesis archives.',
    coordinates: { x: 290, y: 500, floor: 'Ground Floor' },
    openingHours: 'Open 24/7 with ID',
    status: 'open',
    contactEmail: 'library@nextcampus.edu',
    contactPhone: 'Ext: 1100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q',
  },
  {
    name: 'Ramanujan Science Complex',
    code: 'ramanujan',
    category: 'academic',
    description: 'Applied Physics, Computational Mathematics, and Hardware Prototyping Cleanrooms.',
    coordinates: { x: 1245, y: 260, floor: 'Floor 3' },
    openingHours: '08:00 AM - 09:00 PM',
    status: 'open',
    contactEmail: 'science@nextcampus.edu',
    contactPhone: 'Ext: 4310',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnsBFmdYqr6jHc-tYoJj9aCEEbfKyFo5L3SLupQ0ikKDdXvkE8ZnSUMjdGmIop8z5KCO7QmVOsIqHy9HYbjtta90SqR4wGPlU-2wqtRGDiq5rUGxAyV903zRKjRYWmoztCiNad357-F5wzNP-stQIagLuV-V9RJTr5eWXoeezLsB_Qjl-q6e13GHym0Nopm46ykpFUvv08rbvxuEQW96J72Y2DHoTV7V4NV_eChXmGJjkKxk7Yk9JxWA',
  },
  {
    name: 'Student Activity Center (SAC)',
    code: 'sac',
    category: 'facility',
    description: 'Central cafeteria, student union lounge, club desks, and recreation commons.',
    coordinates: { x: 810, y: 740, floor: 'Ground Floor' },
    openingHours: '07:00 AM - 11:00 PM',
    status: 'open',
    contactEmail: 'sac@nextcampus.edu',
    contactPhone: 'Ext: 2200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
  },
  {
    name: 'Robotics & AI Innovation Hub',
    code: 'robotics',
    category: 'facility',
    description: 'Autonomous Systems, Mechatronics, and Drone Flight Testing Garage.',
    coordinates: { x: 1255, y: 515, floor: 'Floor 1' },
    openingHours: '08:00 AM - 10:00 PM',
    status: 'open',
    contactEmail: 'robotics@nextcampus.edu',
    contactPhone: 'Ext: 5102',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1V6NaAN18Lf9daDEOiUCcg0Qz9TKAJTZEk9ECU3aySgNV_3O2hapiSnHSeUeScEXSjx47TLmk0cx0dsb_ZVA9EORszw3fNNN0V5EICouIgNfcs0lFyeVR0z0-fBJTvFLwabJeDl7KTSnD62my8TfA-M8AVfxPtiTO4SRRFQokqKIaWdLNfZtih4yUWkpusJLlN7f8edtZ98cv56xSSZJgS1akZwa_mq0qR3mAERMOY_rHpGJyiEVsGYmjpP',
  },
];

export const getAllLocations = async (filter = {}) => {
  try {
    const locations = await Location.find(filter).sort({ name: 1 });
    if (locations && locations.length > 0) return locations;
  } catch (err) {
    console.warn('[NextCampus API] DB Query fallback to demo locations.');
  }
  return DEMO_LOCATIONS;
};

export const getLocationByCode = async (code) => {
  try {
    const loc = await Location.findOne({ code });
    if (loc) return loc;
  } catch (err) {
    console.warn('[NextCampus API] DB Query fallback for code:', code);
  }
  return DEMO_LOCATIONS.find((l) => l.code === code) || DEMO_LOCATIONS[0];
};

export const createLocation = async (locationData) => {
  return await Location.create(locationData);
};
