import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  Layers,
  DoorOpen,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Download,
  RefreshCw,
  Compass,
  Edit3,
  Trash2,
  X,
  Check,
  Users
} from 'lucide-react';

const INITIAL_MEWAR_BUILDINGS = [
  {
    _id: 'bldg-eng02',
    name: 'Faculty of Engineering & Technology',
    code: 'ENG-02',
    precinct: 'North Academic Promenade',
    totalFloors: 4,
    departments: ['School of Computing', 'Autonomous Systems', 'Robotics & AI Lab', 'VLSI Design'],
    category: 'academic',
    status: 'open',
    rooms: [
      { roomNumber: 'B-204', name: 'Multi-Media Lecture Theatre', type: 'Lecture Theatre', capacity: 60, status: 'in-use', amenities: ['Laser Projector', 'Smart Board', 'Audio System'] },
      { roomNumber: 'B-203', name: 'Distributed Systems & Cloud Lab', type: 'Computer Lab', capacity: 40, status: 'available', amenities: ['40 Workstations', 'Gigabit Ethernet', 'AC'] },
      { roomNumber: 'ENG-101', name: 'Main Engineering Lecture Hall', type: 'Lecture Theatre', capacity: 120, status: 'in-use', amenities: ['Dual Projectors', 'Wireless Mic', 'Tiered Seating'] },
      { roomNumber: 'ENG-305', name: 'AI Research & Robotics Suite', type: 'Research Lab', capacity: 25, status: 'available', amenities: ['GPU Cluster Access', 'Workbenches', 'Soldering Stations'] }
    ]
  },
  {
    _id: 'bldg-adm01',
    name: 'Maharana Pratap Main Academic Block',
    code: 'ADM-01',
    precinct: 'Central Administrative Plaza',
    totalFloors: 3,
    departments: ['Vice Chancellor Secretariat', 'Academic Affairs', 'Examination Registry', 'Accounts'],
    category: 'academic',
    status: 'open',
    rooms: [
      { roomNumber: 'ADM-101', name: 'Registrar & Student Affairs', type: 'Administrative Office', capacity: 20, status: 'in-use', amenities: ['Helpdesk Counters', 'Waiting Area'] },
      { roomNumber: 'ADM-201', name: 'Syndicate & Board Room', type: 'Conference Hall', capacity: 35, status: 'available', amenities: ['Video Conferencing', 'Display Screens'] },
      { roomNumber: 'ADM-205', name: 'Examination Evaluation Wing', type: 'Secure Archive', capacity: 30, status: 'in-use', amenities: ['Biometric Access', 'Lockers'] }
    ]
  },
  {
    _id: 'bldg-lib03',
    name: 'Swami Vivekananda Central Library',
    code: 'LIB-03',
    precinct: 'East Knowledge Commons',
    totalFloors: 3,
    departments: ['Central Lending Stacks', 'Digital Media Archive', 'Study Commons', 'Reference Wing'],
    category: 'facility',
    status: 'open',
    rooms: [
      { roomNumber: 'LIB-G01', name: 'Lending Stacks & Turnstile Ingest', type: 'Open Library', capacity: 150, status: 'in-use', amenities: ['RFID Self-Checkout', 'OPAC Terminals'] },
      { roomNumber: 'LIB-102', name: 'Digital Periodicals & E-Resources', type: 'Computer Commons', capacity: 50, status: 'available', amenities: ['50 Desktop Terminals', 'High-Speed Wi-Fi'] },
      { roomNumber: 'LIB-206', name: 'Quiet Study Bays & Pods', type: 'Study Pods', capacity: 40, status: 'available', amenities: ['Acoustic Partitioning', 'Power Outlets'] }
    ]
  },
  {
    _id: 'bldg-caf05',
    name: 'Central Dining Hall & Cafeteria',
    code: 'CAF-05',
    precinct: 'Central Services Wing',
    totalFloors: 2,
    departments: ['Hostel Mess Ground Floor', 'Executive Dining Wing', 'Student Food Court'],
    category: 'facility',
    status: 'open',
    rooms: [
      { roomNumber: 'CAF-G01', name: 'Hostel Dining Hall (Ground)', type: 'Dining Commons', capacity: 350, status: 'in-use', amenities: ['Buffet Service Counters', 'Handwash Stations'] },
      { roomNumber: 'CAF-101', name: 'First Floor Student Food Court', type: 'Cafeteria', capacity: 120, status: 'available', amenities: ['Kiosks', 'Air Conditioning'] }
    ]
  }
];

export function CampusManagement() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const [buildings, setBuildings] = useState(INITIAL_MEWAR_BUILDINGS);
  const [selectedFacilityCode, setSelectedFacilityCode] = useState('ENG-02');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [successToast, setSuccessToast] = useState('');

  // Modals
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [buildingForm, setBuildingForm] = useState({
    name: '',
    code: '',
    precinct: '',
    totalFloors: 3,
    departments: '',
    category: 'academic'
  });
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    name: '',
    type: 'Classroom',
    capacity: 40,
    status: 'available',
    amenities: 'Projector, Whiteboard'
  });

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const activeFacility = useMemo(() => {
    return (
      buildings.find((b) => b.code === selectedFacilityCode || b._id === selectedFacilityCode) ||
      buildings[0]
    );
  }, [buildings, selectedFacilityCode]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.precinct && b.precinct.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        categoryFilter === 'all' || b.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [buildings, searchQuery, categoryFilter]);

  const handleAddBuildingSubmit = (e) => {
    e.preventDefault();
    if (!buildingForm.name.trim() || !buildingForm.code.trim()) return;

    const newBuilding = {
      _id: `bldg-${Date.now()}`,
      name: buildingForm.name.trim(),
      code: buildingForm.code.trim().toUpperCase(),
      precinct: buildingForm.precinct.trim() || 'Main Campus',
      totalFloors: Number(buildingForm.totalFloors) || 3,
      departments: buildingForm.departments ? buildingForm.departments.split(',').map((d) => d.trim()) : ['General'],
      category: buildingForm.category,
      status: 'open',
      rooms: []
    };

    setBuildings((prev) => [...prev, newBuilding]);
    setSelectedFacilityCode(newBuilding.code);
    setShowAddBuildingModal(false);
    setBuildingForm({ name: '', code: '', precinct: '', totalFloors: 3, departments: '', category: 'academic' });
    showToast(`Added ${newBuilding.name} (${newBuilding.code}) to campus registry.`);
  };

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    if (!roomForm.roomNumber.trim() || !roomForm.name.trim()) return;

    const newRoom = {
      roomNumber: roomForm.roomNumber.trim().toUpperCase(),
      name: roomForm.name.trim(),
      type: roomForm.type,
      capacity: Number(roomForm.capacity) || 40,
      status: roomForm.status,
      amenities: roomForm.amenities ? roomForm.amenities.split(',').map((a) => a.trim()) : ['Projector']
    };

    setBuildings((prev) =>
      prev.map((b) =>
        b.code === activeFacility.code
          ? { ...b, rooms: [...(b.rooms || []), newRoom] }
          : b
      )
    );

    setShowAddRoomModal(false);
    setRoomForm({ roomNumber: '', name: '', type: 'Classroom', capacity: 40, status: 'available', amenities: 'Projector, Whiteboard' });
    showToast(`Added Room ${newRoom.roomNumber} to ${activeFacility.name}.`);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Building Code,Building Name,Category,Precinct,Floors,Total Rooms\n';
    const csvRows = buildings
      .map(
        (b) =>
          `"${b.code}","${b.name}","${b.category}","${b.precinct || ''}",${b.totalFloors || 3},${b.rooms?.length || 0}`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Campus_Spaces_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Campus facilities exported to CSV.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-slate-800">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Facilities &amp; Space Directory
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9E153E] border border-rose-200 font-mono font-bold">
              Admin Ops
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-3xl mt-1">
            Authoritative registry of academic blocks, lecture halls, computer laboratories, and dining facilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddBuildingModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9E153E] to-[#BE123C] hover:from-[#881337] hover:to-[#9E153E] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Building</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono uppercase tracking-wider font-semibold">Registered Buildings</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#9E153E]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{buildings.length}</div>
            <div className="text-xs text-slate-500 mt-1">Academic &amp; Student Facilities</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono uppercase tracking-wider font-semibold">Total Floors</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {buildings.reduce((acc, b) => acc + (b.totalFloors || 3), 0)}
            </div>
            <div className="text-xs text-sky-700 font-medium mt-1">Across all registered blocks</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono uppercase tracking-wider font-semibold">Cataloged Rooms</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <DoorOpen className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {buildings.reduce((acc, b) => acc + (b.rooms?.length || 0), 0)}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">Theatres, Labs &amp; Offices</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono uppercase tracking-wider font-semibold">Campus Map Sync</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Compass className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">Active GIS</div>
            <div className="text-xs text-purple-700 font-medium mt-1">Grounded AI Navigation</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buildings by name or code (e.g., ENG-02, ADM-01)..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E] transition-all"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E] transition-all font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic Blocks</option>
            <option value="facility">Student Facilities &amp; Dining</option>
          </select>
        </div>
      </div>

      {/* Main Workspace (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Buildings Registry (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#9E153E]" />
                <h3 className="text-sm font-bold text-slate-900">Campus Buildings</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#9E153E] text-[10px] font-bold border border-rose-200">
                  {filteredBuildings.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredBuildings.map((b) => {
                const isSelected = selectedFacilityCode === b.code || selectedFacilityCode === b._id;

                return (
                  <div
                    key={b.code || b._id}
                    onClick={() => setSelectedFacilityCode(b.code)}
                    className={`p-4 transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-50/50 border-l-4 border-l-[#9E153E]'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#9E153E] font-bold font-mono shrink-0">
                        {b.code.split('-')[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{b.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
                            {b.code}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {b.precinct} • {b.totalFloors || 3} Floors • {b.rooms?.length || 0} Rooms
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/campus-map?bldg=${b.code.toLowerCase()}`);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                      title="View on Campus Map"
                    >
                      <Compass className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Room & Space Inspector (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-[#9E153E] font-bold uppercase tracking-wider">
                  Inspecting Building • {activeFacility?.code}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeFacility?.name}</h2>
                <p className="text-xs text-slate-500">{activeFacility?.precinct} • {activeFacility?.totalFloors} Floors</p>
              </div>

              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#9E153E] hover:bg-[#881337] text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Room</span>
              </button>
            </div>

            {/* Room List in Active Facility */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Classrooms, Labs &amp; Facilities ({activeFacility?.rooms?.length || 0})
              </h3>

              {(!activeFacility?.rooms || activeFacility.rooms.length === 0) ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No rooms cataloged for this facility yet. Click "Add Room" above.
                </div>
              ) : (
                activeFacility.rooms.map((rm, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-mono font-bold text-xs text-slate-900">
                          {rm.roomNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{rm.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rm.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {rm.status === 'available' ? 'Available' : 'In Session'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Type: <strong className="text-slate-700">{rm.type}</strong></span>
                      <span>Capacity: <strong className="text-slate-700">{rm.capacity} seats</strong></span>
                    </div>

                    {rm.amenities && rm.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rm.amenities.map((am, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded bg-white text-[10px] text-slate-600 border border-slate-200"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Building Modal */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#9E153E]" />
                <span>Add Campus Building</span>
              </h3>
              <button
                onClick={() => setShowAddBuildingModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBuildingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Building Name *</label>
                <input
                  type="text"
                  value={buildingForm.name}
                  onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                  placeholder="e.g., School of Basic Sciences"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Building Code *</label>
                  <input
                    type="text"
                    value={buildingForm.code}
                    onChange={(e) => setBuildingForm({ ...buildingForm, code: e.target.value })}
                    placeholder="e.g., SCI-04"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Floors</label>
                  <input
                    type="number"
                    value={buildingForm.totalFloors}
                    onChange={(e) => setBuildingForm({ ...buildingForm, totalFloors: e.target.value })}
                    min="1"
                    max="10"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Precinct</label>
                <input
                  type="text"
                  value={buildingForm.precinct}
                  onChange={(e) => setBuildingForm({ ...buildingForm, precinct: e.target.value })}
                  placeholder="e.g., East Academic Quad"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={buildingForm.category}
                  onChange={(e) => setBuildingForm({ ...buildingForm, category: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                >
                  <option value="academic">Academic &amp; Research</option>
                  <option value="facility">Student Facility &amp; Dining</option>
                  <option value="residential">Hostel &amp; Residential</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#9E153E] hover:bg-[#881337] text-white text-xs font-bold shadow-sm cursor-pointer transition-colors"
                >
                  Save Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-[#9E153E]" />
                <span>Add Room to {activeFacility?.name}</span>
              </h3>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    placeholder="e.g., C-302"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    min="1"
                    max="500"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Space Name *</label>
                <input
                  type="text"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  placeholder="e.g., Computer Vision Laboratory"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Space Type</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                  >
                    <option value="Lecture Theatre">Lecture Theatre</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Research Lab">Research Lab</option>
                    <option value="Conference Hall">Conference Hall</option>
                    <option value="Administrative Office">Administrative Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Session</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  placeholder="e.g., Dual Projector, Smart Board, AC, Wi-Fi"
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#9E153E] hover:bg-[#881337] text-white text-xs font-bold shadow-sm cursor-pointer transition-colors"
                >
                  Save Room
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
