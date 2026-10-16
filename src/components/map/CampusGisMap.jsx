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
  Minimize2,
  Target,
  Locate,
  Info,
  Shield,
  Check,
  X,
  Footprints,
  Bus,
  Zap,
  Clock,
  Users,
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


// Authentic Mewar University Campus EV Shuttle Transit Routes & Waypoints
export const SHUTTLE_DATA = [
  {
    id: 'shuttle-1',
    code: 'EV-01',
    name: 'EV-01 Campus Express',
    routeLabel: 'Main Gate 1 ➔ Admin Block ➔ Library ➔ Engineering',
    color: '#2563EB',
    tag: 'Academic Arterial',
    stops: ['Main Campus Gate 1', 'Maharana Pratap Admin Block', 'Central Library', 'Faculty of Engineering'],
    waypoints: [
      [25.031923, 74.635568],
      [25.032583, 74.635492],
      [25.032817, 74.635477],
      [25.032776, 74.635674],
      [25.032549, 74.635781],
      [25.032143, 74.636623],
      [25.032583, 74.636486],
      [25.032858, 74.636388],
      [25.032583, 74.636486],
      [25.032143, 74.636623],
      [25.032074, 74.636327],
      [25.031951, 74.635872],
    ],
    speed: 18.5,
    occupancy: '14 / 20 Seats',
    battery: 88,
  },
  {
    id: 'shuttle-2',
    code: 'EV-02',
    name: 'EV-02 Hostel & Sports Loop',
    routeLabel: 'Hostel Village ➔ Cafeteria ➔ Sports Complex ➔ Hospital',
    color: '#059669',
    tag: 'Residential Loop',
    stops: ['Aravalli / Meera Hostels', 'Dining Mess & Cafeteria', 'Sports Arena', 'Mewar Hospital'],
    waypoints: [
      [25.034260, 74.636213],
      [25.034247, 74.635948],
      [25.033587, 74.636130],
      [25.033463, 74.635492],
      [25.033367, 74.635341],
      [25.033958, 74.635037],
      [25.034398, 74.635022],
      [25.034645, 74.635151],
      [25.034247, 74.635219],
      [25.034260, 74.635606],
    ],
    speed: 16.2,
    occupancy: '16 / 20 Seats',
    battery: 94,
  },
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
    lng: 74.635250,
    polygon: [
      [25.032080, 74.635170],
      [25.032080, 74.635340],
      [25.031920, 74.635340],
      [25.031920, 74.635170],
      [25.032080, 74.635170],
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
    name: 'Engineering Block',
    shortName: 'Engineering Block',
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
      [25.033904, 74.634429],
      [25.033904, 74.634676],
      [25.033729, 74.634676],
      [25.033729, 74.634429],
      [25.033904, 74.634429],
    ],
    dept: 'Campus Hospitality & Visiting Dignitaries Lodge',
    elevation: 'Ground + Floor 1',
    description: 'Furnished suites for visiting faculty, academic guest lecturers, delegates, and parent accommodations located near the west entrance avenue.',
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
      [25.034099, 74.634397],
      [25.034099, 74.634644],
      [25.033933, 74.634644],
      [25.033933, 74.634397],
      [25.034099, 74.634397],
    ],
    dept: 'Female Student Residential Precinct (Central Wing)',
    elevation: 'Blocks A & B',
    description: 'Secure female residence quarters with central open courtyard, reading hall, and dedicated warden outpost situated between Panna and Guest House.',
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
    lat: 25.034260,
    lng: 74.634450,
    polygon: [
      [25.034293, 74.634386],
      [25.034293, 74.634612],
      [25.034128, 74.634601],
      [25.034128, 74.634376],
      [25.034293, 74.634386],
    ],
    dept: 'Female Student Residential Precinct (North Courtyard Wing)',
    elevation: 'Blocks 1 & 2',
    description: 'Secure female student quarters, air-cooled living units, and study rooms located north of Mira Hostel and south of Padmani Hostel.',
  },
  padmani: {
    id: 'padmani',
    code: 'HST-09',
    name: 'Padmani Girls Residential Hostel',
    shortName: 'Padmani Hostel',
    category: 'facility',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    icon: '🏠',
    lat: 25.034500,
    lng: 74.634280,
    polygon: [
      [25.034620, 74.634140],
      [25.034680, 74.634340],
      [25.034400, 74.634420],
      [25.034340, 74.634220],
      [25.034620, 74.634140],
    ],
    dept: 'Female Student Residential Precinct (North Wing)',
    elevation: 'Blocks 1–3',
    description: 'Secure female student accommodation complex located immediately north of Panna Hostel featuring rooftop solar array, air-cooled rooms, study hall, and 24/7 security station.',
  },
  hospital: {
    id: 'hospital',
    code: 'MED-01',
    name: 'Hospital and Gora Hostel',
    shortName: 'Hospital and Gora Hostel',
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
    name: 'Hospital and Gora Hostel',
    shortName: 'Hospital and Gora Hostel',
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
    name: 'Sanga Hostel',
    shortName: 'Sanga Hostel',
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

// Aliases for backwards compatibility with legacy routes/bookmarks and satellite annotations
CAMPUS_GIS_LOCATIONS.admin = CAMPUS_GIS_LOCATIONS.main;
CAMPUS_GIS_LOCATIONS.main_building = CAMPUS_GIS_LOCATIONS.main;
CAMPUS_GIS_LOCATIONS.cafeteria = CAMPUS_GIS_LOCATIONS.mess;
CAMPUS_GIS_LOCATIONS.dining_mess = CAMPUS_GIS_LOCATIONS.mess;
CAMPUS_GIS_LOCATIONS.hostel_b = CAMPUS_GIS_LOCATIONS.sanaga;
CAMPUS_GIS_LOCATIONS.sanga = CAMPUS_GIS_LOCATIONS.sanaga;
CAMPUS_GIS_LOCATIONS.sanga_hostel = CAMPUS_GIS_LOCATIONS.sanaga;
CAMPUS_GIS_LOCATIONS.bhamasha_hostel = CAMPUS_GIS_LOCATIONS.bhamasha;
CAMPUS_GIS_LOCATIONS.kumbha_hostel = CAMPUS_GIS_LOCATIONS.kumbha;
CAMPUS_GIS_LOCATIONS.pratap_hostel = CAMPUS_GIS_LOCATIONS.pratap;
CAMPUS_GIS_LOCATIONS.badal_hostel = CAMPUS_GIS_LOCATIONS.badal;
CAMPUS_GIS_LOCATIONS.engineering = CAMPUS_GIS_LOCATIONS.eng;
CAMPUS_GIS_LOCATIONS.engineering_block = CAMPUS_GIS_LOCATIONS.eng;
CAMPUS_GIS_LOCATIONS.hospital_gora = CAMPUS_GIS_LOCATIONS.gora;
CAMPUS_GIS_LOCATIONS.hospital_and_gora_hostel = CAMPUS_GIS_LOCATIONS.gora;
CAMPUS_GIS_LOCATIONS.gora_hostel = CAMPUS_GIS_LOCATIONS.gora;
CAMPUS_GIS_LOCATIONS.law_building = CAMPUS_GIS_LOCATIONS.law;
CAMPUS_GIS_LOCATIONS.hostel_g = CAMPUS_GIS_LOCATIONS.mira;
CAMPUS_GIS_LOCATIONS.mira_hostel = CAMPUS_GIS_LOCATIONS.mira;
CAMPUS_GIS_LOCATIONS.padmani_hostel = CAMPUS_GIS_LOCATIONS.padmani;
CAMPUS_GIS_LOCATIONS.panna_hostel = CAMPUS_GIS_LOCATIONS.panna;
CAMPUS_GIS_LOCATIONS.sports = CAMPUS_GIS_LOCATIONS.basketball;
CAMPUS_GIS_LOCATIONS.basketball_ground = CAMPUS_GIS_LOCATIONS.basketball;
CAMPUS_GIS_LOCATIONS.volleyball_ground = CAMPUS_GIS_LOCATIONS.volleyball;
CAMPUS_GIS_LOCATIONS.fitness_center = CAMPUS_GIS_LOCATIONS.gym;
CAMPUS_GIS_LOCATIONS.library = CAMPUS_GIS_LOCATIONS.pratap;
CAMPUS_GIS_LOCATIONS.auditorium = CAMPUS_GIS_LOCATIONS.football;
CAMPUS_GIS_LOCATIONS.mandir = CAMPUS_GIS_LOCATIONS.temple;
CAMPUS_GIS_LOCATIONS.farm = CAMPUS_GIS_LOCATIONS.agriculture;
CAMPUS_GIS_LOCATIONS.agriculture_field = CAMPUS_GIS_LOCATIONS.agriculture;
CAMPUS_GIS_LOCATIONS.campus_park = CAMPUS_GIS_LOCATIONS.park;

// Ray-casting point-in-polygon algorithm to detect clicks anywhere on building footprints
export function isPointInPolygon(point, vs) {
  if (!vs || !vs.length) return false;
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

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

// Great-circle initial bearing in degrees (0 - 360)
export function calculateBearing(startLat, startLng, destLat, destLng) {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;
  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
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
    n_gate1: [25.032009, 74.635250],
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
    n_guest_house: [25.033780, 74.634550],
    n_mira: [25.034085, 74.634523],
    n_panna: [25.034260, 74.634450],
    n_padmani: [25.034500, 74.634280],
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
    ["n_padmani", "r_35"],
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
  const distStartToCampus = calculateDistanceMeters(sLat, sLng, DEFAULT_CAMPUS_CENTER[0], DEFAULT_CAMPUS_CENTER[1]);
  if (distStartToCampus <= 1500) {
    rawWaypoints.push([sLat, sLng]);
  }

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


export const CAMPUS_HOSTEL_OPTIONS = [
  { id: 'kumbha', name: 'Maharana Kumbha Boys Hostel', shortName: 'Kumbha Hostel', tag: 'Boys' },
  { id: 'pratap', name: 'Maharana Pratap Boys Hostel', shortName: 'Pratap Hostel', tag: 'Boys' },
  { id: 'badal', name: 'Badal Boys Residential Hostel', shortName: 'Badal Hostel', tag: 'Boys' },
  { id: 'sanaga', name: 'Sanga Boys Hostel', shortName: 'Sanga Hostel', tag: 'Boys' },
  { id: 'bhamasha', name: 'Bhamasha Boys Hostel', shortName: 'Bhamasha Hostel', tag: 'Boys' },
  { id: 'gora', name: 'Hospital and Gora Hostel', shortName: 'Gora Hostel', tag: 'Boys' },
  { id: 'mira', name: 'Mira Girls Residential Hostel', shortName: 'Mira Hostel', tag: 'Girls' },
  { id: 'padmani', name: 'Padmani Girls Hostel', shortName: 'Padmani Hostel', tag: 'Girls' },
  { id: 'panna', name: 'Panna Girls Residential Hostel', shortName: 'Panna Hostel', tag: 'Girls' },
  { id: 'gate', name: 'Main Campus Gate 1 (NH-48)', shortName: 'Gate 1', tag: 'Gate' },
];

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
  onStartLiveGps,
  onToggleLiveGps,
  isSimulatingWalk,
  setIsSimulatingWalk,
  simulationProgress,
  setSimulationProgress,
  onNavigationUpdate,
  isDrawerOpen = false,
  isNavPanelOpen = true,
  onOpenDetails,
  autoFollow = true,
  onToggleAutoFollow,
  breadcrumbs = [],
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const breadcrumbsLayerRef = useRef(null);
  const customDestMarkerRef = useRef(null);
  const routeCasingPolylineRef = useRef(null);
  const routePolylineRef = useRef(null);
  const routePulsePolylineRef = useRef(null);
  const buildingMarkersRef = useRef({});
  const buildingPolygonsRef = useRef({});
  const tileLayerRef = useRef(null);
  const perimeterLayerRef = useRef(null);
  const roadsLayerRef = useRef([]);
  const shuttleMarkersRef = useRef({});
  const shuttlePathLayersRef = useRef({});
  const [localAutoFollow, setLocalAutoFollow] = useState(true);
  const isFollowActive = autoFollow !== undefined ? autoFollow : localAutoFollow;

  // Map Tile Style: 'satellite' | 'streets'
  const [mapLayerStyle, setMapLayerStyle] = useState('satellite');
  // Toggleable Map Legend
  const [showLegend, setShowLegend] = useState(false);
  // Minimizable active destination card
  const [isDestinationCardMinimized, setIsDestinationCardMinimized] = useState(false);
  // Quick Hostel Picker when user is in hostel or off-campus IP is detected
  const [showHostelPicker, setShowHostelPicker] = useState(false);

  const handleSnapToHostel = (hostelKey) => {
    const loc = CAMPUS_GIS_LOCATIONS[hostelKey] || CAMPUS_GIS_LOCATIONS.kumbha;
    if (!loc) return;
    const newCoords = {
      lat: loc.lat,
      lng: loc.lng,
      accuracy: 5,
      heading: 0,
      speed: 1.2,
      timestamp: Date.now(),
      isManualHostel: true,
      hostelName: loc.shortName || loc.name,
    };
    if (setUserCoords) {
      setUserCoords(newCoords);
    }
    if (setIsLiveGpsActive) {
      setIsLiveGpsActive(true);
    }
    setLocalAutoFollow(true);
    if (onToggleAutoFollow) onToggleAutoFollow(true);
    setShowHostelPicker(false);
    try {
      localStorage.setItem('nc_preferred_hostel', hostelKey);
    } catch (e) {}
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([loc.lat, loc.lng], 18.5, { animate: true, duration: 1 });
    }
  };

  // Restore destination card when destination changes
  useEffect(() => {
    setIsDestinationCardMinimized(false);
  }, [selectedBuildingKey, customDestination]);

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

  // Initialize Leaflet Map (defaults to Campus or user's live position)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter =
        userCoords && userCoords.lat && userCoords.lng
          ? [userCoords.lat, userCoords.lng]
          : DEFAULT_CAMPUS_CENTER;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 17.5,
        minZoom: 16.2, // Prevents user from minimizing / zooming out beyond campus boundary
        maxZoom: 20, // High-resolution building footprint & pathway zoom (upscaled cleanly beyond native zoom)
        maxBounds: [
          [25.0230, 74.6280], // SW buffer around NH-48 & Gate 1
          [25.0420, 74.6440], // NE buffer around North Living Quad & sports grounds
        ],
        maxBoundsViscosity: 0.9, // Firm elastic resistance against panning outside campus
        zoomControl: false,
        attributionControl: false,
      });

      // Pause auto-follow when user manually drags or touches the map
      map.on('dragstart', () => {
        setLocalAutoFollow(false);
        if (onToggleAutoFollow) onToggleAutoFollow(false);
      });

      // Initialize base tile layer with maxNativeZoom protection
      tileLayerRef.current = createTileLayer(mapLayerStyle).addTo(map);

      // Add Zoom Control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Live Breadcrumb Trail Polyline
      breadcrumbsLayerRef.current = L.polyline([], {
        color: '#10B981',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
        lineCap: 'round',
      }).addTo(map);

      // 1. INVERSE SHADED MASK: Subtle university perimeter shading
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
        fillOpacity: 0.12,
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
      userMarkerRef.current = null;
      userAccuracyCircleRef.current = null;
      breadcrumbsLayerRef.current = null;
      customDestMarkerRef.current = null;
      routeCasingPolylineRef.current = null;
      routePolylineRef.current = null;
      routePulsePolylineRef.current = null;
      buildingMarkersRef.current = {};
      buildingPolygonsRef.current = {};
      tileLayerRef.current = null;
      perimeterLayerRef.current = null;
      roadsLayerRef.current = [];
      shuttleMarkersRef.current = {};
      shuttlePathLayersRef.current = {};
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

      // 1. Draw Visible Building Footprint Polygon (Transparent interior, crisp colored boundary)
      let polyCenter = null;
      if (bldg.polygon) {
        const poly = L.polygon(bldg.polygon, {
          color: isSelected ? '#10B981' : (bldg.color || '#168567'),
          weight: isSelected ? 3.5 : 2,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: isSelected ? '6, 4' : null,
          interactive: true,
        }).addTo(map);

        try {
          polyCenter = poly.getBounds().getCenter();
        } catch (e) {
          polyCenter = null;
        }

        poly.on('click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          if (onClearCustomDestination) onClearCustomDestination();
          if (onSelectBuilding) onSelectBuilding(key);
        });

        // Hover tooltip showing building name
        poly.bindTooltip(`<b>${bldg.shortName || bldg.name}</b>`, {
          permanent: isSelected,
          direction: 'center',
          className: 'mewar-tooltip',
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

      // Compute precise alignment coordinate (exact polygon centroid or bldg coordinate)
      const markerPosition = polyCenter ? [polyCenter.lat, polyCenter.lng] : [bldg.lat, bldg.lng];
      const pinSize = isSelected ? 36 : 30;

      // 2. Draw Sleek Modern Circular Symbol Marker Pin (Icon Only, Perfectly Centered on Building)
      const markerHtml = `
        <div class="mewar-symbol-pin ${isSelected ? 'pin-selected' : ''}" style="
          width: ${pinSize}px;
          height: ${pinSize}px;
          border-radius: 50%;
          background: ${isSelected ? 'linear-gradient(135deg, #047857, #10B981)' : 'rgba(255, 255, 255, 0.96)'};
          color: ${isSelected ? '#FFFFFF' : (bldg.color || '#168567')};
          border: 2px solid ${isSelected ? '#FFFFFF' : (bldg.color || '#168567')};
          box-shadow: ${isSelected ? '0 0 0 3px rgba(16, 185, 129, 0.45), 0 8px 20px rgba(0,0,0,0.45)' : '0 3px 10px rgba(0,0,0,0.32)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? '18px' : '15px'};
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          ${bldg.icon}
        </div>
      `;

      const markerIcon = L.divIcon({
        html: markerHtml,
        className: 'mewar-gis-marker',
        iconSize: [pinSize, pinSize],
        iconAnchor: [pinSize / 2, pinSize / 2],
      });

      const marker = L.marker(markerPosition, { icon: markerIcon }).addTo(map);

      // Hover tooltip on the circular marker symbol
      marker.bindTooltip(`<b>${bldg.shortName || bldg.name}</b>`, {
        direction: 'top',
        offset: [0, -(pinSize / 2 + 2)],
        className: 'mewar-tooltip',
      });

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
    if (routeCasingPolylineRef.current && map.hasLayer(routeCasingPolylineRef.current)) {
      routeCasingPolylineRef.current.setLatLngs(routePoints);
    } else {
      if (routeCasingPolylineRef.current) {
        try { routeCasingPolylineRef.current.remove(); } catch (e) {}
      }
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
    if (routePolylineRef.current && map.hasLayer(routePolylineRef.current)) {
      routePolylineRef.current.setLatLngs(routePoints);
      routePolylineRef.current.setStyle({
        color: '#1D4ED8',
      });
    } else {
      if (routePolylineRef.current) {
        try { routePolylineRef.current.remove(); } catch (e) {}
      }
      routePolylineRef.current = L.polyline(routePoints, {
        color: '#1D4ED8',
        weight: 4.8,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // 3. Route Animated Pulse Line (Google Maps Directional Chevron / Dashed stream)
    if (routePulsePolylineRef.current && map.hasLayer(routePulsePolylineRef.current)) {
      routePulsePolylineRef.current.setLatLngs(routePoints);
    } else {
      if (routePulsePolylineRef.current) {
        try { routePulsePolylineRef.current.remove(); } catch (e) {}
      }
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

  // Update User Marker, Heading Cone, Accuracy Circle & Auto-Follow
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords || !userCoords.lat || !userCoords.lng) return;

    const heading = userCoords.heading || 0;
    const userHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div class="user-live-cone" style="
          position: absolute;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 26px solid rgba(16, 185, 129, 0.5);
          filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.7));
          top: -14px;
          transform-origin: 50% 100%;
          transform: rotate(${heading}deg);
          transition: transform 0.2s ease-out;
          pointer-events: none;
        "></div>
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.22);
          border: 1.5px solid #10B981;
          animation: userRadarPulse 2s infinite ease-out;
          pointer-events: none;
        "></div>
        <div style="
          position: relative;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.9), 0 2px 4px rgba(0, 0, 0, 0.4);
          z-index: 2;
        "></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-live-beacon',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const isMarkerAttached = userMarkerRef.current && map.hasLayer(userMarkerRef.current);
    if (isMarkerAttached) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      const cone = userMarkerRef.current.getElement()?.querySelector('.user-live-cone');
      if (cone) {
        cone.style.transform = `rotate(${heading}deg)`;
      }
    } else {
      if (userMarkerRef.current) {
        try { userMarkerRef.current.remove(); } catch (e) {}
      }
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      userMarkerRef.current.bindTooltip('<b>Your Live Location</b>', { permanent: false, direction: 'top', className: 'mewar-tooltip' });
    }

    const isCircleAttached = userAccuracyCircleRef.current && map.hasLayer(userAccuracyCircleRef.current);
    if (isCircleAttached) {
      userAccuracyCircleRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      userAccuracyCircleRef.current.setRadius(userCoords.accuracy || 8);
    } else {
      if (userAccuracyCircleRef.current) {
        try { userAccuracyCircleRef.current.remove(); } catch (e) {}
      }
      userAccuracyCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
        radius: userCoords.accuracy || 8,
        color: '#10B981',
        fillColor: '#34D399',
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map);
    }

    // Auto-follow user as they move with their device (limit auto-pan to campus vicinity so desktop IP locations do not drag map 200km away)
    if (isFollowActive) {
      const dist = calculateDistanceMeters(userCoords.lat, userCoords.lng, DEFAULT_CAMPUS_CENTER[0], DEFAULT_CAMPUS_CENTER[1]);
      if (dist <= 5000) {
        map.panTo([userCoords.lat, userCoords.lng], { animate: true, duration: 0.5 });
      }
    }
  }, [userCoords, isFollowActive]);

  // Sync live breadcrumbs polyline on 2D map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      const latLngs = breadcrumbs.map(([lng, lat]) => [lat, lng]);
      if (breadcrumbsLayerRef.current && map.hasLayer(breadcrumbsLayerRef.current)) {
        breadcrumbsLayerRef.current.setLatLngs(latLngs);
      } else {
        breadcrumbsLayerRef.current = L.polyline(latLngs, {
          color: '#10B981',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 8',
          lineCap: 'round',
        }).addTo(map);
      }
    }
  }, [breadcrumbs]);

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
    if (!isLiveGpsActive && onStartLiveGps) {
      onStartLiveGps();
    }
    setLocalAutoFollow(true);
    if (onToggleAutoFollow) onToggleAutoFollow(true);
    if (map && userCoords?.lat && userCoords?.lng) {
      map.flyTo([userCoords.lat, userCoords.lng], 18, { animate: true, duration: 0.8 });
    }
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(DEFAULT_CAMPUS_CENTER, 17.5, { animate: true, duration: 1 });
  };

  const distFromCampus = userCoords
    ? calculateDistanceMeters(userCoords.lat, userCoords.lng, DEFAULT_CAMPUS_CENTER[0], DEFAULT_CAMPUS_CENTER[1])
    : 0;
  const isOffCampus = distFromCampus > 1500;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Canvas Mount */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* FLOATING LIVE TRACKING STATUS BADGE */}
      <div
        className="flex items-center"
        style={{
          position: 'absolute',
          top: '16px',
          left: isNavPanelOpen ? '420px' : '264px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 25,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          padding: '6px 14px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: 'var(--shadow-md)',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#FFFFFF',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isLiveGpsActive ? '#10B981' : '#F59E0B',
            boxShadow: isLiveGpsActive ? '0 0 8px #10B981' : 'none',
            display: 'inline-block',
          }}
        />
        <Compass size={13} style={{ color: isLiveGpsActive ? '#10B981' : '#F59E0B' }} />
        <span>
          {isLiveGpsActive
            ? isOffCampus
              ? userCoords?.isManualHostel
                ? `📍 Live in ${userCoords.hostelName} • Campus Zone`
                : `Wi-Fi / IP Location • ${(distFromCampus / 1000).toFixed(1)} km from Campus`
              : userCoords?.isManualHostel
                ? `📍 Live in ${userCoords.hostelName} • Campus Zone`
                : `Live Location Active • Campus Zone • ±${userCoords?.accuracy || 6}m`
            : 'Mewar University • 30-Acre Campus'}
        </span>
        {isLiveGpsActive ? (
          <button
            type="button"
            onClick={handleCenterOnUser}
            title={isFollowActive ? 'Auto-following your position' : 'Click to center on your position'}
            style={{
              background: isFollowActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #10B981',
              color: '#34D399',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              cursor: 'pointer',
              marginLeft: '4px',
            }}
          >
            {isFollowActive ? 'Following You' : 'Center on Me'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCenterOnUser}
            title="Start live GPS tracking"
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #F59E0B',
              color: '#FCD34D',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              cursor: 'pointer',
              marginLeft: '4px',
            }}
          >
            Enable GPS
          </button>
        )}
        {/* QUICK HOSTEL SNAP BUTTON (Essential for students on Wi-Fi / Laptops) */}
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <button
            type="button"
            onClick={() => setShowHostelPicker((prev) => !prev)}
            title="Snap your live position to your campus hostel"
            style={{
              background: isOffCampus
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'rgba(59, 130, 246, 0.25)',
              border: isOffCampus ? '1px solid #34D399' : '1px solid #60A5FA',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 9px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: isOffCampus ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🏨</span>
            <span>{userCoords?.isManualHostel ? userCoords.hostelName : "I'm in My Hostel"}</span>
            <span style={{ fontSize: '8px', opacity: 0.8 }}>▼</span>
          </button>

          {showHostelPicker && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                marginTop: '8px',
                left: '0',
                width: '270px',
                backgroundColor: 'rgba(15, 23, 42, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                padding: '10px',
                zIndex: 1000,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#F8FAFC' }}>
                    Select Your Hostel
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>
                    Set your true campus start location
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHostelPicker(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <div
                style={{
                  maxHeight: '230px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {CAMPUS_HOSTEL_OPTIONS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleSnapToHostel(h.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid transparent',
                      color: '#E2E8F0',
                      fontSize: '11px',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                      e.currentTarget.style.borderColor = '#10B981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <span>🛏️ {h.shortName}</span>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background:
                          h.tag === 'Girls'
                            ? 'rgba(244, 63, 94, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                        color: h.tag === 'Girls' ? '#FDA4AF' : '#93C5FD',
                      }}
                    >
                      {h.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {isOffCampus && (
          <button
            type="button"
            onClick={handleRecenter}
            title="Focus on Mewar University Campus"
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid #38BDF8',
              color: '#38BDF8',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              cursor: 'pointer',
            }}
          >
            Campus View
          </button>
        )}
      </div>

      {/* FLOATING CAMPUS DESTINATION CARD ON MAP (Shown when right drawer is closed) */}
      {activeDestination && !isDrawerOpen && (
        isDestinationCardMinimized ? (
          <div
            className="campus-map-floating-card absolute bottom-3 inset-x-3 md:bottom-auto md:top-16 md:right-4 md:inset-x-auto flex items-center justify-between gap-3 animate-fadeIn"
            style={{
              zIndex: 450,
              padding: '8px 12px',
              minWidth: '220px',
              maxWidth: '320px',
              cursor: 'pointer',
            }}
            onClick={() => setIsDestinationCardMinimized(false)}
            title="Click to expand destination card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: activeDestination.color || '#168567',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <span>{activeDestination.icon || (activeDestination.shortName ? activeDestination.shortName.charAt(0) : '🏛️')}</span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    border: '1.5px solid #FFFFFF',
                  }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-heading)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {activeDestination.shortName || activeDestination.name}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--brand-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>● Open</span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{activeDestination.code || 'Campus Zone'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleFitRoute}
                title="Recenter Camera on Route"
                aria-label="Recenter Camera"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
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
                <Crosshair size={13} />
              </button>
              <button
                type="button"
                onClick={() => setIsDestinationCardMinimized(false)}
                title="Expand Destination Card"
                aria-label="Expand Destination Card"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--brand-soft-bg)',
                  border: '1px solid var(--brand-soft-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="campus-map-floating-card absolute bottom-3 inset-x-3 md:bottom-auto md:top-16 md:right-4 md:inset-x-auto flex flex-col gap-2.5 animate-fadeIn"
            style={{ zIndex: 450 }}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleFitRoute}
                  title="Recenter Camera on Route"
                  aria-label="Recenter Camera on Route"
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
                <button
                  type="button"
                  onClick={() => setIsDestinationCardMinimized(true)}
                  title="Minimize Destination Card"
                  aria-label="Minimize Destination Card"
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
                  <Minimize2 size={14} />
                </button>
              </div>
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
        )
      )}

      {/* FLOATING MAP LEGEND (COLLAPSIBLE) */}
      {showLegend && (
        <div
          className="absolute bottom-16 right-3 md:bottom-20 md:right-16 bg-white rounded-xl border border-[var(--border-subtle)] shadow-xl p-3.5 sm:p-4 min-w-[210px] max-w-[calc(100vw - 32px)] flex flex-col gap-2.5 animate-fadeIn"
          style={{ zIndex: 450, backgroundColor: '#FFFFFF' }}
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

      {/* FLOATING BOTTOM-RIGHT QUICK ACTIONS (LOCATE, FIT ROUTE, RECENTER, & LEGEND) */}
      <div
        className="absolute bottom-3 right-3 md:bottom-6 md:right-4 flex flex-col gap-2"
        style={{ zIndex: 450 }}
      >
        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          title="Toggle Campus Legend"
          aria-label="Toggle Campus Legend"
          style={{
            width: '40px',
            height: '40px',
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

        <button
          type="button"
          onClick={handleCenterOnUser}
          title={isLiveGpsActive ? (isFollowActive ? 'Lock to My Location (Active)' : 'Center on My Location') : 'Enable Live GPS & Center'}
          aria-label="Center on My Location"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '11px',
            backgroundColor: isLiveGpsActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.96)',
            color: isLiveGpsActive ? '#FFFFFF' : 'var(--brand-primary)',
            border: isLiveGpsActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
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

        <button
          type="button"
          onClick={handleFitRoute}
          title="Fit Route View"
          aria-label="Fit Route View"
          style={{
            width: '40px',
            height: '40px',
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
            width: '40px',
            height: '40px',
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
