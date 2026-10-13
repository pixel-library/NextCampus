import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Compass,
} from 'lucide-react';
import api from '../services/api';

// ============================================================================
// DATA: Comprehensive Campus Rooms & Architectural CAD Metadata
// ============================================================================
const INITIAL_ROOMS = [
  // --- Block ADM-01 (Maharana Pratap Main Academic Block) - Ground Floor ---
  {
    id: "MN-G-LIB",
    roomNumber: "MN-G-01",
    name: "Central Library",
    type: "Library",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 120,
    currentOccupancy: 45,
    status: "available",
    statusText: "75 Seats Open",
    nextClass: "Open Study All Day",
    co2: 385, co2Status: "Pristine Clean Air", temp: 21.0, tempTarget: 21.0, humidity: 42, noiseDb: 26, noiseStatus: "Silent Zone (<28dB)",
    wifiSpeed: "900 Mbps", wifiLatency: "3 ms", wifiDevices: 45,
    features: ["Reading Desks & Carrels", "Digital Catalogue Terminals", "Wi-Fi Coverage", "AC & Ventilation", "ADA Accessible Aisles"],
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 135, y: 140, w: 290, h: 155, door: { x: 180, y: 310 } },
    routeSteps: [
      { step: "1. Enter Central Hall", desc: "Start from main reception hall (0m)" },
      { step: "2. Head North-West along Path", desc: "Enter Central Library via south gate (40m)" },
    ],
    routeDistance: "40 meters (0.8 min walk)",
    slots: [
      { id: "lib-1", start: "08:00", end: "12:00", title: "Morning Study Hours", lecturer: "Open", status: "available", isBookable: true },
      { id: "lib-2", start: "12:00", end: "17:00", title: "Afternoon Study Hours", lecturer: "Open", status: "available", isBookable: true },
      { id: "lib-3", start: "17:00", end: "20:00", title: "Evening Study Hours", lecturer: "Open", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-SS",
    roomNumber: "MN-G-02",
    name: "Student Section",
    type: "Student Services",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 80, currentOccupancy: 30, status: "available", statusText: "Open Now",
    nextClass: "Open 09:00 AM – 05:00 PM",
    co2: 400, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 44, noiseDb: 42, noiseStatus: "Normal Activity",
    wifiSpeed: "800 Mbps", wifiLatency: "4 ms", wifiDevices: 30,
    features: ["Student Help Desk", "Fee Counter", "Form Submission", "Notice Board", "Seating Area"],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 432, y: 140, w: 310, h: 125, door: { x: 585, y: 290 } },
    routeSteps: [
      { step: "1. Enter Central Hall", desc: "Start from central hall (0m)" },
      { step: "2. Head North directly to Gate", desc: "Student Section gate directly connected to Hall (25m)" },
    ],
    routeDistance: "25 meters (0.5 min walk)",
    slots: [
      { id: "ss-1", start: "09:00", end: "13:00", title: "Morning Service Hours", lecturer: "Admin Staff", status: "available", isBookable: false },
      { id: "ss-2", start: "14:00", end: "17:00", title: "Afternoon Service Hours", lecturer: "Admin Staff", status: "available", isBookable: false },
    ],
  },
  {
    id: "MN-G-CANT",
    roomNumber: "MN-G-03",
    name: "Canteen",
    type: "Facility",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 60, currentOccupancy: 25, status: "available", statusText: "Open Now",
    nextClass: "Serving 07:00 AM – 08:00 PM",
    co2: 430, co2Status: "Good (Kitchen Ventilated)", temp: 24.0, tempTarget: 23.0, humidity: 48, noiseDb: 55, noiseStatus: "Active",
    wifiSpeed: "500 Mbps", wifiLatency: "5 ms", wifiDevices: 25,
    features: ["Hot Meals Counter", "Snacks & Beverages", "Seating Tables", "Digital Display Menu", "CCTV Monitored"],
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 748, y: 140, w: 150, h: 155, door: { x: 825, y: 310 } },
    routeSteps: [
      { step: "1. Enter Central Hall", desc: "Head towards North-East wing (0m)" },
      { step: "2. Enter Canteen Gate", desc: "South facing gate along north path (45m)" },
    ],
    routeDistance: "45 meters (0.9 min walk)",
    slots: [
      { id: "cant-1", start: "07:00", end: "11:00", title: "Breakfast Service", lecturer: "Open", status: "available", isBookable: false },
      { id: "cant-2", start: "11:00", end: "15:00", title: "Lunch Service", lecturer: "Open", status: "occupied", isBookable: false },
      { id: "cant-3", start: "15:00", end: "20:00", title: "Evening Snacks", lecturer: "Open", status: "available", isBookable: false },
    ],
  },
  {
    id: "MN-G-EXM",
    roomNumber: "MN-G-04",
    name: "Central Examination Room",
    type: "Examination Hall",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 100, currentOccupancy: 0, status: "available", statusText: "No Exam Scheduled",
    nextClass: "Available for Booking",
    co2: 390, co2Status: "Pristine Clean Air", temp: 22.5, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Silent — Exam Ready",
    wifiSpeed: "600 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Individual Exam Desks", "CCTV Surveillance", "Strict Silent Zone", "AC & Lighting", "Invigilator Desk"],
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 902, y: 140, w: 158, h: 155, door: { x: 980, y: 310 } },
    routeSteps: [
      { step: "1. From Central Hall", desc: "Walk down North-East path (0m)" },
      { step: "2. Far North-East Corner", desc: "Examination Room entrance at far right of north wing (65m)" },
    ],
    routeDistance: "65 meters (1.3 min walk)",
    slots: [
      { id: "exm-1", start: "09:00", end: "12:00", title: "Morning Exam Slot", lecturer: "Exam Cell", status: "available", isBookable: true },
      { id: "exm-2", start: "14:00", end: "17:00", title: "Afternoon Exam Slot", lecturer: "Exam Cell", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-FLIB",
    roomNumber: "MN-G-05",
    name: "Farmacy Library",
    type: "Library",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 40, currentOccupancy: 12, status: "available", statusText: "28 Seats Open",
    nextClass: "Open 08:00 AM – 06:00 PM",
    co2: 382, co2Status: "Excellent Air Quality", temp: 21.0, tempTarget: 21.0, humidity: 41, noiseDb: 24, noiseStatus: "Strict Silent Zone",
    wifiSpeed: "850 Mbps", wifiLatency: "3 ms", wifiDevices: 12,
    features: ["Pharmacy Reference Books", "Research Journals", "Study Desks", "Digital Catalogue", "Quiet Reading Zone"],
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 1062, y: 295, w: 120, h: 170, door: { x: 1055, y: 380 } },
    routeSteps: [
      { step: "1. Enter East Path", desc: "Head east from Central Hall (0m)" },
      { step: "2. Farmacy Wing Entrance", desc: "Teal library wing projecting eastward (50m)" },
    ],
    routeDistance: "50 meters (1.0 min walk)",
    slots: [
      { id: "flib-1", start: "08:00", end: "13:00", title: "Morning Study", lecturer: "Open", status: "available", isBookable: true },
      { id: "flib-2", start: "13:00", end: "18:00", title: "Afternoon Study", lecturer: "Open", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-CRW01",
    roomNumber: "MN-G-W01",
    name: "Classroom (West Outer 1)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free till 12:00 PM",
    co2: 395, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector & Screen", "Student Desks", "AC & Ventilation"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 35, y: 285, w: 105, h: 120, door: { x: 140, y: 370 } },
    routeSteps: [{ step: "1. West Outer Wing", desc: "Access via West Path corridor (65m)" }],
    routeDistance: "65 meters (1.3 min walk)",
    slots: [
      { id: "w01-1", start: "09:00", end: "11:00", title: "Morning Lecture", lecturer: "Faculty", status: "available", isBookable: true },
      { id: "w01-2", start: "14:00", end: "16:00", title: "Afternoon Session", lecturer: "Faculty", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-CRW02",
    roomNumber: "MN-G-W02",
    name: "Classroom (West Outer 2)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 42, status: "occupied", statusText: "In Session",
    nextClass: "Free at 1:00 PM",
    co2: 450, co2Status: "Elevated", temp: 23.0, tempTarget: 22.0, humidity: 48, noiseDb: 56, noiseStatus: "Lecture",
    wifiSpeed: "680 Mbps", wifiLatency: "4 ms", wifiDevices: 42,
    features: ["Projector & Whiteboard", "Student Desks", "AC & Fans"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 35, y: 415, w: 105, h: 120, door: { x: 140, y: 510 } },
    routeSteps: [{ step: "1. West Outer Wing", desc: "Lower room along West Path (70m)" }],
    routeDistance: "70 meters (1.4 min walk)",
    slots: [
      { id: "w02-1", start: "09:00", end: "13:00", title: "Civil Eng. Class", lecturer: "Prof. Singh", status: "occupied", isBookable: false },
      { id: "w02-2", start: "14:00", end: "16:00", title: "Tutorial Slot", lecturer: "TBD", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-CR01",
    roomNumber: "MN-G-CR01",
    name: "Classroom 1",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free All Morning",
    co2: 390, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "720 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks & Whiteboard", "AC & Ventilation"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 188, y: 325, w: 75, h: 115, door: { x: 185, y: 375 } },
    routeSteps: [{ step: "1. West Inner Concourse", desc: "Top classroom of inner west row (45m)" }],
    routeDistance: "45 meters (0.9 min walk)",
    slots: [
      { id: "cr1-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-CR02",
    roomNumber: "MN-G-CR02",
    name: "Classroom 2",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 40, status: "occupied", statusText: "In Session",
    nextClass: "Free at 12:00 PM",
    co2: 440, co2Status: "Good Air Quality", temp: 23.0, tempTarget: 22.0, humidity: 47, noiseDb: 55, noiseStatus: "Lecture",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 40,
    features: ["Projector", "Desks & Whiteboard", "AC & Fans"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 188, y: 445, w: 75, h: 115, door: { x: 185, y: 505 } },
    routeSteps: [{ step: "1. West Inner Concourse", desc: "Middle classroom (50m)" }],
    routeDistance: "50 meters (1.0 min walk)",
    slots: [
      { id: "cr2-1", start: "09:00", end: "12:00", title: "Maths Class", lecturer: "Dr. Sharma", status: "occupied", isBookable: false },
    ],
  },
  {
    id: "MN-G-CR03",
    roomNumber: "MN-G-CR03",
    name: "Classroom 3",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free All Day",
    co2: 388, co2Status: "Pristine Air", temp: 22.0, tempTarget: 22.0, humidity: 42, noiseDb: 25, noiseStatus: "Quiet",
    wifiSpeed: "750 Mbps", wifiLatency: "3 ms", wifiDevices: 0,
    features: ["Projector", "Desks & Whiteboard", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 188, y: 565, w: 75, h: 115, door: { x: 185, y: 630 } },
    routeSteps: [{ step: "1. West Inner Concourse", desc: "Lower classroom (55m)" }],
    routeDistance: "55 meters (1.1 min walk)",
    slots: [
      { id: "cr3-1", start: "10:00", end: "12:00", title: "Open Study", lecturer: "Open", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-OFF",
    roomNumber: "MN-G-06",
    name: "Office",
    type: "Office",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 15, currentOccupancy: 8, status: "available", statusText: "Open Now",
    nextClass: "09:00 AM – 05:00 PM (Mon–Sat)",
    co2: 395, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 38, noiseStatus: "Office Activity",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 8,
    features: ["Admin Desks", "Document Storage", "CCTV Monitored", "Printer & Scanner", "AC & Ventilation"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 265, y: 340, w: 90, h: 100, door: { x: 300, y: 340 } },
    routeSteps: [{ step: "1. Inner West Wing", desc: "Beside West Classrooms, gate facing north (40m)" }],
    routeDistance: "40 meters (0.8 min walk)",
    slots: [
      { id: "off-1", start: "09:00", end: "17:00", title: "General Administration", lecturer: "Staff", status: "available", isBookable: false },
    ],
  },
  {
    id: "MN-G-STAFF",
    roomNumber: "MN-G-07",
    name: "Staff Room",
    type: "Office",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 20, currentOccupancy: 9, status: "available", statusText: "Faculty Available",
    nextClass: "Consultation 10:00 AM – 04:00 PM",
    co2: 395, co2Status: "Pristine Clean Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 32, noiseStatus: "Quiet Work Space",
    wifiSpeed: "850 Mbps", wifiLatency: "3 ms", wifiDevices: 12,
    features: ["Faculty Workstations", "Meeting Table", "Tea/Coffee Dispenser", "High-Speed Wi-Fi", "AC & Ergonomic Seating"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 355, y: 340, w: 90, h: 100, door: { x: 415, y: 340 } },
    routeSteps: [{ step: "1. Inner West Wing", desc: "Beside Office, dual gates to north path and hall (35m)" }],
    routeDistance: "35 meters (0.7 min walk)",
    slots: [
      { id: "stf-1", start: "10:00", end: "16:00", title: "Consultation Hours", lecturer: "Faculty", status: "available", isBookable: false },
    ],
  },
  {
    id: "MN-G-CR04",
    roomNumber: "MN-G-CR04",
    name: "Classroom 4",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks & Whiteboard", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 246, y: 535, w: 65, h: 95, door: { x: 280, y: 670 } },
    routeSteps: [{ step: "1. Inner West Row", desc: "First room below Office (50m)" }],
    routeDistance: "50 meters (1.0 min walk)",
    slots: [{ id: "cr4-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CR05",
    roomNumber: "MN-G-CR05",
    name: "Classroom 5",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks & Whiteboard", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 315, y: 535, w: 65, h: 95, door: { x: 345, y: 670 } },
    routeSteps: [{ step: "1. Inner West Row", desc: "Middle room below Office (55m)" }],
    routeDistance: "55 meters (1.1 min walk)",
    slots: [{ id: "cr5-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CR06",
    roomNumber: "MN-G-CR06",
    name: "Classroom 6",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 38, status: "occupied", statusText: "In Session",
    nextClass: "Free at 1:00 PM",
    co2: 445, co2Status: "Elevated", temp: 23.0, tempTarget: 22.0, humidity: 49, noiseDb: 54, noiseStatus: "Class Active",
    wifiSpeed: "680 Mbps", wifiLatency: "4 ms", wifiDevices: 38,
    features: ["Projector", "Desks & Whiteboard", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 380, y: 535, w: 65, h: 95, door: { x: 415, y: 670 } },
    routeSteps: [{ step: "1. Inner West Row", desc: "Right room below Staff Room (50m)" }],
    routeDistance: "50 meters (1.0 min walk)",
    slots: [{ id: "cr6-1", start: "09:00", end: "13:00", title: "Elective Class", lecturer: "Prof. Joshi", status: "occupied", isBookable: false }],
  },
  {
    id: "MN-G-MEETN",
    roomNumber: "MN-G-12",
    name: "Room (Meeting / North)",
    type: "Conference",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 30, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free Till 3:00 PM",
    co2: 388, co2Status: "Pristine Clean Air", temp: 21.5, tempTarget: 21.5, humidity: 42, noiseDb: 25, noiseStatus: "Silent Zone",
    wifiSpeed: "900 Mbps", wifiLatency: "2 ms", wifiDevices: 0,
    features: ["Conference Video Bar 4K", "Smart Interactive Display", "Wireless Screen Sharing", "Executive Chairs", "Acoustic Wall Panels"],
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
    has4kLaser: true, hasGpu: false, hasInteractive: true, isAda: true,
    cadBox: { x: 670, y: 340, w: 155, h: 65, door: { x: 710, y: 340 } },
    routeSteps: [{ step: "1. North-East Inner Wing", desc: "Above Badminton Court, gate facing north path (45m)" }],
    routeDistance: "45 meters (0.9 min walk)",
    slots: [{ id: "mtn-1", start: "11:00", end: "15:00", title: "Open Conference Booking", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-MEETE",
    roomNumber: "MN-G-13",
    name: "Room (Faculty / East)",
    type: "Office",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 20, currentOccupancy: 6, status: "available", statusText: "Open Now",
    nextClass: "Open 09:00 AM – 05:00 PM",
    co2: 395, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 30, noiseStatus: "Quiet",
    wifiSpeed: "750 Mbps", wifiLatency: "3 ms", wifiDevices: 6,
    features: ["Faculty Desks", "Wi-Fi 6", "AC & Natural Daylight"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 890, y: 340, w: 80, h: 65, door: { x: 890, y: 370 } },
    routeSteps: [{ step: "1. North-East Inner Wing", desc: "Beside North Meeting Room, gate facing east path (50m)" }],
    routeDistance: "50 meters (1.0 min walk)",
    slots: [{ id: "mte-1", start: "09:00", end: "17:00", title: "Faculty Hours", lecturer: "Faculty", status: "available", isBookable: false }],
  },
  {
    id: "MN-G-BADN",
    roomNumber: "MN-G-10",
    name: "Badminton Court (North)",
    type: "Sports",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 10, currentOccupancy: 8, status: "occupied", statusText: "Match in Progress",
    nextClass: "Free at 12:00 PM",
    co2: 400, co2Status: "Good Air Quality", temp: 25.5, tempTarget: 25.0, humidity: 52, noiseDb: 62, noiseStatus: "Match Active",
    wifiSpeed: "600 Mbps", wifiLatency: "5 ms", wifiDevices: 8,
    features: ["Standard Badminton Court (Green)", "Official Net & Posts", "Marked Boundary Lines", "Ventilated Indoor Hall"],
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 670, y: 405, w: 155, h: 60, door: { x: 810, y: 435 } },
    routeSteps: [{ step: "1. East Inner Arena", desc: "North court with green tournament floor (50m)" }],
    routeDistance: "50 meters (1.0 min walk)",
    slots: [
      { id: "badn-1", start: "08:00", end: "12:00", title: "Tournament Practice", lecturer: "Booked", status: "occupied", isBookable: false },
      { id: "badn-2", start: "14:00", end: "18:00", title: "Student Free Play", lecturer: "Open", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-BADS",
    roomNumber: "MN-G-11",
    name: "Badminton Court (South)",
    type: "Sports",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 10, currentOccupancy: 0, status: "available", statusText: "Court Free",
    nextClass: "Open 06:00 AM – 08:00 PM",
    co2: 380, co2Status: "Fresh Air", temp: 25.0, tempTarget: 25.0, humidity: 50, noiseDb: 35, noiseStatus: "Quiet",
    wifiSpeed: "600 Mbps", wifiLatency: "5 ms", wifiDevices: 0,
    features: ["Standard Badminton Court (Dark)", "Official Net & Posts", "Court Markings", "Direct Internal Path Access"],
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 670, y: 535, w: 155, h: 55, door: { x: 810, y: 565 } },
    routeSteps: [{ step: "1. East Inner Arena", desc: "South court adjacent to vertical path (55m)" }],
    routeDistance: "55 meters (1.1 min walk)",
    slots: [
      { id: "bads-1", start: "06:00", end: "12:00", title: "Morning Play", lecturer: "Open", status: "available", isBookable: true },
      { id: "bads-2", start: "14:00", end: "19:00", title: "Afternoon Play", lecturer: "Open", status: "available", isBookable: true },
    ],
  },
  {
    id: "MN-G-MGMT",
    roomNumber: "MN-G-09",
    name: "Management Room",
    type: "Office",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 20, currentOccupancy: 10, status: "available", statusText: "Open Now",
    nextClass: "09:00 AM – 05:00 PM",
    co2: 400, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 36, noiseStatus: "Office Activity",
    wifiSpeed: "720 Mbps", wifiLatency: "4 ms", wifiDevices: 10,
    features: ["Management Desks", "Conference Table", "CCTV Monitored", "Printer & Scanner", "AC"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 885, y: 465, w: 85, h: 160, door: { x: 885, y: 670 } },
    routeSteps: [{ step: "1. East Wing Interior", desc: "Beside internal path and badminton court, gate facing west (55m)" }],
    routeDistance: "55 meters (1.1 min walk)",
    slots: [
      { id: "mgmt-1", start: "09:00", end: "13:00", title: "Management Hours", lecturer: "Management", status: "available", isBookable: false },
      { id: "mgmt-2", start: "14:00", end: "17:00", title: "Meetings", lecturer: "Management", status: "available", isBookable: false },
    ],
  },
  {
    id: "MN-G-CR07",
    roomNumber: "MN-G-CR07",
    name: "Classroom 7",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 29, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks & Whiteboard", "AC & Fans"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 670, y: 590, w: 75, h: 60, door: { x: 705, y: 670 } },
    routeSteps: [{ step: "1. Below Badminton Arena", desc: "Left room along south path (55m)" }],
    routeDistance: "55 meters (1.1 min walk)",
    slots: [{ id: "cr7-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CR08",
    roomNumber: "MN-G-CR08",
    name: "Classroom 8",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 45, currentOccupancy: 0, status: "available", statusText: "Available Now",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air Quality", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 29, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks & Whiteboard", "AC & Fans"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 750, y: 590, w: 75, h: 60, door: { x: 785, y: 670 } },
    routeSteps: [{ step: "1. Below Badminton Arena", desc: "Right room along south path (60m)" }],
    routeDistance: "60 meters (1.2 min walk)",
    slots: [{ id: "cr8-1", start: "14:00", end: "16:00", title: "Afternoon Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-KTCH",
    roomNumber: "MN-G-08",
    name: "Kitchen Room",
    type: "Facility",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 25, currentOccupancy: 8, status: "available", statusText: "Open & Active",
    nextClass: "Catering 07:00 AM – 09:00 PM",
    co2: 440, co2Status: "Good (Exhaust Active)", temp: 24.5, tempTarget: 23.0, humidity: 50, noiseDb: 52, noiseStatus: "Kitchen Prep",
    wifiSpeed: "500 Mbps", wifiLatency: "5 ms", wifiDevices: 8,
    features: ["Food Prep Station", "Commercial Refrigeration", "Water Purifier RO", "Fire Suppression Rig", "Ventilation Exhaust"],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: true,
    cadBox: { x: 575, y: 735, w: 60, h: 65, door: { x: 585, y: 705 } },
    routeSteps: [{ step: "1. South Corridor", desc: "East of central exit, gate facing north path (60m)" }],
    routeDistance: "60 meters (1.2 min walk)",
    slots: [{ id: "ktch-1", start: "07:00", end: "20:00", title: "Kitchen Prep & Catering", lecturer: "Staff", status: "occupied", isBookable: false }],
  },
  {
    id: "MN-G-CRS01",
    roomNumber: "MN-G-S01",
    name: "Classroom (South 1)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 115, y: 735, w: 60, h: 65, door: { x: 145, y: 705 } },
    routeSteps: [{ step: "1. South-West Row", desc: "Next to West Washroom (75m)" }],
    routeDistance: "75 meters (1.5 min walk)",
    slots: [{ id: "s01-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS02",
    roomNumber: "MN-G-S02",
    name: "Classroom (South 2)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 180, y: 735, w: 60, h: 65, door: { x: 210, y: 705 } },
    routeSteps: [{ step: "1. South-West Row", desc: "Beside West Exit (70m)" }],
    routeDistance: "70 meters (1.4 min walk)",
    slots: [{ id: "s02-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS03",
    roomNumber: "MN-G-S03",
    name: "Classroom (South 3)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 255, y: 735, w: 60, h: 65, door: { x: 285, y: 705 } },
    routeSteps: [{ step: "1. South Central-West Row", desc: "First of 3 rooms (65m)" }],
    routeDistance: "65 meters (1.3 min walk)",
    slots: [{ id: "s03-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS04",
    roomNumber: "MN-G-S04",
    name: "Classroom (South 4)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 45, status: "occupied", statusText: "In Session",
    nextClass: "Free at 1:00 PM",
    co2: 450, co2Status: "Elevated", temp: 23.0, tempTarget: 22.0, humidity: 48, noiseDb: 55, noiseStatus: "Class",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 45,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 320, y: 735, w: 60, h: 65, door: { x: 350, y: 705 } },
    routeSteps: [{ step: "1. South Central-West Row", desc: "Middle room (60m)" }],
    routeDistance: "60 meters (1.2 min walk)",
    slots: [{ id: "s04-1", start: "09:00", end: "13:00", title: "Lecture", lecturer: "Faculty", status: "occupied", isBookable: false }],
  },
  {
    id: "MN-G-CRS05",
    roomNumber: "MN-G-S05",
    name: "Classroom (South 5)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 385, y: 735, w: 60, h: 65, door: { x: 415, y: 705 } },
    routeSteps: [{ step: "1. South Central-West Row", desc: "Right room beside main exit (55m)" }],
    routeDistance: "55 meters (1.1 min walk)",
    slots: [{ id: "s05-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS06",
    roomNumber: "MN-G-S06",
    name: "Classroom (South 6)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 635, y: 735, w: 55, h: 65, door: { x: 640, y: 705 } },
    routeSteps: [{ step: "1. South Central-East Row", desc: "Beside Kitchen Room (65m)" }],
    routeDistance: "65 meters (1.3 min walk)",
    slots: [{ id: "s06-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS07",
    roomNumber: "MN-G-S07",
    name: "Classroom (South 7)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 690, y: 735, w: 60, h: 65, door: { x: 695, y: 705 } },
    routeSteps: [{ step: "1. South Central-East Row", desc: "Beside East Exit (70m)" }],
    routeDistance: "70 meters (1.4 min walk)",
    slots: [{ id: "s07-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS08",
    roomNumber: "MN-G-S08",
    name: "Classroom (South 8)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 780, y: 735, w: 65, h: 65, door: { x: 785, y: 705 } },
    routeSteps: [{ step: "1. South-East Row", desc: "Right of East Exit (75m)" }],
    routeDistance: "75 meters (1.5 min walk)",
    slots: [{ id: "s08-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
  {
    id: "MN-G-CRS09",
    roomNumber: "MN-G-S09",
    name: "Classroom (South 9)",
    type: "Classroom",
    building: "Maharana Pratap Main Academic Block (Block ADM-01)",
    buildingCode: "ADM-01",
    floor: "Ground",
    capacity: 50, currentOccupancy: 0, status: "available", statusText: "Available",
    nextClass: "Free All Day",
    co2: 390, co2Status: "Good Air", temp: 22.0, tempTarget: 22.0, humidity: 43, noiseDb: 28, noiseStatus: "Quiet",
    wifiSpeed: "700 Mbps", wifiLatency: "4 ms", wifiDevices: 0,
    features: ["Projector", "Desks", "AC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    has4kLaser: false, hasGpu: false, hasInteractive: false, isAda: false,
    cadBox: { x: 840, y: 735, w: 65, h: 65, door: { x: 845, y: 705 } },
    routeSteps: [{ step: "1. South-East Row", desc: "Beside East Washroom (80m)" }],
    routeDistance: "80 meters (1.6 min walk)",
    slots: [{ id: "s09-1", start: "09:00", end: "11:00", title: "Morning Slot", lecturer: "Open", status: "available", isBookable: true }],
  },
];

// Buildings directory
const BUILDINGS = [
  { id: "ADM-01", name: "Maharana Pratap Main Academic Block (Block ADM-01)", floors: ["Ground", "Level 1", "Level 2"] },
  { id: "ENG-02", name: "Faculty of Engineering & Technology (Block ENG-02)", floors: ["Ground", "Level 1", "Level 2", "Level 3"] },
  { id: "LIB-03", name: "Swami Vivekananda Central Library (Block LIB-03)", floors: ["Ground", "Level 1", "Level 2"] },
];

// Ground Floor Navigation Landmarks & Main Entrance Exits
const START_LANDMARKS = [
  { id: 'HALL', name: 'Central Hall (Main Lobby)', roomNumber: 'LOBBY', x: 570, y: 520 },
  { id: 'EXIT_1', name: 'Main South Entrance / Exit 1', roomNumber: 'ENTRY-1', x: 515, y: 835 },
  { id: 'EXIT_2', name: 'Main South Entrance / Exit 2', roomNumber: 'ENTRY-2', x: 625, y: 835 },
];

const WEST_CORRIDOR_X = 165;
const EAST_FAR_CORRIDOR_X = 1010;
const EAST_INNER_CORRIDOR_X = 855;
const NORTH_CORRIDOR_Y = 335;
const SOUTH_CORRIDOR_Y = 690;
const HALL_CORE_X = 570;

// Helper to project any room door or landmark onto the nearest architectural hallway centerline
function getCorridorAnchor(pt) {
  // 1. Direct North corridor gates (Library, Student Section, Canteen, Exam Room, Office, Staff Room, Meeting Room)
  if (pt.y <= 360 && pt.x >= 120 && pt.x <= 950) {
    return { x: pt.x, y: NORTH_CORRIDOR_Y, corridor: 'NORTH', isHorizontal: true };
  }
  if (pt.y <= 340) {
    return { x: Math.min(EAST_FAR_CORRIDOR_X, Math.max(WEST_CORRIDOR_X, pt.x)), y: NORTH_CORRIDOR_Y, corridor: 'NORTH', isHorizontal: true };
  }

  // 2. Direct South corridor gates (South Classrooms 1-9, Classroom 4-6, Classroom 7-8, Kitchen, Management, Main Exits)
  if (pt.y >= 650 && pt.x >= 120 && pt.x <= 950) {
    return { x: pt.x, y: SOUTH_CORRIDOR_Y, corridor: 'SOUTH', isHorizontal: true };
  }
  if (pt.y >= 680) {
    return { x: Math.min(EAST_FAR_CORRIDOR_X, Math.max(WEST_CORRIDOR_X, pt.x)), y: SOUTH_CORRIDOR_Y, corridor: 'SOUTH', isHorizontal: true };
  }

  // 3. West vertical corridor (Classroom 1-3 & West Outer 1-2)
  if (pt.x <= 250) {
    return { x: WEST_CORRIDOR_X, y: Math.min(SOUTH_CORRIDOR_Y, Math.max(NORTH_CORRIDOR_Y, pt.y)), corridor: 'WEST', isHorizontal: false };
  }

  // 4. Far East vertical corridor (Farmacy Library)
  if (pt.x >= 950) {
    return { x: EAST_FAR_CORRIDOR_X, y: Math.min(SOUTH_CORRIDOR_Y, Math.max(NORTH_CORRIDOR_Y, pt.y)), corridor: 'EAST_FAR', isHorizontal: false };
  }

  // 5. East Inner concourse (Badminton courts, Faculty room)
  if (pt.x >= 800 && pt.x < 950) {
    return { x: EAST_INNER_CORRIDOR_X, y: Math.min(SOUTH_CORRIDOR_Y, Math.max(NORTH_CORRIDOR_Y, pt.y)), corridor: 'EAST_INNER', isHorizontal: false };
  }

  // 6. Central Hall core aisle
  return { x: HALL_CORE_X, y: Math.min(SOUTH_CORRIDOR_Y, Math.max(NORTH_CORRIDOR_Y, pt.y)), corridor: 'HALL', isHorizontal: false };
}

// Computes realistic walking route strictly following architectural hallway corridors (PATH)
function calculateCorridorWaypoints(start, dest) {
  const p1 = { x: start.x, y: start.y };
  const p2 = { x: dest.x, y: dest.y };

  const a1 = getCorridorAnchor(p1);
  const a2 = getCorridorAnchor(p2);

  let corridorPoints = [];

  if (a1.corridor === a2.corridor) {
    corridorPoints = [a1, a2];
  } else if (a1.isHorizontal && !a2.isHorizontal) {
    // a1 is horizontal (NORTH or SOUTH), a2 is vertical (WEST, EAST_FAR, EAST_INNER, HALL)
    corridorPoints = [a1, { x: a2.x, y: a1.y }, a2];
  } else if (!a1.isHorizontal && a2.isHorizontal) {
    // a1 is vertical, a2 is horizontal
    corridorPoints = [a1, { x: a1.x, y: a2.y }, a2];
  } else if (a1.isHorizontal && a2.isHorizontal) {
    // Both horizontal (NORTH <-> SOUTH): connect via Central Hall core aisle
    corridorPoints = [a1, { x: HALL_CORE_X, y: a1.y }, { x: HALL_CORE_X, y: a2.y }, a2];
  } else {
    // Both vertical (WEST, EAST_FAR, EAST_INNER, HALL)
    // Check if directly connected through Central Hall opening to EAST_INNER at y=505
    const isDirectHallEast = (a1.corridor === 'HALL' && a2.corridor === 'EAST_INNER') ||
                             (a1.corridor === 'EAST_INNER' && a2.corridor === 'HALL');
    let junctionY;
    if (isDirectHallEast && Math.abs(a1.y - 505) < 90 && Math.abs(a2.y - 505) < 90) {
      junctionY = 505;
    } else {
      junctionY = (a1.y + a2.y < 1024) ? NORTH_CORRIDOR_Y : SOUTH_CORRIDOR_Y;
    }
    corridorPoints = [a1, { x: a1.x, y: junctionY }, { x: a2.x, y: junctionY }, a2];
  }

  // Combine entire chain
  const rawChain = [p1, ...corridorPoints, p2];

  // Filter consecutive duplicates
  const cleaned = [];
  for (let i = 0; i < rawChain.length; i++) {
    const pt = rawChain[i];
    const prev = cleaned[cleaned.length - 1];
    if (!prev || prev.x !== pt.x || prev.y !== pt.y) {
      cleaned.push(pt);
    }
  }

  // Filter collinear redundancies
  const simplified = [];
  for (let i = 0; i < cleaned.length; i++) {
    if (i === 0 || i === cleaned.length - 1) {
      simplified.push(cleaned[i]);
      continue;
    }
    const prev = simplified[simplified.length - 1];
    const curr = cleaned[i];
    const next = cleaned[i + 1];

    const isCollinearX = prev.x === curr.x && curr.x === next.x;
    const isCollinearY = prev.y === curr.y && curr.y === next.y;
    if (!isCollinearX && !isCollinearY) {
      simplified.push(curr);
    }
  }

  return simplified;
}

export function SmartRooms() {
  const navigate = useNavigate();

  // Core State
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [selectedBuilding, setSelectedBuilding] = useState('Maharana Pratap Main Academic Block (Block ADM-01)');
  const [selectedFloor, setSelectedFloor] = useState('Ground');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('MN-G-LIB');
  const [startLocationId, setStartLocationId] = useState('HALL');

  // CAD Viewer Interactive Pan & Zoom
  const [cadZoom, setCadZoom] = useState(1);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [navToast, setNavToast] = useState(null);
  const svgRef = useRef(null);

  // Robust room selector & navigator
  const handleSelectRoom = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      if (room.building !== selectedBuilding) {
        setSelectedBuilding(room.building);
      }
      setSelectedRoomId(roomId);
      setNavToast(`Navigating to ${room.name} (${room.roomNumber})`);
      setTimeout(() => setNavToast(null), 3500);
    }
  };

  // Canvas-level SVG coordinate click resolver
  const handleCanvasClick = (e) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    // 1. Direct hit inside cadBox with generous 14px tolerance
    const directHit = buildingFilteredRooms.find((r) => {
      if (!r.cadBox) return false;
      const { x, y, w, h } = r.cadBox;
      return (
        svgP.x >= x - 14 &&
        svgP.x <= x + w + 14 &&
        svgP.y >= y - 14 &&
        svgP.y <= y + h + 14
      );
    });

    if (directHit) {
      handleSelectRoom(directHit.id);
      return;
    }

    // 2. Proximity fallback: nearest room center within 90 units
    let closestRoom = null;
    let minDist = 90;
    buildingFilteredRooms.forEach((r) => {
      if (!r.cadBox) return;
      const { x, y, w, h } = r.cadBox;
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const dist = Math.hypot(svgP.x - centerX, svgP.y - centerY);
      if (dist < minDist) {
        minDist = dist;
        closestRoom = r;
      }
    });

    if (closestRoom) {
      handleSelectRoom(closestRoom.id);
    }
  };

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

  // Selected Room Object
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  // Sync rooms with building selection
  const buildingFilteredRooms = useMemo(() => {
    return rooms.filter((r) => r.building === selectedBuilding);
  }, [rooms, selectedBuilding]);

  // Dynamic Start Location Object (Landmarks or Rooms)
  const startLocation = useMemo(() => {
    const lm = START_LANDMARKS.find((l) => l.id === startLocationId);
    if (lm) return { ...lm, isRoom: false };
    const rm = rooms.find((r) => r.id === startLocationId);
    if (rm && rm.cadBox?.door) {
      return {
        id: rm.id,
        name: rm.name,
        roomNumber: rm.roomNumber,
        x: rm.cadBox.door.x,
        y: rm.cadBox.door.y,
        isRoom: true,
      };
    }
    return { ...START_LANDMARKS[0], isRoom: false };
  }, [startLocationId, rooms]);

  // Compute realistic walking route strictly following architectural hallway corridors (PATH)
  const activeWaypoints = useMemo(() => {
    if (!selectedRoom?.cadBox?.door) return [];
    return calculateCorridorWaypoints(startLocation, selectedRoom.cadBox.door);
  }, [startLocation, selectedRoom]);

  const activeRoutePathD = useMemo(() => {
    if (!activeWaypoints || activeWaypoints.length < 2) return '';
    return activeWaypoints.map((pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `L ${pt.x},${pt.y}`)).join(' ');
  }, [activeWaypoints]);

  const { activeRouteDistanceMeters, activeRouteMinutes, activeDynamicSteps } = useMemo(() => {
    if (!activeWaypoints || activeWaypoints.length < 2) {
      return {
        activeRouteDistanceMeters: 25,
        activeRouteMinutes: 0.5,
        activeDynamicSteps: selectedRoom.routeSteps,
      };
    }
    let totalDist = 0;
    for (let i = 1; i < activeWaypoints.length; i++) {
      totalDist += Math.hypot(
        activeWaypoints[i].x - activeWaypoints[i - 1].x,
        activeWaypoints[i].y - activeWaypoints[i - 1].y
      );
    }
    const meters = Math.max(10, Math.round(totalDist * 0.1));
    const mins = Math.max(0.4, Math.round((meters / 55) * 10) / 10);

    const steps = [
      {
        step: `1. Depart from ${startLocation.name}`,
        desc: `Start at ${startLocation.roomNumber || 'departure node'} (0m)`,
      },
      {
        step: '2. Follow Open Hallway (PATH)',
        desc: 'Walk along the designated architectural corridor',
      },
    ];
    if (activeWaypoints.length > 3) {
      steps.push({
        step: '3. Corridor Waypoint Turn',
        desc: 'Follow hallway intersection turn directly toward destination wing',
      });
    }
    steps.push({
      step: `4. Arrive at ${selectedRoom.name} Gate`,
      desc: `Step through marked entrance GATE (${meters}m total, ~${mins} min walk)`,
    });

    return {
      activeRouteDistanceMeters: meters,
      activeRouteMinutes: mins,
      activeDynamicSteps: steps,
    };
  }, [activeWaypoints, startLocation, selectedRoom]);

  // Handle building change
  const handleBuildingChange = (bldgName) => {
    setSelectedBuilding(bldgName);
    const bldgRooms = rooms.filter((r) => r.building === bldgName);
    if (bldgRooms.length > 0) {
      setSelectedFloor(bldgRooms[0].floor);
      setSelectedRoomId(bldgRooms[0].id);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)', minHeight: '100%' }} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* =========================================================================
          TOP INSTITUTIONAL HEADER & BREADCRUMBS
          ========================================================================= */}
      <div className="flex flex-col gap-4 pb-6 border-b border-[#E4EAE5]">
        {/* Breadcrumb & Navigation Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
            <span className="px-2.5 py-1 rounded-full bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] border border-[var(--brand-soft-border)] font-semibold flex items-center gap-1.5 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              Indoor Navigation CAD
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)]">• Mewar University Gangrar</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className="text-[var(--text-primary)] font-semibold">{selectedRoom.buildingCode}</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className="text-[var(--brand-primary)] font-semibold">{selectedFloor} Architectural CAD</span>
          </div>
        </div>

        {/* Page Title & Purpose */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-heading">
              Indoor Navigation &amp; Floor Maps
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-[var(--text-secondary)] border border-[#E4EAE5] font-mono font-medium">
              CAD BIM v2.4
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1">
            Interactive CAD architectural floor plans, indoor corridor wayfinding, and room directory across campus buildings.
          </p>
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
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim()) {
                  const q = val.toLowerCase();
                  const matched = rooms.find(
                    (r) =>
                      r.name.toLowerCase().includes(q) ||
                      r.roomNumber.toLowerCase().includes(q)
                  );
                  if (matched) {
                    handleSelectRoom(matched.id);
                  }
                }
              }}
              placeholder="Search room (e.g. Student Section, Canteen, Central Library, MN-G-01)..."
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

        {/* Row 2: Building Floor Level Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E4EAE5]">
          <span className="text-xs font-mono uppercase font-bold text-[var(--text-muted)]">Floor Level:</span>
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
        </div>
      </div>

      {/* =========================================================================
          PRIMARY WORKSPACE: SPLIT CAD FLOOR PLAN & LIVE ROOM INSPECTOR
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: ARCHITECTURAL CAD VECTOR VIEWER */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative w-full rounded-2xl bg-white border border-[#E4EAE5] overflow-hidden shadow-sm">
            {/* CAD Viewer Top Overlay Navigation: Wayfinding Origin & Destination Selector */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-20 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
              {/* Wayfinding Origin -> Destination Control Bar */}
              <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-white/95 border border-[#E4EAE5] shadow-md backdrop-blur-md text-xs">
                {/* Origin Selector */}
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">From:</span>
                  <select
                    value={startLocationId}
                    onChange={(e) => setStartLocationId(e.target.value)}
                    className="bg-transparent font-bold text-[var(--text-primary)] text-xs focus:outline-none cursor-pointer max-w-[110px] sm:max-w-[150px] truncate"
                    aria-label="Select Starting Location"
                  >
                    <optgroup label="Central Areas & Exits">
                      {START_LANDMARKS.map((lm) => (
                        <option key={lm.id} value={lm.id}>
                          {lm.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Ground Floor Rooms">
                      {buildingFilteredRooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.roomNumber})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Quick Swap Origin & Destination Button */}
                <button
                  type="button"
                  onClick={() => {
                    const currentStart = startLocationId;
                    const currentDest = selectedRoomId;
                    if (rooms.some((r) => r.id === currentStart)) {
                      setStartLocationId(currentDest);
                      handleSelectRoom(currentStart);
                    } else {
                      setStartLocationId(currentDest);
                      handleSelectRoom('MN-G-LIB');
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Swap Start & Destination"
                  aria-label="Swap Start & Destination"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Destination Selector */}
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">To:</span>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => handleSelectRoom(e.target.value)}
                    className="bg-transparent font-bold text-[var(--brand-primary)] text-xs focus:outline-none cursor-pointer max-w-[110px] sm:max-w-[150px] truncate"
                    aria-label="Select Destination Room to Navigate"
                  >
                    {buildingFilteredRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.roomNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Live Distance & Walking Time Badge */}
                <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-[#E4EAE5] text-[11px] font-mono text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--brand-primary)]">{activeRouteDistanceMeters}m</span>
                  <span>(~{activeRouteMinutes} min walk)</span>
                </div>
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
              </div>
            </div>

            {/* Floating Navigation Feedback Toast */}
            {navToast && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-slate-900/95 text-emerald-400 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-top-2">
                <Navigation className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>{navToast}</span>
              </div>
            )}

            {/* Architectural Ground Floor Blueprint Canvas with Exact SVG Reference */}
            <div className="w-full h-[380px] sm:h-[540px] xl:h-[680px] bg-[#0A0F1D] relative overflow-hidden select-none flex items-center justify-center rounded-2xl border border-[#1E293B] shadow-2xl">
              {/* Precision Background Blueprint Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cadGridDark" width="36" height="36" patternUnits="userSpaceOnUse">
                    <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#10B981" strokeWidth="0.5" strokeDasharray="1 3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cadGridDark)" />
              </svg>

              {/* Exact Vector Geometry with Pan & Zoom transform */}
              <svg
                ref={svgRef}
                onClick={handleCanvasClick}
                className="w-full h-full p-2 sm:p-4 relative z-10 transition-transform duration-300 ease-out cursor-pointer"
                viewBox="0 0 1200 896"
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: `scale(${cadZoom})` }}
              >
                <defs>
                  {/* Glowing Filter for Selected Vector Route */}
                  <filter id="emeraldRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10B981" floodOpacity="0.9" />
                  </filter>
                  <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.95" />
                  </filter>
                </defs>

                {/* Base Ground Floor Map Image — Exact architectural plan from ground_floor_map.svg */}
                <image
                  href="/ground_floor_map.svg"
                  x="0"
                  y="0"
                  width="1200"
                  height="896"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Interactive Clickable Room Overlay Regions */}
                {buildingFilteredRooms
                  .filter((r) => r.cadBox)
                  .map((room) => {
                    const isSelected = room.id === selectedRoomId;
                    const isHovered = room.id === hoveredRoomId;
                    const { x, y, w, h } = room.cadBox;

                    return (
                      <g
                        key={room.id}
                        className="cursor-pointer group"
                        style={{ pointerEvents: 'all' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoomId(room.id);
                          handleSelectRoom(room.id);
                        }}
                        onMouseEnter={() => setHoveredRoomId(room.id)}
                        onMouseLeave={() => setHoveredRoomId(null)}
                      >
                        {/* Interactive transparent overlay bounding box - NO colored box masking blueprint */}
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="4"
                          style={{ pointerEvents: 'all', cursor: 'pointer' }}
                          fill="rgba(0, 0, 0, 0.001)"
                          stroke={isHovered ? "rgba(16, 185, 129, 0.6)" : "transparent"}
                          strokeWidth={isHovered ? "1.5" : "0"}
                          className="transition-all duration-150"
                        />

                        {/* Interactive Hover Tooltip Badge */}
                        {!isSelected && isHovered && (
                          <g transform={`translate(${x + w / 2}, ${y + Math.min(18, h / 2)})`}>
                            <rect
                              x="-56"
                              y="-10"
                              width="112"
                              height="20"
                              rx="5"
                              fill="#022C22"
                              stroke="#10B981"
                              strokeWidth="1"
                            />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fill="#34D399"
                              fontFamily="Inter, sans-serif"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Click to Navigate
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                {/* DYNAMIC ANIMATED VECTOR PATH ALONG ARCHITECTURAL CORRIDORS (PATH) */}
                {activeRoutePathD && (
                  <path
                    d={activeRoutePathD}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4.5"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#emeraldRouteGlow)"
                    className="animate-[dash_1.2s_linear_infinite]"
                  />
                )}

                {/* Destination Door Beacon */}
                {selectedRoom?.cadBox?.door && (
                  <g transform={`translate(${selectedRoom.cadBox.door.x}, ${selectedRoom.cadBox.door.y})`}>
                    <circle cx="0" cy="0" r="7" fill="#10B981" />
                    <circle cx="0" cy="0" r="16" fill="#10B981" fillOpacity="0.35" className="animate-ping" />
                    <g transform="translate(12, -10)">
                      <rect x="0" y="0" width={Math.max(68, selectedRoom.roomNumber.length * 8 + 18)} height="20" rx="4" fill="#022C22" stroke="#10B981" strokeWidth="1" />
                      <text x="7" y="14" fill="#34D399" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" filter="url(#textGlow)">
                        GATE: {selectedRoom.roomNumber}
                      </text>
                    </g>
                  </g>
                )}

                {/* Start Location Departure Marker */}
                {startLocation && (
                  <g transform={`translate(${startLocation.x}, ${startLocation.y})`}>
                    <circle cx="0" cy="0" r="7" fill="#3B82F6" />
                    <circle cx="0" cy="0" r="16" fill="#3B82F6" fillOpacity="0.3" className="animate-ping" />
                    <g transform="translate(12, -10)">
                      <rect x="0" y="0" width={startLocationId === 'HALL' ? 140 : Math.max(70, startLocation.name.length * 7 + 16)} height="20" rx="4" fill="#0F172A" stroke="#3B82F6" strokeWidth="1" />
                      <text x="7" y="14" fill="#60A5FA" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" filter="url(#textGlow)">
                        {startLocationId === 'HALL' ? 'START (Central Hall)' : `START (${startLocation.name})`}
                      </text>
                    </g>
                  </g>
                )}
              </svg>

              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -32; }
                }
              `}</style>

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
        </div>

        {/* =========================================================================
            RIGHT COLUMN: ROOM WAYFINDING INSPECTOR & SPACE SPECIFICATIONS
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
                  <span>{selectedRoom.type}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight font-heading mt-0.5">
                  Room {selectedRoom.roomNumber}: {selectedRoom.name}
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] text-xs font-bold border border-[var(--brand-soft-border)] shrink-0">
                Destination
              </span>
            </div>

            {/* Room Photo Preview */}
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
                  {selectedRoom.capacity} Seats Capacity
                </span>
              </div>
            </div>

            {/* Space Specifications */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-semibold">Total Capacity</span>
                <span className="text-base font-bold text-[var(--text-primary)] font-heading mt-0.5">{selectedRoom.capacity} Desks / Seats</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[#E4EAE5] flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-semibold">Door / Gate</span>
                <span className="text-base font-bold text-[var(--brand-primary)] font-heading mt-0.5">GATE {selectedRoom.roomNumber}</span>
              </div>
            </div>

            {/* Room Features List */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Equipment &amp; Facilities
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

            {/* Dynamic Walking Directions from User Chosen Node */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#E4EAE5]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Walking Turn Directions
                </span>
                <span className="text-xs text-[var(--brand-primary)] font-semibold">
                  {activeRouteDistanceMeters}m (~{activeRouteMinutes} min)
                </span>
              </div>

              <div className="flex flex-col gap-2.5 relative pl-3 border-l-2 border-[var(--brand-primary)] ml-1 mt-1">
                {activeDynamicSteps.map((st, i) => (
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
                onClick={() => handleSelectRoom(selectedRoom.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-current animate-pulse" />
                <span>Follow Live Walking Route on Map</span>
              </button>

              <button
                onClick={() => navigate(`/campus-map?bldg=admin&room=${selectedRoom.roomNumber}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 border border-[#E4EAE5] transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Open in Mewar Campus GIS Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartRooms;
