import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DoorOpen,
  Users,
  Wind,
  Thermometer,
  Wifi,
  Volume2,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Search,
  ArrowRight,
  Navigation,
  Layers,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Info,
  Building2,
  Smartphone,
  Copy,
  Check,
  X,
  Activity,
  Sliders,
  Radio,
  Eye,
  Zap,
  Lock,
  Unlock,
  CornerUpRight,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';

// ============================================================================
// DATA: Comprehensive Campus Rooms & Architectural CAD Metadata
// ============================================================================
const INITIAL_ROOMS = [
  // --- Block ENG-02 (Faculty of Engineering & Technology) - Level 2 ---
  {
    id: 'B-204',
    roomNumber: 'B-204',
    name: 'Multi-Media Lecture Theatre & AI Hub',
    type: 'Lecture Theatres',
    building: 'Faculty of Engineering & Technology (Block ENG-02)',
    buildingCode: 'ENG-02',
    floor: 'Level 2',
    capacity: 60,
    currentOccupancy: 18,
    status: 'available',
    statusText: 'Open (Free Till 1:00 PM)',
    nextClass: 'CS-301 Operating Systems at 1:00 PM',
    co2: 410,
    co2Status: 'Pristine Clean Air',
    temp: 21.8,
    tempTarget: 22.0,
    humidity: 44,
    noiseDb: 34,
    noiseStatus: 'Whisper Quiet (<35dB)',
    wifiSpeed: '820 Mbps',
    wifiLatency: '3 ms',
    wifiDevices: 18,
    features: [
      'Dual 4K Laser Projection + Spatial Rig',
      'Motorized Lectern (USB-C Thunderbolt 4)',
      'Wi-Fi 7 Enterprise Core AP',
      'ADA Front Row & Hearing Loop',
      'HVAC HEPA Air Purification',
    ],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    has4kLaser: true,
    hasGpu: false,
    hasInteractive: true,
    isAda: true,
    cadBox: { x: 260, y: 340, w: 180, h: 160, door: { x: 350, y: 340 } },
    routeSteps: [
      { step: '1. Cross Level 2 Skybridge', desc: 'Enter Alan Turing Hall through automatic glass sliding doors (0m)' },
      { step: '2. Continue down North Main Corridor', desc: 'Walk straight past Restrooms and West Lifts (25m)' },
      { step: '3. Turn Left at Student Lounge', desc: 'Follow illuminated directional wayfinding (15m)' },
      { step: '4. Arrive at Room B-204', desc: 'On your right side. Double acoustic doors with NFC smart lock (8m)' },
    ],
    routeDistance: '48 meters (1.2 min walk)',
    slots: [
      { id: 'b204-1', start: '08:00', end: '09:30', title: 'Data Structures (CS-201)', lecturer: 'Prof. Sharma', status: 'past', isBookable: false },
      { id: 'b204-2', start: '09:30', end: '11:30', title: 'Algorithm Lab Section A', lecturer: 'Dr. Verma', status: 'occupied', isBookable: false },
      { id: 'b204-3', start: '11:30', end: '13:00', title: 'Open Collaborative Lab Access', lecturer: 'Unassigned', status: 'available', isBookable: true },
      { id: 'b204-4', start: '13:00', end: '14:30', title: 'CS-301 Operating Systems', lecturer: 'Dr. Verma', status: 'reserved', isBookable: false },
      { id: 'b204-5', start: '14:30', end: '16:30', title: 'Open Team Project Study Slot', lecturer: 'Open Access', status: 'available', isBookable: true },
      { id: 'b204-6', start: '16:30', end: '18:30', title: 'Evening Capstone Lab Access', lecturer: 'Open Access', status: 'available', isBookable: true },
    ],
  },
  {
    id: 'B-203',
    roomNumber: 'B-203',
    name: 'Distributed Systems & Cloud Lab',
    type: 'Computer Labs',
    building: 'Faculty of Engineering & Technology (Block ENG-02)',
    buildingCode: 'ENG-02',
    floor: 'Level 2',
    capacity: 40,
    currentOccupancy: 10,
    status: 'available',
    statusText: 'Open Now (30 Desks Free)',
    nextClass: 'Cloud Distributed Systems at 3:00 PM',
    co2: 425,
    co2Status: 'Optimal (Fresh Intake)',
    temp: 20.4,
    tempTarget: 20.5,
    humidity: 42,
    noiseDb: 38,
    noiseStatus: 'Low Hum (Workstation Active)',
    wifiSpeed: '950 Mbps',
    wifiLatency: '2 ms',
    wifiDevices: 12,
    features: [
      '30x RTX 4090 AI Workstations',
      '10GbE SFP+ Fiber Network Drop',
      'Dual 4K OLED Color-Accurate Monitors',
      'ADA Workstation #1 (Motorized Height)',
      'Touchless NFC Access Controller',
    ],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    has4kLaser: false,
    hasGpu: true,
    hasInteractive: true,
    isAda: true,
    cadBox: { x: 70, y: 340, w: 160, h: 160, door: { x: 150, y: 340 } },
    routeSteps: [
      { step: '1. Enter Level 2 Corridor', desc: 'Exit West Lift Bank and head west (0m)' },
      { step: '2. Head West down Main Hallway', desc: 'Pass Amphitheatre entrance on left (30m)' },
      { step: '3. Arrive at Room B-203', desc: 'Door on the left side with dual NFC biometric terminal (10m)' },
    ],
    routeDistance: '40 meters (1.0 min walk)',
    slots: [
      { id: 'b203-1', start: '08:30', end: '10:00', title: 'Network Protocols Lab', lecturer: 'Dr. Sengupta', status: 'past', isBookable: false },
      { id: 'b203-2', start: '10:00', end: '13:30', title: 'Open GPU Cluster Work Time', lecturer: 'Open Lab', status: 'available', isBookable: true },
      { id: 'b203-3', start: '13:30', end: '15:00', title: 'Autonomous Systems Sim', lecturer: 'Prof. Mehta', status: 'reserved', isBookable: false },
      { id: 'b203-4', start: '15:00', end: '17:00', title: 'Distributed Systems Practical', lecturer: 'Dr. Sengupta', status: 'reserved', isBookable: false },
      { id: 'b203-5', start: '17:00', end: '19:00', title: 'Evening Open AI Hackathon Desks', lecturer: 'Student Club', status: 'available', isBookable: true },
    ],
  },
  {
    id: 'B-201',
    roomNumber: 'B-201',
    name: 'Main Academic Amphitheatre',
    type: 'Lecture Theatres',
    building: 'Faculty of Engineering & Technology (Block ENG-02)',
    buildingCode: 'ENG-02',
    floor: 'Level 2',
    capacity: 120,
    currentOccupancy: 120,
    status: 'occupied',
    statusText: 'In Session (CS-204 Algorithms)',
    nextClass: 'Free at 1:00 PM for Guest Keynote',
    co2: 520,
    co2Status: 'Elevated (Air Handling at 100%)',
    temp: 23.1,
    tempTarget: 22.0,
    humidity: 50,
    noiseDb: 64,
    noiseStatus: 'Lecture in Progress',
    wifiSpeed: '650 Mbps',
    wifiLatency: '6 ms',
    wifiDevices: 124,
    features: [
      'Tiered Acoustic Auditoria Seating',
      'Dual 4K Christie Laser Projectors',
      'Array Ceiling Mics & Live Webcast Hub',
      'ADA Hearing Assist Loop + Ramp Entry',
    ],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    has4kLaser: true,
    hasGpu: false,
    hasInteractive: false,
    isAda: true,
    cadBox: { x: 70, y: 120, w: 160, h: 160, door: { x: 150, y: 280 } },
    routeSteps: [
      { step: '1. Exit West Lifts', desc: 'Turn left into Central Concourse (5m)' },
      { step: '2. Arrive at Amphitheatre B-201', desc: 'Main acoustic double doors on south wall (15m)' },
    ],
    routeDistance: '20 meters (0.5 min walk)',
    slots: [
      { id: 'b201-1', start: '09:00', end: '10:30', title: 'Discrete Mathematics', lecturer: 'Prof. Joshi', status: 'past', isBookable: false },
      { id: 'b201-2', start: '10:30', end: '13:00', title: 'Algorithms (CS-204)', lecturer: 'Prof. R. Sen', status: 'occupied', isBookable: false },
      { id: 'b201-3', start: '13:00', end: '15:00', title: 'Tech Speaker Series Keynote', lecturer: 'Guest Faculty', status: 'reserved', isBookable: false },
      { id: 'b201-4', start: '15:00', end: '17:00', title: 'Open Revision & Problem Solving', lecturer: 'TA Session', status: 'available', isBookable: true },
    ],
  },
  {
    id: 'B-202',
    roomNumber: 'B-202',
    name: 'Faculty Seminar Suite',
    type: 'Smart Classrooms',
    building: 'Faculty of Engineering & Technology (Block ENG-02)',
    buildingCode: 'ENG-02',
    floor: 'Level 2',
    capacity: 35,
    currentOccupancy: 35,
    status: 'reserved',
    statusText: 'Reserved (Faculty Council 2PM)',
    nextClass: 'Faculty Council at 2:00 PM',
    co2: 390,
    co2Status: 'Pristine Clean Air',
    temp: 21.0,
    tempTarget: 21.0,
    humidity: 43,
    noiseDb: 32,
    noiseStatus: 'Whisper Quiet',
    wifiSpeed: '780 Mbps',
    wifiLatency: '4 ms',
    wifiDevices: 6,
    features: [
      'Interactive Smart Touchboard 85"',
      'Conference AI Auto-Framing Camera',
      'Modular Acoustic Glass Collaboration Pods',
    ],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=800&q=80',
    has4kLaser: false,
    hasGpu: false,
    hasInteractive: true,
    isAda: false,
    cadBox: { x: 730, y: 120, w: 160, h: 160, door: { x: 810, y: 280 } },
    routeSteps: [
      { step: '1. Exit East Lifts', desc: 'Turn right into East Corridor (5m)' },
      { step: '2. Arrive at B-202', desc: 'Glass entry door on right (12m)' },
    ],
    routeDistance: '17 meters (0.4 min walk)',
    slots: [
      { id: 'b202-1', start: '09:00', end: '11:00', title: 'Department Curriculum Review', lecturer: 'HOD CSE', status: 'past', isBookable: false },
      { id: 'b202-2', start: '11:00', end: '13:30', title: 'Open Faculty Desk Time', lecturer: 'Faculty Only', status: 'available', isBookable: true },
      { id: 'b202-3', start: '14:00', end: '16:00', title: 'Faculty Council Session', lecturer: 'Dean Academic', status: 'reserved', isBookable: false },
    ],
  },
  {
    id: 'B-205',
    roomNumber: 'B-205',
    name: 'AI & Robotics Prototyping Lab',
    type: 'Computer Labs',
    building: 'Faculty of Engineering & Technology (Block ENG-02)',
    buildingCode: 'ENG-02',
    floor: 'Level 2',
    capacity: 28,
    currentOccupancy: 28,
    status: 'occupied',
    statusText: 'In Session (Autonomous Drones)',
    nextClass: 'Free at 4:00 PM',
    co2: 440,
    co2Status: 'Optimal Clean Air',
    temp: 22.0,
    tempTarget: 21.5,
    humidity: 46,
    noiseDb: 52,
    noiseStatus: 'Robotics Motors Active',
    wifiSpeed: '900 Mbps',
    wifiLatency: '2 ms',
    wifiDevices: 32,
    features: [
      'NVIDIA Jetson AI Prototyping Benches',
      'Indoor Drone Flight Netting Enclosure',
      'ESD Soldering & 3D Print Farm',
      'ADA Ergonomic Height Workstation',
    ],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    has4kLaser: false,
    hasGpu: true,
    hasInteractive: true,
    isAda: true,
    cadBox: { x: 540, y: 340, w: 180, h: 160, door: { x: 630, y: 340 } },
    routeSteps: [
      { step: '1. Main Concourse', desc: 'Walk past Student Lounge east (20m)' },
      { step: '2. Arrive at B-205', desc: 'Entry on south side with RFID lock (10m)' },
    ],
    routeDistance: '30 meters (0.8 min walk)',
    slots: [
      { id: 'b205-1', start: '09:00', end: '12:00', title: 'Robotics Sensors Lab', lecturer: 'Dr. Chauhan', status: 'past', isBookable: false },
      { id: 'b205-2', start: '12:00', end: '16:00', title: 'Autonomous Drones Flight Test', lecturer: 'Robotics Guild', status: 'occupied', isBookable: false },
      { id: 'b205-3', start: '16:00', end: '19:00', title: 'Open Maker Bench Access', lecturer: 'Open Lab', status: 'available', isBookable: true },
    ],
  },
  {
    id: 'B-206',
    roomNumber: 'B-206',
    name: 'Silent Acoustic Study Pods',
    type: 'Study Pods',
    building: 'Faculty of Engineering & Technology (Block ENG-02)',
    buildingCode: 'ENG-02',
    floor: 'Level 2',
    capacity: 16,
    currentOccupancy: 12,
    status: 'available',
    statusText: '4 Pods Available Now',
    nextClass: 'Instant Tap-In / 24/7 Access',
    co2: 400,
    co2Status: 'Pristine Clean Air',
    temp: 21.5,
    tempTarget: 21.5,
    humidity: 43,
    noiseDb: 28,
    noiseStatus: 'Acoustic Soundproof (<30dB)',
    wifiSpeed: '850 Mbps',
    wifiLatency: '3 ms',
    wifiDevices: 12,
    features: [
      '16x Frameless ANC Acoustic Glass Pods',
      'Dual 100W USB-C PD Superchargers',
      'Adjustable Circadian Lighting Strip',
      'Touchless QR / NFC Pass Unlock',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    has4kLaser: false,
    hasGpu: false,
    hasInteractive: false,
    isAda: true,
    cadBox: { x: 740, y: 340, w: 150, h: 160, door: { x: 815, y: 340 } },
    routeSteps: [
      { step: '1. East Corridor', desc: 'Walk straight past East Lifts (25m)' },
      { step: '2. Arrive at B-206 Pods', desc: 'Acoustic glass bay on south end (15m)' },
    ],
    routeDistance: '40 meters (1.0 min walk)',
    slots: [
      { id: 'b206-1', start: '08:00', end: '10:00', title: 'Early Bird Deep Study', lecturer: 'Open Access', status: 'past', isBookable: false },
      { id: 'b206-2', start: '10:00', end: '12:00', title: 'Reserved Pods 1-8', lecturer: 'Peer Booking', status: 'occupied', isBookable: false },
      { id: 'b206-3', start: '12:00', end: '14:00', title: 'Open Pod Slot A', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
      { id: 'b206-4', start: '14:00', end: '16:00', title: 'Open Pod Slot B', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
      { id: 'b206-5', start: '16:00', end: '18:00', title: 'Open Pod Slot C', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
      { id: 'b206-6', start: '18:00', end: '20:00', title: 'Night Focus Slot', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
    ],
  },

  // --- Block LIB-03 (Swami Vivekananda Central Library) - Level 2 ---
  {
    id: 'LIB-201',
    roomNumber: 'LIB-201',
    name: 'Swami Vivekananda Quiet Focus Bay',
    type: 'Study Pods',
    building: 'Swami Vivekananda Central Library (Block LIB-03)',
    buildingCode: 'LIB-03',
    floor: 'Level 2',
    capacity: 40,
    currentOccupancy: 14,
    status: 'available',
    statusText: '26 Desks Open Now',
    nextClass: 'Open Study All Day',
    co2: 385,
    co2Status: 'Pristine Clean Air',
    temp: 21.0,
    tempTarget: 21.0,
    humidity: 42,
    noiseDb: 26,
    noiseStatus: 'Strict Silent Zone (<28dB)',
    wifiSpeed: '900 Mbps',
    wifiLatency: '3 ms',
    wifiDevices: 14,
    features: [
      'Single Carrels with Acoustic Felt Partitions',
      'Individual Reading Task LED (4000K)',
      '100W USB-C & Universal AC Sockets',
      'ADA Compliant Wide Aisles',
    ],
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    has4kLaser: false,
    hasGpu: false,
    hasInteractive: false,
    isAda: true,
    cadBox: { x: 120, y: 150, w: 280, h: 260, door: { x: 260, y: 410 } },
    routeSteps: [
      { step: '1. Enter Library Central Atrium', desc: 'Pass RFID security turnstiles (10m)' },
      { step: '2. Take Central Glass Elevator to Level 2', desc: 'Exit onto Quiet Floor landing (15m)' },
      { step: '3. Turn North to Focus Bay', desc: 'Acoustic glass automatic doors on left (20m)' },
    ],
    routeDistance: '45 meters (1.1 min walk)',
    slots: [
      { id: 'lib201-1', start: '08:00', end: '12:00', title: 'Morning Focus Period', lecturer: 'Open Study', status: 'available', isBookable: true },
      { id: 'lib201-2', start: '12:00', end: '16:00', title: 'Afternoon Silent Session', lecturer: 'Open Study', status: 'available', isBookable: true },
      { id: 'lib201-3', start: '16:00', end: '20:00', title: 'Evening Research Hours', lecturer: 'Open Study', status: 'available', isBookable: true },
    ],
  },
  {
    id: 'LIB-202',
    roomNumber: 'LIB-202',
    name: 'Acoustic Soundproof Solo Pods (1-8)',
    type: 'Study Pods',
    building: 'Swami Vivekananda Central Library (Block LIB-03)',
    buildingCode: 'LIB-03',
    floor: 'Level 2',
    capacity: 8,
    currentOccupancy: 5,
    status: 'available',
    statusText: '3 Solo Pods Free',
    nextClass: 'Instant QR Reservation',
    co2: 390,
    co2Status: 'Pristine Clean Air',
    temp: 21.2,
    tempTarget: 21.0,
    humidity: 40,
    noiseDb: 24,
    noiseStatus: 'Soundproofed Isolation Pod',
    wifiSpeed: '850 Mbps',
    wifiLatency: '3 ms',
    wifiDevices: 5,
    features: [
      'Double Glazed ANC Soundproof Pod Glass',
      'Air Ventilation HEPA System (6 ACH)',
      'Digital "In-Use" Status Beacon',
      'Mobile App Bluetooth / NFC Pass Reader',
    ],
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    has4kLaser: false,
    hasGpu: false,
    hasInteractive: false,
    isAda: true,
    cadBox: { x: 520, y: 150, w: 260, h: 260, door: { x: 650, y: 410 } },
    routeSteps: [
      { step: '1. Level 2 Library Landing', desc: 'Proceed straight past Information Desk (10m)' },
      { step: '2. Turn Right to West Wing Pod Row', desc: 'Glass pods numbered 1 through 8 (18m)' },
    ],
    routeDistance: '28 meters (0.7 min walk)',
    slots: [
      { id: 'lib202-1', start: '09:00', end: '11:00', title: 'Reserved Pod #2', lecturer: 'Student Booking', status: 'occupied', isBookable: false },
      { id: 'lib202-2', start: '11:00', end: '13:00', title: 'Available Pod #4', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
      { id: 'lib202-3', start: '13:00', end: '15:00', title: 'Available Pod #7', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
      { id: 'lib202-4', start: '15:00', end: '17:00', title: 'Available Pod #1', lecturer: 'Instant Reserve', status: 'available', isBookable: true },
    ],
  },
];

// Buildings directory
const BUILDINGS = [
  { id: 'ENG-02', name: 'Faculty of Engineering & Technology (Block ENG-02)', floors: ['Ground', 'Level 1', 'Level 2', 'Level 3'] },
  { id: 'LIB-03', name: 'Swami Vivekananda Central Library (Block LIB-03)', floors: ['Ground', 'Level 1', 'Level 2'] },
  { id: 'ADM-01', name: 'Maharana Pratap Main Academic Block (Block ADM-01)', floors: ['Ground', 'Level 1', 'Level 2'] },
];

export function SmartRooms() {
  const navigate = useNavigate();

  // Core State
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [selectedBuilding, setSelectedBuilding] = useState('Faculty of Engineering & Technology (Block ENG-02)');
  const [selectedFloor, setSelectedFloor] = useState('Level 2');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('B-204');
  const [activeFilters, setActiveFilters] = useState({
    availableNow: true,
    laser4k: false,
    gpuCluster: false,
    interactiveBoard: false,
    ada: false,
  });

  // CAD Viewer Interactive Pan & Zoom
  const [cadZoom, setCadZoom] = useState(1);
  const [isAdaRoute, setIsAdaRoute] = useState(false);

  // Time-Scrubber State (Hours from 08:00 to 20:00)
  const [currentTimeHour, setCurrentTimeHour] = useState('11:30 AM');

  // Instant Reservation & Pass Generator Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [slotToBook, setSlotToBook] = useState(null);
  const [bookingPurpose, setBookingPurpose] = useState('Capstone Project Team Collab');
  const [studentRoll, setStudentRoll] = useState('MU/CSE/2024/0482');
  const [studentName, setStudentName] = useState('Aarav Mehta');
  const [bookingConflictMsg, setBookingConflictMsg] = useState('');
  const [activePass, setActivePass] = useState(null);
  const [hasCopiedPassId, setHasCopiedPassId] = useState(false);
  const [simulatedUnlockSuccess, setSimulatedUnlockSuccess] = useState(false);

  // My Passes Drawer
  const [isMyPassesOpen, setIsMyPassesOpen] = useState(false);
  const [savedPasses, setSavedPasses] = useState([
    {
      passId: 'NC-POD-7741',
      roomNumber: 'B-206',
      roomName: 'Silent Acoustic Study Pods',
      slotTime: '11:30 AM - 01:00 PM',
      date: 'Today',
      studentRoll: 'MU/CSE/2024/0482',
      purpose: 'Deep Focus Coding',
      status: 'Active Pass',
    },
  ]);

  // Attempt to sync room status with backend if available
  useEffect(() => {
    api.get('/smartrooms/rooms')
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Keep existing rich CAD metadata while updating any matching room occupancy/status from DB
          setRooms((prev) =>
            prev.map((r) => {
              const matched = res.data.find(
                (dbR) => dbR.roomNumber === r.roomNumber || dbR.name === r.name
              );
              if (!matched) return r;
              return {
                ...r,
                currentOccupancy: typeof matched.currentOccupancy === 'number' ? matched.currentOccupancy : r.currentOccupancy,
                status: matched.status || r.status,
              };
            })
          );
        }
      })
      .catch(() => {
        // Fallback gracefully to verified in-memory dataset
      });
  }, []);

  // Keyboard Escape listener for accessible modal dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isBookingModalOpen) {
          setIsBookingModalOpen(false);
          setActivePass(null);
        }
        if (isMyPassesOpen) {
          setIsMyPassesOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingModalOpen, isMyPassesOpen]);

  // Selected Room Object
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  // Sync rooms with building selection
  const buildingFilteredRooms = useMemo(() => {
    return rooms.filter((r) => r.building === selectedBuilding);
  }, [rooms, selectedBuilding]);

  // Filtered rooms list
  const filteredRooms = useMemo(() => {
    return buildingFilteredRooms.filter((r) => {
      if (selectedFloor !== 'All' && r.floor !== selectedFloor) return false;
      if (selectedType !== 'All' && r.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchNum = r.roomNumber.toLowerCase().includes(q);
        const matchFeat = r.features.some((f) => f.toLowerCase().includes(q));
        if (!matchName && !matchNum && !matchFeat) return false;
      }
      if (activeFilters.availableNow && r.status === 'occupied') return false;
      if (activeFilters.laser4k && !r.has4kLaser) return false;
      if (activeFilters.gpuCluster && !r.hasGpu) return false;
      if (activeFilters.interactiveBoard && !r.hasInteractive) return false;
      if (activeFilters.ada && !r.isAda) return false;
      return true;
    });
  }, [buildingFilteredRooms, selectedFloor, selectedType, searchQuery, activeFilters]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalDesks = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
    const occupiedDesks = rooms.reduce((acc, r) => acc + (r.currentOccupancy || 0), 0);
    const availableDesks = Math.max(0, totalDesks - occupiedDesks);
    const activeRooms = rooms.filter((r) => r.status === 'occupied').length;
    const avgCo2 = Math.round(rooms.reduce((acc, r) => acc + (r.co2 || 400), 0) / Math.max(1, rooms.length));
    const occupancyPercent = totalDesks > 0 ? Math.round((occupiedDesks / totalDesks) * 100) : 0;

    return {
      totalRooms: rooms.length,
      totalDesks,
      availableDesks,
      activeRooms,
      avgCo2,
      occupancyPercent,
    };
  }, [rooms]);

  // Handle building change
  const handleBuildingChange = (bldgName) => {
    setSelectedBuilding(bldgName);
    const bldgRooms = rooms.filter((r) => r.building === bldgName);
    if (bldgRooms.length > 0) {
      setSelectedFloor(bldgRooms[0].floor);
      setSelectedRoomId(bldgRooms[0].id);
    }
  };

  const handleToggleFilter = (key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Open booking modal for a specific slot
  const handleOpenBooking = (slot) => {
    if (slot.status === 'occupied') {
      setBookingConflictMsg(`Slot Conflict: "${slot.title}" is currently in session. Cannot reserve occupied academic hours.`);
    } else if (slot.status === 'past') {
      setBookingConflictMsg(`Time Expired: This slot was earlier today and is no longer bookable.`);
    } else {
      setBookingConflictMsg('');
    }
    setSlotToBook(slot);
    setSimulatedUnlockSuccess(false);
    setIsBookingModalOpen(true);
  };

  // Confirm reservation and generate digital pass
  const handleConfirmReservation = () => {
    if (!slotToBook || !slotToBook.isBookable) return;

    const newPassId = `NC-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass = {
      passId: newPassId,
      roomNumber: selectedRoom.roomNumber,
      roomName: selectedRoom.name,
      building: selectedRoom.building,
      floor: selectedRoom.floor,
      slotTime: `${slotToBook.start} - ${slotToBook.end}`,
      date: 'Today',
      studentRoll,
      studentName,
      purpose: bookingPurpose,
      status: 'Active Pass',
    };

    // Update room slot status in state
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRoom.id) return r;
        return {
          ...r,
          currentOccupancy: Math.min(r.capacity, r.currentOccupancy + 1),
          slots: r.slots.map((s) =>
            s.id === slotToBook.id
              ? { ...s, status: 'reserved', title: `Reserved: ${bookingPurpose}`, isBookable: false }
              : s
          ),
        };
      })
    );

    setActivePass(newPass);
    setSavedPasses((prev) => [newPass, ...prev]);
  };

  // Simulate NFC door unlock
  const handleSimulateUnlock = () => {
    setSimulatedUnlockSuccess(true);
    setTimeout(() => {
      setSimulatedUnlockSuccess(false);
    }, 4000);
  };

  const copyPassId = (id) => {
    navigator.clipboard?.writeText?.(id);
    setHasCopiedPassId(true);
    setTimeout(() => setHasCopiedPassId(false), 2000);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)', minHeight: '100%' }} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* =========================================================================
          TOP INSTITUTIONAL HEADER & COMPACT METRICS HIERARCHY
          ========================================================================= */}
      <div className="flex flex-col gap-4 pb-6 border-b border-[#E4EAE5]">
        {/* Breadcrumb & Live Mesh Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
            <span className="px-2.5 py-1 rounded-full bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
              IoT Mesh Live
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)]">• Mewar University Gangrar</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className="text-[var(--text-primary)] font-semibold">{selectedRoom.buildingCode}</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className="text-[var(--brand-primary)] font-semibold">{selectedFloor} Architectural CAD</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMyPassesOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E4EAE5] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>My Active Passes</span>
              {savedPasses.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] text-[10px] font-bold border border-[var(--brand-soft-border)]">
                  {savedPasses.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Page Title & Compact Summary Hierarchy */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-heading">
                SmartRooms &amp; Space Intelligence
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-[var(--text-secondary)] border border-[#E4EAE5] font-mono font-medium">
                CAD BIM v2.4
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1">
              Real-time room occupancy, indoor CAD floor plans, verified environmental telemetry, and clash-free slot bookings across campus.
            </p>
          </div>

          {/* Compact Verified Metrics Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Monitored</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-heading">{summaryMetrics.totalRooms} Spaces</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[var(--brand-soft-bg)] border border-[var(--brand-soft-border)] shadow-xs flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--brand-primary)] font-bold">Available Desks</span>
              <span className="text-lg font-bold text-[var(--brand-primary)] font-heading">{summaryMetrics.availableDesks} Free</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Occupancy</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-heading">{summaryMetrics.occupancyPercent}% Active</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col min-w-[95px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Avg CO₂</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-heading">{summaryMetrics.avgCo2} ppm</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FACILITY SEARCH & CONTROL BAR
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col gap-4">
        {/* Row 1: Search & Building Picker */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7 lg:col-span-8 relative flex items-center">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />
            <input
              id="roomSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room code (e.g. B-204, B-206), hardware (RTX 4090, 4K Laser), or features..."
              className="w-full h-11 pl-10 pr-12 rounded-xl bg-[var(--bg-canvas)] hover:bg-white focus:bg-white text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-soft-border)] focus:border-[var(--brand-primary)] border border-[#E4EAE5] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="md:col-span-5 lg:col-span-4 relative">
            <select
              value={selectedBuilding}
              onChange={(e) => handleBuildingChange(e.target.value)}
              className="w-full h-11 pl-3.5 pr-8 rounded-xl bg-[var(--bg-canvas)] hover:bg-white focus:bg-white text-[var(--text-primary)] text-xs sm:text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-soft-border)] focus:border-[var(--brand-primary)] border border-[#E4EAE5] cursor-pointer font-medium transition-all"
            >
              {BUILDINGS.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <Building2 className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Floor Switcher & Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#E4EAE5]">
          {/* Floor Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-canvas)] rounded-xl border border-[#E4EAE5] overflow-x-auto">
            {['Ground', 'Level 1', 'Level 2', 'Level 3'].map((fl) => {
              const isActive = selectedFloor === fl;
              return (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[var(--text-primary)] border border-[#E4EAE5] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/60'
                  }`}
                >
                  {fl}
                </button>
              );
            })}
          </div>

          {/* Room Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { label: 'All Spaces', val: 'All' },
              { label: 'Lecture Theatres', val: 'Lecture Theatres' },
              { label: 'Computer Labs', val: 'Computer Labs' },
              { label: 'Study Pods', val: 'Study Pods' },
              { label: 'Smart Classrooms', val: 'Smart Classrooms' },
            ].map((tp) => (
              <button
                key={tp.val}
                onClick={() => setSelectedType(tp.val)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === tp.val
                    ? 'bg-[var(--brand-primary)] text-white font-bold shadow-xs'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)] border border-[#E4EAE5]'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Feature Filters Multi-Select */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E4EAE5]">
          <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mr-1">Filter Hardware:</span>

          <button
            onClick={() => handleToggleFilter('availableNow')}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilters.availableNow
                ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold'
                : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:bg-white border border-[#E4EAE5]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-[var(--brand-primary)]" />
            Available Now
          </button>

          <button
            onClick={() => handleToggleFilter('laser4k')}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilters.laser4k
                ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold'
                : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:bg-white border border-[#E4EAE5]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[var(--brand-primary)]" />
            4K Laser Projector
          </button>

          <button
            onClick={() => handleToggleFilter('gpuCluster')}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilters.gpuCluster
                ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold'
                : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:bg-white border border-[#E4EAE5]'
            }`}
          >
            <Cpu className="w-3 h-3 text-[var(--brand-primary)]" />
            RTX 4090 GPU Rig
          </button>

          <button
            onClick={() => handleToggleFilter('interactiveBoard')}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilters.interactiveBoard
                ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold'
                : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:bg-white border border-[#E4EAE5]'
            }`}
          >
            <Sliders className="w-3 h-3 text-[var(--brand-primary)]" />
            Interactive Touchboard
          </button>

          <button
            onClick={() => handleToggleFilter('ada')}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilters.ada
                ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold'
                : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:bg-white border border-[#E4EAE5]'
            }`}
          >
            <DoorOpen className="w-3 h-3 text-[var(--brand-primary)]" />
            ADA Step-Free / Loop
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY WORKSPACE: SPLIT CAD FLOOR PLAN & LIVE ROOM INSPECTOR
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: ARCHITECTURAL CAD VECTOR VIEWER */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative w-full rounded-2xl bg-white border border-[#E4EAE5] overflow-hidden shadow-sm">
            {/* CAD Viewer Top Overlay Navigation */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-20 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
              {/* Active Route Wayfinding Badge */}
              <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-white/95 border border-[#E4EAE5] shadow-md backdrop-blur-md text-[10px] sm:text-xs text-[var(--text-primary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-ping"></span>
                <span className="hidden sm:inline text-[var(--text-muted)] font-medium">Vector Path:</span>
                <span className="font-semibold text-[var(--text-primary)] truncate max-w-[100px] sm:max-w-none">Skybridge Arrival</span>
                <ArrowRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                <span className="font-bold text-[var(--brand-primary)]">Room {selectedRoom.roomNumber}</span>
                <span className="text-[var(--text-secondary)] font-mono text-[9px] sm:text-[11px]">({selectedRoom.routeDistance})</span>
              </div>

              {/* Viewport Scale & Route Manipulation Tools */}
              <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-white/95 border border-[#E4EAE5] shadow-md backdrop-blur-md">
                <button
                  onClick={() => setCadZoom((z) => Math.min(1.4, z + 0.1))}
                  className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] transition-colors cursor-pointer"
                  title="Zoom In CAD Plan"
                  aria-label="Zoom In CAD Plan"
                >
                  <span className="font-bold text-sm">+</span>
                </button>
                <button
                  onClick={() => setCadZoom((z) => Math.max(0.7, z - 0.1))}
                  className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] transition-colors cursor-pointer"
                  title="Zoom Out CAD Plan"
                  aria-label="Zoom Out CAD Plan"
                >
                  <span className="font-bold text-sm">-</span>
                </button>
                <button
                  onClick={() => setCadZoom(1)}
                  className="px-2 py-1 min-h-[32px] sm:min-h-0 flex items-center justify-center rounded-lg text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] transition-colors cursor-pointer"
                  title="Reset 100% Zoom"
                  aria-label="Reset CAD Zoom to 100%"
                >
                  {Math.round(cadZoom * 100)}%
                </button>
                <div className="w-px h-4 bg-[#E4EAE5] mx-0.5"></div>
                <button
                  onClick={() => setIsAdaRoute(!isAdaRoute)}
                  className={`px-2 py-1 min-h-[32px] sm:min-h-0 flex items-center gap-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    isAdaRoute
                      ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'
                  }`}
                  title="Toggle Step-Free ADA Elevator Route"
                  aria-label="Toggle Step-Free ADA Route"
                >
                  <DoorOpen className="w-3 h-3" />
                  <span>{isAdaRoute ? 'Elevator Routing' : 'Step-Free'}</span>
                </button>
              </div>
            </div>

            {/* SVG Vector 2D CAD Canvas */}
            <div className="w-full h-[340px] sm:h-[480px] xl:h-[580px] bg-[#0A0F1D] relative overflow-hidden select-none flex items-center justify-center">
              {/* CAD Precision Blueprint Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cadGridDark" width="36" height="36" patternUnits="userSpaceOnUse">
                    <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#168567" strokeWidth="0.5" strokeDasharray="1 3" />
                    <circle cx="0" cy="0" r="1" fill="#168567" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cadGridDark)" />
              </svg>

              {/* Vector Geometry with Pan & Zoom transform */}
              <svg
                className="w-full h-full p-4 relative z-10 transition-transform duration-300 ease-out"
                viewBox="0 0 960 620"
                style={{ transform: `scale(${cadZoom})` }}
              >
                <defs>
                  {/* Glowing Filter for Selected Vector Route */}
                  <filter id="emeraldRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10B981" floodOpacity="0.85" />
                  </filter>
                </defs>

                {/* Outer Wall Architectural Double-Line Envelope */}
                <polygon
                  points="36,86 280,86 320,36 680,36 720,86 924,86 924,534 36,534"
                  fill="#0B132B"
                  stroke="#1E293B"
                  strokeWidth="8"
                />
                <polygon
                  points="40,90 280,90 320,40 680,40 720,90 920,90 920,530 40,530"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Main Architectural Corridors (Concourse & Crossways) */}
                <path d="M 120,310 L 840,310" fill="none" stroke="#1E293B" strokeWidth="60" strokeLinecap="round" />
                <path d="M 480,90 L 480,510" fill="none" stroke="#1E293B" strokeWidth="54" strokeLinecap="round" />
                <path d="M 120,310 L 840,310" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" />

                {/* Skybridge Arrival Point (From Central Library) */}
                <rect x="420" y="10" width="120" height="70" rx="8" fill="#1E293B" stroke="#168567" strokeWidth="1.5" />
                <text x="480" y="36" textAnchor="middle" fill="#34D399" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" letterSpacing="1">
                  NORTH SKYBRIDGE
                </text>
                <text x="480" y="52" textAnchor="middle" fill="#94A3B8" fontFamily="Inter, sans-serif" fontSize="8">
                  Conn: Central Library LIB-03
                </text>
                <circle cx="480" cy="68" r="6" fill="#10B981" />
                <circle cx="480" cy="68" r="12" fill="#10B981" fillOpacity="0.25" className="animate-ping" />

                {/* Vertical Transport: West Lifts & East Lifts */}
                <g>
                  <rect x="250" y="120" width="70" height="70" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <text x="285" y="150" textAnchor="middle" fill="#38BDF8" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700">
                    LIFTS W
                  </text>
                  <text x="285" y="165" textAnchor="middle" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="8">
                    Floor 1 - 4
                  </text>

                  <rect x="640" y="120" width="70" height="70" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <text x="675" y="150" textAnchor="middle" fill="#38BDF8" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700">
                    LIFTS E
                  </text>
                  <text x="675" y="165" textAnchor="middle" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="8">
                    Floor 1 - 4
                  </text>
                </g>

                {/* Restrooms & Service Hub */}
                <rect x="440" y="330" width="80" height="60" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                <text x="480" y="365" textAnchor="middle" fill="#94A3B8" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600">
                  RESTROOMS
                </text>

                {/* Emergency Stairs Exits */}
                <rect x="42" y="500" width="60" height="26" fill="#3B0764" stroke="#A855F7" strokeWidth="1" strokeDasharray="2 2" />
                <text x="72" y="516" textAnchor="middle" fill="#E9D5FF" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">
                  FIRE EXIT A
                </text>
                <rect x="858" y="500" width="60" height="26" fill="#3B0764" stroke="#A855F7" strokeWidth="1" strokeDasharray="2 2" />
                <text x="888" y="516" textAnchor="middle" fill="#E9D5FF" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">
                  FIRE EXIT B
                </text>

                {/* Dynamic Rendering of Floor Rooms */}
                {buildingFilteredRooms
                  .filter((r) => r.cadBox)
                  .map((room) => {
                    const isSelected = room.id === selectedRoomId;
                    const { x, y, w, h } = room.cadBox;
                    const statusColor =
                      room.status === 'available'
                        ? '#10B981'
                        : room.status === 'reserved'
                        ? '#B7791F'
                        : '#C43D4B';

                    return (
                      <g
                        key={room.id}
                        className="cursor-pointer group"
                        onClick={() => setSelectedRoomId(room.id)}
                      >
                        {/* Room Boundary Rect */}
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="10"
                          fill={isSelected ? '#132338' : '#0B132B'}
                          stroke={isSelected ? '#10B981' : '#334155'}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          className="transition-colors duration-200"
                        />

                        {/* Room Header Strip */}
                        <rect
                          x={x + 8}
                          y={y + 8}
                          width={w - 16}
                          height="24"
                          rx="4"
                          fill={isSelected ? '#10B981' : '#1E293B'}
                        />
                        <text
                          x={x + 16}
                          y={y + 24}
                          fill={isSelected ? '#022C22' : '#F8FAFC'}
                          fontFamily="Inter, sans-serif"
                          fontSize="11"
                          fontWeight="700"
                        >
                          {room.roomNumber} • {room.name.split(' ')[0]}
                        </text>
                        {/* Status Beacon */}
                        <circle cx={x + w - 20} cy={y + 20} r="4" fill={statusColor} />

                        {/* Room Subtext Details */}
                        <text
                          x={x + 16}
                          y={y + 54}
                          fill={isSelected ? '#34D399' : '#94A3B8'}
                          fontFamily="Inter, sans-serif"
                          fontSize="10"
                          fontWeight="600"
                        >
                          {room.capacity} Desks • {room.statusText}
                        </text>

                        {/* Environmental Sensor Tag in CAD */}
                        <text
                          x={x + 16}
                          y={y + 74}
                          fill="#64748B"
                          fontFamily="Inter, sans-serif"
                          fontSize="9"
                        >
                          CO₂: {room.co2} ppm • {room.temp}°C
                        </text>

                        {/* Target Node Badge when Selected */}
                        {isSelected && (
                          <g transform={`translate(${x + w / 2}, ${y + h - 22})`}>
                            <rect x="-45" y="-12" width="90" height="20" rx="10" fill="#10B981" />
                            <text
                              x="0"
                              y="2"
                              textAnchor="middle"
                              fill="#022C22"
                              fontFamily="Inter, sans-serif"
                              fontSize="9"
                              fontWeight="800"
                            >
                              TARGET NODE
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                {/* DYNAMIC ANIMATED VECTOR PATH TO SELECTED ROOM */}
                {selectedRoom.cadBox && (
                  <>
                    <path
                      d={`M 480,72 L 480,310 L ${selectedRoom.cadBox.door.x},310 L ${selectedRoom.cadBox.door.x},${selectedRoom.cadBox.door.y}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="5"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#emeraldRouteGlow)"
                      className="animate-[dash_1.2s_linear_infinite]"
                    />
                    {/* Destination Door Beacon */}
                    <g transform={`translate(${selectedRoom.cadBox.door.x}, ${selectedRoom.cadBox.door.y})`}>
                      <circle cx="0" cy="0" r="7" fill="#10B981" />
                      <circle cx="0" cy="0" r="14" fill="#10B981" fillOpacity="0.3" className="animate-ping" />
                    </g>
                  </>
                )}

                {/* Departure Marker */}
                <g transform="translate(480, 72)">
                  <circle cx="0" cy="0" r="6" fill="#10B981" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#34D399" strokeWidth="1.5" />
                  <text x="14" y="4" fill="#34D399" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700">
                    START (Skybridge Arrival)
                  </text>
                </g>
              </svg>

              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -32; }
                }
              `}</style>

              {/* Floating Blueprint Legend */}
              <div className="absolute bottom-3 left-3 p-2.5 px-3.5 rounded-xl bg-white/95 backdrop-blur-md text-[var(--text-primary)] border border-[#E4EAE5] shadow-md z-20 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">CAD Legend:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-[var(--text-secondary)]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="font-medium text-[var(--text-secondary)]">In Session</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-[var(--text-secondary)]">Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span className="font-medium text-[var(--text-secondary)]">Elevator Lift</span>
                </div>
              </div>

              {/* Wayfinding Duration Chip */}
              <div className="absolute bottom-3 right-3 p-2.5 px-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E4EAE5] shadow-md z-20 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[var(--brand-primary)]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{selectedRoom.routeDistance}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Door-to-door CAD routing</span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              VISUAL TIME-SCRUBBER TIMELINE & INSTANT RESERVATION SCHEDULE
              ===================================================================== */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-heading flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span>Room {selectedRoom.roomNumber} Today's Schedule &amp; Clash-Free Booking</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Select any available block below to reserve instantly and generate your verified NFC pass.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-canvas)] text-[11px] font-mono font-medium text-[var(--text-secondary)] border border-[#E4EAE5]">
                  Current Time: {currentTimeHour}
                </span>
              </div>
            </div>

            {/* Visual Schedule Slot Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedRoom.slots.map((slot) => {
                const isPast = slot.status === 'past';
                const isOccupied = slot.status === 'occupied';
                const isReserved = slot.status === 'reserved';
                const isAvailable = slot.status === 'available';

                return (
                  <div
                    key={slot.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isAvailable
                        ? 'bg-white border-[var(--brand-soft-border)] hover:border-[var(--brand-primary)] hover:shadow-md'
                        : isOccupied
                        ? 'bg-red-50/50 border-red-200/70 opacity-90'
                        : isReserved
                        ? 'bg-amber-50/50 border-amber-200/70 opacity-90'
                        : 'bg-[var(--bg-canvas)] border-[#E4EAE5] opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                          {slot.start} - {slot.end}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAvailable
                              ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)]'
                              : isOccupied
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : isReserved
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-200/70 text-slate-500'
                          }`}
                        >
                          {isAvailable
                            ? 'Bookable'
                            : isOccupied
                            ? 'Class In-Session'
                            : isReserved
                            ? 'Reserved'
                            : 'Completed'}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">
                        {slot.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {slot.lecturer}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E4EAE5] flex items-center justify-between">
                      {isAvailable ? (
                        <button
                          onClick={() => handleOpenBooking(slot)}
                          className="w-full py-1.5 px-3 rounded-lg bg-[var(--brand-soft-bg)] hover:bg-[var(--brand-primary)] hover:text-white text-[var(--brand-primary)] border border-[var(--brand-soft-border)] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-current" />
                          <span>Reserve Slot</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)] italic">
                          {isOccupied ? 'Clash: Timetable Lock' : isReserved ? 'Reserved by Peer' : 'Slot Concluded'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =====================================================================
              RAPID ROOM SWITCHER CAROUSEL (Key Spaces in Block)
              ===================================================================== */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                {selectedFloor} Spaces in {selectedRoom.buildingCode}
              </h3>
              <span className="text-xs text-[var(--text-secondary)]">Click any card to inspect telemetry &amp; route</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredRooms.slice(0, 3).map((r) => {
                const isSelected = r.id === selectedRoomId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoomId(r.id)}
                    className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between transition-all bg-white ${
                      isSelected
                        ? 'border-2 border-[var(--brand-primary)] shadow-md ring-2 ring-[var(--brand-soft-border)]'
                        : 'border border-[#E4EAE5] hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                            isSelected ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)]' : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {r.roomNumber}
                        </span>
                        <span
                          className={`text-xs font-medium flex items-center gap-1 ${
                            r.status === 'available' ? 'text-[var(--brand-primary)]' : 'text-red-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'available' ? 'bg-[var(--brand-primary)]' : 'bg-red-500'
                            }`}
                          ></span>
                          {r.statusText}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">{r.name}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                        {r.capacity} Seats • {r.features[0]}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E4EAE5] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>{r.currentOccupancy}/{r.capacity} Occ</span>
                      </span>
                      <span className={isSelected ? 'text-[var(--brand-primary)] font-semibold' : 'text-[var(--text-muted)]'}>
                        {isSelected ? 'Inspecting ✓' : 'Select →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: IOT TELEMETRY DIALS & ROOM WAYFINDING INSPECTOR
            ========================================================================= */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col gap-5">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--brand-primary)] uppercase font-bold tracking-wider">
                  <span>{selectedRoom.buildingCode}</span>
                  <span>•</span>
                  <span>{selectedRoom.floor}</span>
                  <span>•</span>
                  <span>Wing A</span>
                </div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight font-heading mt-0.5">
                  Room {selectedRoom.roomNumber}: {selectedRoom.name}
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] text-xs font-bold border border-[var(--brand-soft-border)] shrink-0">
                Active Node
              </span>
            </div>

            {/* Room Photo Preview with Live Tag */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-[#E4EAE5]">
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                <span className="px-2 py-1 rounded-md bg-white/95 backdrop-blur-md text-[var(--text-primary)] font-semibold shadow-xs">
                  {selectedRoom.type}
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--brand-primary)] backdrop-blur-md text-white font-bold shadow-xs">
                  {selectedRoom.capacity - selectedRoom.currentOccupancy} Desks Open
                </span>
              </div>
            </div>

            {/* ===================================================================
                IOT ENVIRONMENTAL TELEMETRY GAUGES & SENSOR DIALS
                =================================================================== */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  Live IoT Sensor Dials
                </span>
                <span className="text-[10px] text-[var(--brand-primary)] font-mono font-medium">Calibrated 1s ago</span>
              </div>

              {/* Grid of Gauges */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. CO2 & Air Quality Dial */}
                <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                    <span className="text-[10px] font-mono uppercase font-semibold">Air CO₂</span>
                    <Wind className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[var(--text-primary)] font-heading">{selectedRoom.co2}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">ppm</span>
                  </div>
                  <div className="w-full bg-[#E4EAE5] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-[var(--brand-primary)] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (selectedRoom.co2 / 800) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-[var(--brand-primary)] font-medium mt-1">{selectedRoom.co2Status}</span>
                </div>

                {/* 2. Thermal Comfort Dial */}
                <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                    <span className="text-[10px] font-mono uppercase font-semibold">HVAC Temp</span>
                    <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[var(--text-primary)] font-heading">{selectedRoom.temp}°</span>
                    <span className="text-[11px] text-[var(--text-muted)]">C</span>
                  </div>
                  <div className="w-full bg-[#E4EAE5] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all"
                      style={{ width: '68%' }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] mt-1">Target: {selectedRoom.tempTarget}°C • {selectedRoom.humidity}% RH</span>
                </div>

                {/* 3. Acoustic Sound Level Dial */}
                <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                    <span className="text-[10px] font-mono uppercase font-semibold">Acoustics</span>
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[var(--text-primary)] font-heading">{selectedRoom.noiseDb}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">dB</span>
                  </div>
                  <div className="w-full bg-[#E4EAE5] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (selectedRoom.noiseDb / 80) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium mt-1">{selectedRoom.noiseStatus}</span>
                </div>

                {/* 4. Wi-Fi 7 Enterprise Telemetry */}
                <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                    <span className="text-[10px] font-mono uppercase font-semibold">Wi-Fi 7 Core</span>
                    <Wifi className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[var(--text-primary)] font-heading">{selectedRoom.wifiSpeed.split(' ')[0]}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Mbps</span>
                  </div>
                  <div className="w-full bg-[#E4EAE5] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-purple-700 font-medium mt-1">{selectedRoom.wifiLatency} ping • {selectedRoom.wifiDevices} nodes</span>
                </div>
              </div>
            </div>

            {/* Room Features List */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Equipment &amp; Accessibility
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-canvas)] border border-[#E4EAE5] text-[11px] text-[var(--text-secondary)] font-medium"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Walking Directions from Chosen Node */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#E4EAE5]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Walking Turn Directions
                </span>
                <span className="text-xs text-[var(--brand-primary)] font-semibold">{selectedRoom.routeDistance}</span>
              </div>

              <div className="flex flex-col gap-2.5 relative pl-3 border-l-2 border-[var(--brand-primary)] ml-1 mt-1">
                {selectedRoom.routeSteps.map((st, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {st.step}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">{st.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  const firstBookable = selectedRoom.slots.find((s) => s.isBookable) || selectedRoom.slots[0];
                  handleOpenBooking(firstBookable);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Instant Reserve &amp; Generate NFC Pass</span>
              </button>

              <button
                onClick={() => navigate(`/campus-map?bldg=eng&room=${selectedRoom.roomNumber}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 border border-[#E4EAE5] transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Open in Mewar Campus GIS Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: INSTANT RESERVATION & VERIFIED QR/NFC PASS GENERATOR
          ========================================================================= */}
      {isBookingModalOpen && slotToBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsBookingModalOpen(false);
              setActivePass(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-4 sm:p-6 flex flex-col gap-5 text-[var(--text-primary)] max-h-[90dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-[var(--brand-primary)] font-bold uppercase tracking-wider">
                  Clash-Free Room Reservation
                </span>
                <h3 id="booking-modal-title" className="text-xl font-bold text-[var(--text-primary)] font-heading mt-0.5">
                  Book Room {selectedRoom.roomNumber} ({slotToBook.start} - {slotToBook.end})
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close booking modal"
                onClick={() => {
                  setIsBookingModalOpen(false);
                  setActivePass(null);
                }}
                className="w-8 h-8 rounded-lg bg-[var(--bg-canvas)] hover:bg-slate-200 text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message if Slot Conflict */}
            {bookingConflictMsg ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-red-900">Timetable Conflict Detected</span>
                  <span className="text-xs text-red-700 mt-0.5">{bookingConflictMsg}</span>
                  <span className="text-[11px] text-[var(--text-muted)] mt-2">
                    Tip: Look for slots labeled <span className="text-[var(--brand-primary)] font-semibold">"Bookable"</span> in the schedule timeline.
                  </span>
                </div>
              </div>
            ) : activePass ? (
              /* ===================================================================
                 VERIFIED NFC & DIGITAL QR ACCESS PASS BADGE
                 =================================================================== */
              <div className="flex flex-col gap-4">
                <div className="p-5 rounded-2xl bg-white border-2 border-[var(--brand-primary)] shadow-lg flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-soft-bg)] rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[var(--brand-soft-bg)] border border-[var(--brand-soft-border)] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--text-primary)]">Mewar University Digital Key</span>
                        <span className="text-[10px] font-mono text-[var(--brand-primary)] font-semibold">NFC Smart Lock Authorized</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">{activePass.passId}</span>
                  </div>

                  {/* QR Graphic and Details */}
                  <div className="flex items-center gap-4">
                    {/* High-fidelity SVG QR Code */}
                    <div className="w-28 h-28 p-2 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex items-center justify-center shrink-0 shadow-xs">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="0" y="0" width="100" height="100" fill="#F6F8F6" />
                        {/* Position Markers */}
                        <rect x="10" y="10" width="25" height="25" fill="#142D28" />
                        <rect x="15" y="15" width="15" height="15" fill="#F6F8F6" />
                        <rect x="18" y="18" width="9" height="9" fill="#168567" />

                        <rect x="65" y="10" width="25" height="25" fill="#142D28" />
                        <rect x="70" y="15" width="15" height="15" fill="#F6F8F6" />
                        <rect x="73" y="18" width="9" height="9" fill="#168567" />

                        <rect x="10" y="65" width="25" height="25" fill="#142D28" />
                        <rect x="15" y="70" width="15" height="15" fill="#F6F8F6" />
                        <rect x="18" y="73" width="9" height="9" fill="#168567" />

                        {/* Data Pixels */}
                        <rect x="40" y="12" width="6" height="6" fill="#142D28" />
                        <rect x="52" y="15" width="6" height="6" fill="#142D28" />
                        <rect x="42" y="30" width="6" height="6" fill="#142D28" />
                        <rect x="54" y="38" width="6" height="6" fill="#142D28" />
                        <rect x="68" y="44" width="6" height="6" fill="#142D28" />
                        <rect x="40" y="55" width="6" height="6" fill="#142D28" />
                        <rect x="50" y="65" width="6" height="6" fill="#142D28" />
                        <rect x="62" y="75" width="6" height="6" fill="#142D28" />
                        <rect x="75" y="62" width="6" height="6" fill="#142D28" />
                        <rect x="85" y="80" width="6" height="6" fill="#142D28" />
                        <circle cx="50" cy="50" r="5" fill="#168567" />
                      </svg>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-bold text-[var(--text-primary)] text-base font-heading">
                        Room {activePass.roomNumber}
                      </span>
                      <span className="text-[var(--text-secondary)]">{activePass.roomName}</span>
                      <span className="text-[var(--brand-primary)] font-mono font-semibold mt-1">
                        Valid: {activePass.slotTime} ({activePass.date})
                      </span>
                      <span className="text-[var(--text-muted)]">
                        Student: {activePass.studentName} ({activePass.studentRoll})
                      </span>
                    </div>
                  </div>

                  {/* NFC Door Unlock Simulator */}
                  <div className="pt-2 border-t border-[#E4EAE5] flex items-center justify-between">
                    <button
                      onClick={handleSimulateUnlock}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        simulatedUnlockSuccess
                          ? 'bg-[var(--brand-primary)] text-white'
                          : 'bg-[var(--brand-soft-bg)] hover:bg-[var(--brand-soft-border)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)]'
                      }`}
                    >
                      {simulatedUnlockSuccess ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <span>{simulatedUnlockSuccess ? 'Door Reader Unlocked! ✓' : 'Simulate NFC Tap to Unlock'}</span>
                    </button>

                    <button
                      onClick={() => copyPassId(activePass.passId)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 font-mono cursor-pointer"
                    >
                      {hasCopiedPassId ? <Check className="w-3.5 h-3.5 text-[var(--brand-primary)]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{hasCopiedPassId ? 'Copied' : 'Copy ID'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[var(--bg-canvas)] hover:bg-slate-200 text-[var(--text-primary)] text-xs font-semibold cursor-pointer border border-[#E4EAE5]"
                >
                  Close &amp; View Schedule
                </button>
              </div>
            ) : (
              /* Booking Configuration Form */
              <div className="flex flex-col gap-4">
                <div className="p-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">Slot Timing</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{slotToBook.start} - {slotToBook.end} Today</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] text-xs font-bold border border-[var(--brand-soft-border)]">
                    No Conflicts
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Student Roll Number</label>
                  <input
                    type="text"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] text-sm text-[var(--text-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-soft-border)] focus:border-[var(--brand-primary)] font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Reservation Purpose</label>
                  <div className="flex flex-wrap gap-2 mb-1.5">
                    {[
                      'Capstone Project Team Collab',
                      'Solo Deep Work Pod',
                      'AI Model Training & Lab',
                      'Peer Group Study',
                    ].map((purp) => (
                      <button
                        key={purp}
                        type="button"
                        onClick={() => setBookingPurpose(purp)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                          bookingPurpose === purp
                            ? 'bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold'
                            : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[#E4EAE5]'
                        }`}
                      >
                        {purp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E4EAE5]">
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm &amp; Issue Digital Pass</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SLIDE-OVER DRAWER: "MY ACTIVE PASSES"
          ========================================================================= */}
      {isMyPassesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="my-passes-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMyPassesOpen(false);
          }}
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md h-full bg-white border-l border-[#E4EAE5] p-4 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4EAE5]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[var(--brand-primary)]" />
                  <h3 id="my-passes-title" className="text-base font-bold text-[var(--text-primary)] font-heading">My Active Campus Passes</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close active passes drawer"
                  onClick={() => setIsMyPassesOpen(false)}
                  className="w-7 h-7 rounded-lg bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {savedPasses.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center text-[var(--text-muted)]">
                  <QrCode className="w-10 h-10 mb-2 opacity-30 text-[var(--text-muted)]" />
                  <p className="text-xs font-medium text-[var(--text-secondary)]">No active passes issued yet.</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">Book any room slot to generate an NFC pass.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
                  {savedPasses.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] hover:border-[var(--brand-soft-border)] flex flex-col gap-2.5 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[var(--brand-primary)]">{p.passId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)]">
                          {p.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] font-heading">Room {p.roomNumber}</h4>
                        <p className="text-xs text-[var(--text-secondary)]">{p.roomName}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E4EAE5] text-[11px] text-[var(--text-muted)]">
                        <span>Time: {p.slotTime}</span>
                        <span>{p.purpose}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4EAE5]">
              <button
                onClick={() => setIsMyPassesOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[var(--bg-canvas)] hover:bg-slate-200 text-xs font-semibold text-[var(--text-primary)] cursor-pointer border border-[#E4EAE5]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartRooms;
