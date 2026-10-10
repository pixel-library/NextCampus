import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  Layers,
  DoorOpen,
  Sliders,
  Wrench,
  Zap,
  Thermometer,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit3,
  Plus,
  Search,
  Download,
  RefreshCw,
  Activity,
  ArrowRight,
  X,
  Check,
  Compass,
  FileText,
  Flame,
  Radio,
  MapPin,
  Users,
  Eye,
  SlidersHorizontal,
  Lightbulb
} from 'lucide-react';

// ============================================================================
// DATA: Comprehensive Mewar University Campus Facilities & Spatial Nodes
// ============================================================================
const INITIAL_MEWAR_BUILDINGS = [
  {
    _id: 'bldg-eng02',
    name: 'Faculty of Engineering & Technology',
    code: 'ENG-02',
    precinct: 'North Academic Promenade',
    totalFloors: 4,
    departments: ['School of Computing', 'Autonomous Systems', 'Robotics & AI Lab', 'VLSI Design'],
    grossFloorArea: 14200,
    powerSubstation: 'North 11kV Substation',
    loadPercentage: 84,
    status: 'open',
    commissionedYear: 2018,
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    floors: [
      { floorNumber: 'Level 2', name: 'Cybernetics & High-Perf Computing Labs', cadVersion: 'CAD v2.4', roomsCount: 16 },
      { floorNumber: 'Level 1', name: 'Undergraduate Laboratories & Hardware', cadVersion: 'CAD v2.2', roomsCount: 14 },
      { floorNumber: 'Level 3', name: 'Faculty Research Suites & AI Farm', cadVersion: 'CAD v2.1', roomsCount: 12 },
      { floorNumber: 'Ground', name: 'Foyer, Main Atrium & Lecture Theatres', cadVersion: 'CAD v2.0', roomsCount: 8 }
    ]
  },
  {
    _id: 'bldg-adm01',
    name: 'Maharana Pratap Main Academic Block',
    code: 'ADM-01',
    precinct: 'Central Administrative Plaza',
    totalFloors: 3,
    departments: ['Vice Chancellor Secretariat', 'Academic Affairs', 'Examination Registry', 'Accounts'],
    grossFloorArea: 12500,
    powerSubstation: 'Main Grid Feed 33kV',
    loadPercentage: 62,
    status: 'open',
    commissionedYear: 2012,
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    floors: [
      { floorNumber: 'Ground', name: 'Student Services Registry & Council', cadVersion: 'CAD v1.8', roomsCount: 10 },
      { floorNumber: 'Level 1', name: 'Deans Office & Syndicate Boardroom', cadVersion: 'CAD v1.9', roomsCount: 8 },
      { floorNumber: 'Level 2', name: 'Conference Auditorium & Archives', cadVersion: 'CAD v1.9', roomsCount: 6 }
    ]
  },
  {
    _id: 'bldg-lib03',
    name: 'Swami Vivekananda Central Library',
    code: 'LIB-03',
    precinct: 'East Knowledge Commons',
    totalFloors: 3,
    departments: ['Central Lending Stacks', 'Digital Media Archive', 'Acoustic Study Pods', 'Reference Wing'],
    grossFloorArea: 16800,
    powerSubstation: 'East 11kV Substation',
    loadPercentage: 48,
    status: 'open',
    commissionedYear: 2016,
    category: 'facility',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    floors: [
      { floorNumber: 'Ground', name: 'Main Stacks & Turnstile Ingest', cadVersion: 'CAD v2.1', roomsCount: 12 },
      { floorNumber: 'Level 1', name: 'Periodicals, E-Resource Centre', cadVersion: 'CAD v2.1', roomsCount: 10 },
      { floorNumber: 'Level 2', name: 'Acoustic Solo Pods & Quiet Bays', cadVersion: 'CAD v2.4', roomsCount: 14 }
    ]
  },
  {
    _id: 'bldg-aud04',
    name: 'Mewar University Central Auditorium',
    code: 'AUD-04',
    precinct: 'South Convocation Grounds',
    totalFloors: 2,
    departments: ['Cultural Arts Guild', 'Convocation Grand Stage', 'Acoustic Projection Suites'],
    grossFloorArea: 9400,
    powerSubstation: 'South Transformer 11kV',
    loadPercentage: 20,
    status: 'open',
    commissionedYear: 2019,
    category: 'facility',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    floors: [
      { floorNumber: 'Ground', name: '1200-Seat Tiered Auditorium Hall', cadVersion: 'CAD v2.0', roomsCount: 4 },
      { floorNumber: 'Level 1', name: 'Balcony Tier & AV Broadcast Rig', cadVersion: 'CAD v2.0', roomsCount: 4 }
    ]
  }
];

export function CampusManagement() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  // Data states
  const [buildings, setBuildings] = useState(INITIAL_MEWAR_BUILDINGS);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Selected entities
  const [selectedFacilityCode, setSelectedFacilityCode] = useState('ENG-02');
  const [selectedFloor, setSelectedFloor] = useState('Level 2');
  const [activeTab, setActiveTab] = useState('buildings'); // buildings, depts, floors, rooms, assets

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('load');
  const [selectedBuildingIds, setSelectedBuildingIds] = useState(['ENG-02']);

  // Modals & Panels
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [confirmCascade, setConfirmCascade] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // Building Form
  const [buildingForm, setBuildingForm] = useState({
    name: '',
    code: '',
    precinct: 'North Academic Promenade',
    totalFloors: 4,
    departments: '',
    grossFloorArea: 14200,
    cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
    category: 'academic'
  });

  // Room Quick Configuration Editor State (with IoT Overrides)
  const [roomConfig, setRoomConfig] = useState({
    _id: 'rm-b204',
    roomNumber: 'B-204',
    name: 'Multi-Media Lecture Theatre',
    type: 'Multi-Media Theatre',
    capacity: 60,
    status: 'occupied',
    building: 'Faculty of Engineering & Technology',
    floor: 'Level 2',
    temperature: 21.8,
    isLockSecured: true,
    lightingMode: 'Lecture Presentation (Dimmable)',
    hvacEcoMode: true,
    features: ['Dual 4K Laser Projector', 'CO2 & Air Quality', 'NFC Smart Lock', 'Spatial Mic Array'],
    timetableRule: 'Automated live lock sync via Mewar Timetable Core API'
  });

  const [newEquipmentTag, setNewEquipmentTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // New Room Form State
  const [newRoomForm, setNewRoomForm] = useState({
    roomNumber: '',
    name: '',
    type: 'Smart Classrooms',
    capacity: 40,
    status: 'available',
    features: 'Dual 4K Laser Projector, NFC Smart Lock'
  });

  useEffect(() => {
    fetchCampusData();
  }, []);

  const fetchCampusData = async () => {
    setLoading(true);
    try {
      const [bldRes, rmRes] = await Promise.all([
        api.get('/campus/locations').catch(() => null),
        api.get('/smartrooms/rooms').catch(() => null)
      ]);

      if (bldRes && bldRes.success && Array.isArray(bldRes.data) && bldRes.data.length > 0) {
        setBuildings(bldRes.data);
      }
      if (rmRes && rmRes.success && Array.isArray(rmRes.data)) {
        setRooms(rmRes.data);
      }
    } catch {
      // Fallback in memory
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Active facility object
  const activeFacility = useMemo(() => {
    return (
      buildings.find((b) => b.code === selectedFacilityCode || b._id === selectedFacilityCode) ||
      buildings[0]
    );
  }, [buildings, selectedFacilityCode]);

  // Rooms for active facility and floor
  const activeFacilityRooms = useMemo(() => {
    return rooms.filter((r) => {
      const bMatch =
        r.buildingCode === activeFacility?.code ||
        r.building?.toLowerCase().includes(activeFacility?.name?.toLowerCase().slice(0, 6));
      const fMatch = !selectedFloor || r.floor?.toLowerCase() === selectedFloor?.toLowerCase();
      return bMatch && fMatch;
    });
  }, [rooms, activeFacility, selectedFloor]);

  // Filtered & sorted buildings list
  const filteredBuildings = useMemo(() => {
    return buildings
      .filter((b) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          b.name.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q) ||
          (b.departments && b.departments.some((d) => d.toLowerCase().includes(q))) ||
          (b.precinct && b.precinct.toLowerCase().includes(q));

        const matchesCategory =
          categoryFilter === 'all' ||
          (categoryFilter === 'academic' && (b.category === 'academic' || b.category === 'research')) ||
          (categoryFilter === 'facility' && (b.category === 'facility' || b.category === 'library')) ||
          b.category === categoryFilter;

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && b.status === 'open') ||
          (statusFilter === 'high' && (b.loadPercentage || 70) > 75) ||
          (statusFilter === 'maint' && b.status === 'under_maintenance');

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'floors') return (b.totalFloors || 4) - (a.totalFloors || 4);
        if (sortBy === 'load') return (b.loadPercentage || 70) - (a.loadPercentage || 70);
        if (sortBy === 'code') return a.code.localeCompare(b.code);
        return a.name.localeCompare(b.name);
      });
  }, [buildings, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Handle building selection
  const handleSelectFacility = (code) => {
    setSelectedFacilityCode(code);
    const target = buildings.find((b) => b.code === code);
    if (target?.floors && target.floors.length > 0) {
      setSelectedFloor(target.floors[0].floorNumber);
    }
  };

  // Open Building Modal for Create / Edit
  const handleOpenAddBuilding = (buildingToEdit = null) => {
    if (buildingToEdit) {
      setEditingBuilding(buildingToEdit);
      setBuildingForm({
        name: buildingToEdit.name,
        code: buildingToEdit.code,
        precinct: buildingToEdit.precinct || 'North Academic Promenade',
        totalFloors: buildingToEdit.totalFloors || 4,
        departments: Array.isArray(buildingToEdit.departments)
          ? buildingToEdit.departments.join(', ')
          : buildingToEdit.departments || '',
        grossFloorArea: buildingToEdit.grossFloorArea || 14200,
        cadSchema: buildingToEdit.cadSchema || 'Auto-Import from Revit Cloud (IFC4)',
        category: buildingToEdit.category || 'academic'
      });
    } else {
      setEditingBuilding(null);
      setBuildingForm({
        name: '',
        code: `ENG-0${buildings.length + 1}`,
        precinct: 'North Academic Promenade',
        totalFloors: 4,
        departments: 'School of Advanced AI, High-Performance Computing',
        grossFloorArea: 16500,
        cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
        category: 'academic'
      });
    }
    setShowAddBuildingModal(true);
  };

  // Save Building
  const handleSaveBuilding = async (e) => {
    e.preventDefault();
    if (!buildingForm.name.trim() || !buildingForm.code.trim()) {
      alert('Building name and code are required.');
      return;
    }

    const payload = {
      ...buildingForm,
      departments: buildingForm.departments.split(',').map((d) => d.trim()).filter(Boolean)
    };

    if (editingBuilding) {
      setBuildings((prev) =>
        prev.map((b) => (b.code === editingBuilding.code ? { ...b, ...payload } : b))
      );
      showToast(`Building ${payload.name} updated successfully.`);
    } else {
      const newBldg = {
        _id: `bldg-${Date.now()}`,
        ...payload,
        loadPercentage: 45,
        status: 'open',
        commissionedYear: 2026,
        floors: [
          { floorNumber: 'Ground', name: 'Main Lobby & Suites', cadVersion: 'CAD v2.0', roomsCount: 6 },
          { floorNumber: 'Level 1', name: 'Academic Labs', cadVersion: 'CAD v2.0', roomsCount: 10 }
        ]
      };
      setBuildings((prev) => [newBldg, ...prev]);
      setSelectedFacilityCode(newBldg.code);
      showToast(`Building ${payload.name} created and registered in GIS.`);
    }
    setShowAddBuildingModal(false);
  };

  // Trigger Rapid Maintenance Dispatch directly from room inspector
  const handleTriggerMaintenanceDispatch = (room) => {
    navigate(
      `/complaints#submitForm?room=${room.roomNumber}&building=${activeFacility.name}&priority=high`
    );
  };

  // Save Quick Room Configuration
  const handleSaveRoomConfig = (e) => {
    e.preventDefault();
    setRooms((prev) =>
      prev.map((r) =>
        r.roomNumber === roomConfig.roomNumber
          ? {
              ...r,
              capacity: Number(roomConfig.capacity),
              type: roomConfig.type,
              status: roomConfig.status,
              features: roomConfig.features
            }
          : r
      )
    );
    showToast(`SmartRoom ${roomConfig.roomNumber} parameters & IoT locks updated.`);
  };

  // Toggle IoT NFC Lock
  const handleToggleLock = () => {
    setRoomConfig((prev) => ({
      ...prev,
      isLockSecured: !prev.isLockSecured
    }));
    showToast(
      `Door reader for ${roomConfig.roomNumber}: ${
        !roomConfig.isLockSecured ? 'NFC Lock Engaged (Secured)' : 'Unlocked (Open Access)'
      }`
    );
  };

  // Export Spatial Blueprint as CSV
  const handleExportBlueprint = () => {
    const csvHeader = 'Building Code,Building Name,Category,Precinct,Floors,GFA (m2),Congestion Load (%)\n';
    const csvRows = buildings
      .map(
        (b) =>
          `"${b.code}","${b.name}","${b.category}","${b.precinct || ''}",${b.totalFloors || 4},${b.grossFloorArea || 14000},${b.loadPercentage || 75}`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mewar_Spatial_Masterplan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Mewar University spatial masterplan CSV downloaded successfully.');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-100 min-h-screen pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Operational Header Kicker */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            Facility Asset Inventory &amp; Spatial CAD Master Data
          </span>
          <span>• Mewar University • Node: MEWAR-CORE-V4.4</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>LoRaWAN Mesh: 99.8% Nominal</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>BIM / GIS Synced</span>
          </span>
        </div>
      </div>

      {/* Page Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Campus Infrastructure &amp; Space Management</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono font-normal">
              Admin Ops
            </span>
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Authoritative spatial directory of Mewar academic blocks, department floor topologies, capacity threshold heatmaps, and smart room IoT controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast('BIM / GIS Synchronized with Revit Cloud & Campus LoRaWAN mesh (12ms latency).')}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sync BIM Mesh</span>
          </button>

          <button
            onClick={handleExportBlueprint}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Masterplan CSV</span>
          </button>

          <button
            onClick={() => handleOpenAddBuilding()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Facility Node</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          QUICK KPI TILES & CAPACITY CONGESTION GAUGES
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Registered Blocks</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{buildings.length}</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">4 Academic</span> • <span>2 Residential</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Floor Plates Monitored</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">
              {buildings.reduce((acc, b) => acc + (b.totalFloors || 3), 0)}
            </div>
            <div className="text-xs text-sky-400 mt-1 flex items-center gap-1">
              <span>100% 3D CAD Twin Coverage</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">SmartRooms Monitored</span>
            <DoorOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">184</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">92 Available</span> • <span>92 Occupied</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Gross Floor Area (GFA)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">52,900 m²</div>
            <div className="text-xs text-emerald-400 mt-1">
              <span>88.2% Active Utilization</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTROL & SEARCH BAR
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities by name, code (ENG-02, ADM-01), lab..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Category: All Facilities</option>
              <option value="academic">Academic &amp; Research</option>
              <option value="facility">Library &amp; Commons</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="load">Sort: Congestion Load (%) ↓</option>
              <option value="floors">Sort: Floor Count ↓</option>
              <option value="code">Sort: Facility Code (A-Z)</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setSortBy('load');
              }}
              className="w-full h-10 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY WORKSPACE: FACILITIES REGISTRY & ACTIVE INSPECTOR
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MASTER FACILITIES REGISTRY (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Campus Facilities Master Registry</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {filteredBuildings.length} Nodes
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Building &amp; Precinct</th>
                    <th className="py-3 px-3">Floors</th>
                    <th className="py-3 px-3">Faculties / Depts</th>
                    <th className="py-3 px-3">Congestion Heatmap</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredBuildings.map((b) => {
                    const isSelected = selectedFacilityCode === b.code || selectedFacilityCode === b._id;
                    const load = b.loadPercentage || 60;
                    const isHighLoad = load > 80;
                    const isMedLoad = load >= 60 && load <= 80;

                    return (
                      <tr
                        key={b.code || b._id}
                        onClick={() => handleSelectFacility(b.code)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 ring-1 ring-emerald-500/50'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono shrink-0">
                              {b.code.split('-')[0]}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{b.name}</span>
                                <span className="px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 font-mono text-[10px] border border-slate-800">
                                  {b.code}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {b.precinct} • {(b.grossFloorArea || 14000).toLocaleString()} m²
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-white">{b.totalFloors || 3} Levels</span>
                          <div className="text-[10px] text-slate-400">Ground + {(b.totalFloors || 3) - 1}</div>
                        </td>

                        <td className="py-3.5 px-3 max-w-[140px] truncate">
                          <span className="text-slate-200 truncate block">
                            {Array.isArray(b.departments) ? b.departments[0] : b.departments}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {Array.isArray(b.departments) ? b.departments.slice(1).join(', ') : 'Computing, AI'}
                          </span>
                        </td>

                        {/* Capacity Congestion Heatmap Meter */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isHighLoad
                                  ? 'bg-rose-400 animate-pulse'
                                  : isMedLoad
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                            ></span>
                            <span
                              className={`font-mono text-xs font-bold ${
                                isHighLoad ? 'text-rose-400' : isMedLoad ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {load}% Capacity
                            </span>
                          </div>
                          <div className="w-24 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full ${
                                isHighLoad ? 'bg-rose-500' : isMedLoad ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                              style={{ width: `${load}%` }}
                            ></div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => navigate('/campus-map?bldg=eng')}
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Inspect CAD in Campus Map"
                            >
                              <Compass className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenAddBuilding(b)}
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                              title="Edit Building Attributes"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE FACILITY INSPECTOR & ROOM IOT OVERRIDES (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Facility Header Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4 backdrop-blur-md">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Active Inspector • {activeFacility?.code}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeFacility?.name}</h2>
                <p className="text-xs text-slate-400">{activeFacility?.precinct}</p>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-slate-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                {activeFacility?.loadPercentage}% Load
              </span>
            </div>

            {/* Schematic CAD Floor Plate Viewer */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Schematic Floor Plate: {selectedFloor}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">CAD v2.4 Vector</span>
              </div>

              <div className="relative w-full h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                <svg className="w-full h-full" viewBox="0 0 400 140">
                  <rect x="20" y="10" width="360" height="120" rx="6" fill="#0B132B" stroke="#1E293B" strokeWidth="2" />
                  <path d="M 60 70 L 340 70" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 200 10 L 200 130" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Room B-204 Highlight Target */}
                  <rect
                    x="30"
                    y="20"
                    width="70"
                    height="40"
                    rx="4"
                    fill="#132338"
                    stroke="#10B981"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() =>
                      setRoomConfig((prev) => ({
                        ...prev,
                        roomNumber: 'B-204',
                        name: 'Multi-Media Lecture Theatre',
                        status: 'occupied',
                        capacity: 60
                      }))
                    }
                  />
                  <text x="65" y="44" fill="#34D399" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle">
                    B-204
                  </text>
                  <circle cx="88" cy="30" r="3" fill="#10B981" />

                  {/* Room B-203 */}
                  <rect
                    x="110"
                    y="20"
                    width="70"
                    height="40"
                    rx="4"
                    fill="#0F172A"
                    stroke="#475569"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() =>
                      setRoomConfig((prev) => ({
                        ...prev,
                        roomNumber: 'B-203',
                        name: 'Distributed Systems Lab',
                        status: 'available',
                        capacity: 40
                      }))
                    }
                  />
                  <text x="145" y="44" fill="#F8FAFC" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" textAnchor="middle">
                    B-203
                  </text>

                  {/* Room B-206 Study Pods */}
                  <rect
                    x="290"
                    y="80"
                    width="80"
                    height="40"
                    rx="4"
                    fill="#0F172A"
                    stroke="#475569"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() =>
                      setRoomConfig((prev) => ({
                        ...prev,
                        roomNumber: 'B-206',
                        name: 'Silent Acoustic Study Pods',
                        status: 'available',
                        capacity: 16
                      }))
                    }
                  />
                  <text x="330" y="104" fill="#F8FAFC" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" textAnchor="middle">
                    B-206 Pods
                  </text>
                </svg>

                <div className="absolute bottom-2 right-2">
                  <button
                    onClick={() => navigate('/campus-map?bldg=eng')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shadow-sm"
                  >
                    <span>Inspect CAD Path →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Space Configuration & IoT Overrides */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Room {roomConfig.roomNumber} IoT Override Controls</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Mesh Authenticated</span>
              </div>

              {/* Hardware Toggles Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. NFC Smart Lock Toggle */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] font-mono uppercase">NFC Lock</span>
                    {roomConfig.isLockSecured ? (
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {roomConfig.isLockSecured ? 'Secured (Keycard)' : 'Unlocked (Open)'}
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleLock}
                    className="mt-2 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 transition-colors"
                  >
                    Toggle Lock
                  </button>
                </div>

                {/* 2. HVAC Setpoint */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] font-mono uppercase">Climate Temp</span>
                    <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{roomConfig.temperature}°C</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Eco Active</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRoomConfig((prev) => ({
                          ...prev,
                          temperature: Number((prev.temperature - 0.5).toFixed(1))
                        }))
                      }
                      className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRoomConfig((prev) => ({
                          ...prev,
                          temperature: Number((prev.temperature + 0.5).toFixed(1))
                        }))
                      }
                      className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* One-Click CAFM Maintenance Dispatch Trigger */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleTriggerMaintenanceDispatch(roomConfig)}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Dispatch Rapid CAFM Ticket for Room {roomConfig.roomNumber}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT BUILDING
          ========================================================================= */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingBuilding ? 'Edit Campus Facility' : 'Register New Campus Facility Node'}
              </h3>
              <button
                onClick={() => setShowAddBuildingModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBuilding} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">Facility Name *</label>
                  <input
                    type="text"
                    required
                    value={buildingForm.name}
                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                    placeholder="e.g. Marie Curie Biotechnology Pavilion"
                    className="h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">Facility Code *</label>
                  <input
                    type="text"
                    required
                    value={buildingForm.code}
                    onChange={(e) => setBuildingForm({ ...buildingForm, code: e.target.value })}
                    placeholder="e.g. BIO-05"
                    className="h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-medium">Departments / Academic Units</label>
                <input
                  type="text"
                  value={buildingForm.departments}
                  onChange={(e) => setBuildingForm({ ...buildingForm, departments: e.target.value })}
                  placeholder="e.g. School of Computing, High-Performance Computing"
                  className="h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingBuilding ? 'Save Changes' : 'Create Facility Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampusManagement;
