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
  RefreshCw,
  Shield,
  CornerUpRight,
  CornerUpLeft,
  MoveUp,
  Footprints,
  DoorOpen,
  Thermometer,
  Users,
  Wifi,
  ZoomIn,
  ZoomOut,
  ChevronsRight,
  ChevronLeft,
  ArrowUpDown,
  SlidersHorizontal,
  Clock,
  Info,
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
  findShortestCampusRoute,
} from '../components/map/CampusGisMap';

const INITIAL_BUILDINGS = {
  gate: {
    id: 'gate',
    code: 'GATE-01',
    name: 'Main Campus Gate 1 (NH-48, Gangrar)',
    shortName: 'Main Campus Gate 1',
    block: 'Gate GATE-01',
    dept: 'National Highway 48 / 79 Campus Entrance',
    category: 'facility',
    x: 340,
    y: 740,
    width: 210,
    height: 130,
    description: 'Primary ceremonial entrance on NH-48 near Gangrar, automated RFID student verification barrier, and 24/7 security outpost.',
    occupancy: '45%',
    seats: 'Security Station',
    temp: '25.0°C',
    air: '380 ppm CO₂',
    accessibility: 'Barrier-Free Pedestrian Walkway',
    hours: 'Open 24/7',
    status: 'open',
    targetRoom: 'Security Control & Visitor Registration Outpost',
    targetDesc: 'NH-48 Pedestrian & Vehicle Portal',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Current Location: NH-48 Campus Gate 1', sub: 'Security & Student Verification Desk', dist: '0 m' },
      { num: 2, text: 'Pass Security Turnstiles', sub: 'Enter into Central University Boulevard', dist: '30 m • 0.5 min' },
    ],
  },
  gate2: {
    id: 'gate2',
    code: 'GATE-02',
    name: 'Campus Gate 2 (West Entry)',
    shortName: 'Campus Gate 2',
    block: 'Gate GATE-02',
    dept: 'West Perimeter Vehicle & Pedestrian Entrance',
    category: 'facility',
    x: 210,
    y: 440,
    width: 150,
    height: 110,
    description: 'Western entrance portal on the perimeter boundary providing direct access towards Guest House, Mira Hostel, and Campus Park.',
    occupancy: '30%',
    seats: 'West Checkpost',
    temp: '24.5°C',
    air: '380 ppm CO₂',
    accessibility: 'Step-Free Ramp',
    hours: '06:00 AM – 10:00 PM',
    status: 'open',
    targetRoom: 'West Barrier Outpost',
    targetDesc: 'West Gatehouse & Security Desk',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Current Location: Campus Gate 2', sub: 'West Security Desk', dist: '0 m' },
      { num: 2, text: 'Enter towards Guest House Road', sub: 'Direct access towards Hostels & Park', dist: '40 m • 0.6 min' },
    ],
  },
  main: {
    id: 'main',
    code: 'MAIN-01',
    name: 'Main Academic & Administrative Building',
    shortName: 'Main Building',
    block: 'Block MAIN-01',
    dept: 'University Secretariat, Admissions & Administrative Council',
    category: 'academic',
    x: 680,
    y: 280,
    width: 260,
    height: 160,
    description: 'Central university flagship building with expansive solar rooftop arrays, registrar office, admissions desk, accounts, and examination branch.',
    occupancy: '62%',
    seats: '350 / 500 Capacity',
    temp: '22.0°C',
    air: '395 ppm CO₂',
    accessibility: 'Step-Free Ramp & Dual Lifts',
    hours: '08:30 AM – 06:00 PM',
    status: 'open',
    targetRoom: 'Room 102 (Ground Floor)',
    targetDesc: 'Admissions & Student Welfare Secretariat',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gate 1 (NH-48)', sub: 'Walk North along Central Boulevard', dist: '0 m' },
      { num: 2, text: 'Arrive at Main Building Portico', sub: 'Central reception foyer and registrar office', dist: '150 m • 2 min' },
    ],
  },
  eng: {
    id: 'eng',
    code: 'ENG-02',
    name: 'Faculty of Engineering & Technology',
    shortName: 'Engineering Building',
    block: 'Block ENG-02',
    dept: 'Department of Computer Science & Engineering, AI Labs & Core Tech',
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
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Main Building', sub: 'Cross Academic Quad East Pathway', dist: '0 m' },
      { num: 2, text: 'Follow Engineering Promenade', sub: 'Heading East towards Tech Wing', dist: '140 m • 1.8 min' },
      { num: 3, text: 'Ascend Lift to Floor 2', sub: 'Department of Computer Science', dist: '230 m • 3 min' },
    ],
  },
  teacher: {
    id: 'teacher',
    code: 'FAC-01',
    name: 'Teachers & Faculty Academic Building',
    shortName: 'Teacher Building',
    block: 'Block FAC-01',
    dept: 'Faculty Chambers, Research Scholars & HOD Offices',
    category: 'academic',
    x: 1320,
    y: 190,
    width: 220,
    height: 150,
    description: 'Academic staff quarters, professors consultation cabins, conference room, and departmental faculties.',
    occupancy: '55%',
    seats: '120 Faculty Cabins',
    temp: '22.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Step-Free Ramp Access',
    hours: '08:30 AM – 06:30 PM',
    status: 'open',
    targetRoom: 'Dean & Faculty Council Chamber',
    targetDesc: 'Level 1 Consultation Wing',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Engineering Building', sub: 'Head East along Faculty Link', dist: '0 m' },
      { num: 2, text: 'Arrive at Teacher Building', sub: 'Academic faculty entrance', dist: '70 m • 1 min' },
    ],
  },
  badal: {
    id: 'badal',
    code: 'HST-08',
    name: 'Badal Boys Residential Hostel',
    shortName: 'Badal Hostel',
    block: 'Block HST-08',
    dept: 'Male Student Residence (East Campus Wing)',
    category: 'facility',
    x: 1320,
    y: 360,
    width: 220,
    height: 150,
    description: 'Modern student hostel block situated near faculty wing with furnished study units and high-speed Wi-Fi.',
    occupancy: '84%',
    seats: '220 Resident Capacity',
    temp: '22.5°C',
    air: '405 ppm CO₂',
    accessibility: 'Accessible Ground Units',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Warden Office & Common Lounge',
    targetDesc: 'East Residential Gate',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Teacher Building', sub: 'Walk South past garden', dist: '0 m' },
      { num: 2, text: 'Arrive at Badal Hostel Gate', sub: 'Biometric residence portal', dist: '60 m • 0.8 min' },
    ],
  },
  mess: {
    id: 'mess',
    code: 'MSS-01',
    name: 'Central Student Dining Mess',
    shortName: 'Campus Mess',
    block: 'Block MSS-01',
    dept: 'Central Campus Catering & Dining Services',
    category: 'facility',
    x: 1040,
    y: 370,
    width: 250,
    height: 160,
    description: 'Spacious multi-counter student dining hall serving daily breakfast, lunch, refreshments, and dinner.',
    occupancy: '88%',
    seats: '600 Dining Seats',
    temp: '23.5°C',
    air: '430 ppm CO₂',
    accessibility: 'Step-Free Ramp Access',
    hours: '07:00 AM – 09:30 PM',
    status: 'open',
    targetRoom: 'Central Mess Hall A',
    targetDesc: 'Main Dining Court & Nutrition Counter',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Engineering Building', sub: 'Head South down Dining Walkway', dist: '0 m' },
      { num: 2, text: 'Arrive at Central Mess', sub: 'Main cafeteria foyer', dist: '90 m • 1.2 min' },
    ],
  },
  law: {
    id: 'law',
    code: 'LAW-01',
    name: 'Faculty of Law & Legal Studies',
    shortName: 'Law Building',
    block: 'Block LAW-01',
    dept: 'Department of Law, Moot Court Hall & Legal Aid Clinic',
    category: 'academic',
    x: 1320,
    y: 530,
    width: 220,
    height: 160,
    description: 'Dedicated multi-wing law faculty located southeast of the Mess with modern moot court chambers, legal research library, and lecture theatres.',
    occupancy: '65%',
    seats: '300 Student Capacity',
    temp: '22.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Full Ramp Access',
    hours: '08:30 AM – 05:30 PM',
    status: 'open',
    targetRoom: 'Moot Court Chamber 1',
    targetDesc: 'Judicial Simulation Wing',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Central Mess', sub: 'Head East towards Law Wing', dist: '0 m' },
      { num: 2, text: 'Arrive at Law Building', sub: 'Law portico entrance', dist: '70 m • 1 min' },
    ],
  },
  football: {
    id: 'football',
    code: 'SPT-01',
    name: 'University Football Ground & Arena',
    shortName: 'Football Ground',
    block: 'Block SPT-01',
    dept: 'Department of Physical Education & Athletics',
    category: 'facility',
    x: 680,
    y: 550,
    width: 260,
    height: 220,
    description: 'Full-size natural turf football ground with running track perimeter and spectator pavilions.',
    occupancy: '40%',
    seats: 'Open Pavilion 800 Seats',
    temp: '25.0°C',
    air: '370 ppm CO₂',
    accessibility: 'Step-Free Ground Level',
    hours: '05:30 AM – 08:30 PM',
    status: 'open',
    targetRoom: 'Sports Equipment Room & Pavilion',
    targetDesc: 'Athletic Locker & Pavilion',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gate 1 (NH-48)', sub: 'Head South-East along sports path', dist: '0 m' },
      { num: 2, text: 'Arrive at Football Ground Pavilion', sub: 'Spectator stands entrance', dist: '110 m • 1.5 min' },
    ],
  },
  basketball: {
    id: 'basketball',
    code: 'SPT-02',
    name: 'Basketball & Outdoor Sports Court',
    shortName: 'Basketball Ground',
    block: 'Block SPT-02',
    dept: 'Department of Physical Education & Court Sports',
    category: 'facility',
    x: 1320,
    y: 710,
    width: 220,
    height: 130,
    description: 'Floodlit outdoor basketball and volleyball hard courts situated directly south of the Law Building.',
    occupancy: '60%',
    seats: 'Outdoor Hard Courts',
    temp: '24.0°C',
    air: '375 ppm CO₂',
    accessibility: 'Barrier-Free Court Surface',
    hours: '06:00 AM – 09:00 PM',
    status: 'open',
    targetRoom: 'Court Manager & Equipment Post',
    targetDesc: 'East Courts Control',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Law Building', sub: 'Walk South past garden walkway', dist: '0 m' },
      { num: 2, text: 'Arrive at Basketball Courts', sub: 'Courts gate', dist: '50 m • 0.7 min' },
    ],
  },
  kumbha: {
    id: 'kumbha',
    code: 'HST-06',
    name: 'Maharana Kumbha Boys Hostel',
    shortName: 'Kumbha Hostel',
    block: 'Block HST-06',
    dept: 'Senior Student Residence Wing',
    category: 'facility',
    x: 680,
    y: 110,
    width: 260,
    height: 140,
    description: 'Senior scholar dormitory units with high-speed campus LAN, study halls, and laundry amenities.',
    occupancy: '76%',
    seats: '200 Resident Capacity',
    temp: '22.4°C',
    air: '395 ppm CO₂',
    accessibility: 'Step-Free Ramp Access',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Hostel Study Commons & Resident Office',
    targetDesc: 'Senior Scholar Residential Wing',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Main Building', sub: 'Walk North towards Residential Quad', dist: '0 m' },
      { num: 2, text: 'Arrive at Kumbha Hostel', sub: 'Main entrance archway', dist: '110 m • 1.5 min' },
    ],
  },
  pratap: {
    id: 'pratap',
    code: 'HST-07',
    name: 'Maharana Pratap Boys Hostel',
    shortName: 'Pratap Hostel',
    block: 'Block HST-07',
    dept: 'Male Student Living Complex',
    category: 'facility',
    x: 680,
    y: 220,
    width: 260,
    height: 130,
    description: 'Residential quarters directly south of Kumbha Hostel with landscaped garden frontage.',
    occupancy: '82%',
    seats: '220 Resident Capacity',
    temp: '22.5°C',
    air: '400 ppm CO₂',
    accessibility: 'Ramp Access',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Pratap Common Lounge & Warden Office',
    targetDesc: 'Block Foyer',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Kumbha Hostel', sub: 'Head South down Residential Pathway', dist: '0 m' },
      { num: 2, text: 'Arrive at Pratap Hostel Gate', sub: 'Residential entrance', dist: '50 m • 0.7 min' },
    ],
  },
  park: {
    id: 'park',
    code: 'PRK-01',
    name: 'Central Campus Park & Botanical Garden',
    shortName: 'Campus Park',
    block: 'Block PRK-01',
    dept: 'Campus Horticultural & Student Recreation Zone',
    category: 'facility',
    x: 480,
    y: 150,
    width: 170,
    height: 170,
    description: 'Central green parkland, shaded walking tracks, flowering shrubs, and outdoor seating lawns.',
    occupancy: 'Open Grounds',
    seats: 'Outdoor Green Lawns',
    temp: '23.0°C',
    air: '360 ppm CO₂',
    accessibility: 'Paved Perimeter Walkway',
    hours: '05:00 AM – 10:00 PM',
    status: 'open',
    targetRoom: 'Central Pergola & Fountain',
    targetDesc: 'Botanical Lawns',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Main Building', sub: 'Head Northwest past central avenue', dist: '0 m' },
      { num: 2, text: 'Arrive at Central Park', sub: 'Park gates', dist: '90 m • 1.2 min' },
    ],
  },
  guest_house: {
    id: 'guest_house',
    code: 'GST-01',
    name: 'University Guest House & VIP Suites',
    shortName: 'Guest House',
    block: 'Block GST-01',
    dept: 'Campus Hospitality & Visiting Dignitaries Lodge',
    category: 'facility',
    x: 300,
    y: 440,
    width: 160,
    height: 100,
    description: 'Furnished suites for visiting faculty, academic guest lecturers, delegates, and parent accommodations.',
    occupancy: '60%',
    seats: '16 Guest Suites',
    temp: '21.5°C',
    air: '380 ppm CO₂',
    accessibility: 'Step-Free Ground Suites',
    hours: 'Open 24/7 Reception',
    status: 'open',
    targetRoom: 'Guest Reception & VIP Dining Foyer',
    targetDesc: 'Executive Hospitality Wing',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gate 2', sub: 'Walk North 40 meters along avenue', dist: '0 m' },
      { num: 2, text: 'Arrive at Guest House Portico', sub: 'Reception foyer', dist: '40 m • 0.6 min' },
    ],
  },
  mira: {
    id: 'mira',
    code: 'HST-01',
    name: 'Mira Girls Residential Hostel',
    shortName: 'Mira Hostel',
    block: 'Block HST-01',
    dept: 'Female Student Residential Precinct (South Wing)',
    category: 'facility',
    x: 300, y: 320, width: 160, height: 100,
    description: 'Secure female residence quarters with landscaped courtyard, reading hall, and dedicated warden outpost.',
    occupancy: '88%',
    seats: '280 Resident Capacity',
    temp: '22.0°C',
    air: '400 ppm CO₂',
    accessibility: 'Fully Accessible Ground Level',
    hours: 'Open 24/7 (Gate curfew 09:00 PM)',
    status: 'open',
    targetRoom: 'Warden Office & Common Study Room',
    targetDesc: 'Residence Administration',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Guest House', sub: 'Walk North along paved avenue', dist: '0 m' },
      { num: 2, text: 'Arrive at Mira Hostel Gate', sub: 'Biometric security access entry', dist: '70 m • 1 min' },
    ],
  },
  panna: {
    id: 'panna',
    code: 'HST-02',
    name: 'Panna Girls Residential Hostel',
    shortName: 'Panna Hostel',
    block: 'Block HST-02',
    dept: 'Female Student Residential Precinct (North Wing)',
    category: 'facility',
    x: 300, y: 200, width: 160, height: 100,
    description: 'Secure female student quarters, air-cooled living units, study rooms, and attached dining mess.',
    occupancy: '85%',
    seats: '240 Resident Capacity',
    temp: '22.0°C',
    air: '395 ppm CO₂',
    accessibility: 'Ground Floor Accessible Units',
    hours: 'Open 24/7 (Curfew 09:00 PM)',
    status: 'open',
    targetRoom: 'North Block Common Hall & Security Desk',
    targetDesc: 'Panna Hostel Security Portal',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Mira Hostel', sub: 'Continue North past courtyard', dist: '0 m' },
      { num: 2, text: 'Arrive at Panna Hostel', sub: 'North gate portal', dist: '60 m • 0.8 min' },
    ],
  },
  hospital: {
    id: 'hospital',
    code: 'MED-01',
    name: 'University Hospital & Health Centre',
    shortName: 'Campus Hospital',
    block: 'Block MED-01',
    dept: '24/7 Campus Emergency Medical Care & Dispensary',
    category: 'facility',
    x: 440, y: 70, width: 110, height: 90,
    description: 'Round-the-clock university hospital wing, emergency ambulance desk, resident medical doctors, and pharmacy dispensary.',
    occupancy: '25%',
    seats: '20 Inpatient Beds',
    temp: '21.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Emergency Stretcher & Wheelchair Ramp',
    hours: 'Open 24/7 Emergency Care',
    status: 'open',
    targetRoom: 'Emergency Triage & Consultation Room 1',
    targetDesc: 'Campus Medical Dispensary',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Panna Hostel', sub: 'Head East towards Health Complex', dist: '0 m' },
      { num: 2, text: 'Arrive at University Hospital', sub: 'Emergency Bay entrance', dist: '80 m • 1 min' },
    ],
  },
  gora: {
    id: 'gora',
    code: 'HST-03',
    name: 'Gora Boys Residential Hostel',
    shortName: 'Gora Hostel',
    block: 'Block HST-03',
    dept: 'Boys Residence Complex & Quadrangle Living',
    category: 'facility',
    x: 570, y: 50, width: 160, height: 110,
    description: 'Major residential hostel block with an open central courtyard, air-cooled rooms, and attached student amenities.',
    occupancy: '90%',
    seats: '350 Resident Capacity',
    temp: '22.8°C',
    air: '410 ppm CO₂',
    accessibility: 'Step-Free Ground Units',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Gora Quadrangle Foyer & Recreation Room',
    targetDesc: 'Main Quadrangle Portal',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Central Park', sub: 'Walk North along garden promenade', dist: '0 m' },
      { num: 2, text: 'Arrive at Gora Hostel Gate', sub: 'Central quad archway', dist: '100 m • 1.3 min' },
    ],
  },
  sanaga: {
    id: 'sanaga',
    code: 'HST-04',
    name: 'Sanaga Boys Residential Hostel',
    shortName: 'Sanaga Hostel',
    block: 'Block HST-04',
    dept: 'Male Student Residence Wing',
    category: 'facility',
    x: 750, y: 40, width: 160, height: 100,
    description: 'Senior boys hostel living quarters with Wi-Fi, common recreation room, and 24/7 security station.',
    occupancy: '91%',
    seats: '360 Resident Capacity',
    temp: '22.8°C',
    air: '415 ppm CO₂',
    accessibility: 'Ramp and Ground Floor Units',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Block 2 Warden Office & Common Room',
    targetDesc: 'Residential Administration Desk',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gora Hostel', sub: 'Head East along North Perimeter path', dist: '0 m' },
      { num: 2, text: 'Arrive at Sanaga Hostel Gate', sub: 'Sanaga residential corridor', dist: '90 m • 1.2 min' },
    ],
  },
  bhamasha: {
    id: 'bhamasha',
    code: 'HST-05',
    name: 'Bhamasha Boys Residential Hostel',
    shortName: 'Bhamasha Hostel',
    block: 'Block HST-05',
    dept: 'East Living Quad Male Student Residence Wing',
    category: 'facility',
    x: 750,
    y: 160,
    width: 160,
    height: 110,
    description: 'Student accommodation complex positioned directly south of Sanaga Hostel with furnished dormitories and courtyards.',
    occupancy: '86%',
    seats: '260 Resident Capacity',
    temp: '22.6°C',
    air: '405 ppm CO₂',
    accessibility: 'Ramp Access',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    status: 'open',
    targetRoom: 'Bhamasha Foyer & Study Hall',
    targetDesc: 'East Living Reception',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Sanaga Hostel', sub: 'Walk South towards Bhamasha wing', dist: '0 m' },
      { num: 2, text: 'Arrive at Bhamasha Hostel', sub: 'Main hostel entrance', dist: '50 m • 0.7 min' },
    ],
  },
  temple: {
    id: 'temple',
    code: 'TMP-01',
    name: 'Mewar Campus Temple & Meditation Shrine',
    shortName: 'Temple',
    block: 'Temple TMP-01',
    dept: 'Campus Spiritual Centre & Cultural Forum',
    category: 'facility',
    x: 720,
    y: 310,
    width: 140,
    height: 110,
    description: 'Sacred campus temple and peaceful meditation shrine situated at the northern entrance courtyard of the Main Academic complex, directly south of the Botanical Park.',
    occupancy: '25%',
    seats: 'Shrine Courtyard',
    temp: '23.0°C',
    air: '375 ppm CO₂',
    accessibility: 'Step-Free Courtyard',
    hours: '05:30 AM – 09:30 PM',
    status: 'open',
    targetRoom: 'Main Mandir Sanctum & Prayer Hall',
    targetDesc: 'North Academic Entry Courtyard',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gate 1 / Main Building', sub: 'Walk North along Central Boulevard', dist: '0 m' },
      { num: 2, text: 'Arrive at Campus Temple Portico', sub: 'North Foyer of Main Academic Building', dist: '180 m • 2.2 min' },
    ],
  },
  parking: {
    id: 'parking',
    code: 'PRK-02',
    name: 'Main Campus Vehicle & Visitor Parking Zone',
    shortName: 'Parking',
    block: 'Parking PRK-02',
    dept: 'Campus Transport & Vehicle Management Outpost',
    category: 'facility',
    x: 380,
    y: 790,
    width: 190,
    height: 120,
    description: 'Spacious covered vehicular parking zone located along the western perimeter fence south of Gate 1 and west of Football Ground, offering EV charging and 2-wheeler/4-wheeler bays.',
    occupancy: '52%',
    seats: '220 Bays Available',
    temp: '26.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Step-Free Direct Vehicle Access',
    hours: 'Open 24/7',
    status: 'open',
    targetRoom: 'Covered Vehicle Bay Zone A-F',
    targetDesc: 'West Highway Perimeter Parking',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gate 1 (NH-48)', sub: 'Turn South along West Perimeter Avenue', dist: '0 m' },
      { num: 2, text: 'Enter Parking Bays', sub: 'Covered Student & Faculty Parking Zone', dist: '75 m • 1 min' },
    ],
  },
  cricket: {
    id: 'cricket',
    code: 'SPT-03',
    name: 'University Cricket Ground & Pavilion',
    shortName: 'Cricket Ground',
    block: 'Sports Arena SPT-03',
    dept: 'Department of Physical Education & Athletics',
    category: 'facility',
    x: 620,
    y: 920,
    width: 280,
    height: 180,
    description: 'Full-sized university cricket ground located in the south-central campus grounds with turf pitch, pavilion stands, and practice nets.',
    occupancy: '40%',
    seats: 'Pavilion & Practice Nets',
    temp: '25.5°C',
    air: '380 ppm CO₂',
    accessibility: 'Perimeter Walkway & Spectator Lawns',
    hours: '06:00 AM – 07:00 PM',
    status: 'open',
    targetRoom: 'Cricket Pavilion & Equipment Room',
    targetDesc: 'South Athletic Precinct',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Gate 1', sub: 'Head South past Football Ground', dist: '0 m' },
      { num: 2, text: 'Arrive at Cricket Ground Pavilion', sub: 'South Turf Arena & Practice Nets', dist: '220 m • 2.8 min' },
    ],
  },
  gym: {
    id: 'gym',
    code: 'SPT-04',
    name: 'University Fitness Centre & Gymnasium',
    shortName: 'Gym',
    block: 'Sports SPT-04',
    dept: 'Department of Physical Education & Sports Training',
    category: 'facility',
    x: 910,
    y: 880,
    width: 130,
    height: 110,
    description: 'Fully equipped student gymnasium and indoor strength-training center situated south of Basketball Court and adjacent to Volleyball Ground.',
    occupancy: '58%',
    seats: '45 Cardio & Weight Stations',
    temp: '21.0°C',
    air: '420 ppm CO₂',
    accessibility: 'Step-Free Ground Floor Entrance',
    hours: '06:00 AM – 09:30 PM',
    status: 'open',
    targetRoom: 'Main Workout Hall & Weights Wing',
    targetDesc: 'East Sports Court Precinct',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Law Building', sub: 'Walk South past Basketball Ground', dist: '0 m' },
      { num: 2, text: 'Enter Gymnasium Reception', sub: 'Indoor Fitness & Cardio Hall', dist: '90 m • 1.1 min' },
    ],
  },
  volleyball: {
    id: 'volleyball',
    code: 'SPT-05',
    name: 'University Volleyball Arena & Courts',
    shortName: 'Volleyball Ground',
    block: 'Sports SPT-05',
    dept: 'Department of Physical Education & Court Sports',
    category: 'facility',
    x: 1060,
    y: 880,
    width: 140,
    height: 110,
    description: 'Outdoor regulation volleyball courts situated east of the Gymnasium and south of Law Building with spectator seating and tournament lighting.',
    occupancy: '35%',
    seats: 'Regulation Courts 1 & 2',
    temp: '24.5°C',
    air: '380 ppm CO₂',
    accessibility: 'Step-Free Court Access',
    hours: '06:00 AM – 08:30 PM',
    status: 'open',
    targetRoom: 'Court 1 (Tournament Arena)',
    targetDesc: 'East Outdoor Sports Arena',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart Law Building / Basketball Ground', sub: 'Walk South-East along Sports Pathway', dist: '0 m' },
      { num: 2, text: 'Arrive at Volleyball Court', sub: 'Outdoor Volleyball Arena', dist: '110 m • 1.3 min' },
    ],
  },
  agriculture: {
    id: 'agriculture',
    code: 'AGR-01',
    name: 'Faculty of Agriculture Research & Experimental Field',
    shortName: 'Agriculture Field',
    block: 'Agri AGR-01',
    dept: 'Department of Agriculture Sciences & Horticulture Research',
    category: 'academic',
    x: 980,
    y: 1040,
    width: 260,
    height: 200,
    description: 'Extensive agricultural research farm plots and botanical nursery situated in the southeastern quadrangle for crop trials, soil research, and organic cultivation.',
    occupancy: '28%',
    seats: 'Research Polyhouse & Trial Plots',
    temp: '26.0°C',
    air: '365 ppm CO₂',
    accessibility: 'Farm Perimeter Access Path',
    hours: '07:00 AM – 06:30 PM',
    status: 'open',
    targetRoom: 'Agronomy Research Lab & Farm Office',
    targetDesc: 'South-East Agricultural Station',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    steps: [
      { num: 1, text: 'Depart East Sports Quad', sub: 'Head South past Volleyball Court & Gym', dist: '0 m' },
      { num: 2, text: 'Enter Agriculture Research Fields', sub: 'Experimental Crop Plots & Polyhouse', dist: '160 m • 2 min' },
    ],
  },
};

// Aliases for backwards compatibility with legacy routes/bookmarks
INITIAL_BUILDINGS.admin = INITIAL_BUILDINGS.main;
INITIAL_BUILDINGS.cafeteria = INITIAL_BUILDINGS.mess;
INITIAL_BUILDINGS.hostel_b = INITIAL_BUILDINGS.sanaga;
INITIAL_BUILDINGS.hostel_g = INITIAL_BUILDINGS.mira;
INITIAL_BUILDINGS.sports = INITIAL_BUILDINGS.basketball;
INITIAL_BUILDINGS.library = INITIAL_BUILDINGS.pratap;
INITIAL_BUILDINGS.auditorium = INITIAL_BUILDINGS.football;
INITIAL_BUILDINGS.mandir = INITIAL_BUILDINGS.temple;
INITIAL_BUILDINGS.farm = INITIAL_BUILDINGS.agriculture;



// Rich architectural CAD floorplans for campus buildings
export const INDOOR_BLUEPRINTS = {
  eng: {
    buildingName: 'Faculty of Engineering & Technology',
    blockCode: 'Block ENG-02',
    floors: {
      'Level 2': {
        title: 'Level 2: Computing, AI & Systems Research Hub',
        skybridge: { x: 50, y: 390, w: 160, h: 100, label: 'Skybridge from Central Library', connected: true },
        corridor: { label: 'Main North Research Corridor' },
        stairs: [
          { x: 530, y: 390, w: 60, h: 80, label: 'Dual Lifts & Core Stairs' },
          { x: 910, y: 390, w: 70, h: 80, label: 'Restrooms & Water Station' },
        ],
        rooms: [
          {
            id: 'B-201',
            code: 'B-201',
            name: 'Large Amphitheatre',
            type: 'Lecture Theatres',
            status: 'occupied',
            statusText: 'Occupied • CS-204 Algorithms',
            capacity: 120,
            occupancy: 120,
            temp: '23.1°C',
            co2: '510 ppm',
            x: 230,
            y: 160,
            w: 270,
            h: 210,
            door: { x: 365, y: 370 },
            features: ['Tiered Acoustic Seating', 'Dual 4K Laser Projection', 'ADA Hearing Loop'],
            color: '#F43F5E',
          },
          {
            id: 'B-202',
            code: 'B-202',
            name: 'Faculty Seminar Suite',
            type: 'Smart Classrooms',
            status: 'reserved',
            statusText: 'Reserved • Faculty Council (2 PM)',
            capacity: 35,
            occupancy: 35,
            temp: '21.0°C',
            co2: '390 ppm',
            x: 610,
            y: 160,
            w: 240,
            h: 210,
            door: { x: 730, y: 370 },
            features: ['Interactive Smart Touchboard', 'Conference Telemetry Camera', 'Modular Glass Tables'],
            color: '#F59E0B',
          },
          {
            id: 'B-205',
            code: 'B-205',
            name: 'AI & Robotics Prototyping Lab',
            type: 'Computer Labs',
            status: 'occupied',
            statusText: 'In Session • Autonomous Systems',
            capacity: 28,
            occupancy: 28,
            temp: '22.0°C',
            co2: '440 ppm',
            x: 1000,
            y: 160,
            w: 290,
            h: 210,
            door: { x: 1145, y: 370 },
            features: ['AI Prototyping Clusters', 'Test Flight Cage', 'Soldering Stations', 'ADA Bench'],
            color: '#F43F5E',
          },
          {
            id: 'B-203',
            code: 'B-203',
            name: 'Distributed Systems Lab',
            type: 'Computer Labs',
            status: 'available',
            statusText: 'Open Now • Free Access',
            capacity: 40,
            occupancy: 10,
            temp: '20.4°C',
            co2: '425 ppm',
            x: 230,
            y: 500,
            w: 270,
            h: 230,
            door: { x: 365, y: 500 },
            features: ['30x RTX 4090 AI Workstations', '10GbE Fiber Drop', 'Dual OLED Monitors', 'ADA Station #1'],
            color: '#10B981',
          },
          {
            id: 'B-204',
            code: 'B-204',
            name: 'Multi-Media Lecture Theatre & AI Hub',
            type: 'Lecture Theatres',
            status: 'available',
            statusText: 'Open Now (Till 11:30 AM)',
            capacity: 60,
            occupancy: 18,
            temp: '21.8°C',
            co2: '410 ppm',
            x: 610,
            y: 500,
            w: 290,
            h: 230,
            door: { x: 755, y: 500 },
            features: ['Dual 4K Laser Projection', 'Motorized USB-C Lectern', 'Wi-Fi 7 Campus Core', 'ADA Front Row'],
            color: '#10B981',
          },
          {
            id: 'B-206',
            code: 'B-206',
            name: 'Silent Acoustic Study Pods',
            type: 'Study Pods',
            status: 'available',
            statusText: '4 Pods Available',
            capacity: 16,
            occupancy: 12,
            temp: '21.5°C',
            co2: '400 ppm',
            x: 1000,
            y: 500,
            w: 290,
            h: 230,
            door: { x: 1145, y: 500 },
            features: ['16 Acoustic Pods', 'ANC Glass Enclosures', 'USB-C PD 100W Charging', 'Dimmable Warm LED'],
            color: '#10B981',
          },
        ],
      },
      'Level 1': {
        title: 'Level 1: Core Engineering Lecture Halls & Labs',
        corridor: { label: 'Main Concourse Level 1' },
        stairs: [
          { x: 530, y: 390, w: 60, h: 80, label: 'Dual Lifts & Core Stairs' },
          { x: 910, y: 390, w: 70, h: 80, label: 'Restrooms & Water Station' },
        ],
        rooms: [
          {
            id: 'B-101',
            code: 'B-101',
            name: 'Lecture Theatre 1',
            type: 'Lecture Theatres',
            status: 'occupied',
            statusText: 'In Session • ENG-101 Mathematics',
            capacity: 90,
            occupancy: 84,
            temp: '22.0°C',
            co2: '430 ppm',
            x: 230,
            y: 180,
            w: 340,
            h: 200,
            door: { x: 400, y: 380 },
            features: ['Stepped Seating', 'Dual Projectors', 'Public Address'],
            color: '#F43F5E',
          },
          {
            id: 'B-102',
            code: 'B-102',
            name: 'Microprocessors & IoT Lab',
            type: 'Computer Labs',
            status: 'available',
            statusText: 'Open for Practical Sessions',
            capacity: 50,
            occupancy: 12,
            temp: '21.2°C',
            co2: '405 ppm',
            x: 680,
            y: 180,
            w: 340,
            h: 200,
            door: { x: 850, y: 380 },
            features: ['ESP32 & Raspberry Pi Stations', 'Oscilloscopes', 'Logic Analyzers'],
            color: '#10B981',
          },
          {
            id: 'B-103',
            code: 'B-103',
            name: 'Computer Networks & Telecom Lab',
            type: 'Computer Labs',
            status: 'available',
            statusText: 'Available',
            capacity: 45,
            occupancy: 8,
            temp: '20.8°C',
            co2: '395 ppm',
            x: 230,
            y: 490,
            w: 340,
            h: 220,
            door: { x: 400, y: 490 },
            features: ['Cisco Rack Pods', 'Packet Tracer Nodes', 'Fiber Splicers'],
            color: '#10B981',
          },
          {
            id: 'B-104',
            code: 'B-104',
            name: 'Digital Signal Processing Lab',
            type: 'Computer Labs',
            status: 'available',
            statusText: 'Available',
            capacity: 45,
            occupancy: 5,
            temp: '21.0°C',
            co2: '390 ppm',
            x: 680,
            y: 490,
            w: 340,
            h: 220,
            door: { x: 850, y: 490 },
            features: ['MATLAB Telemetry Nodes', 'Audio Analyzers'],
            color: '#10B981',
          },
        ],
      },
      'Ground': {
        title: 'Ground Floor: Main Entrance Foyer, Workshops & Dean Suite',
        corridor: { label: 'Ground Floor Atrium' },
        stairs: [
          { x: 530, y: 390, w: 60, h: 80, label: 'Dual Lifts & Core Stairs' },
          { x: 910, y: 390, w: 70, h: 80, label: 'Ground Restrooms' },
        ],
        rooms: [
          {
            id: 'B-001',
            code: 'B-001',
            name: 'Heavy Machinery & Fabrication Workshop',
            type: 'Labs & Workshops',
            status: 'available',
            statusText: 'Safety Goggles Required',
            capacity: 60,
            occupancy: 20,
            temp: '23.5°C',
            co2: '460 ppm',
            x: 230,
            y: 180,
            w: 420,
            h: 210,
            door: { x: 440, y: 390 },
            features: ['CNC Lathes', '3D Printers (Formlabs)', 'Welding Enclosure'],
            color: '#10B981',
          },
          {
            id: 'B-002',
            code: 'B-002',
            name: 'Dean & Head of Department Secretariat',
            type: 'Administrative',
            status: 'available',
            statusText: 'Office Hours: 10:00 AM – 5:00 PM',
            capacity: 25,
            occupancy: 8,
            temp: '21.5°C',
            co2: '390 ppm',
            x: 750,
            y: 180,
            w: 400,
            h: 210,
            door: { x: 950, y: 390 },
            features: ['Dean Executive Suite', 'HOD CSE Desk', 'Conference Room'],
            color: '#10B981',
          },
          {
            id: 'B-003',
            code: 'B-003',
            name: 'Student Innovation & Hackathon Bay',
            type: 'Student Hub',
            status: 'available',
            statusText: '24/7 Access with ID Card',
            capacity: 80,
            occupancy: 34,
            temp: '22.1°C',
            co2: '420 ppm',
            x: 230,
            y: 490,
            w: 600,
            h: 230,
            door: { x: 530, y: 490 },
            features: ['Whiteboard Walls', 'Modular Sofas', 'High-speed Wi-Fi 7', 'Coffee Station'],
            color: '#10B981',
          },
        ],
      },
    },
  },
  library: {
    buildingName: 'Swami Vivekananda Central Library',
    blockCode: 'Block LIB-03',
    floors: {
      'Level 2': {
        title: 'Level 2: Digital Research Commons & Quiet Pods',
        corridor: { label: 'Central Silent Reading Walkway' },
        stairs: [
          { x: 530, y: 390, w: 60, h: 80, label: 'Central Library Lifts' },
          { x: 910, y: 390, w: 70, h: 80, label: 'Silent Restrooms' },
        ],
        rooms: [
          {
            id: 'LIB-201',
            code: 'LIB-201',
            name: 'Central Reading & Digital Commons',
            type: 'Reading Commons',
            status: 'available',
            statusText: '180 / 350 Seats Available',
            capacity: 350,
            occupancy: 170,
            temp: '21.5°C',
            co2: '390 ppm',
            x: 230,
            y: 180,
            w: 520,
            h: 210,
            door: { x: 490, y: 390 },
            features: ['Natural Skylight', 'Ergonomic Desk Power Outlets', 'High-Speed Wi-Fi'],
            color: '#10B981',
          },
          {
            id: 'LIB-202',
            code: 'LIB-202',
            name: 'Quiet Acoustic Study Pods (Pods 1–12)',
            type: 'Study Pods',
            status: 'available',
            statusText: '6 Pods Open Now',
            capacity: 24,
            occupancy: 12,
            temp: '21.0°C',
            co2: '385 ppm',
            x: 820,
            y: 180,
            w: 420,
            h: 210,
            door: { x: 1030, y: 390 },
            features: ['Noise-Canceling Glass', 'USB-C TB4 Power', 'Individual Lighting Dimmer'],
            color: '#10B981',
          },
          {
            id: 'LIB-203',
            code: 'LIB-203',
            name: 'IEEE, Springer & ACM Reference Lab',
            type: 'Research Lab',
            status: 'available',
            statusText: 'Terminals 1–24 Open',
            capacity: 40,
            occupancy: 14,
            temp: '20.8°C',
            co2: '400 ppm',
            x: 230,
            y: 490,
            w: 480,
            h: 230,
            door: { x: 470, y: 490 },
            features: ['Dual Screen High-Res Terminals', 'Direct Access to Global Journal Subscriptions'],
            color: '#10B981',
          },
          {
            id: 'LIB-204',
            code: 'LIB-204',
            name: 'Postgraduate Thesis & Archive Stacks',
            type: 'Archives',
            status: 'available',
            statusText: 'Quiet Zone (Strict Silence)',
            capacity: 60,
            occupancy: 18,
            temp: '20.5°C',
            co2: '380 ppm',
            x: 780,
            y: 490,
            w: 460,
            h: 230,
            door: { x: 1010, y: 490 },
            features: ['Historical Manuscripts', 'Mewar Ph.D. Dissertations', 'Microfiche Reader'],
            color: '#10B981',
          },
        ],
      },
    },
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
  const [selectedFloor, setSelectedFloor] = useState('Level 2');
  const [selectedRoomId, setSelectedRoomId] = useState('B-204');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showAllManeuvers, setShowAllManeuvers] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [startPointMode, setStartPointMode] = useState('gate'); // 'gate' | 'gps'
  const [mobilityMode, setMobilityMode] = useState('walk'); // walk | wheelchair | shuttle
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewEngine, setViewEngine] = useState('gis'); // 'gis' | 'blueprint'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isNavPanelOpen, setIsNavPanelOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [panelMode, setPanelMode] = useState('directory'); // 'directory' | 'directions'
  const [facilitySearch, setFacilitySearch] = useState('');
  const [customDestination, setCustomDestination] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'buildings' | 'hostels' | 'amenities'

  // GPS & Live Simulation State
  const [userCoords, setUserCoords] = useState({
    lat: 25.032009, // Mewar University Main Gate 1 on NH-48
    lng: 74.634483,
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

  const handleSelectBuilding = (id, openDetails = false) => {
    if (!buildings[id]) return;
    setSelectedBldg(id);
    setActiveStepIndex(0);
    if (INDOOR_BLUEPRINTS[id]) {
      const floors = Object.keys(INDOOR_BLUEPRINTS[id].floors);
      const defFloor = floors.includes('Level 2') ? 'Level 2' : floors[0];
      setSelectedFloor(defFloor);
      const floorRooms = INDOOR_BLUEPRINTS[id].floors[defFloor]?.rooms || [];
      if (floorRooms.length > 0) {
        setSelectedRoomId(floorRooms[0].id);
      }
    }
    if (openDetails) {
      setDrawerOpen(true);
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsNavPanelOpen(false);
      }
    }
    setSearchParams({ bldg: id });
  };

  const handleStartNavigationTo = (id) => {
    handleSelectBuilding(id, false);
    setCustomDestination(null);
    setPanelMode('directions');
    setIsNavPanelOpen(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setDrawerOpen(false);
    }
    triggerToast(`Calculating route to ${buildings[id]?.shortName || buildings[id]?.name}...`);
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
      const startLat = userCoords?.lat || 25.032009; // NH-48 Main Gate
      const startLng = userCoords?.lng || 74.634483;
      const endLat = customDestination ? customDestination.lat : dest.lat;
      const endLng = customDestination ? customDestination.lng : dest.lng;

      // Compute shortest-path waypoints along authentic campus road network
      const routeResult = findShortestCampusRoute(
        { lat: startLat, lng: startLng },
        { lat: endLat, lng: endLng },
        6
      );
      const waypoints =
        routeResult.coordinates && routeResult.coordinates.length > 0
          ? routeResult.coordinates
          : [[startLat, startLng], [endLat, endLng]];

      let waypointIdx = 0;
      const totalWaypoints = waypoints.length;

      simulationTimerRef.current = setInterval(() => {
        waypointIdx++;
        const progress = Math.min(1, waypointIdx / (totalWaypoints - 1 || 1));
        setSimulationProgress(Math.round(progress * 100));

        // Advance active step index dynamically
        const bldgSteps = currentBldg?.steps || [];
        if (bldgSteps.length > 0) {
          const sIdx = Math.min(bldgSteps.length - 1, Math.floor(progress * bldgSteps.length));
          setActiveStepIndex(sIdx);
        }

        const point = waypoints[Math.min(totalWaypoints - 1, waypointIdx)];

        setUserCoords((prev) => ({
          ...prev,
          lat: point[0],
          lng: point[1],
          speed: 1.3,
        }));

        if (waypointIdx >= totalWaypoints - 1) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
          setIsSimulatingWalk(false);
          triggerToast(
            `Arrived at ${customDestination ? customDestination.shortName || 'Marked Destination' : dest.name}!`
          );
        }
      }, 400);
    }
  };

  const handleResetLocation = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsSimulatingWalk(false);
    setSimulationProgress(0);
    setActiveStepIndex(0);
    setUserCoords({
      lat: 25.032009, // NH-48 Main Gate
      lng: 74.634483,
      accuracy: 6,
      heading: 0,
      speed: 1.2,
    });
    setCustomDestination(null);
    setStartPointMode('gate');
    triggerToast('Location reset to Mewar University Main Gate (NH-48)');
  };

  // Swap Origin and Destination
  const handleSwapRoute = () => {
    triggerToast('Route direction inverted.');
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

  // Canonical unique buildings list (filtering out backwards-compatibility aliases)
  const uniqueBuildingList = Object.entries(buildings).reduce((acc, [key, b]) => {
    if (b.id === key) acc.push(b);
    return acc;
  }, []);

  // Filter building list for directory
  const filteredBuildingList = uniqueBuildingList.filter((b) => {
    const q = facilitySearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.shortName?.toLowerCase().includes(q) ||
      b.dept.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      (b.targetRoom && b.targetRoom.toLowerCase().includes(q)) ||
      (b.targetDesc && b.targetDesc.toLowerCase().includes(q)) ||
      (b.description && b.description.toLowerCase().includes(q)) ||
      (INDOOR_BLUEPRINTS[b.id] &&
        Object.values(INDOOR_BLUEPRINTS[b.id].floors).some((fl) =>
          fl.rooms.some(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.code.toLowerCase().includes(q) ||
              r.type.toLowerCase().includes(q) ||
              r.features.some((f) => f.toLowerCase().includes(q))
          )
        ));
    if (!matchesSearch) return false;

    if (activeTab === 'hostels') {
      return (
        b.category === 'hostels' ||
        b.id.includes('hostel') ||
        ['gora', 'sanaga', 'bhamasha', 'kumbha', 'pratap', 'badal', 'mira', 'panna', 'guest_house'].includes(b.id)
      );
    }
    if (activeTab === 'amenities') {
      return (
        b.category === 'facility' &&
        ['mess', 'football', 'basketball', 'hospital', 'park', 'gate', 'gate2'].includes(b.id)
      );
    }
    if (activeTab === 'buildings') {
      return (
        b.category === 'academic' ||
        ['main', 'eng', 'law', 'teacher'].includes(b.id)
      );
    }

    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'academic') return b.category === 'academic';
    if (categoryFilter === 'facility') return b.category === 'facility';
    return true;
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
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
            backgroundColor: 'var(--brand-forest)',
            color: '#FFFFFF',
            padding: '9px 22px',
            borderRadius: '9999px',
            fontSize: '12.5px',
            fontWeight: 700,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={16} style={{ color: '#10B981' }} />
          <span>{adminToast}</span>
        </div>
      )}

      {/* TOP UNIFIED SUB-HEADER TOOLBAR (NextCampus Institutional Palette) */}
      <header
        className="min-h-[56px] h-auto py-2 px-3 sm:px-5 bg-white border-b border-[#E4EAE5] flex flex-wrap items-center justify-between gap-2.5 z-40 shadow-xs"
      >
        {/* Left: Mewar University Campus Badge & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--brand-forest)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              MU
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>
                Mewar University
              </div>
              <div className="hidden sm:block" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                Gangrar, Chittorgarh • 30-Acre Campus
              </div>
            </div>
          </div>

          <div className="hidden md:block" style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Quick Sub-Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none" style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '3px', borderRadius: '8px' }}>
            {[
              { id: 'all', label: `All Facilities (${uniqueBuildingList.length})` },
              { id: 'buildings', label: 'Academic Wings' },
              { id: 'hostels', label: 'Hostels & Living' },
              { id: 'amenities', label: 'Sports & Dining' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (!isNavPanelOpen) setIsNavPanelOpen(true);
                  setPanelMode('directory');
                }}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: View Engine Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '3px',
            borderRadius: '9px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewEngine('gis')}
            style={{
              padding: '6px 13px',
              borderRadius: '7px',
              border: 'none',
              fontSize: '11.5px',
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
            <span>Interactive Campus GIS</span>
          </button>
          <button
            type="button"
            onClick={() => setViewEngine('blueprint')}
            style={{
              padding: '6px 13px',
              borderRadius: '7px',
              border: 'none',
              fontSize: '11.5px',
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
            <span>Indoor CAD Blueprint</span>
          </button>
        </div>

        {/* Right: Refresh & Admin Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Refresh Action */}
          <button
            type="button"
            onClick={handleResetLocation}
            title="Reset Location to Main Gate"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={13} />
            <span>Recenter</span>
          </button>

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
                transition: 'all 0.15s ease',
              }}
            >
              <ShieldCheck size={14} />
              <span>{adminMapMode ? 'Admin Mode' : 'Admin Tools'}</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN WORKSPACE: MAP CANVAS + COLLAPSIBLE DIRECTORY + RIGHT DETAILS DRAWER */}
      <div style={{ position: 'relative', flex: 1, width: '100%', overflow: 'hidden' }}>
        {/* FLOATING EXPAND PILL (Appears when Left Panel is Collapsed to maximize map view) */}
        {!isNavPanelOpen && (
          <button
            type="button"
            onClick={() => setIsNavPanelOpen(true)}
            title="Open Campus Directory & Routes"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 35,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(16px)',
              borderRadius: '9999px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-md)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <Search size={14} style={{ color: 'var(--brand-primary)' }} />
            <span>Campus Directory &amp; Routes</span>
            <span
              style={{
                fontSize: '10.5px',
                color: 'var(--brand-primary)',
                backgroundColor: 'var(--brand-soft-bg)',
                padding: '2px 7px',
                borderRadius: '9999px',
                fontWeight: 800,
              }}
            >
              {Object.keys(buildings).length}
            </span>
            <ChevronsRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}

        {/* LEFT COLLAPSIBLE CAMPUS DIRECTORY & NAVIGATION DRAWER */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            bottom: '16px',
            left: isNavPanelOpen ? '16px' : '-430px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Card Header row: Title & Collapse Button */}
          <div style={{ padding: '12px 16px 8px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={17} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Campus GIS Navigator
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsNavPanelOpen(false)}
              title="Collapse Panel (Maximize Map)"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Mode Tabs: Directory vs Directions */}
          <div style={{ display: 'flex', padding: '10px 14px 6px 14px', gap: '6px', backgroundColor: '#FFFFFF' }}>
            <button
              type="button"
              onClick={() => setPanelMode('directory')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: panelMode === 'directory' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: panelMode === 'directory' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <Building size={13} />
              <span>Campus Directory</span>
            </button>
            <button
              type="button"
              onClick={() => setPanelMode('directions')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: panelMode === 'directions' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: panelMode === 'directions' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <Navigation size={13} />
              <span>Directions &amp; Route</span>
            </button>
          </div>

          {/* PANEL MODE 1: CAMPUS DIRECTORY (FACILITIES LIST & SEARCH) */}
          {panelMode === 'directory' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {/* Search & Category Filter Row */}
              <div style={{ padding: '8px 14px 10px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search campus buildings, labs, hostels..."
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
                  {facilitySearch && (
                    <button
                      type="button"
                      onClick={() => setFacilitySearch('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Showing <strong>{filteredBuildingList.length}</strong> locations
                  </span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="academic">Academic Wings</option>
                    <option value="libraries">Central Library</option>
                    <option value="facility">Living &amp; Facilities</option>
                  </select>
                </div>
              </div>

              {/* Scrollable Facility List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredBuildingList.length === 0 ? (
                  <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No campus facilities matching "{facilitySearch}"
                  </div>
                ) : (
                  filteredBuildingList.map((bldg) => {
                    const isSelected = selectedBldg === bldg.id && !customDestination;
                    const bldgCoords = CAMPUS_GIS_LOCATIONS[bldg.id] || { lat: 25.03213, lng: 74.636623 };
                    const bldgDist = calculateDistanceMeters(userCoords.lat, userCoords.lng, bldgCoords.lat, bldgCoords.lng);
                    const bldgEta = Math.max(1, Math.round(bldgDist / 1.25 / 60));

                    return (
                      <div
                        key={bldg.id}
                        className={`campus-wayfinding-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectBuilding(bldg.id, false)}
                        style={{
                          backgroundColor: isSelected ? 'var(--brand-soft-bg)' : '#FFFFFF',
                          borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>
                              {CAMPUS_GIS_LOCATIONS[bldg.id]?.icon || '🏛️'}
                            </span>
                            <div>
                              <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                                {bldg.shortName || bldg.name}
                              </div>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {bldg.dept}
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                              color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {bldg.code}
                          </span>
                        </div>

                        {/* Telemetry info row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#16A34A', fontWeight: 700 }}>● Open</span>
                            <span>•</span>
                            <span>{bldg.occupancy} Occupancy</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-primary)', fontWeight: 700 }}>
                            <Footprints size={12} />
                            <span>{bldgDist} m (~{bldgEta} min)</span>
                          </div>
                        </div>

                        {/* Action buttons inside card */}
                        <div style={{ display: 'flex', gap: '6px', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartNavigationTo(bldg.id);
                            }}
                            style={{
                              flex: 1,
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--brand-primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <Navigation size={11} />
                            <span>Navigate</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBuilding(bldg.id, true);
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-surface-subtle)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* PANEL MODE 2: DIRECTIONS & ROUTE PLANNING */}
          {panelMode === 'directions' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {/* Route Planning Inputs (Origin & Destination) */}
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#F8FAFC' }}>
                {/* Origin Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FFFFFF',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3478B8', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Starting Point
                    </div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isLiveGpsActive ? '📍 My Current GPS Location' : '🚪 NH-48 Main Campus Gate (Turnstiles)'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwapRoute}
                    title="Swap Origin and Destination"
                    style={{
                      padding: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </div>

                {/* Destination Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: customDestination ? 'var(--brand-soft-bg)' : '#FFFFFF',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: customDestination ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-interactive)',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      {customDestination ? '📍 Marked Destination' : 'Destination'}
                    </div>
                    {customDestination ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {customDestination.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCustomDestination(null)}
                          style={{
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--brand-primary)',
                            fontSize: '10px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <select
                        value={selectedBldg}
                        onChange={(e) => handleSelectBuilding(e.target.value, false)}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
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
                    )}
                  </div>
                </div>

                {/* Mobility Mode Selector Pills */}
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-subtle)', padding: '2px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setMobilityMode('walk')}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: mobilityMode === 'walk' ? 'var(--brand-primary)' : 'transparent',
                      color: mobilityMode === 'walk' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    🚶 Walk (1.2 m/s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobilityMode('wheelchair')}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: mobilityMode === 'wheelchair' ? 'var(--brand-primary)' : 'transparent',
                      color: mobilityMode === 'wheelchair' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ♿ Step-Free ADA
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobilityMode('shuttle')}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
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

              {/* Active Route Guidance HUD Banner */}
              <div
                style={{
                  backgroundColor: 'var(--brand-soft-bg)',
                  borderBottom: '1px solid var(--brand-soft-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Real-time Walking Progress Bar */}
                <div style={{ height: '3px', width: '100%', backgroundColor: '#D1FAE5', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${isSimulatingWalk ? simulationProgress : Math.min(100, Math.max(10, ((activeStepIndex + 1) / Math.max(1, currentBldg?.steps?.length || 3)) * 100))}%`,
                      backgroundColor: 'var(--brand-primary)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', animation: 'pulse 1.8s infinite' }} />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Live Route Telemetry
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      <span>{navigationStats.distanceMeters} m</span>
                      <span>•</span>
                      <span>~{navigationStats.etaMinutes} min</span>
                    </div>
                  </div>

                  {/* Maneuver Navigation Card */}
                  {(() => {
                    const stepsArr = currentBldg?.steps || [
                      { num: 1, text: 'Depart Main Campus Gate (NH-48)', sub: 'Turnstiles & Security Outpost', dist: '0 m' },
                      { num: 2, text: `Walk along campus avenue towards ${currentBldg?.shortName}`, sub: 'Direct paved pathway', dist: `${navigationStats.distanceMeters} m` },
                    ];
                    const activeStep = stepsArr[Math.min(activeStepIndex, stepsArr.length - 1)] || stepsArr[0];
                    const isLast = activeStepIndex === stepsArr.length - 1;

                    const getManeuverIcon = (text = '', num = 1) => {
                      if (isLast) return <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />;
                      const l = text.toLowerCase();
                      if (l.includes('depart') || l.includes('gate') || num === 1) return <Footprints size={16} style={{ color: '#3478B8' }} />;
                      if (l.includes('right')) return <CornerUpRight size={16} style={{ color: 'var(--brand-primary)' }} />;
                      if (l.includes('left')) return <CornerUpLeft size={16} style={{ color: 'var(--brand-primary)' }} />;
                      if (l.includes('lift') || l.includes('stairs') || l.includes('floor') || l.includes('ascend')) return <Layers size={16} style={{ color: '#7C3AED' }} />;
                      if (l.includes('arrive') || l.includes('room')) return <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />;
                      return <MoveUp size={16} style={{ color: 'var(--brand-primary)' }} />;
                    };

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--brand-soft-border)',
                            borderRadius: '10px',
                            padding: '9px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            boxShadow: 'var(--shadow-xs)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--brand-soft-bg)',
                                border: '1px solid var(--brand-soft-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {getManeuverIcon(activeStep.text, activeStep.num)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                                  Maneuver {activeStep.num} of {stepsArr.length}
                                </span>
                                {activeStep.dist && (
                                  <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    • {activeStep.dist}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {activeStep.text}
                              </div>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {activeStep.sub}
                              </div>
                            </div>
                          </div>

                          {/* Step Navigation Chevrons */}
                          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                            <button
                              type="button"
                              disabled={activeStepIndex === 0}
                              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                backgroundColor: activeStepIndex === 0 ? 'var(--bg-surface-subtle)' : 'var(--brand-soft-bg)',
                                color: activeStepIndex === 0 ? 'var(--text-muted)' : 'var(--brand-primary)',
                                border: '1px solid var(--brand-soft-border)',
                                cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={activeStepIndex >= stepsArr.length - 1}
                              onClick={() => setActiveStepIndex((prev) => Math.min(stepsArr.length - 1, prev + 1))}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                backgroundColor: activeStepIndex >= stepsArr.length - 1 ? 'var(--bg-surface-subtle)' : 'var(--brand-soft-bg)',
                                color: activeStepIndex >= stepsArr.length - 1 ? 'var(--text-muted)' : 'var(--brand-primary)',
                                border: '1px solid var(--brand-soft-border)',
                                cursor: activeStepIndex >= stepsArr.length - 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible toggle for all steps */}
                        <button
                          type="button"
                          onClick={() => setShowAllManeuvers(!showAllManeuvers)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            color: 'var(--brand-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '2px 0',
                          }}
                        >
                          <span>{showAllManeuvers ? 'Hide Maneuver Steps ▲' : `View All ${stepsArr.length} Maneuver Steps ▼`}</span>
                        </button>

                        {showAllManeuvers && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px', maxHeight: '160px', overflowY: 'auto' }}>
                            {stepsArr.map((st, sIdx) => {
                              const isActive = sIdx === activeStepIndex;
                              return (
                                <div
                                  key={st.num}
                                  onClick={() => setActiveStepIndex(sIdx)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: isActive ? 'var(--brand-soft-bg)' : '#FFFFFF',
                                    border: isActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                                      fontSize: '9.5px',
                                      fontWeight: 800,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                      marginTop: '1px',
                                    }}
                                  >
                                    {st.num}
                                  </span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '11px', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                                      {st.text}
                                    </div>
                                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                                      {st.sub} • {st.dist}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Navigation Action Buttons: Hardware GPS & Simulation */}
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={toggleLiveGps}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: isLiveGpsActive ? 'var(--brand-primary)' : '#FFFFFF',
                      color: isLiveGpsActive ? '#FFFFFF' : 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Compass size={13} />
                    <span>{isLiveGpsActive ? 'Stop Live GPS' : 'Enable Live GPS'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleSimulation}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSimulatingWalk ? '#B7791F' : 'var(--brand-primary)',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSimulatingWalk ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isSimulatingWalk ? 'Pause Walk' : 'Simulate Walk'}</span>
                  </button>
                </div>

                {gpsError && (
                  <div style={{ fontSize: '10.5px', color: 'var(--status-danger)', backgroundColor: 'var(--status-danger-bg)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--status-danger-border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={13} />
                    <span>{gpsError}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MAP CANVAS ENGINE (Leaflet GIS vs Blueprint SVG) */}
        {viewEngine === 'gis' ? (
          <div style={{ width: '100%', height: '100%' }}>
            <CampusGisMap
              selectedBuildingKey={selectedBldg}
              onSelectBuilding={(key) => handleSelectBuilding(key, false)}
              customDestination={customDestination}
              onSetCustomDestination={(dest) => {
                setCustomDestination(dest);
                triggerToast(`Marked destination on map: (${dest.lat.toFixed(4)}, ${dest.lng.toFixed(4)})`);
              }}
              onClearCustomDestination={() => setCustomDestination(null)}
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
              isDrawerOpen={drawerOpen}
              isNavPanelOpen={isNavPanelOpen}
              onOpenDetails={() => setDrawerOpen(true)}
            />
          </div>
        ) : (
          /* ARCHITECTURAL INDOOR BLUEPRINT ENGINE */
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: '#0F172A',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {/* FLOATING TOP BLUEPRINT CONTROLS RIBBON */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: isNavPanelOpen ? '420px' : '16px',
                right: drawerOpen ? '388px' : '16px',
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(16px)',
                padding: '8px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Left: Building & Current Blueprint Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                    {(INDOOR_BLUEPRINTS[selectedBldg] || INDOOR_BLUEPRINTS.eng).buildingName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {(INDOOR_BLUEPRINTS[selectedBldg]?.floors[selectedFloor] || INDOOR_BLUEPRINTS.eng.floors['Level 2']).title}
                  </div>
                </div>
              </div>

              {/* Center: Floor Switcher Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  padding: '3px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {['Ground', 'Level 1', 'Level 2'].map((fl) => {
                  const bldgBp = INDOOR_BLUEPRINTS[selectedBldg] || INDOOR_BLUEPRINTS.eng;
                  const hasFloorData = !!bldgBp.floors[fl];
                  const isActive = selectedFloor === fl;

                  return (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => {
                        setSelectedFloor(fl);
                        const flRooms = bldgBp.floors[fl]?.rooms || [];
                        if (flRooms.length > 0) setSelectedRoomId(flRooms[0].id);
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '7px',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                        color: isActive ? '#FFFFFF' : hasFloorData ? '#CBD5E1' : '#64748B',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {fl} {isActive ? '• Active' : ''}
                    </button>
                  );
                })}
              </div>

              {/* Right: Zoom & Scale Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace', fontWeight: 600 }}>
                  1:200 CAD Vector
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
                    title="Zoom Out"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                    style={{
                      padding: '0 8px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
                    title="Zoom In"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Interactive Architectural CAD Canvas */}
            {(() => {
              const bldgBp = INDOOR_BLUEPRINTS[selectedBldg] || INDOOR_BLUEPRINTS.eng;
              const activeFl = bldgBp.floors[selectedFloor] || Object.values(bldgBp.floors)[0];
              const roomsList = activeFl.rooms || [];
              const selectedRoom = roomsList.find((r) => r.id === selectedRoomId);
              const doorX = selectedRoom ? selectedRoom.door.x : 365;
              const doorY = selectedRoom ? selectedRoom.door.y : 370;

              return (
                <svg
                  viewBox="0 0 1600 950"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <defs>
                    <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                    </pattern>
                    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <rect width="100%" height="100%" fill="#0A0F1D" />
                  <rect width="100%" height="100%" fill="url(#cadGrid)" />

                  {/* SKYBRIDGE LINKAGE (If level has one) */}
                  {activeFl.skybridge && (
                    <g>
                      <rect
                        x={activeFl.skybridge.x}
                        y={activeFl.skybridge.y}
                        width={activeFl.skybridge.w}
                        height={activeFl.skybridge.h}
                        rx="10"
                        fill="rgba(30, 41, 59, 0.9)"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <line x1="210" y1="400" x2="210" y2="480" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 4" />
                      <text x="130" y="435" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
                        SKYBRIDGE
                      </text>
                      <text x="130" y="452" fill="#94A3B8" fontSize="8.5" textAnchor="middle">
                        From Library
                      </text>
                      <circle cx="210" cy="440" r="6" fill="#10B981" />
                      <circle cx="210" cy="440" r="12" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    </g>
                  )}

                  {/* CENTRAL MAIN RESEARCH CORRIDOR */}
                  <rect
                    x="210"
                    y="390"
                    width="1110"
                    height="90"
                    fill="rgba(30, 41, 59, 0.45)"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1"
                  />
                  <line
                    x1="210"
                    y1="440"
                    x2="1320"
                    y2="440"
                    stroke="rgba(56, 189, 248, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="8 6"
                  />
                  <text x="760" y="445" fill="rgba(148, 163, 184, 0.4)" fontSize="11" fontWeight="700" letterSpacing="0.2em" textAnchor="middle">
                    {activeFl.corridor?.label || 'MAIN RESEARCH CONCOURSE'}
                  </text>

                  {/* CORE STAIRS & ELEVATORS */}
                  {activeFl.stairs?.map((st, sIdx) => (
                    <g key={sIdx}>
                      <rect
                        x={st.x}
                        y={st.y}
                        width={st.w}
                        height={st.h}
                        rx="8"
                        fill="rgba(30, 41, 59, 0.95)"
                        stroke="rgba(148, 163, 184, 0.3)"
                        strokeWidth="1.5"
                      />
                      <text x={st.x + st.w / 2} y={st.y + 35} fill="#CBD5E1" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {st.label.includes('Lifts') ? '🛗 LIFTS' : '🚻 WC'}
                      </text>
                      <text x={st.x + st.w / 2} y={st.y + 52} fill="#64748B" fontSize="8" textAnchor="middle">
                        Core Access
                      </text>
                    </g>
                  ))}

                  {/* DYNAMIC TURN-BY-TURN WAYFINDING VECTOR PATH IN BLUEPRINT */}
                  {selectedRoom && (
                    <g>
                      <path
                        d={`M 210,440 L ${doorX},440 L ${doorX},${doorY}`}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10 6"
                        filter="url(#emeraldGlow)"
                      />
                      <circle cx={doorX} cy={doorY} r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx={doorX} cy={doorY} r="14" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.75" className="animate-ping" />
                    </g>
                  )}

                  {/* ARCHITECTURAL ROOMS */}
                  {roomsList.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const isHovered = hoveredRoom === room.id;
                    const isAvailable = room.status === 'available';

                    return (
                      <g
                        key={room.id}
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          setDrawerOpen(true);
                          triggerToast(`Selected ${room.code}: ${room.name}`);
                        }}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.w}
                          height={room.h}
                          rx="12"
                          fill={
                            isSelected
                              ? 'rgba(15, 23, 42, 0.95)'
                              : isHovered
                              ? 'rgba(30, 41, 59, 0.95)'
                              : 'rgba(30, 41, 59, 0.7)'
                          }
                          stroke={
                            isSelected
                              ? '#10B981'
                              : isHovered
                              ? '#38BDF8'
                              : 'rgba(148, 163, 184, 0.28)'
                          }
                          strokeWidth={isSelected ? '3' : isHovered ? '2' : '1.5'}
                          filter={isSelected ? 'url(#emeraldGlow)' : undefined}
                        />

                        {/* Architectural Door Swing Arc */}
                        <path
                          d={
                            room.door.y >= 440
                              ? `M ${room.door.x - 20},${room.y} A 20 20 0 0 1 ${room.door.x},${room.y + 20}`
                              : `M ${room.door.x - 20},${room.y + room.h} A 20 20 0 0 0 ${room.door.x},${room.y + room.h - 20}`
                          }
                          fill="none"
                          stroke={isSelected ? '#10B981' : '#64748B'}
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <line
                          x1={room.door.x - 20}
                          y1={room.door.y}
                          x2={room.door.x}
                          y2={room.door.y}
                          stroke="#0B132B"
                          strokeWidth="3.5"
                        />

                        {/* Top Badge: Code & Status */}
                        <rect
                          x={room.x + 14}
                          y={room.y + 14}
                          width="56"
                          height="22"
                          rx="6"
                          fill={isSelected ? '#059669' : 'rgba(15, 23, 42, 0.8)'}
                          stroke={isSelected ? '#34D399' : 'rgba(255, 255, 255, 0.1)'}
                          strokeWidth="1"
                        />
                        <text
                          x={room.x + 42}
                          y={room.y + 29}
                          fill="#FFFFFF"
                          fontSize="11"
                          fontWeight="800"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {room.code}
                        </text>

                        <rect
                          x={room.x + room.w - 100}
                          y={room.y + 14}
                          width="86"
                          height="22"
                          rx="11"
                          fill={
                            isAvailable
                              ? 'rgba(16, 185, 129, 0.15)'
                              : room.status === 'reserved'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(244, 63, 94, 0.15)'
                          }
                          stroke={
                            isAvailable
                              ? '#10B981'
                              : room.status === 'reserved'
                              ? '#F59E0B'
                              : '#F43F5E'
                          }
                          strokeWidth="1"
                        />
                        <text
                          x={room.x + room.w - 57}
                          y={room.y + 29}
                          fill={
                            isAvailable
                              ? '#34D399'
                              : room.status === 'reserved'
                              ? '#FBBF24'
                              : '#FB7185'
                          }
                          fontSize="9.5"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {isAvailable ? '● Available' : room.status === 'reserved' ? '● Reserved' : '● Occupied'}
                        </text>

                        {/* Room Title */}
                        <text
                          x={room.x + 16}
                          y={room.y + 64}
                          fill="#FFFFFF"
                          fontSize="14"
                          fontWeight="800"
                        >
                          {room.name.length > 28 ? room.name.substring(0, 26) + '...' : room.name}
                        </text>
                        <text
                          x={room.x + 16}
                          y={room.y + 82}
                          fill="#94A3B8"
                          fontSize="10.5"
                        >
                          {room.type} • {room.capacity} Max Seats
                        </text>

                        {/* Key Features Chips */}
                        {room.features && room.features[0] && (
                          <g>
                            <rect
                              x={room.x + 14}
                              y={room.y + 96}
                              width={Math.min(room.w - 28, room.features[0].length * 6.5 + 16)}
                              height="20"
                              rx="4"
                              fill="rgba(15, 23, 42, 0.6)"
                              stroke="rgba(255, 255, 255, 0.08)"
                              strokeWidth="1"
                            />
                            <text
                              x={room.x + 22}
                              y={room.y + 110}
                              fill="#CBD5E1"
                              fontSize="9.5"
                            >
                              ⚡ {room.features[0]}
                            </text>
                          </g>
                        )}

                        {/* Environmental Sensor Gauge Footer */}
                        <g transform={`translate(${room.x + 14}, ${room.y + room.h - 38})`}>
                          <rect
                            width={room.w - 28}
                            height="26"
                            rx="6"
                            fill="rgba(15, 23, 42, 0.8)"
                            stroke="rgba(255, 255, 255, 0.06)"
                            strokeWidth="1"
                          />
                          <text x="10" y="17" fill="#38BDF8" fontSize="10" fontWeight="700">
                            🌡️ {room.temp}
                          </text>
                          <text x="80" y="17" fill="#34D399" fontSize="10" fontWeight="700">
                            💨 {room.co2}
                          </text>
                          <text x={room.w - 38} y="17" fill="#E2E8F0" fontSize="10" fontWeight="800" textAnchor="end">
                            👥 {room.occupancy}/{room.capacity}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
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
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-subtle)',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {/* Header Image */}
            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
              <img src={currentBldg.image} alt={currentBldg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20, 45, 40, 0.75) 0%, transparent 60%)' }} />

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                title="Close Details"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(20, 45, 40, 0.7)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <X size={15} />
              </button>

              <div style={{ position: 'absolute', bottom: '10px', left: '14px', display: 'flex', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: '#FFFFFF',
                    color: 'var(--brand-forest)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {currentBldg.hours}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {currentBldg.code}
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                  {currentBldg.name}
                </h3>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {currentBldg.description}
                </p>
              </div>

              {/* Action Buttons: Navigate Here & CAD Blueprint */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleStartNavigationTo(currentBldg.id)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-brand-glow)',
                  }}
                >
                  <Navigation size={13} />
                  <span>Route Here</span>
                </button>

                {INDOOR_BLUEPRINTS[currentBldg.id] && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewEngine('blueprint');
                      triggerToast(`Switched to Indoor Blueprint for ${currentBldg.shortName}`);
                    }}
                    style={{
                      padding: '9px 12px',
                      backgroundColor: 'var(--brand-soft-bg)',
                      border: '1px solid var(--brand-soft-border)',
                      color: 'var(--brand-primary)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Layers size={13} />
                    <span>CAD Blueprint</span>
                  </button>
                )}
              </div>

              {/* Quick Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Occupancy</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--brand-primary)' }}>{currentBldg.occupancy}</div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.seats}</span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>HVAC Temp</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)' }}>{currentBldg.temp}</div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.air}</span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ramp ADA</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#16A34A' }}>Pass</div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Full Access</span>
                </div>
              </div>

              {/* Selected Room Live Telemetry Card (If Available) */}
              {(() => {
                const bldgBp = INDOOR_BLUEPRINTS[selectedBldg] || INDOOR_BLUEPRINTS.eng;
                const flData = bldgBp?.floors[selectedFloor] || Object.values(bldgBp?.floors || {})[0];
                const activeRoom = flData?.rooms?.find((r) => r.id === selectedRoomId);

                if (!activeRoom) return null;

                return (
                  <div
                    style={{
                      backgroundColor: 'var(--brand-soft-bg)',
                      border: '1.5px solid var(--brand-soft-border)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Selected Space • {selectedFloor}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: activeRoom.status === 'available' ? '#DCFCE7' : activeRoom.status === 'reserved' ? '#FEF3C7' : '#FFE4E6',
                          color: activeRoom.status === 'available' ? '#15803D' : activeRoom.status === 'reserved' ? '#B7791F' : 'var(--status-danger)',
                        }}
                      >
                        {activeRoom.statusText}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {activeRoom.code}: {activeRoom.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {activeRoom.type} • Capacity: {activeRoom.capacity} ({activeRoom.occupancy} Current)
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--brand-soft-border)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Thermometer size={12} style={{ color: 'var(--brand-primary)' }} />
                        {activeRoom.temp}
                      </span>
                      <span style={{ backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--brand-soft-border)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} style={{ color: '#3478B8' }} />
                        {activeRoom.co2}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Target Primary Facility Node */}
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                  Primary Facility Node
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {currentBldg.targetRoom}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20,45,40,0.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Edit Facility: {editFormData.name}</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveBuildingEdits} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Facility Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-interactive)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <button type="button" onClick={handleDeleteBuilding} style={{ color: 'var(--status-danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
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
