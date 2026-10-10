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
  Edit3,
  Save,
  Trash2,
  Crosshair,
  Move,
  ShieldCheck,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const INITIAL_BUILDINGS = {
  turing: {
    id: 'turing',
    code: 'A-01',
    name: 'Alan Turing Hall',
    block: 'Block A-01',
    dept: 'School of Computing & Cybernetics',
    category: 'academic',
    x: 680,
    y: 190,
    width: 240,
    height: 150,
    description: 'High-performance research facility, algorithmic labs, and tiered multi-media lecture halls B-201 to B-208.',
    occupancy: '68%',
    seats: '312 / 460 Seats',
    temp: '21.8°C',
    air: '410 ppm CO₂',
    accessibility: '2 Smart Lifts & Ramps',
    hours: '07:30 AM – 10:00 PM',
    status: 'open',
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
    code: 'B-02',
    name: 'Central Campus Library',
    block: 'Block B-02',
    dept: 'Digital Reference & Learning Commons',
    category: 'libraries',
    x: 200,
    y: 420,
    width: 180,
    height: 150,
    description: 'Floor-by-floor quiet study pods, high-speed digital research terminals, reserve desks, and thesis archives.',
    occupancy: '42%',
    seats: '142 / 400 Seats',
    temp: '22.0°C',
    air: '390 ppm CO₂',
    accessibility: 'Full ADA Elevator & Braille',
    hours: 'Open 24/7 with Student ID',
    status: 'open',
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
    code: 'C-03',
    name: 'Ramanujan Science Complex',
    block: 'Block C-03',
    dept: 'Department of Mathematics & Physics',
    category: 'academic',
    x: 1140,
    y: 180,
    width: 210,
    height: 160,
    description: 'Applied Physics laboratories, Computational Mathematics suites, and Nanotechnology prototyping cleanrooms.',
    occupancy: '55%',
    seats: '110 / 200 Seats',
    temp: '20.5°C',
    air: '400 ppm CO₂',
    accessibility: 'Elevators & Accessible Ramp',
    hours: '08:00 AM – 09:00 PM',
    status: 'open',
    targetRoom: 'Room S-108 (Level 1)',
    targetDesc: 'Linear Algebra & Neural Nets Lab',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnsBFmdYqr6jHc-tYoJj9aCEEbfKyFo5L3SLupQ0ikKDdXvkE8ZnSUMjdGmIop8z5KCO7QmVOsIqHy9HYbjtta90SqR4wGPlU-2wqtRGDiq5rUGxAyV903zRKjRYWmoztCiNad357-F5wzNP-stQIagLuV-V9RJTr5eWXoeezLsB_Qjl-q6e13GHym0Nopm46ykpFUvv08rbvxuEQW96J72Y2DHoTV7V4NV_eChXmGJjkKxk7Yk9JxWA',
    steps: [
      { num: 1, text: 'Depart Central Library Promenade', sub: 'Head East along Main Arterial Walkway', dist: '0 m' },
      { num: 2, text: 'Cross North Lawn Plaza', sub: 'Paved step-free pathway', dist: '200 m • 2.5 min' },
      { num: 3, text: 'Arrive at Ramanujan Entrance', sub: 'Room S-108 on Ground Floor Right', dist: '410 m • Total 5 min' },
    ],
  },
  sac: {
    id: 'sac',
    code: 'D-04',
    name: 'Student Activity Center (SAC)',
    block: 'Block SAC-01',
    dept: 'Student Union, Dining & Clubs',
    category: 'facility',
    x: 700,
    y: 630,
    width: 220,
    height: 140,
    description: 'Central campus dining hall, student council offices, medical dispensary, and event amphitheater.',
    occupancy: '80%',
    seats: '180 / 250 Seats',
    temp: '22.5°C',
    air: '430 ppm CO₂',
    accessibility: 'Full Wheelchair Ramp',
    hours: '07:00 AM – 11:00 PM',
    status: 'open',
    targetRoom: 'Central Commons Lounge',
    targetDesc: 'Student Union Lounge & Cafeteria',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ',
    steps: [
      { num: 1, text: 'Depart Library South Plaza', sub: 'Walk South along Main Promenade', dist: '0 m' },
      { num: 2, text: 'Arrive at SAC Main Arcade', sub: 'Ground floor dining entrance', dist: '220 m • 3 min' },
    ],
  },
  robotics: {
    id: 'robotics',
    code: 'INN-HUB-01',
    name: 'Robotics & AI Innovation Hub',
    block: 'Block D-04',
    dept: 'Autonomous Systems & Mechatronics',
    category: 'laboratories',
    x: 1160,
    y: 450,
    width: 190,
    height: 130,
    description: 'Hardware prototyping garage, drone flight test chamber, quadruped robotics lab, and 3D printing suites.',
    occupancy: '72%',
    seats: '28 / 40 Workbenches',
    temp: '21.0°C',
    air: '420 ppm CO₂',
    accessibility: 'Ground Floor Direct Access',
    hours: '08:00 AM – 10:00 PM',
    status: 'open',
    targetRoom: 'Hardware Lab 4',
    targetDesc: 'Embedded IoT & Robotics Workbench #14',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1V6NaAN18Lf9daDEOiUCcg0Qz9TKAJTZEk9ECU3aySgNV_3O2hapiSnHSeUeScEXSjx47TLmk0cx0dsb_ZVA9EORszw3fNNN0V5EICouIgNfcs0lFyeVR0z0-fBJTvFLwabJeDl7KTSnD62my8TfA-M8AVfxPtiTO4SRRFQokqKIaWdLNfZtih4yUWkpusJLlN7f8edtZ98cv56xSSZJgS1akZwa_mq0qR3mAERMOY_rHpGJyiEVsGYmjpP',
    steps: [
      { num: 1, text: 'Depart Central Library East Gate', sub: 'Head East across North Quad', dist: '0 m' },
      { num: 2, text: 'Pass Ramanujan Science Complex', sub: 'Continue past Reflection Pond', dist: '350 m • 4 min' },
      { num: 3, text: 'Arrive at Innovation Hub Entrance', sub: 'Hardware Lab 4 Ground Floor', dist: '520 m • Total 6 min' },
    ],
  },
};

export const CampusMap = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'care_admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialBldg = searchParams.get('bldg') || 'turing';

  // Spatial data state
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [selectedBldg, setSelectedBldg] = useState(initialBldg);
  const [startPoint, setStartPoint] = useState('Central Library (East Entrance)');
  const [destination, setDestination] = useState('Alan Turing Hall — Room B-204');
  const [mobilityMode, setMobilityMode] = useState('walk'); // walk | wheelchair | shuttle
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState('F2');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(true);

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
      setDrawerOpen(true);
    }
  }, [searchParams, buildings]);

  // Fetch live GIS buildings from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/campus/locations');
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBuildings((prev) => {
            const updated = { ...prev };
            res.data.forEach((loc) => {
              const slug = loc.code ? loc.code.toLowerCase().replace(/[^a-z0-9]/g, '') : loc._id;
              const matchKey = Object.keys(updated).find(
                (k) => updated[k].code?.toUpperCase() === loc.code?.toUpperCase() || k === slug
              );
              const key = matchKey || slug;
              updated[key] = {
                ...updated[key],
                id: key,
                _id: loc._id,
                code: loc.code || updated[key]?.code || 'BLD',
                name: loc.name || updated[key]?.name,
                block: loc.precinct || updated[key]?.block || 'Central Precinct',
                dept: (Array.isArray(loc.departments) ? loc.departments.join(', ') : loc.departments) || updated[key]?.dept || 'Department of Instruction',
                category: loc.category || updated[key]?.category || 'academic',
                x: loc.coordinates?.x ?? updated[key]?.x ?? 600,
                y: loc.coordinates?.y ?? updated[key]?.y ?? 400,
                width: updated[key]?.width || 210,
                height: updated[key]?.height || 140,
                description: loc.description || updated[key]?.description || 'Campus Academic Facility',
                hours: loc.openingHours || updated[key]?.hours || '08:00 AM – 09:00 PM',
                status: loc.status || updated[key]?.status || 'open',
                occupancy: updated[key]?.occupancy || `${loc.loadPercentage || 65}%`,
                seats: updated[key]?.seats || '150 / 200 Seats',
                temp: updated[key]?.temp || '21.5°C',
                air: updated[key]?.air || '410 ppm CO₂',
                accessibility: updated[key]?.accessibility || 'Step-Free Ramp & Lifts',
                targetRoom: updated[key]?.targetRoom || 'Room 101',
                targetDesc: updated[key]?.targetDesc || 'Main Lecture Hall',
                image: loc.image || updated[key]?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
                steps: updated[key]?.steps || [
                  { num: 1, text: 'Depart Central Library East Gate', sub: 'Walk towards Campus North Promenade', dist: '0 m' },
                  { num: 2, text: `Arrive at ${loc.name}`, sub: 'Main Entrance Lobby', dist: '250 m • 3 min' },
                ],
              };
            });
            return updated;
          });
        }
      } catch (err) {
        console.warn('[CampusMap] Live GIS sync notice:', err.message);
      }
    };
    fetchLocations();
  }, []);

  // Show temporary toast message
  const triggerToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3500);
  };

  const currentBldg = buildings[selectedBldg] || buildings.turing || Object.values(buildings)[0];

  const handleSelectBuilding = (id) => {
    if (!buildings[id]) return;
    setSelectedBldg(id);
    setDestination(`${buildings[id].name} — ${buildings[id].targetRoom || 'Main Entrance'}`);
    setDrawerOpen(true);
    setSearchParams({ bldg: id });
  };

  const handleSwapRoute = () => {
    const temp = startPoint;
    setStartPoint(destination);
    setDestination(temp);
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

    // Sync to backend if location has an ID/code
    try {
      await api.put(`/campus/locations/${bldg._id || bldg.code || selectedBldg}`, {
        coordinates: { x: newX, y: newY, floor: selectedFloor },
      });
    } catch (e) {
      // Local state is already updated
    }
  };

  // Handle map click for click-to-reposition
  const handleSvgMapClick = async (e) => {
    if (!isAdmin || !adminMapMode || !isClickToPlace) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    const newX = Math.round(svgPoint.x - (currentBldg.width || 200) / 2);
    const newY = Math.round(svgPoint.y - (currentBldg.height || 140) / 2);

    setBuildings((prev) => ({
      ...prev,
      [selectedBldg]: {
        ...prev[selectedBldg],
        x: newX,
        y: newY,
      },
    }));

    setIsClickToPlace(false);
    triggerToast(`Repositioned ${currentBldg.name} to (X: ${newX}, Y: ${newY})`);

    try {
      await api.put(`/campus/locations/${currentBldg._id || currentBldg.code || selectedBldg}`, {
        coordinates: { x: newX, y: newY, floor: selectedFloor },
      });
    } catch (err) {
      console.warn('GIS coordinate sync fallback');
    }
  };

  // Open Edit Modal for current building
  const handleOpenEditModal = () => {
    setEditFormData({
      name: currentBldg.name || '',
      code: currentBldg.code || '',
      category: currentBldg.category || 'academic',
      dept: currentBldg.dept || '',
      description: currentBldg.description || '',
      x: currentBldg.x || 700,
      y: currentBldg.y || 300,
      width: currentBldg.width || 220,
      height: currentBldg.height || 140,
      hours: currentBldg.hours || '',
      occupancy: currentBldg.occupancy || '',
      targetRoom: currentBldg.targetRoom || '',
      targetDesc: currentBldg.targetDesc || '',
    });
    setShowEditModal(true);
  };

  // Save edited building
  const handleSaveBuildingEdits = async (e) => {
    e.preventDefault();
    setIsSavingGis(true);

    const updatedBldg = {
      ...currentBldg,
      name: editFormData.name,
      code: editFormData.code,
      category: editFormData.category,
      dept: editFormData.dept,
      description: editFormData.description,
      x: Number(editFormData.x),
      y: Number(editFormData.y),
      width: Number(editFormData.width),
      height: Number(editFormData.height),
      hours: editFormData.hours,
      occupancy: editFormData.occupancy,
      targetRoom: editFormData.targetRoom,
      targetDesc: editFormData.targetDesc,
    };

    setBuildings((prev) => ({
      ...prev,
      [selectedBldg]: updatedBldg,
    }));

    try {
      await api.put(`/campus/locations/${currentBldg._id || currentBldg.code || selectedBldg}`, {
        name: editFormData.name,
        code: editFormData.code,
        category: editFormData.category,
        departments: editFormData.dept,
        description: editFormData.description,
        openingHours: editFormData.hours,
        coordinates: { x: Number(editFormData.x), y: Number(editFormData.y), floor: selectedFloor },
      });
      triggerToast(`Saved GIS updates for ${editFormData.name} successfully!`);
    } catch (err) {
      triggerToast(`Saved updates locally for ${editFormData.name}.`);
    } finally {
      setIsSavingGis(false);
      setShowEditModal(false);
    }
  };

  // Create new facility on map
  const handleCreateNewBuilding = async (e) => {
    e.preventDefault();
    if (!newBldgForm.name || !newBldgForm.code) return;

    setIsSavingGis(true);
    const slug = newBldgForm.code.toLowerCase().replace(/[^a-z0-9]/g, '') || `bldg_${Date.now()}`;

    const newBuildingObj = {
      id: slug,
      code: newBldgForm.code,
      name: newBldgForm.name,
      block: `Block ${newBldgForm.code}`,
      dept: newBldgForm.dept || 'Academic Department',
      category: newBldgForm.category,
      x: Number(newBldgForm.x) || 500,
      y: Number(newBldgForm.y) || 400,
      width: Number(newBldgForm.width) || 200,
      height: Number(newBldgForm.height) || 140,
      description: newBldgForm.description || 'Newly registered campus facility.',
      occupancy: '40%',
      seats: '120 Seats',
      temp: '22.0°C',
      air: '400 ppm CO₂',
      accessibility: 'Step-Free Ramp & Lifts',
      hours: newBldgForm.hours || '08:00 AM – 09:00 PM',
      status: 'open',
      targetRoom: 'Main Reception (Level 1)',
      targetDesc: 'Facility Administrative Portal',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
      steps: [
        { num: 1, text: 'Depart Central Library East Gate', sub: 'Walk North across Campus Quad', dist: '0 m' },
        { num: 2, text: `Arrive at ${newBldgForm.name}`, sub: 'Main Entrance Arcade', dist: '280 m • 3.5 min' },
      ],
    };

    setBuildings((prev) => ({
      ...prev,
      [slug]: newBuildingObj,
    }));
    setSelectedBldg(slug);

    try {
      await api.post('/campus/locations', {
        name: newBldgForm.name,
        code: newBldgForm.code,
        category: newBldgForm.category,
        departments: newBldgForm.dept,
        description: newBldgForm.description,
        openingHours: newBldgForm.hours,
        coordinates: { x: Number(newBldgForm.x), y: Number(newBldgForm.y), floor: 'Level 1' },
      });
      triggerToast(`Created new facility ${newBldgForm.name} on map!`);
    } catch (err) {
      triggerToast(`Added ${newBldgForm.name} to campus map view.`);
    } finally {
      setIsSavingGis(false);
      setShowAddModal(false);
      setNewBldgForm({
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
    }
  };

  // Delete facility from map
  const handleDeleteBuilding = async () => {
    if (!window.confirm(`Are you sure you want to remove "${currentBldg.name}" from the campus map?`)) return;

    try {
      await api.delete(`/campus/locations/${currentBldg._id || currentBldg.code || selectedBldg}`);
    } catch (err) {
      console.warn('GIS delete fallback');
    }

    setBuildings((prev) => {
      const copy = { ...prev };
      delete copy[selectedBldg];
      return copy;
    });

    const remainingKeys = Object.keys(buildings).filter((k) => k !== selectedBldg);
    if (remainingKeys.length > 0) {
      setSelectedBldg(remainingKeys[0]);
    }
    setShowEditModal(false);
    triggerToast(`Removed facility from map.`);
  };

  // Filter buildings list
  const filteredBuildingList = Object.values(buildings).filter((b) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'academic') return b.category === 'academic';
    if (categoryFilter === 'laboratories') return b.category === 'laboratories' || b.category === 'lab';
    if (categoryFilter === 'libraries') return b.category === 'libraries' || b.category === 'library';
    if (categoryFilter === 'facility') return b.category === 'facility' || b.category === 'facilities';
    return true;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: 'var(--bg-canvas)' }}>
      {/* TOAST NOTIFICATION */}
      {adminToast && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            backgroundColor: 'rgba(235, 99, 139, 0.95)',
            color: '#FFFFFF',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{adminToast}</span>
        </div>
      )}

      {/* TOP FLOATING WAYFINDING CONTROL BAR & FILTER CHIPS */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 40, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {/* Main Route Calculation Bar */}
        <div style={{ pointerEvents: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(16px)', padding: '12px 16px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          {/* Starting Point Input */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-subtle)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-accent)', marginRight: '10px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Starting Point</span>
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }} title="Locate via GPS">
              <Compass size={14} />
              <span>GPS</span>
            </button>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapRoute}
            style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Swap Origin and Destination"
          >
            <RotateCcw size={16} />
          </button>

          {/* Destination Input */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-subtle)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-interactive)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', marginRight: '10px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Destination</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>

          {/* Mobility Mode Selectors */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
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
                color: mobilityMode === 'walk' ? '#FFFFFF' : 'var(--text-secondary)',
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
                color: mobilityMode === 'wheelchair' ? '#FFFFFF' : 'var(--text-secondary)',
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
                color: mobilityMode === 'shuttle' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              EV Shuttle (2m)
            </button>
          </div>

          <Button variant="primary" icon={Navigation} onClick={() => setDrawerOpen(true)}>
            Start Nav
          </Button>
        </div>

        {/* Facility Category Filter Chips + Admin Control Toolbar */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setCategoryFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: categoryFilter === 'all' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: categoryFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              All Facilities ({Object.keys(buildings).length})
            </button>
            <button
              onClick={() => setCategoryFilter('academic')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: categoryFilter === 'academic' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: categoryFilter === 'academic' ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Academic Blocks
            </button>
            <button
              onClick={() => setCategoryFilter('laboratories')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: categoryFilter === 'laboratories' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: categoryFilter === 'laboratories' ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Laboratories
            </button>
            <button
              onClick={() => setCategoryFilter('libraries')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: categoryFilter === 'libraries' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: categoryFilter === 'libraries' ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Libraries
            </button>
          </div>

          {/* ADMIN EXCLUSIVE MAP CONTROLS BAR */}
          {isAdmin && (
            <div
              style={{
                backgroundColor: 'rgba(30, 25, 26, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '6px 12px',
                borderRadius: '9999px',
                border: '1px solid var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px', borderRight: '1px solid var(--border-subtle)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--brand-accent)' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-misty)', textTransform: 'uppercase' }}>Admin GIS</span>
              </div>

              {/* Mode Toggle */}
              <button
                onClick={() => setAdminMapMode(!adminMapMode)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: adminMapMode ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)',
                  color: '#FFFFFF',
                }}
              >
                {adminMapMode ? 'Editor Active' : 'Enable Editor'}
              </button>

              {adminMapMode && (
                <>
                  {/* Click to Reposition Toggle */}
                  <button
                    onClick={() => {
                      setIsClickToPlace(!isClickToPlace);
                      triggerToast(!isClickToPlace ? `Click on the map to place "${currentBldg.name}"` : 'Reposition mode off');
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-interactive)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: isClickToPlace ? 'var(--brand-accent)' : 'var(--bg-surface)',
                      color: isClickToPlace ? '#1E191A' : '#FFFFFF',
                    }}
                    title="Click anywhere on map to reposition selected building"
                  >
                    <Crosshair size={13} />
                    <span>{isClickToPlace ? 'Click Map Now' : 'Click-to-Move'}</span>
                  </button>

                  {/* Nudge Arrow Controls */}
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '2px 4px', borderRadius: '6px' }}>
                    <button
                      onClick={() => handleNudgeBuilding(-20, 0)}
                      style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px' }}
                      title="Nudge Left 20px"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      onClick={() => handleNudgeBuilding(0, -20)}
                      style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px' }}
                      title="Nudge Up 20px"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleNudgeBuilding(0, 20)}
                      style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px' }}
                      title="Nudge Down 20px"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleNudgeBuilding(20, 0)}
                      style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px' }}
                      title="Nudge Right 20px"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Edit Building Details Button */}
                  <button
                    onClick={handleOpenEditModal}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'var(--brand-accent)',
                      color: '#1E191A',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Edit Info</span>
                  </button>

                  {/* Add New Facility Button */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#2E7D32',
                      color: '#FFFFFF',
                    }}
                  >
                    <Plus size={13} />
                    <span>+ Add Facility</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAP SVG CANVAS */}
      <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'var(--bg-canvas)', cursor: isClickToPlace ? 'crosshair' : 'default' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1600 1000"
          onClick={handleSvgMapClick}
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
          <path d="M 50,40 L 450,20 L 520,240 L 80,300 Z" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1.5" opacity="0.9" />
          <path d="M 550,280 L 1050,260 L 1080,560 L 520,580 Z" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1.5" opacity="0.9" />

          {/* Reflection Pond */}
          <ellipse cx="800" cy="420" rx="90" ry="45" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="2" />
          <circle cx="800" cy="420" r="4" fill="#0284C7" />

          {/* Roadways */}
          <path d="M -20,180 L 480,180 L 820,120 L 1620,130" stroke="#E2E8F0" strokeWidth="24" strokeLinecap="round" />
          <path d="M 480,180 L 480,820 L 1620,840" stroke="#E2E8F0" strokeWidth="24" strokeLinecap="round" />

          {/* Walkways */}
          <path d="M 280,340 L 520,340 L 710,420 L 890,420 L 1050,340 L 1240,340" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />

          {/* Skybridge Path */}
          <line x1="390" y1="460" x2="680" y2="340" stroke="var(--brand-primary)" strokeWidth="6" strokeDasharray="6 6" />

          {/* ANIMATED WAYFINDING ROUTE PATH */}
          <path d="M 380,480 L 520,480 L 610,420 L 710,420 L 750,340" stroke="var(--brand-accent)" strokeWidth="6" fill="none" strokeDasharray="8 6" />

          {/* DYNAMICALLY RENDERED INTERACTIVE BUILDINGS */}
          {filteredBuildingList.map((bldg) => {
            const isSelected = selectedBldg === bldg.id;
            const w = bldg.width || 210;
            const h = bldg.height || 140;
            const cx = bldg.x + w / 2;
            const cy = bldg.y + h / 2;

            return (
              <g
                key={bldg.id}
                onClick={(e) => {
                  if (isClickToPlace) return; // handled by svg click
                  e.stopPropagation();
                  handleSelectBuilding(bldg.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Active Selection Glow Ring */}
                {isSelected && (
                  <rect
                    x={bldg.x - 6}
                    y={bldg.y - 6}
                    width={w + 12}
                    height={h + 12}
                    rx="14"
                    fill="none"
                    stroke="var(--brand-accent)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    opacity="0.9"
                  />
                )}

                {/* Building Body Rectangle */}
                <rect
                  x={bldg.x}
                  y={bldg.y}
                  width={w}
                  height={h}
                  rx="10"
                  fill={isSelected ? 'var(--brand-primary)' : '#FFFFFF'}
                  stroke={isSelected ? 'var(--brand-accent)' : 'var(--border-interactive)'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Building Title */}
                <text
                  x={cx}
                  y={cy - 10}
                  fill={isSelected ? '#FFFFFF' : 'var(--text-primary)'}
                  fontSize="14"
                  textAnchor="middle"
                  fontWeight="bold"
                  fontFamily="Plus Jakarta Sans"
                >
                  {bldg.name}
                </text>

                {/* Subtitle / Department / Code */}
                <text
                  x={cx}
                  y={cy + 12}
                  fill={isSelected ? 'var(--brand-soft-bg)' : 'var(--text-secondary)'}
                  fontSize="11"
                  textAnchor="middle"
                >
                  {bldg.block || bldg.code} {isSelected ? '• Selected' : ''}
                </text>

                {/* Category Pill */}
                <text
                  x={cx}
                  y={cy + 28}
                  fill={isSelected ? '#FFFFFF' : 'var(--brand-primary)'}
                  fontSize="9.5"
                  textAnchor="middle"
                  textTransform="uppercase"
                  fontWeight="700"
                >
                  {bldg.category}
                </text>

                {/* Admin Mode Badge on marker */}
                {isAdmin && adminMapMode && (
                  <g transform={`translate(${bldg.x + w - 16}, ${bldg.y + 16})`}>
                    <circle cx="0" cy="0" r="9" fill="var(--brand-accent)" />
                    <text x="0" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                      GIS
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Destination Pin Marker on Selected Building */}
          {currentBldg && (
            <g transform={`translate(${currentBldg.x + (currentBldg.width || 210) / 2}, ${currentBldg.y})`}>
              <circle cx="0" cy="-14" r="14" fill="rgba(225, 29, 72, 0.25)" />
              <circle cx="0" cy="-14" r="7" fill="var(--brand-accent)" />
              <path d="M -4,-14 L 0,0 L 4,-14 Z" fill="var(--brand-accent)" />
            </g>
          )}
        </svg>

        {/* MAP CONTROLS (Top & Bottom Right) */}
        <div style={{ position: 'absolute', top: '100px', right: '16px', zIndex: 30, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* 2D/3D Mode Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-interactive)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
          >
            {is3DMode ? '3D Isometric' : '2D Tactical'}
          </button>

          {/* Level Floor Switcher */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '6px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
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
            style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--brand-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
            title="Reset Zoom"
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '10px 20px',
            borderRadius: '9999px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              In 120m, cross Central Quad colonnade towards {currentBldg?.name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Approaching {currentBldg?.name} • Coordinates: ({currentBldg?.x}, {currentBldg?.y})
            </span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px', fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)' }}>
            4 min
          </div>
        </div>
      </div>

      {/* SELECTED BUILDING & LOCATION DETAIL PANEL (Side Drawer) */}
      {drawerOpen && currentBldg && (
        <aside
          style={{
            position: 'absolute',
            top: '90px',
            bottom: '24px',
            right: '16px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-subtle)',
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
              style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', gap: '8px' }}>
              <Badge status="active">{currentBldg.hours}</Badge>
              {isAdmin && <span style={{ fontSize: '10px', background: 'var(--brand-soft-bg)', border: '1px solid #FECDD3', padding: '2px 8px', borderRadius: '4px', color: 'var(--brand-primary)', fontWeight: 700 }}>X:{currentBldg.x} Y:{currentBldg.y}</span>}
            </div>
          </div>

          {/* Drawer Body */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                  {currentBldg.dept}
                </span>
                {isAdmin && (
                  <button
                    onClick={handleOpenEditModal}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '4px 0 6px 0' }}>{currentBldg.name}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{currentBldg.description}</p>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Density</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-accent)' }}>{currentBldg.occupancy}</div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.seats}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HVAC</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentBldg.temp}</div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{currentBldg.air}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ADA</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>Pass</div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Ramps & Lifts</span>
              </div>
            </div>

            {/* Target Room Banner */}
            <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Target: {currentBldg.targetRoom}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{currentBldg.targetDesc}</div>
            </div>

            {/* Turn-by-Turn Steps */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Turn-by-Turn Steps</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {currentBldg.steps && currentBldg.steps.map((st) => (
                  <div key={st.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#FFF', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {st.num}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{st.text}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{st.sub}</div>
                      <span style={{ fontSize: '10px', color: 'var(--brand-accent)', fontWeight: 600 }}>{st.dist}</span>
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

      {/* ADMIN MODAL: EDIT BUILDING DETAILS & MAP COORDINATES */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={18} style={{ color: 'var(--brand-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Edit Campus Facility &amp; Map Coordinates</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBuildingEdits} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '75vh', overflowY: 'auto' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Building Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Facility Code</label>
                  <input
                    type="text"
                    required
                    value={editFormData.code}
                    onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  >
                    <option value="academic">Academic Block</option>
                    <option value="laboratories">Laboratories</option>
                    <option value="libraries">Libraries</option>
                    <option value="facility">Campus Facility</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Department / Precinct</label>
                <input
                  type="text"
                  value={editFormData.dept}
                  onChange={(e) => setEditFormData({ ...editFormData, dept: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Description</label>
                <textarea
                  rows="2"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              {/* Coordinates & Map Placement */}
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Map SVG Coordinates &amp; Box Size
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>X (Left)</label>
                    <input
                      type="number"
                      value={editFormData.x}
                      onChange={(e) => setEditFormData({ ...editFormData, x: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Y (Top)</label>
                    <input
                      type="number"
                      value={editFormData.y}
                      onChange={(e) => setEditFormData({ ...editFormData, y: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Width</label>
                    <input
                      type="number"
                      value={editFormData.width}
                      onChange={(e) => setEditFormData({ ...editFormData, width: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Height</label>
                    <input
                      type="number"
                      value={editFormData.height}
                      onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Operating Hours</label>
                  <input
                    type="text"
                    value={editFormData.hours}
                    onChange={(e) => setEditFormData({ ...editFormData, hours: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Target Room</label>
                  <input
                    type="text"
                    value={editFormData.targetRoom}
                    onChange={(e) => setEditFormData({ ...editFormData, targetRoom: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={handleDeleteBuilding}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  <Trash2 size={15} />
                  <span>Remove Facility</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" icon={Save} type="submit" disabled={isSavingGis}>
                    {isSavingGis ? 'Saving GIS...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL: ADD NEW FACILITY TO CAMPUS MAP */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={18} style={{ color: '#16A34A' }} />
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Register New Facility on Campus Map</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewBuilding} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bio-Tech Research Complex"
                  value={newBldgForm.name}
                  onChange={(e) => setNewBldgForm({ ...newBldgForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Building Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. E-05"
                    value={newBldgForm.code}
                    onChange={(e) => setNewBldgForm({ ...newBldgForm, code: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Category</label>
                  <select
                    value={newBldgForm.category}
                    onChange={(e) => setNewBldgForm({ ...newBldgForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  >
                    <option value="academic">Academic Block</option>
                    <option value="laboratories">Laboratories</option>
                    <option value="libraries">Libraries</option>
                    <option value="facility">Campus Facility</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Map X Position</label>
                  <input
                    type="number"
                    value={newBldgForm.x}
                    onChange={(e) => setNewBldgForm({ ...newBldgForm, x: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Map Y Position</label>
                  <input
                    type="number"
                    value={newBldgForm.y}
                    onChange={(e) => setNewBldgForm({ ...newBldgForm, y: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Department</label>
                <input
                  type="text"
                  placeholder="e.g. School of Biological & Chemical Sciences"
                  value={newBldgForm.dept}
                  onChange={(e) => setNewBldgForm({ ...newBldgForm, dept: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-interactive)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" icon={Plus} type="submit" disabled={isSavingGis}>
                  {isSavingGis ? 'Placing Facility...' : 'Place on Map'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMap;
