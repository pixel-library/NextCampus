import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Navigation,
  MapPin,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Accessibility,
  Bus,
  Plus,
  Minus,
  RotateCcw,
  BookOpen,
  Building,
  Activity,
  ChevronRight,
  X,
  Share2,
  ExternalLink,
  Edit3,
  Save,
  Trash2,
  Crosshair,
  Move,
  ShieldCheck,
  Check,
  Play,
  Pause,
  Maximize2,
  Flame,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import CampusGisMap, {
  CAMPUS_GIS_LOCATIONS,
  calculateDistanceMeters,
  DEFAULT_CAMPUS_CENTER,
} from '../components/map/CampusGisMap';

const INITIAL_BUILDINGS = {
  gate: {
    id: 'gate',
    code: 'GATE-10',
    name: 'Main Campus Gate (NH-48, Gangrar)',
    shortName: 'Main Campus Gate',
    block: 'Gate GATE-10',
    dept: 'National Highway 48 / 79 Campus Entrance',
    category: 'facility',
    x: 340,
    y: 740,
    width: 210,
    height: 130,
    description: 'Official entrance on NH-48 near Gangrar, automated RFID student verification barrier, and 24/7 security outpost.',
    occupancy: '45%',
    seats: 'Security Station',
    temp: '25.0°C',
    air: '380 ppm CO₂',
    accessibility: 'Barrier-Free Pedestrian Walkway',
    hours: 'Open 24/7',
    status: 'open',
    targetRoom: 'Security Control & Visitor Registration Outpost',
    targetDesc: 'NH-48 Pedestrian & Vehicle Portal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
    steps: [
      { num: 1, text: 'Current Location: NH-48 Campus Gate', sub: 'Security & Student Verification Desk', dist: '0 m' },
      { num: 2, text: 'Pass Security Turnstiles', sub: 'Enter into Central University Boulevard', dist: '30 m • 0.5 min' },
    ],
  },
  admin: {
    id: 'admin',
    code: 'ADM-01',
    name: 'Maharana Pratap Main Academic & Admin Block',
    shortName: 'Admin & Academic Block',
    block: 'Block ADM-01',
    dept: 'University Secretariat & Administrative Council',
    category: 'academic',
    x: 680,
    y: 280,
    width: 260,
    height: 160,
    description: 'Central university reception, registrar office, admissions desk, accounts, and examination branch.',
    occupancy: '62%',
    seats: '350 / 500 Capacity',
    temp: '22.0°C',
    air: '395 ppm CO₂',
    accessibility: 'Step-Free Ramp & Dual Lifts',
    hours: '08:30 AM – 06:00 PM',
    status: 'open',
    targetRoom: 'Room 102 (Ground Floor)',
    targetDesc: 'Admissions & Student Welfare Secretariat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
    steps: [
      { num: 1, text: 'Depart Main Campus Gate (NH-48)', sub: 'Enter through the main ceremonial archway', dist: '0 m' },
      { num: 2, text: 'Walk along Central Avenue', sub: 'Paved tree-lined walkway heading north', dist: '150 m • 2 min' },
      { num: 3, text: 'Arrive at Maharana Pratap Block', sub: 'Reception and administrative foyer', dist: '220 m • Total 3 min' },
    ],
  },
  eng: {
    id: 'eng',
    code: 'ENG-02',
    name: 'Faculty of Engineering & Technology',
    shortName: 'Engineering & AI Labs',
    block: 'Block ENG-02',
    dept: 'Department of Computer Science & Engineering (AI & ML)',
    category: 'academic',
    x: 1040,
    y: 190,
    width: 250,
    height: 160,
    description: 'High-performance research computing labs, Artificial Intelligence & ML center, IoT workstations, and smart classrooms.',
    occupancy: '74%',
    seats: '420 / 550 Seats',
    temp: '21.5°C',
    air: '410 ppm CO₂',
    accessibility: 'Smart Lifts, Ramps & Tactile Paths',
    hours: '08:00 AM – 08:00 PM',
    status: 'open',
    targetRoom: 'Lab B-204 (Level 2)',
    targetDesc: 'AI & Machine Learning Innovation Hub',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnsBFmdYqr6jHc-tYoJj9aCEEbfKyFo5L3SLupQ0ikKDdXvkE8ZnSUMjdGmIop8z5KCO7QmVOsIqHy9HYbjtta90SqR4wGPlU-2wqtRGDiq5rUGxAyV903zRKjRYWmoztCiNad357-F5wzNP-stQIagLuV-V9RJTr5eWXoeezLsB_Qjl-q6e13GHym0Nopm46ykpFUvv08rbvxuEQW96J72Y2DHoTV7V4NV_eChXmGJjkKxk7Yk9JxWA',
    steps: [
      { num: 1, text: 'Depart Maharana Pratap Block', sub: 'Cross Academic Quad East Pathway', dist: '0 m' },
      { num: 2, text: 'Follow Engineering Promenade', sub: 'Pass North Lawn towards Tech Wing', dist: '140 m • 1.8 min' },
      { num: 3, text: 'Ascend Lift to Floor 2', sub: 'Department of Computer Science', dist: '230 m • 3 min' },
      { num: 4, text: 'Arrive at Room B-204 (AI Hub)', sub: 'Destination on your right past corridor', dist: '280 m • Total 3.5 min' },
    ],
  },
  library: {
    id: 'library',
    code: 'LIB-03',
    name: 'Swami Vivekananda Central Library',
    shortName: 'Central Library',
    block: 'Block LIB-03',
    dept: 'Central Library & Digital Knowledge Commons',
    category: 'libraries',
    x: 320,
    y: 280,
    width: 220,
    height: 150,
    description: 'Over 50,000 academic volumes, IEEE/Elsevier e-journal division, quiet research pods, and 200+ reading seats.',
    occupancy: '48%',
    seats: '180 / 350 Seats',
    temp: '22.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Full ADA Elevator & Braille Nav',
    hours: '08:00 AM – 10:00 PM (24/7 in Exams)',
    status: 'open',
    targetRoom: 'Digital Commons (Floor 2)',
    targetDesc: 'Research Terminals & IEEE Reference',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q',
    steps: [
      { num: 1, text: 'Current Location: Library Foyer', sub: 'Main Circulation Desk & RFID Scanner', dist: '0 m' },
      { num: 2, text: 'Ascend to Level 2', sub: 'Reference & High-Speed Workstations', dist: '40 m • 1 min' },
    ],
  },
  auditorium: {
    id: 'auditorium',
    code: 'AUD-04',
    name: 'Mewar University Central Auditorium',
    shortName: 'Central Auditorium',
    block: 'Block AUD-04',
    dept: 'Cultural & Academic Convocation Center',
    category: 'facility',
    x: 720,
    y: 520,
    width: 240,
    height: 150,
    description: '500-seat multi-tiered air-conditioned auditorium for convocations, symposiums, and cultural fests.',
    occupancy: '30%',
    seats: '500 Capacity',
    temp: '21.0°C',
    air: '420 ppm CO₂',
    accessibility: 'Ground Floor Level Entrance',
    hours: '09:00 AM – 07:00 PM',
    status: 'open',
    targetRoom: 'Main Amphitheater Stage',
    targetDesc: 'Convocation & Seminar Stage',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
    steps: [
      { num: 1, text: 'Depart Maharana Pratap Block', sub: 'Walk South along central green quad', dist: '0 m' },
      { num: 2, text: 'Cross Cultural Plaza', sub: 'Direct paved pathway', dist: '110 m • 1.5 min' },
      { num: 3, text: 'Arrive at Auditorium Portico', sub: 'Main glass entrance doors', dist: '160 m • Total 2 min' },
    ],
  },
  cafeteria: {
    id: 'cafeteria',
    code: 'CAF-05',
    name: 'University Cafeteria & Food Court',
    shortName: 'Campus Cafeteria',
    block: 'Block CAF-05',
    dept: 'Student Dining & Amenities Hub',
    category: 'facility',
    x: 340,
    y: 510,
    width: 210,
    height: 140,
    description: 'Multi-cuisine campus canteen, tea & snack kiosk, student dining hall, and campus helpdesk station.',
    occupancy: '82%',
    seats: '220 / 280 Seats',
    temp: '23.0°C',
    air: '440 ppm CO₂',
    accessibility: 'Step-Free Ramp Access',
    hours: '07:30 AM – 10:30 PM',
    status: 'open',
    targetRoom: 'Central Dining Hall',
    targetDesc: 'Student Dining & Refreshments',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
    steps: [
      { num: 1, text: 'Depart Swami Vivekananda Library', sub: 'Walk south towards amenities zone', dist: '0 m' },
      { num: 2, text: 'Arrive at Cafeteria Court', sub: 'Ground floor dining entrance', dist: '120 m • 1.5 min' },
    ],
  },
  hostel_b: {
    id: 'hostel_b',
    code: 'HST-06',
    name: 'Aravalli Boys Residential Hostel',
    shortName: 'Aravalli Boys Hostel',
    block: 'Block HST-06',
    dept: 'Male Student Residence Precinct (Blocks 1–4)',
    category: 'facility',
    x: 1060,
    y: 470,
    width: 240,
    height: 150,
    description: 'Air-cooled residential blocks, Wi-Fi connectivity, recreation room, student mess, and 24/7 security outpost.',
    occupancy: '91%',
    seats: '360 Resident Capacity',
    temp: '22.8°C',
    air: '415 ppm CO₂',
    accessibility: 'Ramp and Ground Floor Units',
    hours: 'Open 24/7 (Gate curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Block 2 Warden Office & Common Room',
    targetDesc: 'Residential Administration Desk',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1V6NaAN18Lf9daDEOiUCcg0Qz9TKAJTZEk9ECU3aySgNV_3O2hapiSnHSeUeScEXSjx47TLmk0cx0dsb_ZVA9EORszw3fNNN0V5EICouIgNfcs0lFyeVR0z0-fBJTvFLwabJeDl7KTSnD62my8TfA-M8AVfxPtiTO4SRRFQokqKIaWdLNfZtih4yUWkpusJLlN7f8edtZ98cv56xSSZJgS1akZwa_mq0qR3mAERMOY_rHpGJyiEVsGYmjpP',
    steps: [
      { num: 1, text: 'Depart Faculty of Engineering', sub: 'Head southeast past Sports Arena', dist: '0 m' },
      { num: 2, text: 'Arrive at Aravalli Hostel Gate', sub: 'Turn into Block 1-4 residential corridor', dist: '180 m • 2.5 min' },
    ],
  },
  hostel_g: {
    id: 'hostel_g',
    code: 'HST-07',
    name: 'Meera Bai Girls Residential Hostel',
    shortName: 'Meera Bai Girls Hostel',
    block: 'Block HST-07',
    dept: 'Female Student Residence Precinct',
    category: 'facility',
    x: 1060,
    y: 710,
    width: 240,
    height: 150,
    description: 'Secure female student quarters, landscaped courtyard, study library, sports room, and dedicated dining mess.',
    occupancy: '88%',
    seats: '280 Resident Capacity',
    temp: '22.0°C',
    air: '400 ppm CO₂',
    accessibility: 'Fully Accessible Ground Level',
    hours: 'Open 24/7 (Gate curfew 09:00 PM)',
    status: 'open',
    targetRoom: 'Warden Office & Common Study Room',
    targetDesc: 'Residence Administration',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
    steps: [
      { num: 1, text: 'Depart Central Campus Promenade', sub: 'Walk south towards residential park', dist: '0 m' },
      { num: 2, text: 'Arrive at Meera Bai Hostel Gate', sub: 'Biometric security access entry', dist: '240 m • 3 min' },
    ],
  },
  sports: {
    id: 'sports',
    code: 'SPT-08',
    name: 'Mewar Sports Arena & Cricket Ground',
    shortName: 'Cricket & Sports Arena',
    block: 'Block SPT-08',
    dept: 'Department of Physical Education & Sports',
    category: 'facility',
    x: 1360,
    y: 310,
    width: 220,
    height: 180,
    description: 'Full-size cricket ground, outdoor athletic track, basketball courts, badminton pavilion, and fitness gym.',
    occupancy: '50%',
    seats: 'Open Pavilion 600 Seats',
    temp: '24.5°C',
    air: '380 ppm CO₂',
    accessibility: 'Step-Free Ground Level Arena',
    hours: '06:00 AM – 09:00 PM',
    status: 'open',
    targetRoom: 'Sports Pavilion & Equipment Room',
    targetDesc: 'Indoor Gymnasium & Badminton Pavilion',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
    steps: [
      { num: 1, text: 'Depart Faculty of Engineering', sub: 'Head East along stadium walkway', dist: '0 m' },
      { num: 2, text: 'Arrive at Sports Pavilion', sub: 'Athletic complex entrance', dist: '150 m • 2 min' },
    ],
  },
  hospital: {
    id: 'hospital',
    code: 'MED-09',
    name: 'Mewar University Hospital & Health Centre',
    shortName: 'University Hospital',
    block: 'Block MED-09',
    dept: 'Campus Medical & Emergency Care Services',
    category: 'facility',
    x: 720,
    y: 740,
    width: 240,
    height: 140,
    description: '24/7 on-campus health center, emergency ambulance service, resident doctors, and pharmacy dispensary.',
    occupancy: '25%',
    seats: '20 Inpatient Beds',
    temp: '21.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Emergency Stretcher & Wheelchair Ramp',
    hours: 'Open 24/7 Emergency Care',
    status: 'open',
    targetRoom: 'Emergency Triage & Consultation Room 1',
    targetDesc: 'Campus Medical Dispensary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q',
    steps: [
      { num: 1, text: 'Depart Main Campus Gate', sub: 'Follow medical signposts along East Perimeter', dist: '0 m' },
      { num: 2, text: 'Arrive at Health Centre Emergency Bay', sub: 'Ground floor triage entry', dist: '160 m • 2 min' },
    ],
  },
};

export const CampusMap = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'care_admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialBldg = searchParams.get('bldg') || 'eng';

  // Spatial data state
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [selectedBldg, setSelectedBldg] = useState(initialBldg);
  const [startPointMode, setStartPointMode] = useState('gate'); // 'gate' | 'gps'
  const [mobilityMode, setMobilityMode] = useState('walk'); // walk | wheelchair | shuttle
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewEngine, setViewEngine] = useState('gis'); // 'gis' | 'blueprint'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [facilitySearch, setFacilitySearch] = useState('');

  // GPS & Live Simulation State
  const [userCoords, setUserCoords] = useState({
    lat: 25.03080, // Mewar University Main Gate on NH-48
    lng: 74.63630,
    accuracy: 6,
    heading: 0,
    speed: 1.2,
  });
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [gpsError, setGpsError] = useState('');
  const [navigationStats, setNavigationStats] = useState({
    distanceMeters: 260,
    etaMinutes: 3,
    stepText: 'Walk along Central Avenue towards Faculty of Engineering',
  });

  const watchIdRef = useRef(null);
  const simulationTimerRef = useRef(null);

  // Admin Map Editor states
  const [adminMapMode, setAdminMapMode] = useState(isAdmin);
  const [isClickToPlace, setIsClickToPlace] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adminToast, setAdminToast] = useState('');
  const [isSavingGis, setIsSavingGis] = useState(false);

  // Edit building form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    category: 'academic',
    dept: '',
    description: '',
    x: 700,
    y: 300,
    width: 220,
    height: 140,
    hours: '',
    occupancy: '',
    targetRoom: '',
    targetDesc: '',
  });

  // Add building form state
  const [newBldgForm, setNewBldgForm] = useState({
    name: '',
    code: '',
    category: 'academic',
    dept: '',
    description: '',
    x: 480,
    y: 400,
    width: 200,
    height: 140,
    hours: '08:00 AM – 09:00 PM',
  });

  // Sync selected building when URL search params change
  useEffect(() => {
    const bldgFromUrl = searchParams.get('bldg');
    if (bldgFromUrl && buildings[bldgFromUrl]) {
      setSelectedBldg(bldgFromUrl);
    }
  }, [searchParams, buildings]);

  // Toast
  const triggerToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3500);
  };

  const currentBldg = buildings[selectedBldg] || buildings.eng || Object.values(buildings)[0];

  const handleSelectBuilding = (id) => {
    if (!buildings[id]) return;
    setSelectedBldg(id);
    setDrawerOpen(true);
    setSearchParams({ bldg: id });
  };

  // Real Hardware Browser GPS Tracking (watchPosition)
  const toggleLiveGps = () => {
    if (isLiveGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveGpsActive(false);
      setGpsError('');
      setStartPointMode('gate');
    } else {
      if (!('geolocation' in navigator)) {
        setGpsError('Geolocation is not supported by this browser.');
        return;
      }

      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
      setIsSimulatingWalk(false);
      setGpsError('');

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setIsLiveGpsActive(true);
          setStartPointMode('gps');
          const { latitude, longitude, accuracy, heading, speed } = pos.coords;
          setUserCoords({
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 8,
            heading: heading || 0,
            speed: speed || 1.2,
          });
        },
        (err) => {
          setIsLiveGpsActive(false);
          setGpsError(
            err.code === 1
              ? 'GPS Permission Denied. Use "Simulate Movement" to test navigation across Mewar University.'
              : 'Unable to acquire accurate GPS position.'
          );
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }
  };

  // Simulated Walking Movement
  const toggleSimulation = () => {
    if (isSimulatingWalk) {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
      setIsSimulatingWalk(false);
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveGpsActive(false);
      setIsSimulatingWalk(true);

      const dest = CAMPUS_GIS_LOCATIONS[selectedBldg] || CAMPUS_GIS_LOCATIONS.eng;
      const startLat = 25.03080; // Main Gate
      const startLng = 74.63630;
      const endLat = dest.lat;
      const endLng = dest.lng;

      let step = 0;
      const totalSteps = 30;

      simulationTimerRef.current = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        setSimulationProgress(Math.round(progress * 100));

        const nextLat = startLat + (endLat - startLat) * progress;
        const nextLng = startLng + (endLng - startLng) * progress;

        setUserCoords((prev) => ({
          ...prev,
          lat: nextLat,
          lng: nextLng,
          speed: 1.3,
        }));

        if (step >= totalSteps) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
          setIsSimulatingWalk(false);
          triggerToast(`Arrived at ${dest.name}!`);
        }
      }, 700);
    }
  };

  const handleResetLocation = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsSimulatingWalk(false);
    setSimulationProgress(0);
    setUserCoords({
      lat: 25.03080, // Main Gate
      lng: 74.63630,
      accuracy: 6,
      heading: 0,
      speed: 1.2,
    });
    setStartPointMode('gate');
    triggerToast('Location reset to Mewar University Main Gate (NH-48)');
  };

  // Nudge selected building on map canvas
  const handleNudgeBuilding = async (dx, dy) => {
    if (!isAdmin || !buildings[selectedBldg]) return;
    const bldg = buildings[selectedBldg];
    const newX = Math.max(20, Math.min(1500, bldg.x + dx));
    const newY = Math.max(20, Math.min(900, bldg.y + dy));

    setBuildings((prev) => ({
      ...prev,
      [selectedBldg]: {
        ...prev[selectedBldg],
        x: newX,
        y: newY,
      },
    }));

    triggerToast(`Moved ${bldg.name} to (X: ${newX}, Y: ${newY})`);
  };

  // Save building edits
  const handleSaveBuildingEdits = async (e) => {
    e.preventDefault();
    setIsSavingGis(true);
    setBuildings((prev) => ({
      ...prev,
      [selectedBldg]: {
        ...prev[selectedBldg],
        ...editFormData,
      },
    }));
    setShowEditModal(false);
    setIsSavingGis(false);
    triggerToast(`Updated ${editFormData.name} successfully.`);
  };

  // Delete building
  const handleDeleteBuilding = async () => {
    if (!window.confirm(`Delete facility "${currentBldg.name}"?`)) return;
    const updated = { ...buildings };
    delete updated[selectedBldg];
    setBuildings(updated);
    setShowEditModal(false);
    const nextKey = Object.keys(updated)[0] || 'eng';
    setSelectedBldg(nextKey);
    triggerToast(`Facility deleted.`);
  };

  // Create new building
  const handleCreateNewBuilding = async (e) => {
    e.preventDefault();
    setIsSavingGis(true);
    const slug = newBldgForm.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newEntry = {
      id: slug,
      ...newBldgForm,
      occupancy: '10%',
      seats: '60 Seats',
      temp: '22°C',
      air: '400 ppm CO₂',
      accessibility: 'Accessible Ramp',
      status: 'open',
      targetRoom: 'Room 101',
      targetDesc: 'Main Lab Space',
      image: currentBldg.image,
      steps: [
        { num: 1, text: 'Depart Main Quad', sub: 'Walk along Campus Promenade', dist: '0 m' },
        { num: 2, text: `Arrive at ${newBldgForm.name}`, sub: 'Entrance Foyer', dist: '150 m • 2 min' },
      ],
    };
    setBuildings((prev) => ({ ...prev, [slug]: newEntry }));
    setSelectedBldg(slug);
    setShowAddModal(false);
    setIsSavingGis(false);
    triggerToast(`Registered "${newBldgForm.name}" on map.`);
  };

  // Filter building list for directory
  const filteredBuildingList = Object.values(buildings).filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      b.dept.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      b.code.toLowerCase().includes(facilitySearch.toLowerCase());
    if (!matchesSearch) return false;

    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'academic') return b.category === 'academic';
    if (categoryFilter === 'libraries') return b.category === 'libraries';
    if (categoryFilter === 'facility') return b.category === 'facility';
    return true;
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* TOAST NOTIFICATION */}
      {adminToast && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            backgroundColor: 'rgba(158, 21, 62, 0.95)',
            color: '#FFFFFF',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{adminToast}</span>
        </div>
      )}

      {/* TOP UNIFIED SUB-HEADER TOOLBAR (Fixed 56px, Zero Overlap) */}
      <header
        style={{
          height: '56px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Left: Mewar University Campus Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
            }}
          >
            MU
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Mewar University
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Gangrar, Chittorgarh • 30-Acre Campus
            </div>
          </div>
        </div>

        {/* Center: View Engine Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewEngine('gis')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: viewEngine === 'gis' ? 'var(--brand-primary)' : 'transparent',
              color: viewEngine === 'gis' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            <Compass size={14} />
            <span>Campus GIS & GPS</span>
          </button>
          <button
            type="button"
            onClick={() => setViewEngine('blueprint')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: viewEngine === 'blueprint' ? 'var(--brand-primary)' : 'transparent',
              color: viewEngine === 'blueprint' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={14} />
            <span>Indoor Blueprint</span>
          </button>
        </div>

        {/* Right: Quick Status & Admin Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#16A34A',
              backgroundColor: '#F0FDF4',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid #BBF7D0',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
            <span>Campus Open</span>
          </div>

          {isAdmin && (
            <button
              onClick={() => setAdminMapMode(!adminMapMode)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--brand-primary)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: adminMapMode ? 'var(--brand-primary)' : '#FFFFFF',
                color: adminMapMode ? '#FFFFFF' : 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={14} />
              <span>{adminMapMode ? 'Admin Active' : 'Admin Tools'}</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN WORKSPACE: MAP CANVAS + FLOATING LEFT CARD + RIGHT DRAWER */}
      <div style={{ position: 'relative', flex: 1, width: '100%', overflow: 'hidden' }}>
        {/* FLOATING LEFT NAVIGATION & DIRECTORY CARD (Google Maps Style) */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            bottom: '16px',
            left: '16px',
            width: '370px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Card Section 1: Route Planning Inputs */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Origin Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Starting Point
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isLiveGpsActive ? '📍 My Current GPS Location' : '🚪 Main Campus Gate (NH-48)'}
                </div>
              </div>
            </div>

            {/* Destination Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-interactive)',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                  Destination
                </div>
                <select
                  value={selectedBldg}
                  onChange={(e) => handleSelectBuilding(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {Object.entries(buildings).map(([key, bldg]) => (
                    <option key={key} value={key}>
                      {bldg.name} ({bldg.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobility Mode Pills */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-subtle)', padding: '3px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setMobilityMode('walk')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: mobilityMode === 'walk' ? 'var(--brand-primary)' : 'transparent',
                  color: mobilityMode === 'walk' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                🚶 Walk
              </button>
              <button
                type="button"
                onClick={() => setMobilityMode('wheelchair')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: mobilityMode === 'wheelchair' ? 'var(--brand-primary)' : 'transparent',
                  color: mobilityMode === 'wheelchair' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                ♿ Step-Free
              </button>
              <button
                type="button"
                onClick={() => setMobilityMode('shuttle')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: mobilityMode === 'shuttle' ? 'var(--brand-primary)' : 'transparent',
                  color: mobilityMode === 'shuttle' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                🚐 EV Shuttle
              </button>
            </div>
          </div>

          {/* Card Section 2: Active Route Guidance HUD */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FFF1F2',
              borderBottom: '1px solid #FECDD3',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                Pedestrian Guidance
              </span>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                <span>{navigationStats.distanceMeters} m</span>
                <span>•</span>
                <span>{navigationStats.etaMinutes} min</span>
              </div>
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35 }}>
              {navigationStats.stepText}
            </div>
          </div>

          {/* Card Section 3: GPS & Walking Movement Buttons */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={toggleLiveGps}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-interactive)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: isLiveGpsActive ? '#16A34A' : '#FFFFFF',
                  color: isLiveGpsActive ? '#FFFFFF' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Compass size={15} className={isLiveGpsActive ? 'animate-spin' : ''} />
                <span>{isLiveGpsActive ? 'Live GPS Active' : 'Track My GPS'}</span>
              </button>

              <button
                type="button"
                onClick={toggleSimulation}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: isSimulatingWalk ? '#9E153E' : 'var(--bg-surface-subtle)',
                  color: isSimulatingWalk ? '#FFFFFF' : 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {isSimulatingWalk ? <Pause size={14} /> : <Play size={14} />}
                <span>{isSimulatingWalk ? `Walking ${simulationProgress}%` : 'Simulate Walk'}</span>
              </button>
            </div>

            {/* Reset button row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleResetLocation}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={12} />
                <span>Reset to Main Gate</span>
              </button>

              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{drawerOpen ? 'Hide Facility Card' : 'View Facility Card'}</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {gpsError && (
              <div style={{ fontSize: '10.5px', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '6px 8px', borderRadius: '6px' }}>
                {gpsError}
              </div>
            )}
          </div>

          {/* Card Section 4: Campus Facilities Directory List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Search input & category pills */}
            <div style={{ padding: '12px 16px 8px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search buildings, labs..."
                  value={facilitySearch}
                  onChange={(e) => setFacilitySearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Filter pills */}
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
                {[
                  { id: 'all', label: 'All (10)' },
                  { id: 'academic', label: 'Academic' },
                  { id: 'libraries', label: 'Library' },
                  { id: 'facility', label: 'Facilities' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor: categoryFilter === cat.id ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                      color: categoryFilter === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Building list items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredBuildingList.map((bldg) => {
                const isSelected = selectedBldg === bldg.id;
                return (
                  <div
                    key={bldg.id}
                    onClick={() => handleSelectBuilding(bldg.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#FFF1F2' : '#FFFFFF',
                      border: `1px solid ${isSelected ? '#FECDD3' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                          {bldg.code}
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#16A34A' }}>
                          ● {bldg.occupancy}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {bldg.shortName || bldg.name}
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAP CANVAS ENGINE (Leaflet GIS vs Blueprint SVG) */}
        {viewEngine === 'gis' ? (
          <div style={{ width: '100%', height: '100%' }}>
            <CampusGisMap
              selectedBuildingKey={selectedBldg}
              onSelectBuilding={handleSelectBuilding}
              mobilityMode={mobilityMode}
              userCoords={userCoords}
              setUserCoords={setUserCoords}
              isLiveGpsActive={isLiveGpsActive}
              setIsLiveGpsActive={setIsLiveGpsActive}
              isSimulatingWalk={isSimulatingWalk}
              setIsSimulatingWalk={setIsSimulatingWalk}
              simulationProgress={simulationProgress}
              setSimulationProgress={setSimulationProgress}
              onNavigationUpdate={setNavigationStats}
            />
          </div>
        ) : (
          /* INDOOR BLUEPRINT SVG ENGINE */
          <div style={{ width: '100%', height: '100%', backgroundColor: '#F8FAFC', cursor: isClickToPlace ? 'crosshair' : 'default', overflow: 'hidden' }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1600 1000"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
            >
              <defs>
                <pattern id="campusGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1600" height="1000" fill="#F8FAFC" />
              <rect width="1600" height="1000" fill="url(#campusGridPattern)" />

              {/* Green Lawns */}
              <path d="M 50,40 L 450,20 L 520,240 L 80,300 Z" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1.5" />
              <path d="M 550,280 L 1050,260 L 1080,560 L 520,580 Z" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1.5" />

              {/* Central Promenade Roadways */}
              <path d="M -20,180 L 480,180 L 820,120 L 1620,130" stroke="#E2E8F0" strokeWidth="24" strokeLinecap="round" />
              <path d="M 480,180 L 480,820 L 1620,840" stroke="#E2E8F0" strokeWidth="24" strokeLinecap="round" />

              {/* DYNAMICALLY RENDERED INTERACTIVE BUILDINGS */}
              {filteredBuildingList.map((bldg) => {
                const isSelected = selectedBldg === bldg.id;
                const w = bldg.width || 220;
                const h = bldg.height || 140;
                const cx = bldg.x + w / 2;
                const cy = bldg.y + h / 2;

                return (
                  <g
                    key={bldg.id}
                    onClick={() => handleSelectBuilding(bldg.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <rect
                        x={bldg.x - 6}
                        y={bldg.y - 6}
                        width={w + 12}
                        height={h + 12}
                        rx="14"
                        fill="none"
                        stroke="var(--brand-primary)"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                      />
                    )}

                    <rect
                      x={bldg.x}
                      y={bldg.y}
                      width={w}
                      height={h}
                      rx="10"
                      fill={isSelected ? 'var(--brand-primary)' : '#FFFFFF'}
                      stroke={isSelected ? '#E11D48' : '#CBD5E1'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />

                    <text
                      x={cx}
                      y={cy - 10}
                      fill={isSelected ? '#FFFFFF' : '#0F172A'}
                      fontSize="14"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {bldg.shortName || bldg.name}
                    </text>

                    <text
                      x={cx}
                      y={cy + 12}
                      fill={isSelected ? '#FCE7F3' : '#64748B'}
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {bldg.code} {isSelected ? '• Selected' : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* SELECTED BUILDING DETAIL DRAWER (Right Slide-over, Zero Overlap) */}
        {drawerOpen && currentBldg && (
          <aside
            style={{
              position: 'absolute',
              top: '16px',
              bottom: '16px',
              right: '16px',
              width: '360px',
              maxWidth: 'calc(100vw - 32px)',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 36px rgba(15, 23, 42, 0.14)',
              border: '1px solid var(--border-subtle)',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header Image */}
            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
              <img src={currentBldg.image} alt={currentBldg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={15} />
              </button>

              <div style={{ position: 'absolute', bottom: '10px', left: '14px', display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#FFFFFF', color: 'var(--brand-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                  {currentBldg.hours}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                    {currentBldg.dept}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditFormData(currentBldg);
                        setShowEditModal(true);
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px 0' }}>
                  {currentBldg.name}
                </h3>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {currentBldg.description}
                </p>
              </div>

              {/* Quick Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Occupancy</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)' }}>{currentBldg.occupancy}</div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.seats}</span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>HVAC Temp</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{currentBldg.temp}</div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.air}</span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ramp ADA</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A34A' }}>Pass</div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Full Access</span>
                </div>
              </div>

              {/* Target Space */}
              <div style={{ backgroundColor: '#FFF1F2', padding: '10px 12px', borderRadius: '10px', border: '1px solid #FECDD3' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                  Primary Facility Node
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {currentBldg.targetRoom}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {currentBldg.targetDesc}
                </div>
              </div>

              {/* Step Directions */}
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Walking Route from Main Gate
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentBldg.steps.map((st) => (
                    <div key={st.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {st.num}
                      </span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{st.text}</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{st.sub} ({st.dist})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ADMIN EDIT MODAL */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Edit Facility: {editFormData.name}</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveBuildingEdits} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Facility Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-interactive)', marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <button type="button" onClick={handleDeleteBuilding} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                  Delete Facility
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Save Changes</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMap;
