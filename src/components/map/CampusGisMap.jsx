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


// Official Campus Perimeter Boundary Polygon
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

// Authentic Mewar University Blue Internal Road & Pathway Network (Satellite Ground-Truth)
export const MEWAR_CAMPUS_ROADS = [
  // 1. West Arterial Road (Gate 1 past Gate 2 to Hospital)
  [
    [25.031923, 74.635568],
    [25.032583, 74.635492],
    [25.032995, 74.635417],
    [25.033367, 74.635341],
    [25.033710, 74.635219],
    [25.033958, 74.635037],
    [25.034398, 74.635022],
    [25.034645, 74.635151],
  ],
  // 2. Main Building West Lawn Loop
  [
    [25.032817, 74.635477],
    [25.032776, 74.635674],
    [25.032549, 74.635781],
    [25.032226, 74.635811],
    [25.032074, 74.635705],
    [25.032061, 74.635568],
    [25.031923, 74.635568],
  ],
  // 3. Main Building South Promenade (Gate 1 past Main Building to Mess)
  [
    [25.031923, 74.635568],
    [25.031951, 74.635872],
    [25.032013, 74.636099],
    [25.032074, 74.636327],
    [25.032143, 74.636623],
    [25.032226, 74.636767],
  ],
  // 4. Main Building East Road (Promenade to Temple / North Quad)
  [
    [25.032143, 74.636623],
    [25.032583, 74.636486],
    [25.032858, 74.636388],
    [25.033270, 74.636236],
    [25.033587, 74.636130],
  ],
  // 5. Temple Front Road (East road past Temple to West road)
  [
    [25.033587, 74.636130],
    [25.033532, 74.635796],
    [25.033463, 74.635492],
    [25.033367, 74.635341],
  ],
  // 6. North Living Quad - Park Perimeter & Hostels
  [
    [25.033367, 74.635341],
    [25.033875, 74.635310],
    [25.034247, 74.635219],
    [25.034260, 74.635606],
    [25.034247, 74.635948],
    [25.034260, 74.636213],
  ],
  [
    [25.034247, 74.635948],
    [25.033992, 74.636061],
    [25.033587, 74.636130],
  ],
  // Top Hospital & North Hostels Loop
  [
    [25.034645, 74.635151],
    [25.034776, 74.635492],
    [25.034769, 74.636008],
    [25.034631, 74.636137],
    [25.034260, 74.636213],
  ],
  // Spurs to Hostels
  [[25.033875, 74.635310], [25.033807, 74.634992]],
  [[25.034247, 74.635219], [25.034192, 74.634794]],
  [[25.033587, 74.636130], [25.033710, 74.636615]],
  [[25.034260, 74.636213], [25.034123, 74.636539]],
  // 7. Parking Lane (west of Football Ground)
  [
    [25.031923, 74.635568],
    [25.031772, 74.635629],
    [25.031456, 74.635705],
    [25.031085, 74.635857],
    [25.030975, 74.635986],
  ],
  // 8. Cross lane between Football & Cricket Grounds
  [
    [25.030975, 74.635986],
    [25.031030, 74.636289],
    [25.031085, 74.636592],
    [25.031153, 74.636888],
    [25.030892, 74.636979],
  ],
  // 9. Avenue between Football Ground & Central Mess/Law
  [
    [25.032143, 74.636623],
    [25.031827, 74.636691],
    [25.031456, 74.636812],
    [25.031153, 74.636888],
  ],
  // 10. Law Building Courtyard Garden Loop
  [
    [25.032226, 74.636767],
    [25.032061, 74.636888],
    [25.031744, 74.637010],
    [25.031731, 74.637146],
    [25.031511, 74.637116],
    [25.031511, 74.636888],
    [25.031744, 74.636888],
  ],
  // 11. South Sports Avenue (between Cricket and Gym/Agriculture)
  [
    [25.030892, 74.636979],
    [25.030521, 74.637146],
    [25.029902, 74.637389],
    [25.029614, 74.637526],
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
    lat: 25.032009,
    lng: 74.634483,
    polygon: [
      [25.032100, 74.634400],
      [25.032100, 74.634560],
      [25.031920, 74.634560],
      [25.031920, 74.634400],
      [25.032100, 74.634400],
    ],
    dept: 'NH-48 Campus Entrance & Security Post',
    elevation: 'Ground Level',
    description: 'Primary ceremonial entrance on NH-48 near Gangrar, automated RFID student verification barrier, and 24/7 security outpost.',
  },
  parking: {
    id: 'parking',
    code: 'PRK-02',
    name: 'Main Campus Vehicle & Visitor Parking Zone',
    shortName: 'Parking',
    category: 'facility',
    color: '#F97316',
    bgColor: '#FFF7ED',
    icon: '🅿️',
    lat: 25.031181,
    lng: 74.635524,
    polygon: [
      [25.031761, 74.635368],
      [25.031736, 74.635448],
      [25.031518, 74.635556],
      [25.031202, 74.635663],
      [25.030881, 74.635770],
      [25.030852, 74.635674],
      [25.031129, 74.635556],
      [25.031493, 74.635459],
      [25.031532, 74.635341],
      [25.031629, 74.635277],
      [25.031761, 74.635368],
    ],
    dept: 'Campus Transport & Vehicle Management Outpost',
    elevation: 'Ground Level Covered Bays',
    description: 'Spacious covered vehicular parking zone located along the western perimeter fence south of Gate 1 and west of Football Ground, offering EV charging and 2-wheeler/4-wheeler bays.',
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
    lat: 25.034828,
    lng: 74.633839,
    polygon: [
      [25.034900, 74.633760],
      [25.034900, 74.633920],
      [25.034750, 74.633920],
      [25.034750, 74.633760],
      [25.034900, 74.633760],
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
    lat: 25.032755,
    lng: 74.635380,
    polygon: [
      [25.033559, 74.635207],
      [25.033413, 74.635599],
      [25.033233, 74.635904],
      [25.032392, 74.636280],
      [25.032222, 74.636253],
      [25.032077, 74.635583],
      [25.032733, 74.635491],
      [25.032830, 74.635212],
      [25.033024, 74.635153],
      [25.033097, 74.635384],
      [25.033559, 74.635207],
    ],
    dept: 'University Secretariat, Admissions & Administrative Council',
    elevation: 'Floors 1–4',
    description: 'Central university flagship administrative and academic complex with expansive solar rooftop arrays, registrar office, accounts, and examination branch.',
  },
  temple: {
    id: 'temple',
    code: 'TMP-01',
    name: 'Mewar Campus Temple & Meditation Shrine',
    shortName: 'Temple',
    category: 'facility',
    color: '#EAB308',
    bgColor: '#FEFCE8',
    icon: '🛕',
    lat: 25.033669,
    lng: 74.635567,
    polygon: [
      [25.033758, 74.635502],
      [25.033758, 74.635631],
      [25.033642, 74.635631],
      [25.033642, 74.635502],
      [25.033758, 74.635502],
    ],
    dept: 'Campus Spiritual Centre & Cultural Forum',
    elevation: 'Ground Level Portico',
    description: 'Sacred campus temple and peaceful meditation shrine situated at the northern entrance courtyard of the Main Academic complex, directly south of the Botanical Park.',
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
  cricket: {
    id: 'cricket',
    code: 'SPT-03',
    name: 'University Cricket Ground & Pavilion',
    shortName: 'Cricket Ground',
    category: 'facility',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    icon: '🏏',
    lat: 25.030293,
    lng: 74.636245,
    polygon: [
      [25.030900, 74.635845],
      [25.031017, 74.636575],
      [25.030978, 74.636639],
      [25.030725, 74.636725],
      [25.030424, 74.636811],
      [25.030132, 74.636886],
      [25.029880, 74.636961],
      [25.029802, 74.636924],
      [25.029763, 74.636854],
      [25.029763, 74.636146],
      [25.029802, 74.636071],
      [25.030084, 74.635974],
      [25.030375, 74.635888],
      [25.030667, 74.635824],
      [25.030900, 74.635845],
    ],
    dept: 'Department of Physical Education & Athletics',
    elevation: 'Turf Ground & Pavilion',
    description: 'Full-sized university cricket ground located in the south-central campus grounds with turf pitch, pavilion stands, and practice nets.',
  },
  gym: {
    id: 'gym',
    code: 'SPT-04',
    name: 'University Fitness Centre & Gymnasium',
    shortName: 'Gym',
    category: 'facility',
    color: '#334155',
    bgColor: '#F8FAFC',
    icon: '🏋️',
    lat: 25.030837,
    lng: 74.637018,
    polygon: [
      [25.031007, 74.636763],
      [25.031080, 74.636950],
      [25.030618, 74.637181],
      [25.030545, 74.636993],
      [25.031007, 74.636763],
    ],
    dept: 'Department of Physical Education & Sports Training',
    elevation: 'Ground Floor Sports Complex',
    description: 'Fully equipped student gymnasium and indoor strength-training center situated south of Basketball Court and adjacent to Volleyball Ground.',
  },
  volleyball: {
    id: 'volleyball',
    code: 'SPT-05',
    name: 'University Volleyball Arena & Courts',
    shortName: 'Volleyball Ground',
    category: 'facility',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    icon: '🏐',
    lat: 25.030757,
    lng: 74.637288,
    polygon: [
      [25.031056, 74.636993],
      [25.031056, 74.637326],
      [25.030691, 74.637487],
      [25.030691, 74.637154],
      [25.031056, 74.636993],
    ],
    dept: 'Department of Physical Education & Court Sports',
    elevation: 'Hard Surface Court',
    description: 'Outdoor regulation volleyball courts situated east of the Gymnasium and south of Law Building with spectator seating and tournament lighting.',
  },
  agriculture: {
    id: 'agriculture',
    code: 'AGR-01',
    name: 'Faculty of Agriculture Research & Experimental Field',
    shortName: 'Agriculture Field',
    category: 'academic',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    icon: '🌾',
    lat: 25.030157,
    lng: 74.637499,
    polygon: [
      [25.030375, 74.636940],
      [25.030400, 74.637219],
      [25.030448, 74.637541],
      [25.030497, 74.637836],
      [25.030132, 74.637997],
      [25.029743, 74.638131],
      [25.029646, 74.637594],
      [25.029695, 74.637246],
      [25.030011, 74.637111],
      [25.030375, 74.636940],
    ],
    dept: 'Department of Agriculture Sciences & Horticulture Research',
    elevation: 'Experimental Farm Plots',
    description: 'Extensive agricultural research farm plots and botanical nursery situated in the southeastern quadrangle for crop trials, soil research, and organic cultivation.',
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
CAMPUS_GIS_LOCATIONS.mandir = CAMPUS_GIS_LOCATIONS.temple;
CAMPUS_GIS_LOCATIONS.farm = CAMPUS_GIS_LOCATIONS.agriculture;

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

// Authentic Mewar University Campus Road Graph Topology
export const MEWAR_CAMPUS_GRAPH = {
  nodes: {
    r_0: [25.031923, 74.635568],
    r_1: [25.032583, 74.635492],
    r_2: [25.032995, 74.635417],
    r_3: [25.033367, 74.635341],
    r_4: [25.03371, 74.635219],
    r_5: [25.033958, 74.635037],
    r_6: [25.034398, 74.635022],
    r_7: [25.034645, 74.635151],
    r_8: [25.032817, 74.635477],
    r_9: [25.032776, 74.635674],
    r_10: [25.032549, 74.635781],
    r_11: [25.032226, 74.635811],
    r_12: [25.032074, 74.635705],
    r_13: [25.032061, 74.635568],
    r_14: [25.031951, 74.635872],
    r_15: [25.032013, 74.636099],
    r_16: [25.032074, 74.636327],
    r_17: [25.032143, 74.636623],
    r_18: [25.032226, 74.636767],
    r_19: [25.032583, 74.636486],
    r_20: [25.032858, 74.636388],
    r_21: [25.03327, 74.636236],
    r_22: [25.033587, 74.63613],
    r_23: [25.033532, 74.635796],
    r_24: [25.033463, 74.635492],
    r_25: [25.033875, 74.63531],
    r_26: [25.034247, 74.635219],
    r_27: [25.03426, 74.635606],
    r_28: [25.034247, 74.635948],
    r_29: [25.03426, 74.636213],
    r_30: [25.033992, 74.636061],
    r_31: [25.034776, 74.635492],
    r_32: [25.034769, 74.636008],
    r_33: [25.034631, 74.636137],
    r_34: [25.033807, 74.634992],
    r_35: [25.034192, 74.634794],
    r_36: [25.03371, 74.636615],
    r_37: [25.034123, 74.636539],
    r_38: [25.031772, 74.635629],
    r_39: [25.031456, 74.635705],
    r_40: [25.031085, 74.635857],
    r_41: [25.030975, 74.635986],
    r_42: [25.03103, 74.636289],
    r_43: [25.031085, 74.636592],
    r_44: [25.031153, 74.636888],
    r_45: [25.030892, 74.636979],
    r_46: [25.031827, 74.636691],
    r_47: [25.031456, 74.636812],
    r_48: [25.032061, 74.636888],
    r_49: [25.031744, 74.63701],
    r_50: [25.031731, 74.637146],
    r_51: [25.031511, 74.637116],
    r_52: [25.031511, 74.636888],
    r_53: [25.031744, 74.636888],
    r_54: [25.030521, 74.637146],
    r_55: [25.029902, 74.637389],
    r_56: [25.029614, 74.637526],
    n_gate1: [25.032009, 74.634483],
    n_gate2: [25.034828, 74.633839],
    n_parking: [25.031181, 74.635785],
    n_main: [25.032755, 74.635872],
    n_temple: [25.033669, 74.635822],
    n_eng: [25.032631, 74.636545],
    n_teacher: [25.032655, 74.636881],
    n_badal: [25.032382, 74.63701],
    n_mess: [25.032203, 74.636307],
    n_law: [25.032106, 74.636843],
    n_football: [25.031526, 74.636104],
    n_basketball: [25.031342, 74.637242],
    n_cricket: [25.030293, 74.636703],
    n_gym: [25.030837, 74.637275],
    n_volleyball: [25.030757, 74.637623],
    n_agriculture: [25.030157, 74.637547],
    n_kumbha: [25.033814, 74.63604],
    n_pratap: [25.033592, 74.636105],
    n_park: [25.033968, 74.635239],
    n_guest_house: [25.03378, 74.63455],
    n_mira: [25.034085, 74.634523],
    n_panna: [25.03445, 74.63432],
    n_hospital: [25.0346, 74.63484],
    n_gora: [25.034447, 74.635065],
    n_sanaga: [25.034645, 74.635783],
    n_bhamasha: [25.034287, 74.635706],
  },
  edges: [
    ["r_0", "r_1"],
    ["r_1", "r_2"],
    ["r_2", "r_3"],
    ["r_3", "r_4"],
    ["r_4", "r_5"],
    ["r_5", "r_6"],
    ["r_6", "r_7"],
    ["r_8", "r_9"],
    ["r_9", "r_10"],
    ["r_10", "r_11"],
    ["r_11", "r_12"],
    ["r_12", "r_13"],
    ["r_0", "r_13"],
    ["r_0", "r_14"],
    ["r_14", "r_15"],
    ["r_15", "r_16"],
    ["r_16", "r_17"],
    ["r_17", "r_18"],
    ["r_17", "r_19"],
    ["r_19", "r_20"],
    ["r_20", "r_21"],
    ["r_21", "r_22"],
    ["r_22", "r_23"],
    ["r_23", "r_24"],
    ["r_3", "r_24"],
    ["r_3", "r_25"],
    ["r_25", "r_26"],
    ["r_26", "r_27"],
    ["r_27", "r_28"],
    ["r_28", "r_29"],
    ["r_28", "r_30"],
    ["r_22", "r_30"],
    ["r_7", "r_31"],
    ["r_31", "r_32"],
    ["r_32", "r_33"],
    ["r_29", "r_33"],
    ["r_25", "r_34"],
    ["r_26", "r_35"],
    ["r_22", "r_36"],
    ["r_29", "r_37"],
    ["r_0", "r_38"],
    ["r_38", "r_39"],
    ["r_39", "r_40"],
    ["r_40", "r_41"],
    ["r_41", "r_42"],
    ["r_42", "r_43"],
    ["r_43", "r_44"],
    ["r_44", "r_45"],
    ["r_17", "r_46"],
    ["r_46", "r_47"],
    ["r_44", "r_47"],
    ["r_18", "r_48"],
    ["r_48", "r_49"],
    ["r_49", "r_50"],
    ["r_50", "r_51"],
    ["r_51", "r_52"],
    ["r_52", "r_53"],
    ["r_45", "r_54"],
    ["r_54", "r_55"],
    ["r_55", "r_56"],
    ["r_1", "r_8"],
    ["r_48", "r_53"],
    ["n_gate1", "r_13"],
    ["n_gate2", "r_35"],
    ["n_parking", "r_40"],
    ["n_main", "r_9"],
    ["n_temple", "r_23"],
    ["n_eng", "r_19"],
    ["n_teacher", "r_19"],
    ["n_badal", "r_18"],
    ["n_mess", "r_16"],
    ["n_law", "r_48"],
    ["n_football", "r_39"],
    ["n_basketball", "r_51"],
    ["n_cricket", "r_54"],
    ["n_gym", "r_45"],
    ["n_volleyball", "r_54"],
    ["n_agriculture", "r_55"],
    ["n_kumbha", "r_30"],
    ["n_pratap", "r_22"],
    ["n_park", "r_25"],
    ["n_guest_house", "r_34"],
    ["n_mira", "r_35"],
    ["n_panna", "r_35"],
    ["n_hospital", "r_6"],
    ["n_gora", "r_6"],
    ["n_sanaga", "r_32"],
    ["n_bhamasha", "r_27"],
  ],
};

// Build adjacency lookup map with Haversine weights
const _graphAdj = {};
Object.keys(MEWAR_CAMPUS_GRAPH.nodes).forEach((k) => {
  _graphAdj[k] = [];
});
MEWAR_CAMPUS_GRAPH.edges.forEach(([u, v]) => {
  if (MEWAR_CAMPUS_GRAPH.nodes[u] && MEWAR_CAMPUS_GRAPH.nodes[v]) {
    const pU = MEWAR_CAMPUS_GRAPH.nodes[u];
    const pV = MEWAR_CAMPUS_GRAPH.nodes[v];
    const d = calculateDistanceMeters(pU[0], pU[1], pV[0], pV[1]);
    _graphAdj[u].push({ node: v, dist: d });
    _graphAdj[v].push({ node: u, dist: d });
  }
});

// Find closest graph waypoint to given coordinates
export function findNearestGraphNode(coords) {
  const lat = Array.isArray(coords) ? coords[0] : coords?.lat;
  const lng = Array.isArray(coords) ? coords[1] : coords?.lng;
  if (lat == null || lng == null) return 'n_gate1';

  let bestNode = 'n_gate1';
  let minD = Infinity;

  Object.entries(MEWAR_CAMPUS_GRAPH.nodes).forEach(([key, nCoords]) => {
    const d = calculateDistanceMeters(lat, lng, nCoords[0], nCoords[1]);
    if (d < minD) {
      minD = d;
      bestNode = key;
    }
  });

  return bestNode;
}

// Subdivide polyline into evenly-spaced points for fluid animation
export function subdividePolyline(points, maxStepMeters = 8) {
  if (!points || points.length === 0) return [];
  const result = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const d = calculateDistanceMeters(p1[0], p1[1], p2[0], p2[1]);
    const steps = Math.max(1, Math.ceil(d / maxStepMeters));
    for (let s = 1; s <= steps; s++) {
      const frac = s / steps;
      result.push([
        p1[0] + (p2[0] - p1[0]) * frac,
        p1[1] + (p2[1] - p1[1]) * frac,
      ]);
    }
  }
  return result;
}

// Full Google Maps-style shortest-path route computation along campus roads
export function findShortestCampusRoute(startCoords, destCoords, maxStepMeters = 8) {
  const sLat = Array.isArray(startCoords) ? startCoords[0] : startCoords?.lat;
  const sLng = Array.isArray(startCoords) ? startCoords[1] : startCoords?.lng;
  const dLat = Array.isArray(destCoords) ? destCoords[0] : destCoords?.lat;
  const dLng = Array.isArray(destCoords) ? destCoords[1] : destCoords?.lng;

  if (sLat == null || sLng == null || dLat == null || dLng == null) {
    return { coordinates: [], distanceMeters: 0, nodes: [] };
  }

  const startNode = findNearestGraphNode([sLat, sLng]);
  const destNode = findNearestGraphNode([dLat, dLng]);

  // Dijkstra Shortest Path Search
  const dist = {};
  const prev = {};
  const unvisited = new Set(Object.keys(MEWAR_CAMPUS_GRAPH.nodes));

  Object.keys(MEWAR_CAMPUS_GRAPH.nodes).forEach((n) => {
    dist[n] = Infinity;
  });
  dist[startNode] = 0;

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;
    for (const n of unvisited) {
      if (dist[n] < minD) {
        minD = dist[n];
        curr = n;
      }
    }

    if (!curr || minD === Infinity) break;
    if (curr === destNode) break;

    unvisited.delete(curr);

    const neighbors = _graphAdj[curr] || [];
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor.node)) {
        const alt = dist[curr] + neighbor.dist;
        if (alt < dist[neighbor.node]) {
          dist[neighbor.node] = alt;
          prev[neighbor.node] = curr;
        }
      }
    }
  }

  // Backtrack path
  const pathKeys = [];
  let u = destNode;
  while (u) {
    pathKeys.unshift(u);
    u = prev[u];
  }

  // Assemble full geometric waypoint sequence
  const rawWaypoints = [];
  rawWaypoints.push([sLat, sLng]);

  pathKeys.forEach((key) => {
    const pt = MEWAR_CAMPUS_GRAPH.nodes[key];
    if (pt) rawWaypoints.push([pt[0], pt[1]]);
  });

  rawWaypoints.push([dLat, dLng]);

  // De-duplicate consecutive identical coordinates
  const cleanWaypoints = [];
  for (let i = 0; i < rawWaypoints.length; i++) {
    const cur = rawWaypoints[i];
    if (i === 0) {
      cleanWaypoints.push(cur);
    } else {
      const prevPt = cleanWaypoints[cleanWaypoints.length - 1];
      const d = calculateDistanceMeters(prevPt[0], prevPt[1], cur[0], cur[1]);
      if (d > 0.5) {
        cleanWaypoints.push(cur);
      }
    }
  }

  // Calculate true road distance along waypoints
  let totalMeters = 0;
  for (let i = 0; i < cleanWaypoints.length - 1; i++) {
    totalMeters += calculateDistanceMeters(
      cleanWaypoints[i][0],
      cleanWaypoints[i][1],
      cleanWaypoints[i + 1][0],
      cleanWaypoints[i + 1][1]
    );
  }

  // Subdivide for silky smooth Google Maps navigation / simulated walk
  const smoothPoints = subdividePolyline(cleanWaypoints, maxStepMeters);

  return {
    coordinates: smoothPoints,
    distanceMeters: Math.round(totalMeters),
    nodes: pathKeys,
  };
}

// Fallback intermediate waypoint interpolation
function interpolateRoute(start, end, numPoints = 18) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const factor = i / numPoints;
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
  const routePulsePolylineRef = useRef(null);
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

      // Static blue road overlay removed per user request to maintain clean natural satellite imagery
      roadsLayerRef.current = [];


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
        const isKeyLandmark = ['parking', 'temple', 'cricket', 'gym', 'volleyball', 'agriculture'].includes(key);
        const poly = L.polygon(bldg.polygon, {
          color: isSelected ? '#10B981' : bldg.color,
          weight: isSelected ? 4 : (isKeyLandmark ? 3 : 2),
          fillColor: isSelected ? '#10B981' : bldg.color,
          fillOpacity: isSelected ? 0.35 : (isKeyLandmark ? 0.22 : 0.15),
          dashArray: isSelected ? '6, 4' : null,
        }).addTo(map);

        poly.on('click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          if (onClearCustomDestination) onClearCustomDestination();
          if (onSelectBuilding) onSelectBuilding(key);
        });

        poly.bindTooltip(`<b>${bldg.shortName}</b>`, {
          permanent: isSelected || isKeyLandmark || key === 'eng',
          direction: 'center',
          className: `mewar-tooltip mewar-badge-${key}`,
        });

        poly.bindPopup(`
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

        buildingPolygonsRef.current[key] = poly;
      }

      // 2. Draw Marker Pin with Icon & Badge (NextCampus Institutional Palette)
      // For key landmarks with dedicated prominent badge tooltips (parking, temple, cricket, gym, volleyball, agriculture),
      // we only render the badge on the polygon to avoid circular marker icon collision over the center of the badge.
      const isBadgeOnlyLandmark = ['parking', 'temple', 'cricket', 'gym', 'volleyball', 'agriculture'].includes(key);
      if (!isBadgeOnlyLandmark) {
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
      }
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

  // Update Route Polyline & Live Guidance Stats with Google Maps Pathway Navigation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeDestination || !userCoords) return;

    // Google Maps Shortest-Path Route Navigation along Campus Road Network
    const routeResult = findShortestCampusRoute(
      { lat: userCoords.lat, lng: userCoords.lng },
      { lat: activeDestination.lat, lng: activeDestination.lng }
    );
    const routePoints = routeResult.coordinates;
    const roadDist = routeResult.distanceMeters;

    let speedMps = 1.25;
    if (mobilityMode === 'wheelchair') speedMps = 1.0;
    if (mobilityMode === 'shuttle') speedMps = 4.2;

    const etaMin = Math.max(1, Math.round(roadDist / speedMps / 60));

    let directive = `Head towards ${activeDestination.shortName}`;
    if (roadDist > 180) {
      directive = `Walk along blue campus pathways towards ${activeDestination.shortName}`;
    } else if (roadDist > 50) {
      directive = `Approaching destination: ${activeDestination.shortName}`;
    } else if (roadDist <= 25) {
      directive = `You have arrived at ${activeDestination.shortName}!`;
    }

    if (onNavigationUpdate) {
      onNavigationUpdate({
        distanceMeters: roadDist,
        etaMinutes: etaMin,
        stepText: directive,
        destinationName: activeDestination.shortName,
      });
    }

    // 1. Route Casing (White outer halo for maximum GIS contrast against satellite imagery)
    if (routeCasingPolylineRef.current) {
      routeCasingPolylineRef.current.setLatLngs(routePoints);
    } else {
      routeCasingPolylineRef.current = L.polyline(routePoints, {
        color: '#FFFFFF',
        weight: 8,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
      }).addTo(map);
    }

    // 2. Route Core Polyline (Google Maps Signature Royal Blue Ribbon)
    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(routePoints);
      routePolylineRef.current.setStyle({
        color: '#1D4ED8',
      });
    } else {
      routePolylineRef.current = L.polyline(routePoints, {
        color: '#1D4ED8',
        weight: 4.8,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // 3. Route Animated Pulse Line (Google Maps Directional Chevron / Dashed stream)
    if (routePulsePolylineRef.current) {
      routePulsePolylineRef.current.setLatLngs(routePoints);
    } else {
      routePulsePolylineRef.current = L.polyline(routePoints, {
        color: '#93C5FD',
        weight: 2.6,
        opacity: 0.92,
        dashArray: '8, 12',
        className: 'route-nav-pulse',
        interactive: false,
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
              { color: '#EAB308', label: 'Campus Temple & Shrine' },
              { color: '#F97316', label: 'Vehicle Parking Zone' },
              { color: '#16A34A', label: 'Agriculture Research Field' },
              { color: '#3478B8', label: 'Student Residences (Hostels)' },
              { color: '#DC2626', label: 'Cricket & Sports Arena' },
              { color: '#8B5CF6', label: 'Volleyball & Courts' },
              { color: '#475569', label: 'Gymnasium & Fitness' },
              { color: '#C43D4B', label: 'Health Centre & Hospital' },
              { color: '#D97706', label: 'Dining Mess & Cafeteria' },
              { color: '#2563EB', label: 'Blue Campus Road Network' },
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
