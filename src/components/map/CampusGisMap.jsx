import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Navigation,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Crosshair,
  Layers,
  Building,
  Maximize2,
  Target,
  Locate,
  Info,
  Shield,
  Check,
  X,
  Footprints,
} from 'lucide-react';

// Exact Centroid of Mewar University, Gangrar, Chittorgarh (Rajasthan, India)
export const DEFAULT_CAMPUS_CENTER = [25.03215, 74.63616];

// Strict Campus Bounds
export const MEWAR_CAMPUS_BOUNDS = [
  [25.0270, 74.6320], // SW near NH-48 / Gangrar bypass
  [25.0375, 74.6410], // NE corner of campus grounds
];

// Tile Layer Configurations with maxNativeZoom protection:
// Esri World Imagery native satellite resolution ends at z=18 for this region.
// Without maxNativeZoom: 18, Leaflet requests non-existent z=19 tiles, causing Esri to return
// gray "Map data not yet available" placeholder tiles.
// With maxNativeZoom: 18 and maxZoom: 20, Leaflet requests z=18 tiles and upscales them smoothly.
export const TILE_LAYER_CONFIGS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 20,
      maxNativeZoom: 18,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    },
  },
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: {
      maxZoom: 20,
      maxNativeZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
};

export const createTileLayer = (style = 'satellite') => {
  const config = TILE_LAYER_CONFIGS[style] || TILE_LAYER_CONFIGS.satellite;
  return L.tileLayer(config.url, config.options);
};


// Official Campus Perimeter Boundary Polygon (OSM Way 549126310)
export const MEWAR_PERIMETER_POLYGON = [
  [25.029613, 74.636170],
  [25.029463, 74.638219],
  [25.033063, 74.636971],
  [25.033155, 74.636513],
  [25.034842, 74.636185],
  [25.034717, 74.634102],
  [25.033614, 74.634549],
  [25.033475, 74.634605],
  [25.033382, 74.634643],
  [25.029613, 74.636170],
];

// Authentic Mewar University Internal Walkways & Road Network
export const MEWAR_CAMPUS_ROADS = [
  // West Avenue (Gate 1 past Main Building to Gate 2, Guest House & Mira Hostel)
  [
    [25.031920, 74.635280], // Gate 1 (NH-48 entrance portal)
    [25.032315, 74.635262],
    [25.033008, 74.634981],
    [25.033480, 74.634600], // Gate 2 (West Entry portal)
    [25.033780, 74.634550], // Guest House
    [25.034085, 74.634523], // Mira Hostel
    [25.034450, 74.634320], // Panna Hostel
  ],
  // Central Promenade (Gate 1 to Main Building, Mess, Law Building & Courts)
  [
    [25.031920, 74.635280], // Gate 1
    [25.032173, 74.636267],
    [25.032130, 74.636623], // Mess
    [25.031866, 74.637113], // Law Building
    [25.031342, 74.637242], // Basketball Ground
  ],
  // Academic Promenade to Engineering, Teacher Building & Badal Hostel
  [
    [25.032173, 74.636267],
    [25.032631, 74.636545], // Engineering Building
    [25.032655, 74.636881], // Teacher Building
    [25.032382, 74.637010], // Badal Hostel
    [25.031866, 74.637113], // Law Building Link
  ],
  // Park & Hostels Pathway (Main Building to Park, Kumbha, Pratap, Gora & Hospital)
  [
    [25.032981, 74.635483], // Main Building
    [25.033592, 74.636105], // Pratap Hostel
    [25.033814, 74.636040], // Kumbha Hostel
    [25.033968, 74.635239], // Campus Park
    [25.034447, 74.635065], // Gora Hostel
    [25.034600, 74.634840], // Campus Hospital
  ],
  // East Living Quad (Kumbha to Sanaga & Bhamasha)
  [
    [25.033814, 74.636040],
    [25.034287, 74.635706], // Bhamasha Hostel
    [25.034645, 74.635783], // Sanaga Hostel
  ],
  // Athletic Track (Gate 1 to Football Ground)
  [
    [25.031920, 74.635280], // Gate 1
    [25.031526, 74.636104], // Football Ground
  ],
];

// Official Real-World Buildings & Footprints of Mewar University, Gangrar
// Accurate annotations matching campus satellite landmarks and user ground-truth
export const CAMPUS_GIS_LOCATIONS = {
  gate: {
    id: 'gate',
    code: 'GATE-01',
    name: 'Main Campus Gate 1 (NH-48)',
    shortName: 'Gate 1',
    category: 'facility',
    color: '#142D28',
    bgColor: '#EAF5EF',
    icon: '🚪',
    lat: 25.031920,
    lng: 74.635280,
    polygon: [
      [25.032000, 74.635200],
      [25.032040, 74.635320],
      [25.031860, 74.635360],
      [25.031820, 74.635240],
      [25.032000, 74.635200],
    ],
    dept: 'NH-48 Campus Entrance & Security Post',
    elevation: 'Ground Level',
    description: 'Primary ceremonial entrance on NH-48 near Gangrar, automated RFID student verification barrier, and 24/7 security outpost.',
  },
  gate2: {
    id: 'gate2',
    code: 'GATE-02',
    name: 'Campus Gate 2 (West Entry)',
    shortName: 'Gate 2',
    category: 'facility',
    color: '#142D28',
    bgColor: '#EAF5EF',
    icon: '🚪',
    lat: 25.033480,
    lng: 74.634600,
    polygon: [
      [25.033560, 74.634520],
      [25.033590, 74.634660],
      [25.033400, 74.634700],
      [25.033370, 74.634560],
      [25.033560, 74.634520],
    ],
    dept: 'West Perimeter Vehicle & Pedestrian Entrance',
    elevation: 'Ground Level',
    description: 'Western entrance portal on the perimeter boundary providing direct access towards Guest House, Mira Hostel, and Campus Park.',
  },
  main: {
    id: 'main',
    code: 'MAIN-01',
    name: 'Main Academic & Administrative Building',
    shortName: 'Main Building',
    category: 'academic',
    color: '#168567',
    bgColor: '#EAF5EF',
    icon: '🏛️',
    lat: 25.032981,
    lng: 74.635483,
    polygon: [
      [25.032106, 74.635761],
      [25.032289, 74.636310],
      [25.033596, 74.635780],
      [25.033582, 74.635744],
      [25.033633, 74.635720],
      [25.033585, 74.635569],
      [25.033532, 74.635595],
      [25.033518, 74.635557],
      [25.033564, 74.635537],
      [25.033499, 74.635359],
      [25.033556, 74.635335],
      [25.033512, 74.635205],
      [25.033455, 74.635231],
      [25.033425, 74.635140],
      [25.033319, 74.635185],
      [25.033330, 74.635216],
      [25.032948, 74.635358],
      [25.032906, 74.635234],
      [25.032798, 74.635271],
      [25.032770, 74.635160],
      [25.032661, 74.635208],
      [25.032697, 74.635314],
      [25.032599, 74.635356],
      [25.032641, 74.635486],
      [25.032265, 74.635633],
      [25.032251, 74.635602],
      [25.032138, 74.635646],
      [25.032173, 74.635739],
      [25.032106, 74.635761],
    ],
    dept: 'University Secretariat, Admissions & Administrative Council',
    elevation: 'Floors 1–4',
    description: 'Central university flagship administrative and academic complex with expansive solar rooftop arrays, registrar office, accounts, and examination branch.',
  },
  eng: {
    id: 'eng',
    code: 'ENG-02',
    name: 'Faculty of Engineering & Technology',
    shortName: 'Engineering Building',
    category: 'academic',
    color: '#168567',
    bgColor: '#EAF5EF',
    icon: '💻',
    lat: 25.032631,
    lng: 74.636545,
    polygon: [
      [25.032309, 74.636451],
      [25.032871, 74.636231],
      [25.032939, 74.636443],
      [25.032755, 74.636515],
      [25.032761, 74.636535],
      [25.032837, 74.636505],
      [25.032885, 74.636655],
      [25.032540, 74.636790],
      [25.032492, 74.636641],
      [25.032569, 74.636611],
      [25.032562, 74.636589],
      [25.032377, 74.636662],
      [25.032309, 74.636451],
    ],
    dept: 'Department of Computer Science & Engineering, AI Labs & Core Tech',
    elevation: 'Floors 1–4',
    description: 'High-performance research computing labs, AI & ML center, IoT workstations, mechanical & civil workshops directly east of Main Building.',
  },
  teacher: {
    id: 'teacher',
    code: 'FAC-01',
    name: 'Teachers & Faculty Academic Building',
    shortName: 'Teacher Building',
    category: 'academic',
    color: '#4338CA',
    bgColor: '#EEF2FF',
    icon: '👨‍🏫',
    lat: 25.032655,
    lng: 74.636881,
    polygon: [
      [25.032732, 74.636672],
      [25.032849, 74.636961],
      [25.032577, 74.637090],
      [25.032460, 74.636801],
      [25.032732, 74.636672],
    ],
    dept: 'Faculty Chambers, Research Scholars & HOD Offices',
    elevation: 'Floors 1–3',
    description: 'Northern academic staff wing situated east of Engineering Building, housing professors consultation cabins, conference rooms, and faculty offices.',
  },
  badal: {
    id: 'badal',
    code: 'HST-08',
    name: 'Badal Boys Residential Hostel',
    shortName: 'Badal Hostel',
    category: 'facility',
    color: '#3478B8',
    bgColor: '#EEF5FA',
    icon: '🛏️',
    lat: 25.032382,
    lng: 74.637010,
    polygon: [
      [25.032460, 74.636801],
      [25.032577, 74.637090],
      [25.032305, 74.637219],
      [25.032188, 74.636929],
      [25.032460, 74.636801],
    ],
    dept: 'Male Student Residence (East Campus Wing)',
    elevation: '3 Floors',
    description: 'Southern residence block situated east of Engineering Building and directly below Teacher Building with furnished study units.',
  },
  mess: {
    id: 'mess',
    code: 'MSS-01',
    name: 'Central Student Dining Mess',
    shortName: 'Mess',
    category: 'facility',
    color: '#D97706',
    bgColor: '#FFF7ED',
    icon: '🍽️',
    lat: 25.032130,
    lng: 74.636623,
    polygon: [
      [25.032150, 74.636408],
      [25.032255, 74.636748],
      [25.032229, 74.636758],
      [25.032220, 74.636730],
      [25.032003, 74.636811],
      [25.031907, 74.636499],
      [25.032150, 74.636408],
    ],
    dept: 'Central Campus Catering & Dining Services',
    elevation: 'Ground + Floor 1',
    description: 'Spacious light-roof student dining hall located south of Engineering Building and northwest of Law Building serving breakfast, lunch, and dinner.',
  },
  law: {
    id: 'law',
    code: 'LAW-01',
    name: 'Faculty of Law & Legal Studies',
    shortName: 'Law Building',
    category: 'academic',
    color: '#142D28',
    bgColor: '#EAF5EF',
    icon: '⚖️',
    lat: 25.031866,
    lng: 74.637113,
    polygon: [
      [25.032024, 74.636908],
      [25.032108, 74.637178],
      [25.032022, 74.637210],
      [25.032002, 74.637145],
      [25.031927, 74.637173],
      [25.031948, 74.637243],
      [25.031854, 74.637278],
      [25.031836, 74.637219],
      [25.031764, 74.637246],
      [25.031782, 74.637305],
      [25.031695, 74.637338],
      [25.031611, 74.637065],
      [25.031694, 74.637034],
      [25.031713, 74.637095],
      [25.031790, 74.637066],
      [25.031772, 74.637007],
      [25.031858, 74.636975],
      [25.031876, 74.637034],
      [25.031956, 74.637003],
      [25.031937, 74.636941],
      [25.032024, 74.636908],
    ],
    dept: 'Department of Law, Moot Court Hall & Legal Aid Clinic',
    elevation: 'Floors 1–3',
    description: 'Dedicated multi-wing law faculty located southeast of the Mess with moot court chambers and legal research library.',
  },
  football: {
    id: 'football',
    code: 'SPT-01',
    name: 'University Football Ground & Arena',
    shortName: 'Football Ground',
    category: 'facility',
    color: '#047857',
    bgColor: '#ECFDF5',
    icon: '⚽',
    lat: 25.031526,
    lng: 74.636104,
    polygon: [
      [25.032118, 74.636237],
      [25.031880, 74.635493],
      [25.031024, 74.635826],
      [25.031115, 74.636112],
      [25.031164, 74.636255],
      [25.031262, 74.636571],
      [25.032118, 74.636237],
    ],
    dept: 'Department of Physical Education & Athletics',
    elevation: 'Sports Arena',
    description: 'Expansive green athletic ground located west of the Mess and south of Main Building with running tracks and spectator lawns.',
  },
  basketball: {
    id: 'basketball',
    code: 'SPT-02',
    name: 'Basketball & Outdoor Sports Court',
    shortName: 'Basketball Ground',
    category: 'facility',
    color: '#E11D48',
    bgColor: '#FFF1F2',
    icon: '🏀',
    lat: 25.031342,
    lng: 74.637242,
    polygon: [
      [25.031203, 74.637207],
      [25.031265, 74.637405],
      [25.031551, 74.637295],
      [25.031489, 74.637097],
      [25.031203, 74.637207],
    ],
    dept: 'Department of Physical Education & Court Sports',
    elevation: 'Hard Court Surface',
    description: 'Outdoor red-surface basketball court situated directly south of the Law Building.',
  },
  kumbha: {
    id: 'kumbha',
    code: 'HST-06',
    name: 'Maharana Kumbha Boys Hostel',
    shortName: 'Kumbha Hostel',
    category: 'facility',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    icon: '🛏️',
    lat: 25.033814,
    lng: 74.636040,
    polygon: [
      [25.033815, 74.635849],
      [25.033946, 74.636277],
      [25.033813, 74.636327],
      [25.033682, 74.635898],
      [25.033815, 74.635849],
    ],
    dept: 'Senior Student Residence Wing',
    elevation: '3 Floors',
    description: 'Hostel dormitory units with high-speed campus LAN, study halls, and laundry amenities.',
  },
  pratap: {
    id: 'pratap',
    code: 'HST-07',
    name: 'Maharana Pratap Boys Hostel',
    shortName: 'Pratap Hostel',
    category: 'facility',
    color: '#D97706',
    bgColor: '#FFFBEB',
    icon: '🛏️',
    lat: 25.033592,
    lng: 74.636105,
    polygon: [
      [25.033593, 74.635914],
      [25.033724, 74.636342],
      [25.033591, 74.636392],
      [25.033459, 74.635963],
      [25.033593, 74.635914],
    ],
    dept: 'Male Student Living Complex',
    elevation: '3 Floors',
    description: 'Residential quarters directly south of Kumbha Hostel with landscaped garden frontage.',
  },
  park: {
    id: 'park',
    code: 'PRK-01',
    name: 'Central Campus Park & Botanical Garden',
    shortName: 'Campus Park',
    category: 'facility',
    color: '#15803D',
    bgColor: '#F0FDF4',
    icon: '🌳',
    lat: 25.033968,
    lng: 74.635239,
    polygon: [
      [25.034021, 74.635025],
      [25.034169, 74.635437],
      [25.033887, 74.635560],
      [25.033739, 74.635148],
      [25.034021, 74.635025],
    ],
    dept: 'Campus Horticultural & Student Recreation Zone',
    elevation: 'Open Grounds',
    description: 'Central green parkland, shaded walking tracks, flowering shrubs, and outdoor seating lawns directly south of Gora Hostel.',
  },
  guest_house: {
    id: 'guest_house',
    code: 'GST-01',
    name: 'University Guest House & VIP Suites',
    shortName: 'Guest House',
    category: 'facility',
    color: '#059669',
    bgColor: '#ECFDF5',
    icon: '🏨',
    lat: 25.033780,
    lng: 74.634550,
    polygon: [
      [25.03388, 74.63442],
      [25.03392, 74.63468],
      [25.03368, 74.63475],
      [25.03362, 74.63450],
    ],
    dept: 'Campus Hospitality & Visiting Dignitaries Lodge',
    elevation: 'Ground + Floor 1',
    description: 'Furnished suites for visiting faculty, academic guest lecturers, delegates, and parent accommodations.',
  },
  mira: {
    id: 'mira',
    code: 'HST-01',
    name: 'Mira Girls Residential Hostel',
    shortName: 'Mira Hostel',
    category: 'facility',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    icon: '🏠',
    lat: 25.034085,
    lng: 74.634523,
    polygon: [
      [25.034158, 74.634385],
      [25.034188, 74.634480],
      [25.034049, 74.634534],
      [25.034096, 74.634685],
      [25.034011, 74.634717],
      [25.033933, 74.634472],
      [25.034158, 74.634385],
    ],
    dept: 'Female Student Residential Precinct (South Wing)',
    elevation: 'Blocks A & B',
    description: 'Secure female residence quarters with landscaped courtyard, reading hall, and dedicated warden outpost.',
  },
  panna: {
    id: 'panna',
    code: 'HST-02',
    name: 'Panna Girls Residential Hostel',
    shortName: 'Panna Hostel',
    category: 'facility',
    color: '#9333EA',
    bgColor: '#FAF5FF',
    icon: '🏠',
    lat: 25.034450,
    lng: 74.634320,
    polygon: [
      [25.03460, 74.63418],
      [25.03465, 74.63445],
      [25.03428, 74.63455],
      [25.03422, 74.63428],
    ],
    dept: 'Female Student Residential Precinct (North Wing)',
    elevation: 'Blocks 1 & 2',
    description: 'Secure female student quarters, air-cooled living units, and study rooms.',
  },
  hospital: {
    id: 'hospital',
    code: 'MED-01',
    name: 'University Hospital & Health Centre',
    shortName: 'Campus Hospital',
    category: 'facility',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    icon: '🏥',
    lat: 25.034600,
    lng: 74.634840,
    polygon: [
      [25.03472, 74.63475],
      [25.03476, 74.63492],
      [25.03448, 74.63500],
      [25.03444, 74.63482],
    ],
    dept: '24/7 Campus Emergency Medical Care & Dispensary',
    elevation: 'Ground Floor Wing',
    description: 'Round-the-clock university hospital wing, emergency ambulance desk, resident medical doctors, and pharmacy dispensary.',
  },
  gora: {
    id: 'gora',
    code: 'HST-03',
    name: 'Gora Boys Residential Hostel',
    shortName: 'Gora Hostel',
    category: 'facility',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    icon: '🛏️',
    lat: 25.034447,
    lng: 74.635065,
    polygon: [
      [25.034194, 74.635087],
      [25.034242, 74.635255],
      [25.034335, 74.635223],
      [25.034390, 74.635246],
      [25.034426, 74.635347],
      [25.034551, 74.635292],
      [25.034517, 74.635197],
      [25.034557, 74.635119],
      [25.034572, 74.635137],
      [25.034678, 74.635103],
      [25.034633, 74.634926],
      [25.034513, 74.634964],
      [25.034513, 74.634988],
      [25.034423, 74.634942],
      [25.034451, 74.634931],
      [25.034502, 74.634944],
      [25.034653, 74.634885],
      [25.034623, 74.634791],
      [25.034292, 74.634920],
      [25.034314, 74.634989],
      [25.034256, 74.635065],
      [25.034194, 74.635087],
    ],
    dept: 'Boys Residence Complex & Quadrangle Living',
    elevation: 'Blocks 1–3',
    description: 'Major residential hostel block with an open central courtyard, air-cooled rooms, and attached student amenities.',
  },
  sanaga: {
    id: 'sanaga',
    code: 'HST-04',
    name: 'Sanaga Boys Residential Hostel',
    shortName: 'Sanaga Hostel',
    category: 'facility',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    icon: '🛏️',
    lat: 25.034645,
    lng: 74.635783,
    polygon: [
      [25.034641, 74.635385],
      [25.034509, 74.635440],
      [25.034634, 74.635811],
      [25.034352, 74.635927],
      [25.034397, 74.636061],
      [25.034707, 74.635933],
      [25.034720, 74.635973],
      [25.034787, 74.635946],
      [25.034756, 74.635854],
      [25.034738, 74.635861],
      [25.034723, 74.635816],
      [25.034779, 74.635793],
      [25.034641, 74.635385],
    ],
    dept: 'Male Student Residence Wing',
    elevation: 'Blocks 1–4',
    description: 'Senior boys hostel living quarters with Wi-Fi, common recreation room, and 24/7 security station.',
  },
  bhamasha: {
    id: 'bhamasha',
    code: 'HST-05',
    name: 'Bhamasha Boys Residential Hostel',
    shortName: 'Bhamasha Hostel',
    category: 'facility',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    icon: '🛏️',
    lat: 25.034287,
    lng: 74.635706,
    polygon: [
      [25.034469, 74.635447],
      [25.034531, 74.635650],
      [25.034241, 74.635759],
      [25.034340, 74.636080],
      [25.034172, 74.636143],
      [25.034024, 74.635662],
      [25.034177, 74.635604],
      [25.034164, 74.635562],
      [25.034469, 74.635447],
    ],
    dept: 'East Living Quad Male Student Residence Wing',
    elevation: '3 Floors',
    description: 'Student accommodation complex positioned directly south of Sanaga Hostel with furnished dormitories and courtyards.',
  },
};

// Aliases for backwards compatibility with legacy routes/bookmarks
CAMPUS_GIS_LOCATIONS.admin = CAMPUS_GIS_LOCATIONS.main;
CAMPUS_GIS_LOCATIONS.cafeteria = CAMPUS_GIS_LOCATIONS.mess;
CAMPUS_GIS_LOCATIONS.hostel_b = CAMPUS_GIS_LOCATIONS.sanaga;
CAMPUS_GIS_LOCATIONS.hostel_g = CAMPUS_GIS_LOCATIONS.mira;
CAMPUS_GIS_LOCATIONS.sports = CAMPUS_GIS_LOCATIONS.basketball;
CAMPUS_GIS_LOCATIONS.library = CAMPUS_GIS_LOCATIONS.pratap;
CAMPUS_GIS_LOCATIONS.auditorium = CAMPUS_GIS_LOCATIONS.football;

// Haversine geodesic distance in meters
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Generate intermediate waypoint route path
function interpolateRoute(start, end, numPoints = 18) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const factor = i / numPoints;
    // Gentle curve along academic walkways
    const curveOffset = Math.sin(factor * Math.PI) * 0.00008;
    const lat = start.lat + (end.lat - start.lat) * factor + curveOffset;
    const lng = start.lng + (end.lng - start.lng) * factor - curveOffset * 0.2;
    points.push([lat, lng]);
  }
  return points;
}

export const CampusGisMap = ({
  selectedBuildingKey = 'eng',
  onSelectBuilding,
  customDestination,
  onSetCustomDestination,
  onClearCustomDestination,
  mobilityMode = 'walk',
  userCoords,
  setUserCoords,
  isLiveGpsActive,
  setIsLiveGpsActive,
  isSimulatingWalk,
  setIsSimulatingWalk,
  simulationProgress,
  setSimulationProgress,
  onNavigationUpdate,
  isDrawerOpen = false,
  isNavPanelOpen = true,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const customDestMarkerRef = useRef(null);
  const routeCasingPolylineRef = useRef(null);
  const routePolylineRef = useRef(null);
  const buildingMarkersRef = useRef({});
  const buildingPolygonsRef = useRef({});
  const tileLayerRef = useRef(null);
  const perimeterLayerRef = useRef(null);
  const roadsLayerRef = useRef([]);

  // Map Tile Style: 'satellite' | 'streets'
  const [mapLayerStyle, setMapLayerStyle] = useState('satellite');
  // Toggleable Map Legend
  const [showLegend, setShowLegend] = useState(false);

  // Active target destination (either custom clicked point or selected building)
  const activeDestination = customDestination
    ? {
        name: customDestination.name || 'Marked Destination',
        shortName: customDestination.shortName || 'Marked Point',
        lat: customDestination.lat,
        lng: customDestination.lng,
        isCustom: true,
        color: '#168567',
        icon: '📍',
      }
    : CAMPUS_GIS_LOCATIONS[selectedBuildingKey] || CAMPUS_GIS_LOCATIONS.eng;

  // Initialize Leaflet Map locked to Mewar University, Gangrar, Chittorgarh
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CAMPUS_CENTER,
        zoom: 17.5,
        minZoom: 16.2, // STRICT HARD LOCK: User cannot zoom out beyond university campus
        maxZoom: 20, // High-resolution building footprint & pathway zoom (upscaled cleanly beyond native zoom)
        maxBounds: MEWAR_CAMPUS_BOUNDS,
        maxBoundsViscosity: 1.0, // 100% HARD LOCK: Bounces back instantly; cannot drag outside
        zoomControl: false,
        attributionControl: false,
      });

      // Strict Drag Clamp: keeps map centered strictly within university boundary
      map.on('drag', () => {
        map.panInsideBounds(MEWAR_CAMPUS_BOUNDS, { animate: false });
      });

      // Initialize base tile layer with maxNativeZoom protection
      tileLayerRef.current = createTileLayer(mapLayerStyle).addTo(map);

      // Add Zoom Control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 1. INVERSE SHADED MASK: Dim everything outside the university perimeter with calm Forest Green
      const outerWorldPolygon = [
        [24.90, 74.50],
        [24.90, 74.80],
        [25.15, 74.80],
        [25.15, 74.50],
      ];
      L.polygon([outerWorldPolygon, MEWAR_PERIMETER_POLYGON], {
        color: '#142D28',
        weight: 0,
        fillColor: '#142D28',
        fillOpacity: 0.32,
        interactive: false,
      }).addTo(map);

      // 2. OFFICIAL CAMPUS PERIMETER FENCE (OSM Way 549126310)
      perimeterLayerRef.current = L.polygon(MEWAR_PERIMETER_POLYGON, {
        color: '#168567',
        weight: 2.5,
        fillColor: '#168567',
        fillOpacity: 0.04,
        dashArray: '6, 6',
      })
        .bindTooltip('🏫 Mewar University 30-Acre Campus Perimeter (Restricted)', {
          permanent: false,
          direction: 'center',
          className: 'mewar-tooltip',
        })
        .addTo(map);

      // Draw Walkway & Internal Road Network
      roadsLayerRef.current = MEWAR_CAMPUS_ROADS.map((roadCoords) =>
        L.polyline(roadCoords, {
          color: '#10B981',
          weight: 3,
          opacity: 0.6,
          dashArray: '4, 4',
        }).addTo(map)
      );

      // Click on Map to Mark Destination Anywhere inside Campus!
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (onSetCustomDestination) {
          onSetCustomDestination({
            lat,
            lng,
            name: `Marked Campus Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            shortName: 'Marked Destination',
          });
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate Map Size when drawer or nav panel state transitions
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 320);
    return () => clearTimeout(timer);
  }, [isDrawerOpen, isNavPanelOpen]);

  // Switch Tile Layer (Satellite Aerial vs Street Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);
    tileLayerRef.current = createTileLayer(mapLayerStyle).addTo(map);
  }, [mapLayerStyle]);

  // Render Highlighted Building Footprint Polygons & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old building markers & polygons
    Object.values(buildingMarkersRef.current).forEach((m) => m.remove());
    buildingMarkersRef.current = {};
    Object.values(buildingPolygonsRef.current).forEach((p) => p.remove());
    buildingPolygonsRef.current = {};

    Object.entries(CAMPUS_GIS_LOCATIONS).forEach(([key, bldg]) => {
      if (bldg.id !== key) return; // Avoid rendering duplicate polygons/markers for backwards-compatible aliases
      const isSelected = !customDestination && (key === selectedBuildingKey || bldg.id === selectedBuildingKey);

      // 1. Draw Visible Building Footprint Polygon
      if (bldg.polygon) {
        const poly = L.polygon(bldg.polygon, {
          color: isSelected ? '#168567' : bldg.color,
          weight: isSelected ? 3.5 : 2,
          fillColor: isSelected ? '#168567' : bldg.color,
          fillOpacity: isSelected ? 0.38 : 0.22,
          dashArray: isSelected ? '6, 4' : null,
        }).addTo(map);

        poly.on('click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          if (onClearCustomDestination) onClearCustomDestination();
          if (onSelectBuilding) onSelectBuilding(key);
        });

        poly.bindTooltip(`<b>${bldg.shortName}</b>`, {
          permanent: isSelected,
          direction: 'top',
          className: 'mewar-tooltip',
        });

        buildingPolygonsRef.current[key] = poly;
      }

      // 2. Draw Marker Pin with Icon & Badge (NextCampus Institutional Palette)
      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
          transform: translate(-50%, -50%);
        ">
          <div style="
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            border-radius: 50%;
            background-color: ${isSelected ? '#142D28' : '#FFFFFF'};
            color: ${isSelected ? '#FFFFFF' : bldg.color};
            border: 2.5px solid ${isSelected ? '#168567' : bldg.color};
            box-shadow: 0 4px 14px rgba(20,45,40,0.28);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '18px' : '15px'};
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            ${bldg.icon}
          </div>
          ${
            isSelected
              ? `
            <div style="
              background: #142D28;
              color: #FFFFFF;
              font-size: 11px;
              font-weight: 700;
              font-family: 'Plus Jakarta Sans', sans-serif;
              padding: 4px 10px;
              border-radius: 9999px;
              white-space: nowrap;
              box-shadow: 0 4px 14px rgba(20,45,40,0.3);
              border: 1.5px solid #168567;
            ">
              ${bldg.shortName}
            </div>
          `
              : ''
          }
        </div>
      `;

      const markerIcon = L.divIcon({
        html: markerHtml,
        className: 'mewar-gis-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([bldg.lat, bldg.lng], { icon: markerIcon }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 10px; font-family: Inter, sans-serif; min-width: 220px;">
          <div style="font-weight: 800; font-size: 13.5px; color: #142D28; margin-bottom: 3px; font-family: 'Plus Jakarta Sans', sans-serif;">
            ${bldg.name}
          </div>
          <div style="font-size: 11px; color: #65736B; margin-bottom: 8px; line-height: 1.45;">
            ${bldg.description}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E4EAE5; padding-top: 6px;">
            <span style="font-size: 10px; color: #168567; font-weight: 700;">● ${bldg.dept}</span>
            <span style="font-size: 10px; font-weight: 600; color: #87968D;">${bldg.elevation}</span>
          </div>
        </div>
      `);

      marker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        if (onClearCustomDestination) onClearCustomDestination();
        if (onSelectBuilding) onSelectBuilding(key);
      });

      buildingMarkersRef.current[key] = marker;
    });
  }, [selectedBuildingKey, customDestination, onSelectBuilding, onClearCustomDestination]);

  // Smoothly glide camera to selected building
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || customDestination) return;
    const bldg = CAMPUS_GIS_LOCATIONS[selectedBuildingKey];
    if (bldg && bldg.lat && bldg.lng) {
      map.flyTo([bldg.lat, bldg.lng], 18, { animate: true, duration: 0.8 });
    }
  }, [selectedBuildingKey, customDestination]);

  // Render Custom Marked Destination Pin (if user clicked on the map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (customDestination) {
      const pinHtml = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: translate(-50%, -100%);
        ">
          <div style="
            background: #142D28;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            box-shadow: 0 4px 16px rgba(20,45,40,0.35);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            border: 1.5px solid #168567;
          ">
            <span>📍 Marked Destination</span>
          </div>
          <div style="
            width: 14px;
            height: 14px;
            background: #168567;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            margin-top: 4px;
            box-shadow: 0 0 10px rgba(22,133,103,0.8);
          "></div>
        </div>
      `;

      const pinIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-dest-pin',
        iconSize: [120, 48],
        iconAnchor: [60, 48],
      });

      if (customDestMarkerRef.current) {
        customDestMarkerRef.current.setLatLng([customDestination.lat, customDestination.lng]);
      } else {
        customDestMarkerRef.current = L.marker([customDestination.lat, customDestination.lng], { icon: pinIcon }).addTo(map);
      }
    } else {
      if (customDestMarkerRef.current) {
        customDestMarkerRef.current.remove();
        customDestMarkerRef.current = null;
      }
    }
  }, [customDestination]);

  // Update Route Polyline & Live Guidance Stats with Double-Cased Visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeDestination || !userCoords) return;

    const dist = calculateDistanceMeters(
      userCoords.lat,
      userCoords.lng,
      activeDestination.lat,
      activeDestination.lng
    );

    let speedMps = 1.25;
    if (mobilityMode === 'wheelchair') speedMps = 1.0;
    if (mobilityMode === 'shuttle') speedMps = 4.2;

    const etaMin = Math.max(1, Math.round(dist / speedMps / 60));

    let directive = `Head towards ${activeDestination.shortName}`;
    if (dist > 180) {
      directive = `Walk along campus promenade towards ${activeDestination.shortName}`;
    } else if (dist > 50) {
      directive = `Approaching destination: ${activeDestination.shortName}`;
    } else if (dist <= 25) {
      directive = `You have arrived at ${activeDestination.shortName}!`;
    }

    if (onNavigationUpdate) {
      onNavigationUpdate({
        distanceMeters: dist,
        etaMinutes: etaMin,
        stepText: directive,
        destinationName: activeDestination.shortName,
      });
    }

    // Dynamic Waypoint Route Polyline
    const routePoints = interpolateRoute(
      { lat: userCoords.lat, lng: userCoords.lng },
      { lat: activeDestination.lat, lng: activeDestination.lng },
      18
    );

    // 1. Route Casing (White outer halo for maximum GIS contrast against satellite imagery)
    if (routeCasingPolylineRef.current) {
      routeCasingPolylineRef.current.setLatLngs(routePoints);
    } else {
      routeCasingPolylineRef.current = L.polyline(routePoints, {
        color: '#FFFFFF',
        weight: 7.5,
        opacity: 0.85,
        lineCap: 'round',
        interactive: false,
      }).addTo(map);
    }

    // 2. Route Core Polyline (NextCampus Intelligent Green)
    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(routePoints);
      routePolylineRef.current.setStyle({
        color: '#168567',
      });
    } else {
      routePolylineRef.current = L.polyline(routePoints, {
        color: '#168567',
        weight: 4.5,
        opacity: 0.95,
        lineCap: 'round',
      }).addTo(map);
    }
  }, [userCoords, activeDestination, customDestination, mobilityMode, onNavigationUpdate]);

  // Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    const userHtml = `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #3478B8;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 16px rgba(52, 120, 184, 0.85);
        "></div>
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #3478B8;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-live-beacon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
      userMarkerRef.current.bindTooltip('<b>You Are Here</b>', { permanent: false, direction: 'top', className: 'mewar-tooltip' });
    }

    if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      userAccuracyCircleRef.current.setRadius(userCoords.accuracy || 8);
    } else {
      userAccuracyCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
        radius: userCoords.accuracy || 8,
        color: '#3478B8',
        fillColor: '#93C5FD',
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map);
    }
  }, [userCoords]);

  const handleFitRoute = () => {
    const map = mapInstanceRef.current;
    if (!map || !activeDestination || !userCoords) return;
    const bounds = L.latLngBounds(
      [userCoords.lat, userCoords.lng],
      [activeDestination.lat, activeDestination.lng]
    );
    map.fitBounds(bounds, { padding: [80, 80], animate: true, maxZoom: 18.5 });
  };

  const handleCenterOnUser = () => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;
    map.flyTo([userCoords.lat, userCoords.lng], 18, { animate: true, duration: 1 });
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(DEFAULT_CAMPUS_CENTER, 17.5, { animate: true, duration: 1 });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Canvas Mount */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* FLOATING TOP-RIGHT LAYER SWITCHER */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          padding: '4px',
          display: 'flex',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setMapLayerStyle('satellite')}
          style={{
            padding: '6px 12px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: mapLayerStyle === 'satellite' ? 'var(--brand-primary)' : 'transparent',
            color: mapLayerStyle === 'satellite' ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
        >
          <Layers size={13} />
          <span>Satellite Aerial</span>
        </button>
        <button
          type="button"
          onClick={() => setMapLayerStyle('streets')}
          style={{
            padding: '6px 12px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: mapLayerStyle === 'streets' ? 'var(--brand-primary)' : 'transparent',
            color: mapLayerStyle === 'streets' ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
        >
          <Building size={13} />
          <span>Street Map</span>
        </button>
      </div>

      {/* FLOATING CAMPUS BOUNDARY LOCKED BADGE */}
      <div
        className="hidden md:flex"
        style={{
          position: 'absolute',
          top: '16px',
          left: isNavPanelOpen ? '430px' : '16px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 25,
          backgroundColor: 'rgba(20, 45, 40, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          padding: '6px 14px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: 'var(--shadow-md)',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#FFFFFF',
          pointerEvents: 'none',
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
        <Shield size={13} style={{ color: '#10B981' }} />
        <span>University Area Locked • 30-Acre Campus</span>
      </div>

      {/* FLOATING CAMPUS DESTINATION CARD ON MAP (Shown when right drawer is closed) */}
      {activeDestination && !isDrawerOpen && (
        <div
          className="campus-map-floating-card"
          style={{
            position: 'absolute',
            top: '64px',
            right: '16px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: activeDestination.color || '#168567',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                }}
              >
                <span>{activeDestination.icon || (activeDestination.shortName ? activeDestination.shortName.charAt(0) : '🏛️')}</span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    border: '2px solid #FFFFFF',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, fontFamily: 'var(--font-heading)' }}>
                  {activeDestination.shortName || activeDestination.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span>● Open</span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{activeDestination.code || 'Campus Zone'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFitRoute}
              title="Recenter Camera on Route"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Crosshair size={14} />
            </button>
          </div>

          {/* Department / Zone */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            <MapPin size={13} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>{activeDestination.dept || 'Mewar University Academic Zone'}</span>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
            <button
              type="button"
              onClick={handleFitRoute}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: 'var(--brand-primary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: 'var(--shadow-brand-glow)',
                transition: 'all 0.15s ease',
              }}
            >
              <Navigation size={12} />
              <span>Fit Route</span>
            </button>
            {onOpenDetails && (
              <button
                type="button"
                onClick={onOpenDetails}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--brand-soft-bg)',
                  border: '1px solid var(--brand-soft-border)',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--brand-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Details</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FLOATING MAP LEGEND (COLLAPSIBLE) */}
      {showLegend && (
        <div
          style={{
            position: 'absolute',
            bottom: '76px',
            right: '68px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 35,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            padding: '14px 16px',
            minWidth: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              Campus Map Legend
            </span>
            <button
              type="button"
              onClick={() => setShowLegend(false)}
              aria-label="Close campus legend"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            {[
              { color: '#168567', label: 'Academic & Tech Wings' },
              { color: '#B7791F', label: 'Central Library' },
              { color: '#142D28', label: 'Administrative Secretariat' },
              { color: '#3478B8', label: 'Student Residences (Hostels)' },
              { color: '#0D9488', label: 'Sports Arena & Grounds' },
              { color: '#C43D4B', label: 'Health Centre & Hospital' },
              { color: '#D97706', label: 'Dining & Cafeteria' },
              { color: '#7C3AED', label: 'Auditorium & Convocation' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: '#168567', borderTop: '2px dashed #168567', flexShrink: 0 }} />
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Restricted Boundary (30 Acres)</span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM-RIGHT QUICK ACTIONS (LOCATE, FIT ROUTE, RECENTER & LEGEND) */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '16px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          title="Toggle Campus Legend"
          aria-label="Toggle Campus Legend"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '11px',
            backgroundColor: showLegend ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.96)',
            color: showLegend ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <Info size={17} />
        </button>

        {userCoords && (
          <button
            type="button"
            onClick={handleCenterOnUser}
            title="Center on My Location"
            aria-label="Center on My Location"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '11px',
              backgroundColor: isLiveGpsActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.96)',
              color: isLiveGpsActive ? '#FFFFFF' : 'var(--brand-primary)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Locate size={18} />
          </button>
        )}

        <button
          type="button"
          onClick={handleFitRoute}
          title="Fit Route View"
          aria-label="Fit Route View"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '11px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--brand-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <Crosshair size={18} />
        </button>

        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Mewar University"
          aria-label="Recenter Mewar University Campus View"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '11px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default CampusGisMap;
