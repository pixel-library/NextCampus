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
  const [facilitySearch, setFacilitySearch] = useState('');
  const [customDestination, setCustomDestination] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'buildings' | 'hostels' | 'amenities'

  // GPS & Live Simulation State
  const [userCoords, setUserCoords] = useState({
    lat: 25.031907, // Mewar University Main Gate on NH-48
    lng: 74.635428,
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
      const startLat = 25.031907; // NH-48 Main Gate
      const startLng = 74.635428;
      const endLat = customDestination ? customDestination.lat : dest.lat;
      const endLng = customDestination ? customDestination.lng : dest.lng;

      let step = 0;
      const totalSteps = 30;

      simulationTimerRef.current = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        setSimulationProgress(Math.round(progress * 100));

        // Advance active step index dynamically
        const bldgSteps = currentBldg?.steps || [];
        if (bldgSteps.length > 0) {
          const sIdx = Math.min(bldgSteps.length - 1, Math.floor(progress * bldgSteps.length));
          setActiveStepIndex(sIdx);
        }

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
    setActiveStepIndex(0);
    setUserCoords({
      lat: 25.031907, // NH-48 Main Gate
      lng: 74.635428,
      accuracy: 6,
      heading: 0,
      speed: 1.2,
    });
    setCustomDestination(null);
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
    const q = facilitySearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
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
      return b.id.includes('hostel') || b.id.includes('kumbha');
    }
    if (activeTab === 'amenities') {
      return b.category === 'facility' && !b.id.includes('hostel');
    }
    if (activeTab === 'buildings') {
      return b.category === 'academic' || b.category === 'libraries';
    }

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

      {/* TOP UNIFIED SUB-HEADER TOOLBAR (Reference Image 3 Dashboard Layout) */}
      <header
        style={{
          height: '60px',
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
        {/* Left: Mewar University Campus Badge & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
              }}
            >
              MU
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Mewar University
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Gangrar, Chittorgarh • 30-Acre Campus
              </div>
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Sub-Tabs (Clean Campus Categorization inspired by dashboard tab patterns) */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-subtle)', padding: '3px', borderRadius: '10px' }}>
            {[
              { id: 'all', label: `All Facilities (${Object.keys(buildings).length})` },
              { id: 'buildings', label: 'Academic Wings' },
              { id: 'hostels', label: 'Hostels & Living' },
              { id: 'amenities', label: 'Sports & Amenities' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
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
            <span>Campus GIS &amp; GPS</span>
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

        {/* Right: Strict University Boundary Badge, Refresh & Admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Boundary Lock Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ECFDF5',
              padding: '5px 12px',
              borderRadius: '9999px',
              border: '1px solid #A7F3D0',
            }}
          >
            <Shield size={13} style={{ color: '#059669' }} />
            <span>Campus Only (Locked)</span>
          </div>

          {/* Refresh Action (Reference 3 Refresh Button) */}
          <button
            type="button"
            onClick={handleResetLocation}
            title="Refresh Location to Main Gate"
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
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
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
        {/* FLOATING LEFT CAMPUS NAVIGATION & DIRECTORY PANEL */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            bottom: '16px',
            left: '16px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header row in card: Search and Category Filter */}
          <div style={{ padding: '14px 16px 10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>Campus Directory</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>({filteredBuildingList.length} locations)</span>
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #BBF7D0' }}>
                ● Wayfinding Active
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search campus buildings, labs, departments..."
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

              {/* Category dropdown matching Reference Image 3 "All ▾" */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="all">All</option>
                <option value="academic">Academic</option>
                <option value="libraries">Libraries</option>
                <option value="facility">Facilities</option>
              </select>
            </div>
          </div>

          {/* Route Planning Inputs (Origin & Destination) */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#F8FAFC' }}>
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
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Starting Point
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isLiveGpsActive ? '📍 My Current GPS Location' : '🚪 NH-48 Main Campus Gate (Turnstiles)'}
                </div>
              </div>
            </div>

            {/* Destination Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: customDestination ? '#FFF1F2' : '#FFFFFF',
                padding: '6px 10px',
                borderRadius: '8px',
                border: customDestination ? '1.5px solid #E11D48' : '1px solid var(--border-interactive)',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: customDestination ? '#E11D48' : '#059669', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: customDestination ? '#E11D48' : '#059669', textTransform: 'uppercase' }}>
                  {customDestination ? '📍 Marked Destination' : 'Destination'}
                </div>
                {customDestination ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {customDestination.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomDestination(null)}
                      style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #FECDD3',
                        color: '#E11D48',
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
                    onChange={(e) => handleSelectBuilding(e.target.value)}
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

            {/* Mobility Mode Pills */}
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
                  backgroundColor: mobilityMode === 'walk' ? '#059669' : 'transparent',
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
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: mobilityMode === 'wheelchair' ? '#059669' : 'transparent',
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
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: mobilityMode === 'shuttle' ? '#059669' : 'transparent',
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
              backgroundColor: '#F0FDF4',
              borderBottom: '1px solid #BBF7D0',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Real-time Walking Progress Bar */}
            <div style={{ height: '3px', width: '100%', backgroundColor: '#DCFCE7', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${isSimulatingWalk ? simulationProgress : Math.min(100, Math.max(10, ((activeStepIndex + 1) / Math.max(1, currentBldg?.steps?.length || 3)) * 100))}%`,
                  backgroundColor: '#059669',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669', animation: 'pulse 1.8s infinite' }} />
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Step-by-Step Wayfinding
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: '#059669' }}>
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
                  if (isLast) return <CheckCircle2 size={16} style={{ color: '#059669' }} />;
                  const l = text.toLowerCase();
                  if (l.includes('depart') || l.includes('gate') || num === 1) return <Footprints size={16} style={{ color: '#2563EB' }} />;
                  if (l.includes('right')) return <CornerUpRight size={16} style={{ color: '#059669' }} />;
                  if (l.includes('left')) return <CornerUpLeft size={16} style={{ color: '#059669' }} />;
                  if (l.includes('lift') || l.includes('stairs') || l.includes('floor') || l.includes('ascend')) return <Layers size={16} style={{ color: '#7C3AED' }} />;
                  if (l.includes('arrive') || l.includes('room')) return <CheckCircle2 size={16} style={{ color: '#059669' }} />;
                  return <MoveUp size={16} style={{ color: '#059669' }} />;
                };

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #A7F3D0',
                        borderRadius: '10px',
                        padding: '9px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxShadow: '0 1px 4px rgba(5, 150, 105, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#ECFDF5',
                            border: '1px solid #A7F3D0',
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
                            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                              Maneuver {activeStep.num} of {stepsArr.length}
                            </span>
                            {activeStep.dist && (
                              <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                                • {activeStep.dist}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {activeStep.text}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                            backgroundColor: activeStepIndex === 0 ? '#F1F5F9' : '#ECFDF5',
                            color: activeStepIndex === 0 ? '#94A3B8' : '#059669',
                            border: '1px solid #A7F3D0',
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
                            backgroundColor: activeStepIndex >= stepsArr.length - 1 ? '#F1F5F9' : '#ECFDF5',
                            color: activeStepIndex >= stepsArr.length - 1 ? '#94A3B8' : '#059669',
                            border: '1px solid #A7F3D0',
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
                        color: '#059669',
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px', maxHeight: '180px', overflowY: 'auto' }}>
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
                                backgroundColor: isActive ? '#ECFDF5' : '#FFFFFF',
                                border: isActive ? '1px solid #10B981' : '1px solid #E2E8F0',
                                cursor: 'pointer',
                              }}
                            >
                              <span
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  backgroundColor: isActive ? '#059669' : '#E2E8F0',
                                  color: isActive ? '#FFFFFF' : '#475569',
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
                                <div style={{ fontSize: '11px', fontWeight: isActive ? 800 : 600, color: isActive ? '#065F46' : '#1E293B' }}>
                                  {st.text}
                                </div>
                                <div style={{ fontSize: '9.5px', color: '#64748B' }}>
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
        </div>

        {/* MAP CANVAS ENGINE (Leaflet GIS vs Blueprint SVG) */}
        {viewEngine === 'gis' ? (
          <div style={{ width: '100%', height: '100%' }}>
            <CampusGisMap
              selectedBuildingKey={selectedBldg}
              onSelectBuilding={handleSelectBuilding}
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
                left: '420px',
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
                transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                {['Ground', 'Level 1', 'Level 2', 'Level 3'].map((fl) => {
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
                      color: '#CBD5E1',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {Math.round(zoomLevel * 100)}%
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

            {/* SVG ARCHITECTURAL CAD BLUEPRINT CANVAS */}
            {(() => {
              const bldgBp = INDOOR_BLUEPRINTS[selectedBldg] || INDOOR_BLUEPRINTS.eng;
              const activeFl = bldgBp.floors[selectedFloor] || Object.values(bldgBp.floors)[0];
              const roomsList = activeFl?.rooms || [];
              const selectedRoom = roomsList.find((r) => r.id === selectedRoomId) || roomsList[0];

              const doorX = selectedRoom ? selectedRoom.door.x : 755;
              const doorY = selectedRoom ? selectedRoom.door.y : 500;

              return (
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1440 900"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <defs>
                    <pattern id="cadGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.8" />
                    </pattern>
                    <pattern id="cadGridLarge" width="100" height="100" patternUnits="userSpaceOnUse">
                      <rect width="100" height="100" fill="url(#cadGridSmall)" />
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1.2" />
                    </pattern>
                    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#10B981" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* CAD Canvas Background */}
                  <rect width="1440" height="900" fill="#0B132B" />
                  <rect width="1440" height="900" fill="url(#cadGridLarge)" />

                  {/* Concrete Building Perimeter Envelope */}
                  <rect
                    x="180"
                    y="110"
                    width="1160"
                    height="680"
                    rx="16"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="3"
                  />
                  <rect
                    x="174"
                    y="104"
                    width="1172"
                    height="692"
                    rx="20"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.12)"
                    strokeWidth="1.5"
                    strokeDasharray="8 4"
                  />

                  {/* SKYBRIDGE ARRIVAL PORTAL (West Entrance) */}
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

              {/* Selected Room Live Telemetry Card */}
              {(() => {
                const bldgBp = INDOOR_BLUEPRINTS[selectedBldg] || INDOOR_BLUEPRINTS.eng;
                const flData = bldgBp?.floors[selectedFloor] || Object.values(bldgBp?.floors || {})[0];
                const activeRoom = flData?.rooms?.find((r) => r.id === selectedRoomId);

                if (!activeRoom) return null;

                return (
                  <div
                    style={{
                      backgroundColor: '#ECFDF5',
                      border: '1.5px solid #10B981',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Selected Space • {selectedFloor}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: activeRoom.status === 'available' ? '#DCFCE7' : activeRoom.status === 'reserved' ? '#FEF3C7' : '#FFE4E6',
                          color: activeRoom.status === 'available' ? '#15803D' : activeRoom.status === 'reserved' ? '#D97706' : '#E11D48',
                        }}
                      >
                        {activeRoom.statusText}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                        {activeRoom.code}: {activeRoom.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {activeRoom.type} • Capacity: {activeRoom.capacity} ({activeRoom.occupancy} Current)
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#334155' }}>
                      <span style={{ backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #D1FAE5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Thermometer size={12} style={{ color: '#059669' }} />
                        {activeRoom.temp}
                      </span>
                      <span style={{ backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #D1FAE5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} style={{ color: '#2563EB' }} />
                        {activeRoom.co2}
                      </span>
                    </div>

                    {activeRoom.features && activeRoom.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {activeRoom.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            style={{
                              fontSize: '9.5px',
                              padding: '2px 6px',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px',
                              border: '1px solid #E2E8F0',
                              color: '#475569',
                            }}
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setViewEngine('blueprint');
                          triggerToast(`Switched to Indoor Blueprint for ${activeRoom.code}`);
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: '#059669',
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
                        <Layers size={12} />
                        <span>View CAD Blueprint</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

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
