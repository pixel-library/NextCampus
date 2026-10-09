import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_ROOMS = [
  {
    id: 'B-204',
    roomNumber: 'B-204',
    name: 'Multi-Media Lecture Theatre',
    type: 'Lecture Theatres',
    building: 'Alan Turing Hall (Block A-01)',
    floor: 'Level 2',
    capacity: 60,
    currentOccupancy: 18,
    status: 'available',
    statusText: 'Open (Till 11:30 AM)',
    nextClass: 'CS-301 at 11:30 AM',
    co2: '410 ppm (Clean)',
    temperature: '21.8°C',
    wifiSpeed: '820 Mbps',
    features: ['Dual 4K Laser Projection + Spatial Rig', 'Motorized Lectern (USB-C TB4)', 'Wi-Fi 7 Campus Core AP', 'ADA Front Row & Hearing Loop', 'HVAC Air Flow Optimization'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEmMuzHefL5tPKAYOycYTHzeTmeXLCvOUJycvf6lKLZhRaijmgIjYzF1hLw60D3hqHGhdPnZ1fff6qM77Yyp1EJAoNuXTB1PtBLrsfrDG4u1qFZma4pY4yiVVO9_v8V1AvnxLEQ9qtnM7wC6GTZm7x7ducKf2QjEL___ep8BrPaHh1kd4IaP13sHCmBascN8Wc8XVSMBK0X6uJNDAC0B7CuHMvHv_2YwTB0o0ecM5L3a_lCyYlxPokGQ',
    has4kLaser: true,
    hasGpu: false,
    hasInteractive: true,
    isAda: true,
    routeSteps: [
      { step: '1. Cross Level 2 Skybridge', desc: 'Enter Alan Turing Hall through automatic glass doors (0m)' },
      { step: '2. Continue down North Main Corridor', desc: 'Walk straight past Restrooms and Lifts (25m)' },
      { step: '3. Turn Left at Student Lounge', desc: 'Follow the Blush illuminated pathway sign (15m)' },
      { step: '4. Arrive at Room B-204', desc: 'On your right side. Double acoustic doors with NFC lock (8m)' }
    ],
    routeDistance: '48 meters (1.2 min walk)'
  },
  {
    id: 'B-203',
    roomNumber: 'B-203',
    name: 'Distributed Systems Lab',
    type: 'Computer Labs',
    building: 'Alan Turing Hall (Block A-01)',
    floor: 'Level 2',
    capacity: 40,
    currentOccupancy: 10,
    status: 'available',
    statusText: 'Open Now',
    nextClass: 'Free access',
    co2: '425 ppm',
    temperature: '20.4°C',
    wifiSpeed: '950 Mbps',
    features: ['30x RTX 4090 AI Workstations', '10GbE Fiber Drop', 'Dual OLED Monitors', 'ADA Station #1', 'Smart Access Control'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    has4kLaser: false,
    hasGpu: true,
    hasInteractive: true,
    isAda: true,
    routeSteps: [
      { step: '1. Enter Level 2 Corridor', desc: 'From West Lift Bank (0m)' },
      { step: '2. Head West down Hallway', desc: 'Pass Amphitheatre entrance on left (30m)' },
      { step: '3. Arrive at Room B-203', desc: 'Door on the left (10m)' }
    ],
    routeDistance: '40 meters (1.0 min walk)'
  },
  {
    id: 'B-201',
    roomNumber: 'B-201',
    name: 'Large Amphitheatre',
    type: 'Lecture Theatres',
    building: 'Alan Turing Hall (Block A-01)',
    floor: 'Level 2',
    capacity: 120,
    currentOccupancy: 120,
    status: 'occupied',
    statusText: 'Occupied (CS-204 Algorithms)',
    nextClass: 'Free at 1:00 PM',
    co2: '510 ppm',
    temperature: '23.1°C',
    wifiSpeed: '650 Mbps',
    features: ['Tiered Acoustic Seating', 'Dual 4K Laser Projectors', 'Surround Broadcast Mics', 'ADA Hearing Loop'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    has4kLaser: true,
    hasGpu: false,
    hasInteractive: false,
    isAda: true,
    routeSteps: [
      { step: '1. Exit West Lifts', desc: 'Turn left into Main Concourse (5m)' },
      { step: '2. Arrive at Amphitheatre B-201', desc: 'Main double doors on south wall (15m)' }
    ],
    routeDistance: '20 meters (0.5 min walk)'
  },
  {
    id: 'B-202',
    roomNumber: 'B-202',
    name: 'Faculty Seminar Suite',
    type: 'Smart Classrooms',
    building: 'Alan Turing Hall (Block A-01)',
    floor: 'Level 2',
    capacity: 35,
    currentOccupancy: 35,
    status: 'reserved',
    statusText: 'Reserved (Faculty Council 2PM)',
    nextClass: 'Reserved for Council',
    co2: '390 ppm',
    temperature: '21.0°C',
    wifiSpeed: '780 Mbps',
    features: ['Interactive Smart Touchboard', 'Conference Telemetry Camera', 'Modular Glass Tables'],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80',
    has4kLaser: false,
    hasGpu: false,
    hasInteractive: true,
    isAda: false,
    routeSteps: [
      { step: '1. Exit East Lifts', desc: 'Turn right into East Corridor (5m)' },
      { step: '2. Arrive at B-202', desc: 'Glass entry door on right (12m)' }
    ],
    routeDistance: '17 meters (0.4 min walk)'
  },
  {
    id: 'B-205',
    roomNumber: 'B-205',
    name: 'AI & Robotics Lab',
    type: 'Computer Labs',
    building: 'Alan Turing Hall (Block A-01)',
    floor: 'Level 2',
    capacity: 28,
    currentOccupancy: 28,
    status: 'occupied',
    statusText: 'In Session (Autonomous Drones)',
    nextClass: 'Free at 4:00 PM',
    co2: '440 ppm',
    temperature: '22.0°C',
    wifiSpeed: '900 Mbps',
    features: ['AI Prototyping Clusters', 'Test Flight Cage', 'Soldering Stations', 'ADA Bench'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    has4kLaser: false,
    hasGpu: true,
    hasInteractive: true,
    isAda: true,
    routeSteps: [
      { step: '1. Main Concourse', desc: 'Walk past Student Lounge east (20m)' },
      { step: '2. Arrive at B-205', desc: 'Entry on south side (10m)' }
    ],
    routeDistance: '30 meters (0.8 min walk)'
  },
  {
    id: 'B-206',
    roomNumber: 'B-206',
    name: 'Silent Acoustic Study Pods',
    type: 'Study Pods',
    building: 'Alan Turing Hall (Block A-01)',
    floor: 'Level 2',
    capacity: 16,
    currentOccupancy: 12,
    status: 'available',
    statusText: '4 Pods Free',
    nextClass: 'Instant Tap-In',
    co2: '400 ppm',
    temperature: '21.5°C',
    wifiSpeed: '850 Mbps',
    features: ['16 Acoustic Pods', 'ANC Glass Enclosures', 'USB-C PD 100W Charging', 'Dimmable Warm LED'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    has4kLaser: false,
    hasGpu: false,
    hasInteractive: false,
    isAda: true,
    routeSteps: [
      { step: '1. East Corridor', desc: 'Walk straight past East Lifts (25m)' },
      { step: '2. Arrive at B-206 Pods', desc: 'Acoustic glass bay on south end (15m)' }
    ],
    routeDistance: '40 meters (1.0 min walk)'
  }
];

export function SmartRooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState(SAMPLE_ROOMS);
  const [selectedBuilding, setSelectedBuilding] = useState('Alan Turing Hall (Block A-01)');
  const [selectedFloor, setSelectedFloor] = useState('Level 2');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('B-204');
  const [activeFilters, setActiveFilters] = useState({
    availableNow: true,
    laser4k: false,
    gpuCluster: false,
    interactiveBoard: false,
    ada: false
  });
  const [startNode, setStartNode] = useState('Level 2 Skybridge Arrival (Connected to Library)');

  // Try to fetch backend live rooms if connected
  useEffect(() => {
    fetch('/api/v1/smartrooms/rooms')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Merge or supplement
        }
      })
      .catch(() => {
        // use sample fallback gracefully
      });
  }, []);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const handleToggleFilter = (key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredRooms = rooms.filter((r) => {
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

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Sub-Header / Campus Spatial Context Strip */}
      <div className="flex flex-col gap-space-sm pb-space-lg border-b border-outline-variant/20 mb-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-caption font-caption tracking-wider uppercase text-on-surface-variant">
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-semibold">CAD / BIM Mesh</span>
            <span>Oxford Brookes University • {selectedBuilding}</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-medium">{selectedFloor} Blueprint</span>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Telemetry Engine: Active Live Stream (Illustrative CAD)
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mt-2">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
              SmartRooms &amp; Indoor Wayfinding
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
              Real-time room availability, equipment telemetry, environmental sensors, and turn-by-turn vector navigation across academic blocks.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high flex flex-col min-w-[100px] border border-outline-variant/30">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Total Rooms</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">42</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high flex flex-col min-w-[100px] border border-primary/30">
              <span class="font-caption text-caption text-primary uppercase tracking-wider">Available</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">18</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high flex flex-col min-w-[100px] border border-outline-variant/30">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Lectures</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">14</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high flex flex-col min-w-[100px] border border-secondary/30">
              <span className="font-caption text-caption text-secondary uppercase tracking-wider">Reserved</span>
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Architectural Floor / Filter Controls Bar */}
      <div className="p-space-md rounded-2xl bg-surface-container-low mb-space-lg flex flex-col gap-space-md shadow-[0_2px_8px_rgba(0,0,0,0.35)] border border-outline-variant/20">
        {/* Top Row: Global Keyword Search & Building Picker */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
          <div className="md:col-span-7 lg:col-span-8 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">search</span>
            <input
              id="roomSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room code (e.g. B-204), equipment (4K Laser, RTX 4090), or seats..."
              className="w-full h-11 pl-11 pr-space-md rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container transition-all border border-outline-variant/30"
            />
          </div>
          <div className="md:col-span-5 lg:col-span-4 flex items-center gap-space-sm">
            <div className="relative w-full">
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="w-full h-11 pl-3.5 pr-8 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-outline-variant/30"
              >
                <option>Alan Turing Hall (Block A-01)</option>
                <option>Central Library &amp; Commons</option>
                <option>Ramanujan Science Complex</option>
                <option>Innovation &amp; Engineering Hub</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
        </div>

        {/* Middle Row: Floor Tabs & Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-2 border-t border-outline-variant/20">
          {/* Floor Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-surface-container-lowest rounded-xl overflow-x-auto border border-outline-variant/20">
            {['Ground', 'Level 1', 'Level 2', 'Level 3', 'Level 4'].map((fl) => {
              const isActive = selectedFloor.includes(fl);
              return (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {fl} {isActive ? '(Active)' : ''}
                </button>
              );
            })}
          </div>

          {/* Quick Room Types Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { label: 'All (42)', val: 'All' },
              { label: 'Lecture Theatres (6)', val: 'Lecture Theatres' },
              { label: 'Smart Classrooms (12)', val: 'Smart Classrooms' },
              { label: 'Computer Labs (8)', val: 'Computer Labs' },
              { label: 'Study Pods (10)', val: 'Study Pods' }
            ].map((tp) => (
              <button
                key={tp.val}
                onClick={() => setSelectedType(tp.val)}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === tp.val
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature / Hardware Chips Filter Multi-Select */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mr-1">Filter Tech:</span>

          <button
            onClick={() => handleToggleFilter('availableNow')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
              activeFilters.availableNow ? 'bg-primary/20 text-primary border border-primary/40 font-semibold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{activeFilters.availableNow ? 'check_circle' : 'circle'}</span>
            Available Now
          </button>

          <button
            onClick={() => handleToggleFilter('laser4k')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
              activeFilters.laser4k ? 'bg-primary/20 text-primary border border-primary/40 font-semibold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">videocam</span>
            4K Laser Projector
          </button>

          <button
            onClick={() => handleToggleFilter('gpuCluster')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
              activeFilters.gpuCluster ? 'bg-primary/20 text-primary border border-primary/40 font-semibold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">memory</span>
            GPU AI Cluster
          </button>

          <button
            onClick={() => handleToggleFilter('interactiveBoard')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
              activeFilters.interactiveBoard ? 'bg-primary/20 text-primary border border-primary/40 font-semibold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">draw</span>
            Interactive Board
          </button>

          <button
            onClick={() => handleToggleFilter('ada')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
              activeFilters.ada ? 'bg-primary/20 text-primary border border-primary/40 font-semibold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">accessible</span>
            ADA / Hearing Loop
          </button>
        </div>
      </div>

      {/* Primary Interactive Canvas: Split View Floor Plan & Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT / CENTER: Interactive BIM Floor Plan CAD Viewer */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          <div className="relative w-full rounded-2xl bg-surface-container-low overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.35)] border border-outline-variant/20">
            {/* Canvas Top Bar Navigation Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              {/* Active Path Breadcrumb Pill */}
              <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/90 backdrop-blur-md shadow-md text-on-surface font-label-sm text-label-sm border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                <span className="text-on-surface-variant">Active Route:</span>
                <span className="font-semibold text-primary">Library Skybridge Arrival</span>
                <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                <span className="font-bold text-on-surface">Room {selectedRoom.roomNumber}</span>
                <span className="text-on-surface-variant ml-1 font-mono text-caption">({selectedRoom.routeDistance})</span>
              </div>

              {/* Floor Viewport Manipulation Tools */}
              <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-surface/90 backdrop-blur-md shadow-md border border-outline-variant/30">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Zoom in">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Zoom out">
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Reset camera">
                  <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                </button>
                <div className="w-px h-4 bg-outline-variant/30 mx-0.5"></div>
                <button className="px-2 py-1 flex items-center gap-1 rounded-lg text-primary hover:bg-primary/10 transition-colors text-caption font-semibold" title="Toggle ADA accessible paths">
                  <span className="material-symbols-outlined text-[16px]">accessible</span>
                  Step-Free
                </button>
              </div>
            </div>

            {/* 2D Architectural CAD Plan Floor Rendering */}
            <div className="w-full h-[580px] bg-[#140f10] relative overflow-hidden select-none flex items-center justify-center">
              {/* Subtle Blueprint Coordinate Grid Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffb2bf" strokeWidth="0.5"></path>
                    <circle cx="0" cy="0" r="1" fill="#ffb2bf"></circle>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cadGrid)"></rect>
              </svg>

              {/* Architectural Plan Geometry */}
              <svg className="w-full h-full p-4 relative z-10 transition-transform duration-300" viewBox="0 0 960 620">
                {/* Outer Perimeter */}
                <polygon points="40,90 280,90 320,40 680,40 720,90 920,90 920,530 40,530" fill="#1b1517" stroke="#382e31" strokeWidth="6"></polygon>

                {/* Main Corridor Lines */}
                <path d="M 120,310 L 840,310" fill="none" stroke="#251e20" strokeWidth="64" strokeLinecap="round"></path>
                <path d="M 480,90 L 480,510" fill="none" stroke="#251e20" strokeWidth="56" strokeLinecap="round"></path>

                {/* Skybridge Arrival */}
                <rect x="420" y="10" width="120" height="70" rx="8" fill="#231c1e" stroke="#584144" strokeWidth="2"></rect>
                <text x="480" y="38" textAnchor="middle" fill="#ffdadb" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">NORTH SKYBRIDGE</text>
                <text x="480" y="54" textAnchor="middle" fill="#dfbfc3" fontFamily="Inter" fontSize="9">Conn: Central Library</text>
                <circle cx="480" cy="68" r="7" fill="#ffb1c2"></circle>
                <circle cx="480" cy="68" r="14" fill="#ffb1c2" fillOpacity="0.25" className="animate-ping"></circle>

                {/* Elevators */}
                <rect x="250" y="120" width="70" height="70" rx="6" fill="#282023" stroke="#504347" strokeWidth="1.5"></rect>
                <text x="285" y="152" textAnchor="middle" fill="#dfbfc3" fontFamily="Inter" fontSize="10" fontWeight="600">LIFTS W</text>
                <rect x="640" y="120" width="70" height="70" rx="6" fill="#282023" stroke="#504347" strokeWidth="1.5"></rect>
                <text x="675" y="152" textAnchor="middle" fill="#dfbfc3" fontFamily="Inter" fontSize="10" fontWeight="600">LIFTS E</text>

                {/* Restrooms */}
                <rect x="440" y="330" width="80" height="60" rx="6" fill="#231e1f" stroke="#504347" strokeWidth="1"></rect>
                <text x="480" y="358" textAnchor="middle" fill="#dfbfc3" fontFamily="Inter" fontSize="9" fontWeight="600">RESTROOMS</text>

                {/* ROOM B-201 */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoomId('B-201')}>
                  <rect
                    x="70"
                    y="120"
                    width="160"
                    height="150"
                    rx="10"
                    fill={selectedRoomId === 'B-201' ? '#311922' : '#271f21'}
                    stroke={selectedRoomId === 'B-201' ? '#eb638b' : '#48383c'}
                    strokeWidth={selectedRoomId === 'B-201' ? '2.5' : '2'}
                  ></rect>
                  <rect x="80" y="130" width="140" height="20" rx="4" fill="#382e31"></rect>
                  <text x="90" y="144" fill="#eae0e1" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">B-201 Amphitheatre</text>
                  <circle cx="210" cy="140" r="4" fill="#ffb4ab"></circle>
                  <text x="90" y="180" fill="#dfbfc3" fontFamily="Inter" fontSize="10">120 Seats • Occupied</text>
                  <text x="90" y="200" fill="#a68a8d" fontFamily="Inter" fontSize="9">CS-204 Algorithms</text>
                </g>

                {/* ROOM B-202 */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoomId('B-202')}>
                  <rect
                    x="730"
                    y="120"
                    width="160"
                    height="150"
                    rx="10"
                    fill={selectedRoomId === 'B-202' ? '#311922' : '#251d1f'}
                    stroke={selectedRoomId === 'B-202' ? '#eb638b' : '#48383c'}
                    strokeWidth={selectedRoomId === 'B-202' ? '2.5' : '2'}
                  ></rect>
                  <rect x="740" y="130" width="140" height="20" rx="4" fill="#382e31"></rect>
                  <text x="750" y="144" fill="#eae0e1" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">B-202 Seminar Suite</text>
                  <circle cx="870" cy="140" r="4" fill="#ffb1c2"></circle>
                  <text x="750" y="180" fill="#dfbfc3" fontFamily="Inter" fontSize="10">35 Seats • Reserved</text>
                </g>

                {/* ROOM B-203 */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoomId('B-203')}>
                  <rect
                    x="70"
                    y="340"
                    width="160"
                    height="160"
                    rx="10"
                    fill={selectedRoomId === 'B-203' ? '#311922' : '#211a1c'}
                    stroke={selectedRoomId === 'B-203' ? '#eb638b' : '#584144'}
                    strokeWidth={selectedRoomId === 'B-203' ? '2.5' : '2'}
                  ></rect>
                  <rect x="80" y="350" width="140" height="20" rx="4" fill="#382e31"></rect>
                  <text x="90" y="364" fill="#eae0e1" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">B-203 Systems Lab</text>
                  <circle cx="210" cy="360" r="4" fill="#ffb2bf"></circle>
                  <text x="90" y="400" fill="#dfbfc3" fontFamily="Inter" fontSize="10">40 Seats • Available</text>
                </g>

                {/* ROOM B-204 TARGET NODE */}
                <g className="cursor-pointer" onClick={() => setSelectedRoomId('B-204')}>
                  <rect
                    x="250"
                    y="340"
                    width="170"
                    height="160"
                    rx="12"
                    fill={selectedRoomId === 'B-204' ? '#311922' : '#271f21'}
                    stroke={selectedRoomId === 'B-204' ? '#eb638b' : '#584144'}
                    strokeWidth={selectedRoomId === 'B-204' ? '2.5' : '2'}
                  ></rect>
                  <rect x="260" y="350" width="150" height="24" rx="6" fill={selectedRoomId === 'B-204' ? '#ac274f' : '#382e31'}></rect>
                  <text x="272" y="366" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="800">B-204 Smart Theatre</text>
                  <circle cx="396" cy="362" r="5" fill="#ffd9de" className="animate-pulse"></circle>
                  <text x="272" y="402" fill="#ffdadb" fontFamily="Inter" fontSize="11" fontWeight="600">60 Seats • Available Now</text>
                  <text x="272" y="422" fill="#dfbfc3" fontFamily="Inter" fontSize="9">Dual 4K Laser + Spatial Pod</text>
                  {selectedRoomId === 'B-204' && (
                    <g transform="translate(320, 455)">
                      <rect x="-42" y="-14" width="84" height="20" rx="10" fill="#ac274f"></rect>
                      <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontSize="9" fontWeight="700">TARGET NODE</text>
                    </g>
                  )}
                </g>

                {/* ROOM B-205 */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoomId('B-205')}>
                  <rect
                    x="540"
                    y="340"
                    width="180"
                    height="160"
                    rx="10"
                    fill={selectedRoomId === 'B-205' ? '#311922' : '#251d1f'}
                    stroke={selectedRoomId === 'B-205' ? '#eb638b' : '#48383c'}
                    strokeWidth={selectedRoomId === 'B-205' ? '2.5' : '2'}
                  ></rect>
                  <rect x="550" y="350" width="160" height="20" rx="4" fill="#382e31"></rect>
                  <text x="560" y="364" fill="#eae0e1" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">B-205 AI &amp; Robotics</text>
                  <circle cx="695" cy="360" r="4" fill="#ffb4ab"></circle>
                  <text x="560" y="400" fill="#dfbfc3" fontFamily="Inter" fontSize="10">28 Seats • In Session</text>
                </g>

                {/* ROOM B-206 */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoomId('B-206')}>
                  <rect
                    x="740"
                    y="340"
                    width="150"
                    height="160"
                    rx="10"
                    fill={selectedRoomId === 'B-206' ? '#311922' : '#20181a'}
                    stroke={selectedRoomId === 'B-206' ? '#eb638b' : '#584144'}
                    strokeWidth={selectedRoomId === 'B-206' ? '2.5' : '2'}
                  ></rect>
                  <rect x="750" y="350" width="130" height="20" rx="4" fill="#382e31"></rect>
                  <text x="760" y="364" fill="#eae0e1" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">B-206 Study Pods</text>
                  <circle cx="865" cy="360" r="4" fill="#ffb2bf"></circle>
                  <text x="760" y="400" fill="#dfbfc3" fontFamily="Inter" fontSize="10">16 Pods • 4 Open</text>
                </g>

                {/* Emergency Stairs */}
                <rect x="42" y="500" width="60" height="26" fill="#1b1214" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="2 2"></rect>
                <text x="72" y="516" textAnchor="middle" fill="#ffb4ab" fontFamily="Inter" fontSize="8" fontWeight="700">EXIT A</text>
                <rect x="858" y="500" width="60" height="26" fill="#1b1214" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="2 2"></rect>
                <text x="888" y="516" textAnchor="middle" fill="#ffb4ab" fontFamily="Inter" fontSize="8" fontWeight="700">EXIT B</text>

                {/* Dynamic SVG Animated Route Path to Selected Room */}
                {selectedRoomId === 'B-204' && (
                  <path
                    d="M 480,72 L 480,310 L 335,310 L 335,340"
                    fill="none"
                    stroke="#eb638b"
                    strokeWidth="5"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[dash_1.5s_linear_infinite]"
                  ></path>
                )}
                {selectedRoomId === 'B-203' && (
                  <path
                    d="M 480,72 L 480,310 L 150,310 L 150,340"
                    fill="none"
                    stroke="#eb638b"
                    strokeWidth="5"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[dash_1.5s_linear_infinite]"
                  ></path>
                )}
                {selectedRoomId === 'B-205' && (
                  <path
                    d="M 480,72 L 480,310 L 630,310 L 630,340"
                    fill="none"
                    stroke="#eb638b"
                    strokeWidth="5"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[dash_1.5s_linear_infinite]"
                  ></path>
                )}
                {selectedRoomId === 'B-206' && (
                  <path
                    d="M 480,72 L 480,310 L 815,310 L 815,340"
                    fill="none"
                    stroke="#eb638b"
                    strokeWidth="5"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[dash_1.5s_linear_infinite]"
                  ></path>
                )}

                {/* Start Pulse Beacon */}
                <g transform="translate(480, 72)">
                  <circle cx="0" cy="0" r="6" fill="#ac274f"></circle>
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#ffb2bf" strokeWidth="1.5"></circle>
                  <text x="14" y="4" fill="#ffb2bf" fontFamily="Inter" fontSize="10" fontWeight="700">YOU (Skybridge)</text>
                </g>
              </svg>

              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -32; }
                }
              `}</style>

              {/* Floating Floor Plan Legend Card */}
              <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-surface/90 backdrop-blur-md text-on-surface shadow-lg z-20 flex flex-wrap items-center gap-3 font-caption text-caption border border-outline-variant/30">
                <span className="font-bold text-on-surface-variant uppercase tracking-wider">Legend:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">accessible</span>
                  <span>Accessible</span>
                </div>
              </div>

              {/* Route Status Pill */}
              <div className="absolute bottom-4 right-4 p-2.5 px-3 rounded-xl bg-surface/95 backdrop-blur-md shadow-lg z-20 flex items-center gap-2 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[18px]">directions_walk</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">{selectedRoom.routeDistance}</span>
                  <span className="font-caption text-caption text-on-surface-variant">Elevator-free direct path</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Room Carousel / Rapid Discovery Cards */}
          <div className="flex flex-col gap-space-sm pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md text-on-surface font-bold">Level 2 Key Spaces &amp; Live Telemetry</h3>
              <span className="font-caption text-caption text-on-surface-variant">Tap any card to inspect &amp; set route target</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {filteredRooms.slice(0, 3).map((r) => {
                const isSelected = r.id === selectedRoomId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoomId(r.id)}
                    className={`cursor-pointer p-space-md rounded-2xl flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-surface-container-high ring-2 ring-primary shadow-md'
                        : 'bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-md font-caption text-caption font-bold ${isSelected ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface'}`}>
                          {r.roomNumber}
                        </span>
                        <span className={`inline-flex items-center gap-1 font-caption text-caption font-semibold ${r.status === 'available' ? 'text-primary' : r.status === 'reserved' ? 'text-secondary' : 'text-error'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'available' ? 'bg-primary' : r.status === 'reserved' ? 'bg-secondary' : 'bg-error'}`}></span>
                          {r.statusText}
                        </span>
                      </div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface">{r.name}</h4>
                      <p className="font-caption text-caption text-on-surface-variant mt-1">
                        {r.capacity} Seats • {r.features[0]}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-outline-variant/20 flex items-center justify-between text-caption text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">air</span> {r.co2}
                      </span>
                      <span className={isSelected ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'}>
                        {isSelected ? 'Active Destination →' : 'Inspect Space →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Selected Room Deep-Dive & Wayfinding Inspector Drawer */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-[0_8px_24px_rgba(0,0,0,0.45)] flex flex-col gap-space-md border border-outline-variant/20">
            {/* Room Heading and Identification */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-caption font-caption text-primary uppercase font-bold tracking-wider">
                  <span>Block A-01</span>
                  <span>•</span>
                  <span>{selectedRoom.floor}</span>
                  <span>•</span>
                  <span>Sector North</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold mt-0.5" id="inspectorTitle">
                  Room {selectedRoom.roomNumber}: {selectedRoom.name}
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container text-caption font-bold shrink-0">Selected</span>
            </div>

            {/* Room Architectural & Real Interior Preview Image */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container-highest border border-outline-variant/30">
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-caption">
                <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-semibold">Interior Sensor Stream</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-primary font-mono font-medium">
                  Occupancy: {selectedRoom.currentOccupancy} / {selectedRoom.capacity}
                </span>
              </div>
            </div>

            {/* Dynamic Status & Capacity Metrics */}
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="p-3 rounded-xl bg-surface-container flex flex-col border border-outline-variant/20">
                <span className="font-caption text-caption text-on-surface-variant">Schedule Availability</span>
                <span className="font-label-md text-label-md font-bold text-primary mt-0.5">{selectedRoom.statusText}</span>
                <span className="font-caption text-caption text-on-surface-variant">Next: {selectedRoom.nextClass}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container flex flex-col border border-outline-variant/20">
                <span className="font-caption text-caption text-on-surface-variant">Seating Capacity</span>
                <span className="font-label-md text-label-md font-bold text-on-surface mt-0.5">
                  {selectedRoom.capacity} Desks ({Math.round((selectedRoom.currentOccupancy / selectedRoom.capacity) * 100)}% Load)
                </span>
                <span className="font-caption text-caption text-on-surface-variant">{selectedRoom.capacity - selectedRoom.currentOccupancy} Open Seats</span>
              </div>
            </div>

            {/* Facility & Hardware Checklist */}
            <div className="flex flex-col gap-2">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Hardware Telemetry &amp; IoT Controls</span>
              <div className="grid grid-cols-1 gap-1.5">
                {selectedRoom.features.map((feat, idx) => (
                  <div key={idx} className="p-2 px-3 rounded-lg bg-surface-container-lowest flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{feat}</span>
                    </div>
                    <span className="text-caption text-primary font-medium">Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Point Override Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Change Start Node (Departure)</label>
              <div className="relative w-full">
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-8 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-outline-variant/30"
                >
                  <option>Level 2 Skybridge Arrival (Connected to Library)</option>
                  <option>West Elevator Bank (Lifts 1-4)</option>
                  <option>East Elevator Bank (Lifts 5-8)</option>
                  <option>Ground Floor Main Atrium Stairs</option>
                  <option>Block B Corridor Connection</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Turn-by-Turn Indoor Directions Ribbon */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Step-by-Step Wayfinding Path</span>
              <div className="flex flex-col gap-2 relative pl-4 border-l-2 border-primary/30 ml-1">
                {selectedRoom.routeSteps.map((st, i) => (
                  <div key={i} className="flex flex-col">
                    <span className={`font-label-sm text-label-sm font-semibold ${i === selectedRoom.routeSteps.length - 1 ? 'text-primary font-bold' : 'text-on-surface'}`}>
                      {st.step}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">{st.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Wayfinding Action CTA Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => navigate('/campus-map')}
                className="w-full py-3 px-space-md rounded-xl bg-primary-container text-on-primary-container hover:opacity-95 active:scale-[0.99] font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(172,39,79,0.35)] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">navigation</span>
                <span>Open Full Navigation Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartRooms;
