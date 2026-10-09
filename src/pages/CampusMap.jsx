import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const CampusMap = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialBldg = searchParams.get('bldg') || 'turing';

  const [selectedBldg, setSelectedBldg] = useState(initialBldg);
  const [startPoint, setStartPoint] = useState('Central Library (East Entrance)');
  const [destination, setDestination] = useState('Alan Turing Hall — Room B-204');
  const [mobilityMode, setMobilityMode] = useState('walk'); // walk | wheelchair | shuttle
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState('F2');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Sync selected building when URL search params change
  useEffect(() => {
    const bldgFromUrl = searchParams.get('bldg');
    if (bldgFromUrl) {
      setSelectedBldg(bldgFromUrl);
      setDrawerOpen(true);
    }
  }, [searchParams]);

  const buildingData = {
    turing: {
      id: 'turing',
      name: 'Alan Turing Hall',
      block: 'Block A-01',
      dept: 'School of Computing & Cybernetics',
      code: 'BLK-A-L3',
      description: 'High-performance research facility, algorithmic labs, and tiered multi-media lecture halls B-201 to B-208.',
      occupancy: '68%',
      seats: '312 / 460 Seats',
      temp: '21.8°C',
      air: '410 ppm CO₂',
      accessibility: '2 Smart Lifts & Ramps',
      hours: '07:30 AM – 10:00 PM',
      targetRoom: 'Room B-204 (Level 2)',
      targetDesc: 'Distributed Computing Seminar Lab',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
      steps: [
        { num: 1, text: 'Depart Central Library East Gate', sub: 'Exit through double glass doors towards lawn', dist: '0 m' },
        { num: 2, text: 'Walk North past Fountain Plaza', sub: 'Follow tactile paved promenade path', dist: '120 m • 1.5 min' },
        { num: 3, text: 'Enter South Colonnade / Skybridge', sub: 'Use accessible automatic glass ramp doors', dist: '240 m • 3 min' },
        { num: 4, text: 'Arrive at Room B-204 (Floor 2)', sub: 'Destination on your left past elevator bank', dist: '320 m • Total 4 min' },
      ],
    },
    library: {
      id: 'library',
      name: 'Central Campus Library',
      block: 'Block B-02',
      dept: 'Digital Reference & Learning Commons',
      code: 'LIB-CENTRAL',
      description: 'Floor-by-floor quiet study pods, high-speed digital research terminals, reserve desks, and thesis archives.',
      occupancy: '42%',
      seats: '142 / 400 Seats',
      temp: '22.0°C',
      air: '390 ppm CO₂',
      accessibility: 'Full ADA Elevator & Braille',
      hours: 'Open 24/7 with Student ID',
      targetRoom: 'Quiet Pod 4B (Floor 2)',
      targetDesc: 'Group Collaboration Pod',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q',
      steps: [
        { num: 1, text: 'Current Location: Library Lobby', sub: 'Central Registration Desk', dist: '0 m' },
        { num: 2, text: 'Ascend Elevator to Floor 2', sub: 'West Wing Quiet Pod Corridor', dist: '40 m • 1 min' },
      ],
    },
    ramanujan: {
      id: 'ramanujan',
      name: 'Ramanujan Science Complex',
      block: 'Block C-03',
      dept: 'Department of Mathematics & Physics',
      code: 'SCI-RAM-03',
      description: 'Applied Physics laboratories, Computational Mathematics suites, and Nanotechnology prototyping cleanrooms.',
      occupancy: '55%',
      seats: '110 / 200 Seats',
      temp: '20.5°C',
      air: '400 ppm CO₂',
      accessibility: 'Elevators & Accessible Ramp',
      hours: '08:00 AM – 09:00 PM',
      targetRoom: 'Room S-108 (Level 1)',
      targetDesc: 'Linear Algebra & Neural Nets Lab',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnsBFmdYqr6jHc-tYoJj9aCEEbfKyFo5L3SLupQ0ikKDdXvkE8ZnSUMjdGmIop8z5KCO7QmVOsIqHy9HYbjtta90SqR4wGPlU-2wqtRGDiq5rUGxAyV903zRKjRYWmoztCiNad357-F5wzNP-stQIagLuV-V9RJTr5eWXoeezLsB_Qjl-q6e13GHym0Nopm46ykpFUvv08rbvxuEQW96J72Y2DHoTV7V4NV_eChXmGJjkKxk7Yk9JxWA',
      steps: [
        { num: 1, text: 'Depart Central Library Promenade', sub: 'Head East along Main Arterial Walkway', dist: '0 m' },
        { num: 2, text: 'Cross North Lawn Plaza', sub: 'Paved step-free pathway', dist: '200 m • 2.5 min' },
        { num: 3, text: 'Arrive at Ramanujan Entrance', sub: 'Room S-108 on Ground Floor Right', dist: '410 m • Total 5 min' },
      ],
    },
    robotics: {
      id: 'robotics',
      name: 'Robotics & AI Innovation Hub',
      block: 'Block D-04',
      dept: 'Autonomous Systems & Mechatronics',
      code: 'INN-HUB-01',
      description: 'Hardware prototyping garage, drone flight test chamber, quadruped robotics lab, and 3D printing suites.',
      occupancy: '72%',
      seats: '28 / 40 Workbenches',
      temp: '21.0°C',
      air: '420 ppm CO₂',
      accessibility: 'Ground Floor Direct Access',
      hours: '08:00 AM – 10:00 PM',
      targetRoom: 'Hardware Lab 4',
      targetDesc: 'Embedded IoT & Robotics Workbench #14',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1V6NaAN18Lf9daDEOiUCcg0Qz9TKAJTZEk9ECU3aySgNV_3O2hapiSnHSeUeScEXSjx47TLmk0cx0dsb_ZVA9EORszw3fNNN0V5EICouIgNfcs0lFyeVR0z0-fBJTvFLwabJeDl7KTSnD62my8TfA-M8AVfxPtiTO4SRRFQokqKIaWdLNfZtih4yUWkpusJLlN7f8edtZ98cv56xSSZJgS1akZwa_mq0qR3mAERMOY_rHpGJyiEVsGYmjpP',
      steps: [
        { num: 1, text: 'Depart Central Library East Gate', sub: 'Head East across North Quad', dist: '0 m' },
        { num: 2, text: 'Pass Ramanujan Science Complex', sub: 'Continue past Reflection Pond', dist: '350 m • 4 min' },
        { num: 3, text: 'Arrive at Innovation Hub Entrance', sub: 'Hardware Lab 4 Ground Floor', dist: '520 m • Total 6 min' },
      ],
    },
    sac: {
      id: 'sac',
      name: 'Student Activity Center (SAC)',
      block: 'Block SAC-01',
      dept: 'Student Union, Dining & Clubs',
      code: 'SAC-MAIN',
      description: 'Central campus dining hall, student council offices, medical dispensary, and event amphitheater.',
      occupancy: '80%',
      seats: '180 / 250 Seats',
      temp: '22.5°C',
      air: '430 ppm CO₂',
      accessibility: 'Full Wheelchair Ramp',
      hours: '07:00 AM – 11:00 PM',
      targetRoom: 'Central Commons Lounge',
      targetDesc: 'Student Union Lounge & Cafeteria',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
      steps: [
        { num: 1, text: 'Depart Library South Plaza', sub: 'Walk South along Main Promenade', dist: '0 m' },
        { num: 2, text: 'Arrive at SAC Main Arcade', sub: 'Ground floor dining entrance', dist: '220 m • 3 min' },
      ],
    },
  };

  const currentBldg = buildingData[selectedBldg] || buildingData.turing;

  const handleSelectBuilding = (id) => {
    setSelectedBldg(id);
    setDestination(`${buildingData[id]?.name} — ${buildingData[id]?.targetRoom}`);
    setDrawerOpen(true);
    setSearchParams({ bldg: id });
  };

  const handleSwapRoute = () => {
    const temp = startPoint;
    setStartPoint(destination);
    setDestination(temp);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: 'var(--bg-canvas)' }}>
      {/* TOP FLOATING WAYFINDING CONTROL BAR & FILTER CHIPS */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 40, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {/* Main Route Calculation Bar */}
        <div style={{ pointerEvents: 'auto', backgroundColor: 'rgba(35, 30, 31, 0.95)', backdropFilter: 'blur(16px)', padding: '12px 16px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-interactive)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          {/* Starting Point Input */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-subtle)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-accent)', marginRight: '10px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Starting Point</span>
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} title="Locate via GPS">
              <Compass size={14} />
              <span>GPS</span>
            </button>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapRoute}
            style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--brand-misty)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Swap Origin and Destination"
          >
            <RotateCcw size={16} />
          </button>

          {/* Destination Input */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-subtle)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-interactive)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', marginRight: '10px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-accent)', textTransform: 'uppercase' }}>Destination</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>

          {/* Mobility Mode Selectors */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setMobilityMode('walk')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: mobilityMode === 'walk' ? 'var(--brand-primary)' : 'transparent',
                color: '#FFFFFF',
              }}
            >
              Walk (4m)
            </button>
            <button
              onClick={() => setMobilityMode('wheelchair')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: mobilityMode === 'wheelchair' ? 'var(--brand-primary)' : 'transparent',
                color: '#FFFFFF',
              }}
            >
              Step-Free (5m)
            </button>
            <button
              onClick={() => setMobilityMode('shuttle')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: mobilityMode === 'shuttle' ? 'var(--brand-primary)' : 'transparent',
                color: '#FFFFFF',
              }}
            >
              EV Shuttle (2m)
            </button>
          </div>

          <Button variant="primary" icon={Navigation} onClick={() => setDrawerOpen(true)}>
            Start Nav
          </Button>
        </div>

        {/* Facility Category Filter Chips */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: categoryFilter === 'all' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            All Facilities (48)
          </button>
          <button
            onClick={() => setCategoryFilter('academic')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: categoryFilter === 'academic' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Academic Blocks (14)
          </button>
          <button
            onClick={() => setCategoryFilter('laboratories')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: categoryFilter === 'laboratories' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Laboratories (9)
          </button>
          <button
            onClick={() => setCategoryFilter('libraries')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: categoryFilter === 'libraries' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Libraries (3)
          </button>
        </div>
      </div>

      {/* MAP SVG CANVAS */}
      <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#141011' }}>
        <svg width="100%" height="100%" viewBox="0 0 1600 1000" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}>
          <defs>
            <pattern id="campusGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 217, 218, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1600" height="1000" fill="#141011" />
          <rect width="1600" height="1000" fill="url(#campusGridPattern)" />

          {/* Green Lawns */}
          <path d="M 50,40 L 450,20 L 520,240 L 80,300 Z" fill="#161c18" opacity="0.8" />
          <path d="M 550,280 L 1050,260 L 1080,560 L 520,580 Z" fill="#161c18" opacity="0.9" />

          {/* Reflection Pond */}
          <ellipse cx="800" cy="420" rx="90" ry="45" fill="#1c2530" />
          <circle cx="800" cy="420" r="4" fill="#EB638B" />

          {/* Roadways */}
          <path d="M -20,180 L 480,180 L 820,120 L 1620,130" stroke="#262022" strokeWidth="26" strokeLinecap="round" />
          <path d="M 480,180 L 480,820 L 1620,840" stroke="#262022" strokeWidth="26" strokeLinecap="round" />

          {/* Walkways */}
          <path d="M 280,340 L 520,340 L 710,420 L 890,420 L 1050,340 L 1240,340" stroke="#383335" strokeWidth="10" strokeLinecap="round" />

          {/* Skybridge Path */}
          <line x1="390" y1="460" x2="680" y2="340" stroke="#AC274F" strokeWidth="6" strokeDasharray="6 6" />

          {/* ANIMATED WAYFINDING ROUTE PATH */}
          <path d="M 380,480 L 520,480 L 610,420 L 710,420 L 750,340" stroke="#EB638B" strokeWidth="6" fill="none" strokeDasharray="8 6" />

          {/* Interactive Buildings */}
          {/* 1. Central Library */}
          <g onClick={() => handleSelectBuilding('library')} style={{ cursor: 'pointer' }}>
            <rect x="200" y="420" width="180" height="150" rx="10" fill={selectedBldg === 'library' ? '#AC274F' : '#383335'} stroke={selectedBldg === 'library' ? '#EB638B' : 'rgba(255, 217, 218, 0.1)'} strokeWidth="2" />
            <text x="290" y="495" fill="#FFFFFF" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="Plus Jakarta Sans">Central Library</text>
            <text x="290" y="515" fill="#FFD9DA" fontSize="11" textAnchor="middle">Origin (East Entrance)</text>
          </g>

          {/* 2. Alan Turing Hall */}
          <g onClick={() => handleSelectBuilding('turing')} style={{ cursor: 'pointer' }}>
            <rect x="680" y="190" width="240" height="150" rx="12" fill={selectedBldg === 'turing' ? '#AC274F' : '#383335'} stroke={selectedBldg === 'turing' ? '#EB638B' : 'rgba(255, 217, 218, 0.1)'} strokeWidth="2" />
            <text x="800" y="260" fill="#FFFFFF" fontSize="16" textAnchor="middle" fontWeight="bold" fontFamily="Plus Jakarta Sans">Alan Turing Hall</text>
            <text x="800" y="280" fill="#FFD9DA" fontSize="12" textAnchor="middle">Academic Block A • Selected</text>
          </g>

          {/* 3. Ramanujan Science */}
          <g onClick={() => handleSelectBuilding('ramanujan')} style={{ cursor: 'pointer' }}>
            <rect x="1140" y="180" width="210" height="160" rx="10" fill={selectedBldg === 'ramanujan' ? '#AC274F' : '#383335'} stroke={selectedBldg === 'ramanujan' ? '#EB638B' : 'rgba(255, 217, 218, 0.1)'} strokeWidth="2" />
            <text x="1245" y="255" fill="#FFFFFF" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="Plus Jakarta Sans">Ramanujan Science</text>
            <text x="1245" y="275" fill="#D6C4C8" fontSize="11" textAnchor="middle">Science & Math Labs</text>
          </g>

          {/* 4. Student Activity Center */}
          <g onClick={() => handleSelectBuilding('sac')} style={{ cursor: 'pointer' }}>
            <rect x="700" y="630" width="220" height="140" rx="12" fill={selectedBldg === 'sac' ? '#AC274F' : '#383335'} stroke={selectedBldg === 'sac' ? '#EB638B' : 'rgba(255, 217, 218, 0.1)'} strokeWidth="2" />
            <text x="810" y="695" fill="#FFFFFF" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="Plus Jakarta Sans">Student Activity Center</text>
            <text x="810" y="715" fill="#D6C4C8" fontSize="11" textAnchor="middle">Union & Cafeteria</text>
          </g>

          {/* 5. Innovation & Robotics Hub */}
          <g onClick={() => handleSelectBuilding('robotics')} style={{ cursor: 'pointer' }}>
            <rect x="1160" y="450" width="190" height="130" rx="8" fill={selectedBldg === 'robotics' ? '#AC274F' : '#383335'} stroke={selectedBldg === 'robotics' ? '#EB638B' : 'rgba(255, 217, 218, 0.1)'} strokeWidth="2" />
            <text x="1255" y="510" fill="#FFFFFF" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="Plus Jakarta Sans">Robotics & AI Hub</text>
            <text x="1255" y="530" fill="#D6C4C8" fontSize="11" textAnchor="middle">Hardware Garage</text>
          </g>

          {/* Destination Pin Marker */}
          <g transform="translate(750, 340)">
            <circle cx="0" cy="0" r="16" fill="rgba(172, 39, 79, 0.4)" />
            <circle cx="0" cy="0" r="8" fill="#EB638B" />
          </g>
        </svg>

        {/* MAP CONTROLS (Top & Bottom Right) */}
        <div style={{ position: 'absolute', top: '100px', right: '16px', zIndex: 30, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* 2D/3D Mode Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(30, 25, 26, 0.9)', color: '#FFF', border: '1px solid var(--border-interactive)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
          >
            {is3DMode ? '3D Isometric' : '2D Tactical'}
          </button>

          {/* Level Floor Switcher */}
          <div style={{ backgroundColor: 'rgba(30, 25, 26, 0.9)', padding: '6px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LVL</span>
            {['R', 'F3', 'F2', 'F1', 'G'].map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: selectedFloor === fl ? 'var(--brand-primary)' : 'transparent',
                  color: selectedFloor === fl ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div style={{ position: 'absolute', bottom: '24px', right: '16px', zIndex: 30, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--brand-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* FLOATING ROUTE GUIDANCE HUD (Bottom Center) */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            backgroundColor: 'rgba(30, 25, 26, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '10px 20px',
            borderRadius: '9999px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-interactive)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            maxWidth: '90%',
          }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
              In 120m, cross Central Quad colonnade towards {currentBldg.name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Approaching {currentBldg.name} • South Skybridge Entrance
            </span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px', fontSize: '14px', fontWeight: 800, color: 'var(--brand-accent)' }}>
            4 min
          </div>
        </div>
      </div>

      {/* SELECTED BUILDING & LOCATION DETAIL PANEL (Side Drawer) */}
      {drawerOpen && (
        <aside
          style={{
            position: 'absolute',
            top: '90px',
            bottom: '24px',
            right: '16px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: 'rgba(35, 30, 31, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-interactive)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header Banner */}
          <div style={{ position: 'relative', height: '160px', width: '100%' }}>
            <img src={currentBldg.image} alt={currentBldg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-surface) 0%, transparent 80%)' }} />

            <button
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
              <Badge status="active">{currentBldg.hours}</Badge>
            </div>
          </div>

          {/* Drawer Body */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-accent)', textTransform: 'uppercase' }}>
                {currentBldg.dept}
              </span>
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: '4px 0 6px 0' }}>{currentBldg.name}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{currentBldg.description}</p>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Density</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-accent)' }}>{currentBldg.occupancy}</div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.seats}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HVAC</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{currentBldg.temp}</div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.air}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ADA</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-misty)' }}>Pass</div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Ramps & Lifts</span>
              </div>
            </div>

            {/* Target Room Banner */}
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Target: {currentBldg.targetRoom}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{currentBldg.targetDesc}</div>
            </div>

            {/* Turn-by-Turn Steps */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-misty)', textTransform: 'uppercase' }}>Turn-by-Turn Steps</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {currentBldg.steps.map((st) => (
                  <div key={st.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#FFF', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                      {st.num}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>{st.text}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.sub}</div>
                      <span style={{ fontSize: '10px', color: 'var(--brand-accent)' }}>{st.dist}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
            <Button
              variant="secondary"
              style={{ flex: 1 }}
              onClick={() => navigate(`/directory?building=${currentBldg.id}`)}
              icon={ExternalLink}
            >
              Directory Info
            </Button>
            <Button variant="primary" style={{ flex: 1 }} icon={Navigation} onClick={() => setDrawerOpen(false)}>
              Start Guidance
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default CampusMap;
