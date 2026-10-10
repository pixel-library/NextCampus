import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export function CampusManagement() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  // Data states
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Selected entities
  const [selectedFacilityCode, setSelectedFacilityCode] = useState('A-01');
  const [selectedFloor, setSelectedFloor] = useState('Level 2');
  const [activeTab, setActiveTab] = useState('buildings'); // buildings, depts, floors, rooms, assets

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('floors');
  const [selectedBuildingIds, setSelectedBuildingIds] = useState(['A-01']);

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
    precinct: 'North Quadrangle',
    totalFloors: 4,
    departments: '',
    grossFloorArea: 14200,
    cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
    category: 'academic',
  });

  // Room Quick Configuration Editor State
  const [roomConfig, setRoomConfig] = useState({
    _id: '',
    roomNumber: 'B-204',
    name: 'Multi-Media Lecture Theatre',
    type: 'Multi-Media Theatre',
    capacity: 60,
    status: 'occupied',
    building: 'Alan Turing Hall',
    floor: 'Level 2',
    features: ['Dual 4K Laser Projector', 'CO2 & Air Quality', 'NFC Smart Lock', 'Spatial Mic Array'],
    timetableRule: 'Automated live lock sync via University Timetable Core API',
  });

  // New Equipment tag input in Room Editor
  const [newEquipmentTag, setNewEquipmentTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // New Room Form State
  const [newRoomForm, setNewRoomForm] = useState({
    roomNumber: '',
    name: '',
    type: 'Smart Classrooms',
    capacity: 40,
    status: 'available',
    features: 'Dual 4K Projector, NFC Smart Lock',
  });

  useEffect(() => {
    fetchCampusData();
  }, []);

  const fetchCampusData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [bldRes, rmRes] = await Promise.all([
        api.get('/campus/locations').catch(() => null),
        api.get('/smartrooms/rooms').catch(() => null),
      ]);

      if (bldRes && bldRes.success && Array.isArray(bldRes.data)) {
        setBuildings(bldRes.data);
        if (bldRes.data.length > 0 && !selectedFacilityCode) {
          setSelectedFacilityCode(bldRes.data[0].code);
        }
      }
      if (rmRes && rmRes.success && Array.isArray(rmRes.data)) {
        setRooms(rmRes.data);
        const initialRoom = rmRes.data.find((r) => r.roomNumber === 'B-204') || rmRes.data[0];
        if (initialRoom) {
          setRoomConfig({
            _id: initialRoom._id,
            roomNumber: initialRoom.roomNumber,
            name: initialRoom.name || '',
            type: initialRoom.type || 'Lecture Theatres',
            capacity: initialRoom.capacity || 40,
            status: initialRoom.status || 'available',
            building: initialRoom.building,
            floor: initialRoom.floor || 'Level 2',
            features: initialRoom.features || ['Dual 4K Projector', 'NFC Smart Lock'],
            timetableRule: initialRoom.timetableRule || 'Automated live lock sync via University Timetable Core API',
          });
        }
      }
    } catch (err) {
      console.warn('Campus data fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Active facility object
  const activeFacility =
    buildings.find((b) => b.code === selectedFacilityCode || b._id === selectedFacilityCode) ||
    buildings[0] || {
      name: 'Alan Turing Hall',
      code: 'A-01',
      category: 'academic',
      precinct: 'North Quadrangle',
      totalFloors: 4,
      departments: ['School of Computing', 'Autonomous Systems', 'Robotics', 'AI Lab'],
      grossFloorArea: 14200,
      powerSubstation: 'West 11kV',
      loadPercentage: 84,
      floors: [
        { floorNumber: 'Level 2', name: 'Cybernetics & High-Perf Computing', cadVersion: 'CAD v2.4', roomsCount: 16 },
        { floorNumber: 'Level 1', name: 'Undergraduate Laboratories', cadVersion: 'CAD v2.2', roomsCount: 14 },
        { floorNumber: 'Level 3', name: 'Faculty Research Suites', cadVersion: 'CAD v2.1', roomsCount: 12 },
        { floorNumber: 'Ground Floor', name: 'Foyer, Atrium & Cafe Hub', cadVersion: 'CAD v2.0', roomsCount: 8 },
      ],
    };

  // Rooms for active facility and floor
  const activeFacilityRooms = rooms.filter((r) => {
    const bMatch =
      r.buildingCode === activeFacility.code ||
      r.building?.toLowerCase().includes(activeFacility.name?.toLowerCase().slice(0, 6));
    const fMatch = !selectedFloor || r.floor?.toLowerCase() === selectedFloor?.toLowerCase();
    return bMatch && fMatch;
  });

  // Filtered & sorted buildings list
  const filteredBuildings = buildings.filter((b) => {
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
      (categoryFilter === 'cleanroom' && (b.category === 'cleanroom' || b.category === 'research')) ||
      (categoryFilter === 'facility' && (b.category === 'facility' || b.category === 'dining' || b.category === 'library')) ||
      b.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && b.status === 'open') ||
      (statusFilter === 'high' && (b.loadPercentage || 80) > 85) ||
      (statusFilter === 'maint' && (b.status === 'under_maintenance' || b.status === 'restricted'));

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'floors') return (b.totalFloors || 4) - (a.totalFloors || 4);
    if (sortBy === 'load') return (b.loadPercentage || 75) - (a.loadPercentage || 75);
    if (sortBy === 'code') return a.code.localeCompare(b.code);
    return a.name.localeCompare(b.name);
  });

  // Handle building selection
  const handleSelectFacility = (code) => {
    setSelectedFacilityCode(code);
    // Switch active floor to the first available floor
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
        precinct: buildingToEdit.precinct || 'North Quadrangle',
        totalFloors: buildingToEdit.totalFloors || 4,
        departments: Array.isArray(buildingToEdit.departments)
          ? buildingToEdit.departments.join(', ')
          : buildingToEdit.departments || '',
        grossFloorArea: buildingToEdit.grossFloorArea || 14200,
        cadSchema: buildingToEdit.cadSchema || 'Auto-Import from Revit Cloud (IFC4)',
        category: buildingToEdit.category || 'academic',
      });
    } else {
      setEditingBuilding(null);
      setBuildingForm({
        name: '',
        code: `BLK-${String.fromCharCode(65 + buildings.length)}-0${buildings.length + 1}`,
        precinct: 'North Quadrangle',
        totalFloors: 4,
        departments: 'School of Design, Advanced Prototyping',
        grossFloorArea: 16500,
        cadSchema: 'Auto-Import from Revit Cloud (IFC4)',
        category: 'academic',
      });
    }
    setShowAddBuildingModal(true);
  };

  // Save Building (Create or Update)
  const handleSaveBuilding = async (e) => {
    e.preventDefault();
    if (!buildingForm.name.trim() || !buildingForm.code.trim()) {
      alert('Building name and code are required.');
      return;
    }

    try {
      const payload = {
        ...buildingForm,
        departments: buildingForm.departments.split(',').map((d) => d.trim()).filter(Boolean),
      };

      if (editingBuilding) {
        const res = await api.put(`/campus/locations/${editingBuilding._id || editingBuilding.code}`, payload);
        if (res && res.success) {
          showToast(`Building ${payload.name} updated successfully.`);
          setBuildings((prev) =>
            prev.map((b) => (b.code === editingBuilding.code || b._id === editingBuilding._id ? res.data : b))
          );
        }
      } else {
        const res = await api.post('/campus/locations', payload);
        if (res && res.success) {
          showToast(`Building ${payload.name} created and registered in GIS.`);
          setBuildings((prev) => [res.data, ...prev]);
          setSelectedFacilityCode(res.data.code);
        }
      }
      setShowAddBuildingModal(false);
    } catch (err) {
      alert(`Error saving facility: ${err.message}`);
    }
  };

  // Delete Building Handlers
  const handlePromptDelete = (building, e) => {
    e?.stopPropagation();
    setShowDeleteModal(building);
    setConfirmCascade(false);
    setDeleteError('');
  };

  const handleExecuteDeleteBuilding = async () => {
    if (!showDeleteModal) return;
    try {
      const res = await api.delete(
        `/campus/locations/${showDeleteModal._id || showDeleteModal.code}?cascade=${confirmCascade}`
      );
      if (res && res.success) {
        showToast(res.message || `Building ${showDeleteModal.name} deleted.`);
        setBuildings((prev) => prev.filter((b) => b.code !== showDeleteModal.code && b._id !== showDeleteModal._id));
        if (selectedFacilityCode === showDeleteModal.code) {
          setSelectedFacilityCode(buildings[0]?.code || '');
        }
        setShowDeleteModal(null);
      }
    } catch (err) {
      if (err.status === 409 || err.data?.conflict) {
        setDeleteError(
          err.data?.message ||
            `Cannot delete facility: ${err.data?.dependentCount || 'Several'} dependent rooms are assigned. Check the cascade deletion box to proceed.`
        );
      } else {
        setDeleteError(err.message || 'Failed to delete building.');
      }
    }
  };

  // Quick Space Configuration Editor
  const handleSelectRoomForEditor = (room) => {
    setRoomConfig({
      _id: room._id,
      roomNumber: room.roomNumber,
      name: room.name || '',
      type: room.type || 'Smart Classrooms',
      capacity: room.capacity || 40,
      status: room.status || 'available',
      building: room.building || activeFacility.name,
      floor: room.floor || selectedFloor,
      features: room.features || ['Dual 4K Projector'],
      timetableRule: room.timetableRule || 'Automated live lock sync via University Timetable Core API',
    });

    const panel = document.getElementById('room-editor-panel');
    if (panel) {
      panel.classList.add('ring-2', 'ring-primary');
      setTimeout(() => panel.classList.remove('ring-2', 'ring-primary'), 700);
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSaveRoomConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        capacity: Number(roomConfig.capacity),
        type: roomConfig.type,
        status: roomConfig.status,
        features: roomConfig.features,
        timetableRule: roomConfig.timetableRule,
      };

      const res = await api.patch(`/smartrooms/rooms/${roomConfig._id || roomConfig.roomNumber}`, payload);
      if (res && res.success) {
        showToast(`SmartRoom ${roomConfig.roomNumber} updated successfully.`);
        setRooms((prev) =>
          prev.map((r) => (r.roomNumber === roomConfig.roomNumber || r._id === roomConfig._id ? res.data : r))
        );
      }
    } catch (err) {
      alert(`Error updating SmartRoom: ${err.message}`);
    }
  };

  const handleRemoveFeatureTag = (tag) => {
    setRoomConfig((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== tag),
    }));
  };

  const handleAddFeatureTag = () => {
    if (newEquipmentTag.trim()) {
      if (!roomConfig.features.includes(newEquipmentTag.trim())) {
        setRoomConfig((prev) => ({
          ...prev,
          features: [...prev.features, newEquipmentTag.trim()],
        }));
      }
      setNewEquipmentTag('');
      setShowTagInput(false);
    }
  };

  // Add Room to current Building/Floor
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomForm.roomNumber.trim()) {
      alert('Room Number is required');
      return;
    }

    try {
      const payload = {
        roomNumber: newRoomForm.roomNumber.trim().toUpperCase(),
        name: newRoomForm.name.trim() || newRoomForm.type,
        building: activeFacility.name,
        buildingCode: activeFacility.code,
        floor: selectedFloor,
        type: newRoomForm.type,
        capacity: Number(newRoomForm.capacity) || 30,
        status: newRoomForm.status,
        features: newRoomForm.features.split(',').map((f) => f.trim()).filter(Boolean),
      };

      const res = await api.post('/smartrooms/rooms', payload);
      if (res && res.success) {
        showToast(`SmartRoom ${payload.roomNumber} registered on ${selectedFloor}.`);
        setRooms((prev) => [res.data, ...prev]);
        setShowAddRoomModal(false);
        setNewRoomForm({
          roomNumber: '',
          name: '',
          type: 'Smart Classrooms',
          capacity: 40,
          status: 'available',
          features: 'Dual 4K Projector, NFC Smart Lock',
        });
      }
    } catch (err) {
      alert(`Error adding room: ${err.message}`);
    }
  };

  // Export Spatial Blueprint as CSV
  const handleExportBlueprint = () => {
    const csvHeader = 'Building Code,Building Name,Category,Precinct,Floors,GFA (m2),Load (%),Departments\n';
    const csvRows = buildings
      .map(
        (b) =>
          `"${b.code}","${b.name}","${b.category}","${b.precinct || ''}",${b.totalFloors || 4},${b.grossFloorArea || 14000},${b.loadPercentage || 75},"${(b.departments || []).join('; ')}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NextCampus_Spatial_Masterplan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Spatial blueprint CSV downloaded successfully.');
  };

  // Sync BIM & IoT CAD
  const handleSyncBIM = () => {
    showToast('BIM / GIS Synchronized with Autodesk Revit Cloud & LoRaWAN mesh (14ms latency).');
  };

  return (
    <div className="flex flex-col w-full text-on-surface space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-secondary-container text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-secondary animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{successToast}</span>
        </div>
      )}

      {/* Operational Kicker & Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="font-caption text-caption text-secondary uppercase tracking-widest font-semibold font-mono">
            Facility Asset Inventory &amp; Spatial Master Data • Apex Polytechnic Institute • Node: CAMPUS-CORE-V4.2
          </span>
        </div>
        <div className="flex items-center gap-space-sm text-on-surface-variant font-caption text-caption">
          <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-secondary text-[14px]">cell_tower</span>
            LoRaWAN Mesh: 99.4% Latency 14ms
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
            BIM / GIS Synchronized
          </span>
        </div>
      </div>

      {/* Page Title & Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Campus Infrastructure &amp; Space Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-0.5">
            Authoritative spatial directory of campus facilities, academic departments, floor topologies, and
            sensor-monitored smart room allocation across Apex Quad precincts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button
            onClick={handleSyncBIM}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">sync_alt</span>
            <span>Sync BIM &amp; IoT CAD</span>
          </button>
          <button
            onClick={handleExportBlueprint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">download</span>
            <span>Export Spatial Blueprint</span>
          </button>
          <button
            onClick={() => handleOpenAddBuilding()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-secondary-container transition-all shadow-[0_0_16px_rgba(172,39,79,0.4)]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>+ Add New Building</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Tiles Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        <div className="bg-surface-variant rounded-xl p-space-md shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Total Facilities</span>
            <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
          </div>
          <div className="mt-2">
            <div className="font-display-hero text-display-hero text-on-surface leading-none tracking-tight font-extrabold">
              {buildings.length || 14}
            </div>
            <div className="font-caption text-caption text-secondary mt-1 flex items-center gap-1">
              <span>{buildings.filter((b) => b.category === 'academic').length || 10} Academic</span> •{' '}
              <span>{buildings.filter((b) => b.category === 'facility').length || 4} Facilities</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="bg-surface-variant rounded-xl p-space-md shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Monitored Floor Plates</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">layers</span>
          </div>
          <div className="mt-2">
            <div className="font-display-hero text-display-hero text-on-surface leading-none tracking-tight font-extrabold">
              {buildings.reduce((acc, b) => acc + (b.totalFloors || 4), 0) || 48}
            </div>
            <div className="font-caption text-caption text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="text-primary font-semibold">100%</span> 3D Digital Twin Coverage
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-secondary-container/20 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="bg-surface-variant rounded-xl p-space-md shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">SmartRoom Inventory</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">meeting_room</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-on-surface leading-none tracking-tight font-extrabold">
                {rooms.length || 184}
              </span>
              <span className="font-caption text-caption text-secondary font-semibold">
                {rooms.filter((r) => r.status === 'occupied').length || 142} In-Use
              </span>
            </div>
            <div className="font-caption text-caption text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>{rooms.filter((r) => r.status === 'available').length || 42} Available for instant reserve</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-container/20 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="bg-surface-variant rounded-xl p-space-md shadow-md relative overflow-hidden flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Gross Floor Area</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">square_foot</span>
          </div>
          <div className="mt-2">
            <div className="font-display-hero text-display-hero text-on-surface leading-none tracking-tight font-extrabold">
              {(() => {
                const sum = buildings.reduce((acc, b) => acc + (Number(b.grossFloorArea) || 0), 0);
                return (sum > 0 ? sum : 215400).toLocaleString();
              })()}
            </div>
            <div className="font-caption text-caption text-on-surface-variant mt-1">
              <span>Square Meters (GFA) • 92.4% Util.</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
        </div>
      </div>

      {/* Segmented View Tabs & Operational Filter Bar */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-md mb-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md shrink-0 transition-colors ${
              activeTab === 'buildings'
                ? 'bg-primary-container text-white shadow-[0_0_12px_rgba(172,39,79,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
            }`}
            type="button"
          >
            Buildings ({buildings.length || 14})
          </button>
          <button
            onClick={() => setActiveTab('depts')}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md shrink-0 transition-colors ${
              activeTab === 'depts'
                ? 'bg-primary-container text-white shadow-[0_0_12px_rgba(172,39,79,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
            }`}
            type="button"
          >
            Departments &amp; Faculties (8)
          </button>
          <button
            onClick={() => setActiveTab('floors')}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md shrink-0 transition-colors ${
              activeTab === 'floors'
                ? 'bg-primary-container text-white shadow-[0_0_12px_rgba(172,39,79,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
            }`}
            type="button"
          >
            Floor Topologies ({buildings.reduce((acc, b) => acc + (b.totalFloors || 4), 0) || 48})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md shrink-0 transition-colors ${
              activeTab === 'rooms'
                ? 'bg-primary-container text-white shadow-[0_0_12px_rgba(172,39,79,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
            }`}
            type="button"
          >
            SmartRoom Inventory ({rooms.length || 184})
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md shrink-0 transition-colors ${
              activeTab === 'assets'
                ? 'bg-primary-container text-white shadow-[0_0_12px_rgba(172,39,79,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
            }`}
            type="button"
          >
            Facility &amp; Asset Registry
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low pl-10 pr-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
              placeholder="Search facilities by name, code (e.g. Block A-01), lab, or precinct..."
              type="text"
            />
          </div>

          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-low py-2 pl-3 pr-8 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
              >
                <option value="all">Type: All Categories</option>
                <option value="academic">Academic &amp; Research</option>
                <option value="cleanroom">STEM &amp; Cleanroom Labs</option>
                <option value="facility">Library &amp; Commons</option>
                <option value="dining">Student Union &amp; Dining</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[16px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-low py-2 pl-3 pr-8 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
              >
                <option value="all">Status: All (Active • Maint)</option>
                <option value="active">Active • Nominal</option>
                <option value="high">High Occupancy (&gt;85%)</option>
                <option value="maint">Scheduled Maintenance</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[16px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-surface-container-low py-2 pl-3 pr-8 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
              >
                <option value="floors">Sort: Floor Count ↓</option>
                <option value="load">Sort: Footfall Load ↓</option>
                <option value="code">Sort: Code (Ascending)</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[16px] pointer-events-none">
                swap_vert
              </span>
            </div>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setSortBy('floors');
              }}
              className="w-full md:w-auto p-2 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface rounded-lg transition-colors flex items-center justify-center border border-outline-variant/20"
              title="Reset Filters"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Two-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start mb-space-xl">
        {/* Left Column: Master Facilities Table (7 cols on lg = ~58-60%) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Facilities Registry Table Card */}
          <div className="bg-surface-variant rounded-xl shadow-md overflow-hidden border border-outline-variant/20">
            <div className="p-space-md bg-surface-container flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  Campus Facilities Registry
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-caption text-caption font-semibold">
                  {filteredBuildings.length} Registered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedBuildingIds.length === filteredBuildings.length) {
                      setSelectedBuildingIds([]);
                    } else {
                      setSelectedBuildingIds(filteredBuildings.map((b) => b.code));
                    }
                  }}
                  className="text-on-surface-variant hover:text-on-surface font-caption text-caption p-1 rounded hover:bg-surface-container-high transition-colors flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">select_all</span>
                  <span className="hidden sm:inline">
                    {selectedBuildingIds.length === filteredBuildings.length ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
                <button
                  onClick={() => alert(`Batch tagged ${selectedBuildingIds.length} facilities with "BIM Synced"`)}
                  className="text-on-surface-variant hover:text-on-surface font-caption text-caption p-1 rounded hover:bg-surface-container-high transition-colors flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">label</span>
                  <span className="hidden sm:inline">Batch Tags</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
                    <th className="py-3 px-4 w-10">
                      <input
                        checked={selectedBuildingIds.length > 0 && selectedBuildingIds.length === filteredBuildings.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedBuildingIds(filteredBuildings.map((b) => b.code));
                          else setSelectedBuildingIds([]);
                        }}
                        className="rounded bg-surface-container text-primary-container focus:ring-0 w-3.5 h-3.5"
                        type="checkbox"
                      />
                    </th>
                    <th className="py-3 px-3">Building &amp; Precinct</th>
                    <th className="py-3 px-3">Floors</th>
                    <th className="py-3 px-3">Faculty / Depts</th>
                    <th className="py-3 px-3">Load / Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/30 font-body-sm text-body-sm">
                  {filteredBuildings.map((b) => {
                    const isSelected = selectedFacilityCode === b.code || selectedFacilityCode === b._id;
                    const letter = (b.code || b.name || 'A')[0];
                    return (
                      <tr
                        key={b.code || b._id}
                        onClick={() => handleSelectFacility(b.code)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? 'bg-surface-container-high/70 shadow-[inset_3px_0_0_0_#ffb2bf]'
                            : 'hover:bg-surface-container-high/40'
                        }`}
                      >
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            checked={selectedBuildingIds.includes(b.code)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedBuildingIds([...selectedBuildingIds, b.code]);
                              else setSelectedBuildingIds(selectedBuildingIds.filter((id) => id !== b.code));
                            }}
                            className="rounded bg-surface-container text-primary-container focus:ring-0 w-3.5 h-3.5"
                            type="checkbox"
                          />
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary shrink-0 font-bold font-title-md border border-primary/20">
                              {letter}
                            </div>
                            <div>
                              <div className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 font-bold">
                                {b.name}
                                <span className="bg-primary-container text-on-primary font-caption text-caption px-1.5 py-0.2 rounded font-mono font-bold">
                                  {b.code}
                                </span>
                              </div>
                              <div className="font-caption text-caption text-on-surface-variant">
                                {b.precinct || 'North Quad'} • {(b.grossFloorArea || 14000).toLocaleString()} m²
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-on-surface">{b.totalFloors || 4} Levels</div>
                          <div className="font-caption text-caption text-on-surface-variant">G + {(b.totalFloors || 4) - 1} Floors</div>
                        </td>
                        <td className="py-3.5 px-3 max-w-[140px] truncate">
                          <span className="text-on-surface font-medium truncate block">
                            {Array.isArray(b.departments) ? b.departments[0] : b.departments || 'Academic Labs'}
                          </span>
                          <div className="font-caption text-caption text-on-surface-variant truncate">
                            {Array.isArray(b.departments) ? b.departments.slice(1).join(', ') : 'Robotics, AI Labs'}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                (b.loadPercentage || 75) > 85 ? 'bg-primary animate-pulse' : 'bg-secondary'
                              }`}
                            ></span>
                            <span className="text-secondary font-semibold font-caption text-caption">
                              {b.loadPercentage || 75}% Load
                            </span>
                          </div>
                          <div className="font-caption text-caption text-on-surface-variant">
                            {rooms.filter((r) => r.buildingCode === b.code || r.building === b.name).length || 38} Rooms
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                handleSelectFacility(b.code);
                                navigate('/smartroom');
                              }}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                              title="Manage in SmartRoom"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">door_front</span>
                            </button>
                            <button
                              onClick={() => navigate('/campus-map')}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors"
                              title="Spatial Campus Map"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">map</span>
                            </button>
                            <button
                              onClick={() => handleOpenAddBuilding(b)}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                              title="Edit Building Attributes"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={(e) => handlePromptDelete(b, e)}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                              title="Delete Building"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Summary */}
            <div className="p-space-md bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm font-caption text-caption text-on-surface-variant border-t border-outline-variant/20">
              <div>
                Showing <span className="font-semibold text-on-surface">{filteredBuildings.length}</span> of{' '}
                <span className="font-semibold text-on-surface">{buildings.length}</span> campus facilities
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2.5 py-1 rounded bg-primary-container text-on-primary font-semibold">1</span>
                <span className="text-outline">Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Campus Precinct Map Graphic / Context Overview */}
          <div className="bg-surface-variant rounded-xl p-space-md shadow-md border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  Quad Precinct Geo-Distribution
                </span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant">Real-Time Sensor Density: High</span>
            </div>

            <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container-lowest flex items-center justify-center group border border-outline-variant/30">
              <img
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                alt="Stylized architectural nighttime rendering of modern university campus quad"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0zG3h6aOxuxsZrqLGrRH_yPmqb4BHxJgTCgPskJuFeNdsnPvqyZmS5qGR75DRIhIchlWTrMpJtmEii2oGsNLdp9gijQoXpGZTRz4Q05iWPrgYz-0v0-t_F0swBtPdFywElaePUjPXQn8cd8gIh7O6ZDGKztCLOHhg3bQhmkks2aohSCW3N41osZpSm5WEhmGYUOHkIQ6YPdQr61yxMNzbHiRD7MaGsOyZfveQ_rYOhibMpL1v3lYMig"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>

              {/* Tactical Overlay Pins */}
              <div className="absolute top-8 left-12 flex items-center gap-2 bg-surface-container/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="font-caption text-caption text-on-surface font-semibold">North Quad: A-01 Turing</span>
              </div>
              <div className="absolute top-16 right-16 flex items-center gap-2 bg-surface-container/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-caption text-caption text-on-surface font-semibold">East Quad: B-02 Library</span>
              </div>
              <div className="absolute bottom-6 left-1/3 flex items-center gap-2 bg-surface-container/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span className="font-caption text-caption text-on-surface font-semibold">South Quad: STEM Cleanroom</span>
              </div>

              <div className="absolute bottom-3 right-4 flex items-center gap-2">
                <Link
                  to="/campus-map"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest/90 hover:bg-surface-bright text-secondary font-label-sm text-label-sm rounded backdrop-blur-sm transition-colors shadow border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  <span>Expand Master Site Plan</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Facility Inspector & Floor Plan Breakdown (5 cols on lg = ~40-42%) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Inspector Header Card */}
          <div className="bg-surface-variant rounded-xl p-space-md shadow-md flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
            <div className="relative h-32 -mx-space-md -mt-space-md rounded-t-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Facility exterior architectural view"
                src={
                  activeFacility.image ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDIQH1a_rIDo3bVMfUVChA8hIOc4U2AfzU417f31DBE4raYpbqT0sRTSChd1kGunnt1Xji5_sq1DrwSFbvN4Wcx-gSwgp-kqooUIb5CRHfR1c75iF9FfMzociluJlYcsnsrmeVN9vwDk2P_nMk3PMZgWioeinmt9h3NdO7G5sQ1mpr481A1rmqb7kLBY9I95w-9c0CHXdoVpQkYO_3Y49A-w63hJKapwAPGoi_Q9up6aUOak4vSCbatAg'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-variant via-surface-variant/60 to-transparent"></div>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-caption text-caption font-bold tracking-wider">
                  {activeFacility.code}
                </span>
                <button
                  onClick={() => handleOpenAddBuilding(activeFacility)}
                  className="p-1 rounded-full bg-surface-container/80 text-on-surface hover:text-primary transition-colors backdrop-blur-sm"
                  title="Edit Building Attributes"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <div className="absolute bottom-2 left-4">
                <span className="font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                  Active Inspector
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-extrabold">
                  {activeFacility.name}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1 text-center bg-surface-container rounded-lg p-2 border border-outline-variant/20">
              <div>
                <div className="font-caption text-caption text-on-surface-variant">Commissioned</div>
                <div className="font-label-md text-label-md text-on-surface font-semibold">
                  {activeFacility.commissionedYear || 2021}
                </div>
              </div>
              <div>
                <div className="font-caption text-caption text-on-surface-variant">Footprint</div>
                <div className="font-label-md text-label-md text-on-surface font-semibold">
                  {(activeFacility.grossFloorArea || 14200).toLocaleString()} m²
                </div>
              </div>
              <div>
                <div className="font-caption text-caption text-on-surface-variant">Power Substation</div>
                <div className="font-label-md text-label-md text-secondary font-semibold">
                  {activeFacility.powerSubstation || 'West 11kV'}
                </div>
              </div>
            </div>

            {/* Level Navigator Accordions */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold tracking-wider">
                  Floor Topologies &amp; Room Rosters
                </span>
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="font-caption text-caption text-primary hover:underline font-semibold"
                  type="button"
                >
                  + Add Room to Floor
                </button>
              </div>

              {/* Active Floor (Expanded) */}
              <div className="bg-surface-container rounded-lg p-3 shadow-inner border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-md text-label-md text-primary font-bold">
                      {selectedFloor} • Cybernetics &amp; High-Perf Computing
                    </span>
                  </div>
                  <span className="font-caption text-caption text-secondary bg-surface-container-high px-1.5 py-0.2 rounded font-semibold font-mono">
                    CAD v2.4
                  </span>
                </div>

                {/* Mini 2.5D Schematic Floor Plan Preview Card */}
                <div className="bg-surface-container-lowest rounded-lg p-3 my-2 relative overflow-hidden group border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">floor</span>
                      <span className="font-caption text-caption text-on-surface font-semibold">
                        Schematic Floor Plate: {selectedFloor}
                      </span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant font-mono">BIM IFC4</span>
                  </div>

                  {/* Interactive Visual Floor Plan Map Canvas (SVG) */}
                  <div className="relative w-full h-32 bg-surface-container-high/40 rounded flex items-center justify-center p-2 overflow-hidden">
                    <svg className="w-full h-full text-outline-variant" fill="none" stroke="currentColor" viewBox="0 0 400 160">
                      {/* Building Perimeter */}
                      <rect className="stroke-outline" fill="#231e1f" height="120" rx="8" strokeWidth="1.5" width="360" x="20" y="20"></rect>
                      {/* Corridor Wayfinding */}
                      <path className="stroke-secondary/60" d="M 60 80 L 340 80" strokeDasharray="4 4" strokeWidth="2"></path>
                      <path className="stroke-secondary/40" d="M 190 20 L 190 140" strokeDasharray="4 4" strokeWidth="2"></path>

                      {/* Room B-204 Highlight (Occupied) */}
                      <rect
                        className="fill-primary-container/40 stroke-primary cursor-pointer hover:fill-primary-container/70"
                        height="42"
                        rx="4"
                        strokeWidth="1.5"
                        width="70"
                        x="30"
                        y="30"
                        onClick={() =>
                          handleSelectRoomForEditor({
                            roomNumber: 'B-204',
                            name: 'Multi-Media Lecture Theatre',
                            type: 'Multi-Media Theatre',
                            capacity: 60,
                            status: 'occupied',
                            features: ['Dual 4K Laser Projector', 'CO2 & Air Quality', 'NFC Smart Lock'],
                          })
                        }
                      ></rect>
                      <text fill="#ffb2bf" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="65" y="55">
                        B-204
                      </text>
                      <circle className="fill-primary" cx="90" cy="40" r="3"></circle>

                      {/* Room B-208 (Robotics Lab) */}
                      <rect
                        className="fill-surface-variant stroke-secondary cursor-pointer hover:fill-surface-container-high"
                        height="42"
                        rx="4"
                        strokeWidth="1"
                        width="70"
                        x="110"
                        y="30"
                        onClick={() =>
                          handleSelectRoomForEditor({
                            roomNumber: 'B-208',
                            name: 'Autonomous Robotics Lab',
                            type: 'Autonomous Robotics Lab',
                            capacity: 30,
                            status: 'occupied',
                            features: ['ROS2 Rigs', 'Motion Capture', 'Workstations'],
                          })
                        }
                      ></rect>
                      <text fill="#ffdadb" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="145" y="55">
                        B-208
                      </text>

                      {/* Room B-212 (Quiet Pod - Open) */}
                      <rect
                        className="fill-surface-variant stroke-secondary/80 cursor-pointer hover:fill-surface-container-high"
                        height="42"
                        rx="4"
                        strokeWidth="1.5"
                        width="60"
                        x="200"
                        y="30"
                        onClick={() =>
                          handleSelectRoomForEditor({
                            roomNumber: 'B-212',
                            name: 'Quiet Team Study Pod',
                            type: 'Quiet Team Study Pod',
                            capacity: 8,
                            status: 'available',
                            features: ['65" Touch Display', 'Polycom Suite'],
                          })
                        }
                      ></rect>
                      <text fill="#ffffff" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="230" y="55">
                        B-212
                      </text>
                      <circle className="fill-secondary" cx="250" cy="40" r="3"></circle>

                      {/* Additional schematic units */}
                      <rect className="fill-surface-container-high stroke-outline-variant" height="42" rx="4" strokeWidth="0.8" width="100" x="270" y="30"></rect>
                      <text fill="#a68a8d" fontFamily="Inter" fontSize="9" textAnchor="middle" x="320" y="55">Server Annex</text>

                      <rect className="fill-surface-container-high stroke-outline-variant" height="42" rx="4" strokeWidth="0.8" width="100" x="30" y="90"></rect>
                      <text fill="#a68a8d" fontFamily="Inter" fontSize="9" textAnchor="middle" x="80" y="115">Staff Lounge</text>

                      <rect className="fill-surface-container-high stroke-outline-variant" height="42" rx="4" strokeWidth="0.8" width="80" x="200" y="90"></rect>
                      <text fill="#a68a8d" fontFamily="Inter" fontSize="9" textAnchor="middle" x="240" y="115">Seminar Pod</text>

                      <rect className="fill-surface-container-high stroke-outline-variant" height="42" rx="4" strokeWidth="0.8" width="80" x="290" y="90"></rect>
                      <text fill="#a68a8d" fontFamily="Inter" fontSize="9" textAnchor="middle" x="330" y="115">Restrooms • Lift</text>
                    </svg>

                    <div className="absolute bottom-2 right-2">
                      <Link
                        to="/smartroom"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container/80 hover:bg-secondary-container text-white font-caption text-caption font-semibold transition-colors shadow"
                      >
                        <span>Open Interactive 3D Spatial Map →</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Room List on this Level */}
                <div className="flex flex-col gap-2 mt-2">
                  {activeFacilityRooms.length > 0 ? (
                    activeFacilityRooms.map((rm) => (
                      <div
                        key={rm.roomNumber || rm._id}
                        onClick={() => handleSelectRoomForEditor(rm)}
                        className={`p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer border ${
                          roomConfig.roomNumber === rm.roomNumber
                            ? 'bg-surface-variant border-primary/40 shadow-sm'
                            : 'bg-surface-variant/70 hover:bg-surface-variant border-outline-variant/10'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                            {rm.type?.includes('Robotics')
                              ? 'smart_toy'
                              : rm.type?.includes('Pod')
                              ? 'group_work'
                              : 'videocam'}
                          </span>
                          <div>
                            <div className="font-title-md text-title-md text-on-surface leading-snug flex items-center gap-1.5 font-bold">
                              <span>Room {rm.roomNumber}</span>
                              <span className="font-caption text-caption text-on-surface-variant font-normal">
                                • {rm.name || rm.type}
                              </span>
                            </div>
                            <div className="font-caption text-caption text-on-surface-variant">
                              Cap: {rm.capacity} • {(rm.features || []).slice(0, 3).join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full font-caption text-caption font-semibold ${
                              rm.status === 'occupied'
                                ? 'bg-primary-container/40 text-primary'
                                : rm.status === 'available'
                                ? 'bg-surface-container-high text-secondary'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {rm.status === 'occupied'
                              ? 'In-Use'
                              : rm.status === 'available'
                              ? 'Available Now'
                              : rm.status}
                          </span>
                          <span className="text-secondary text-caption hover:underline flex items-center gap-0.5">
                            Configure <span className="material-symbols-outlined text-[14px]">tune</span>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-on-surface-variant font-caption text-caption bg-surface-container-low rounded-lg">
                      No rooms registered on {selectedFloor} yet.{' '}
                      <button
                        onClick={() => setShowAddRoomModal(true)}
                        className="text-primary hover:underline font-semibold"
                      >
                        + Add first room
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Floors (Switchable Accordions) */}
              {['Level 1', 'Level 3', 'Ground Floor']
                .filter((f) => f !== selectedFloor)
                .map((fName) => (
                  <div
                    key={fName}
                    onClick={() => setSelectedFloor(fName)}
                    className="bg-surface-container/60 hover:bg-surface-container p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors border border-outline-variant/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-on-surface-variant"></span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {fName} • Floor Plate &amp; Labs
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-caption text-caption text-on-surface-variant">
                        {rooms.filter((r) => r.floor === fName && (r.buildingCode === activeFacility.code || r.building === activeFacility.name)).length || 10} Rooms
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Space Configuration Inline Drawer / Panel */}
          <div
            className="bg-surface-variant rounded-xl p-space-md shadow-md transition-all border border-outline-variant/20"
            id="room-editor-panel"
          >
            <div className="flex items-center justify-between pb-2 mb-3 bg-surface-container -mx-space-md -mt-space-md px-space-md pt-3 rounded-t-xl border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  Quick Space Configuration
                </span>
              </div>
              <span className="font-caption text-caption text-secondary font-mono bg-surface-container-high px-2 py-0.5 rounded font-bold">
                {roomConfig.roomNumber}
              </span>
            </div>

            <form onSubmit={handleSaveRoomConfig} className="flex flex-col gap-3 font-body-sm text-body-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Room Identifier
                  </label>
                  <input
                    value={roomConfig.roomNumber}
                    onChange={(e) => setRoomConfig({ ...roomConfig, roomNumber: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30 font-mono font-bold"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Max Seating Capacity
                  </label>
                  <input
                    value={roomConfig.capacity}
                    onChange={(e) => setRoomConfig({ ...roomConfig, capacity: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Room Classification
                  </label>
                  <input
                    value={roomConfig.type}
                    onChange={(e) => setRoomConfig({ ...roomConfig, type: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Live Operational Status
                  </label>
                  <select
                    value={roomConfig.status}
                    onChange={(e) => setRoomConfig({ ...roomConfig, status: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Hardware & Sensor IoT Tags */}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-semibold">
                  Configured Hardware &amp; Sensor IoT Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {roomConfig.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-caption text-caption border border-outline-variant/30"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeatureTag(feature)}
                        className="hover:text-primary leading-none ml-1 font-bold text-on-surface-variant"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {showTagInput ? (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={newEquipmentTag}
                        onChange={(e) => setNewEquipmentTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeatureTag())}
                        placeholder="e.g. CO2 Sensor"
                        className="px-2 py-0.5 bg-surface-container-lowest text-xs rounded border border-primary focus:outline-none w-32"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddFeatureTag}
                        className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-xs"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTagInput(false)}
                        className="text-xs text-on-surface-variant hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowTagInput(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary hover:text-white font-caption text-caption transition-colors border border-secondary/30"
                    >
                      + Add Equipment
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Timetable Automation Rule
                </label>
                <div className="flex items-center gap-2 p-2 rounded bg-surface-container-low font-caption text-caption text-secondary border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  <span>{roomConfig.timetableRule}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <Link
                  to="/directory"
                  className="font-caption text-caption text-on-surface-variant hover:text-secondary flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>Directory Record</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const found = rooms.find((r) => r.roomNumber === roomConfig.roomNumber);
                      if (found) handleSelectRoomForEditor(found);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors"
                    type="button"
                  >
                    Reset
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary font-label-md text-label-md transition-colors shadow font-semibold"
                    type="submit"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Institutional Prototype Footer Notice */}
      <div className="bg-surface-container rounded-lg p-space-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant font-caption text-caption mb-space-md border border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
          <span>
            NextCampus Spatial Architecture Engine v4.18 • Data configured for{' '}
            <strong>Apex Polytechnic Institute</strong> facilities masterplan.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Spatial GIS WebGL: Online</span>
          <span>•</span>
          <span>SmartRooms Protocol: Active</span>
          <span>•</span>
          <Link to="/campus-map" className="text-primary hover:underline font-semibold">
            Campus Map
          </Link>
          <span>•</span>
          <Link to="/directory" className="text-secondary hover:underline font-semibold">
            Directory
          </Link>
        </div>
      </div>

      {/* MODAL: Register / Edit Building */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
          <div className="bg-surface-variant w-full max-w-xl rounded-xl shadow-[0_16px_40px_rgba(172,39,79,0.25)] p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">add_business</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {editingBuilding ? 'Edit Campus Facility' : 'Register New Campus Facility'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddBuildingModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveBuilding} className="flex flex-col gap-space-sm font-body-sm text-body-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Building Name *
                  </label>
                  <input
                    value={buildingForm.name}
                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                    placeholder="e.g. Marie Curie Pavilion"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Building Code *
                  </label>
                  <input
                    value={buildingForm.code}
                    onChange={(e) => setBuildingForm({ ...buildingForm, code: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30 font-mono"
                    placeholder="e.g. BLOCK E-05"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Primary Quad Precinct
                  </label>
                  <select
                    value={buildingForm.precinct}
                    onChange={(e) => setBuildingForm({ ...buildingForm, precinct: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                  >
                    <option value="North Quadrangle">North Quadrangle</option>
                    <option value="South Tech Precinct">South Tech Precinct</option>
                    <option value="East Residential Commons">East Residential Commons</option>
                    <option value="West Innovation District">West Innovation District</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Total Floor Plates
                  </label>
                  <input
                    value={buildingForm.totalFloors}
                    onChange={(e) => setBuildingForm({ ...buildingForm, totalFloors: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                    max="25"
                    min="1"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Assigned Departments / Faculties
                </label>
                <input
                  value={buildingForm.departments}
                  onChange={(e) => setBuildingForm({ ...buildingForm, departments: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                  placeholder="e.g. School of Biological Sciences, Bio-Genetics"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    Gross Floor Area (m²)
                  </label>
                  <input
                    value={buildingForm.grossFloorArea}
                    onChange={(e) => setBuildingForm({ ...buildingForm, grossFloorArea: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                    type="number"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                    BIM CAD Schema Linked
                  </label>
                  <select
                    value={buildingForm.cadSchema}
                    onChange={(e) => setBuildingForm({ ...buildingForm, cadSchema: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                  >
                    <option value="Auto-Import from Revit Cloud (IFC4)">Auto-Import from Revit Cloud (IFC4)</option>
                    <option value="Manual DXF / DWG Upload">Manual DXF / DWG Upload</option>
                    <option value="Pending Architect Blueprint">Pending Architect Blueprint</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  onClick={() => setShowAddBuildingModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary font-label-md text-label-md transition-colors shadow font-bold"
                  type="submit"
                >
                  {editingBuilding ? 'Save Changes' : 'Create Facility Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Safe Delete Confirmation Dialog with Dependency Checks */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
          <div className="bg-surface-variant w-full max-w-lg rounded-xl shadow-[0_16px_40px_rgba(172,39,79,0.35)] p-space-lg flex flex-col gap-space-md border border-error/30">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Confirm Deletion: {showDeleteModal.name}
              </h3>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              You are about to delete building code{' '}
              <strong className="text-on-surface font-mono">{showDeleteModal.code}</strong>.
            </p>

            {deleteError && (
              <div className="p-3 rounded-lg bg-error-container/40 text-on-error-container border border-error/40 text-caption font-caption flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1 text-error">
                  <span className="material-symbols-outlined text-[16px]">error</span> Dependent Record Conflict:
                </span>
                <span>{deleteError}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-2 text-caption font-caption">
              <input
                id="cascade-check"
                type="checkbox"
                checked={confirmCascade}
                onChange={(e) => setConfirmCascade(e.target.checked)}
                className="mt-0.5 rounded bg-surface-container text-primary-container focus:ring-0"
              />
              <label htmlFor="cascade-check" className="text-on-surface leading-tight cursor-pointer">
                <strong>I understand that cascading deletion will remove all associated rooms and floor topologies.</strong>{' '}
                Check this box to safely cascade delete all dependent records without leaving orphaned spatial nodes.
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDeleteBuilding}
                className="px-5 py-2 rounded-lg bg-error-container text-on-error font-label-md text-label-md hover:bg-opacity-90 transition-colors shadow font-bold"
                type="button"
              >
                Permanently Delete Building
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Room to Facility */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
          <div className="bg-surface-variant w-full max-w-lg rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">meeting_room</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Add SmartRoom to {activeFacility.name} ({selectedFloor})
                </h3>
              </div>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 font-body-sm text-body-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B-215"
                    value={newRoomForm.roomNumber}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, roomNumber: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newRoomForm.capacity}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, capacity: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                  Room Name / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cognitive Systems Seminar Room"
                  value={newRoomForm.name}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                    Classification
                  </label>
                  <select
                    value={newRoomForm.type}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, type: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                  >
                    <option value="Smart Classrooms">Smart Classrooms</option>
                    <option value="Lecture Theatres">Lecture Theatres</option>
                    <option value="Computer Labs">Computer Labs</option>
                    <option value="Autonomous Robotics Lab">Autonomous Robotics Lab</option>
                    <option value="Quiet Team Study Pod">Quiet Team Study Pod</option>
                    <option value="Seminar Pod">Seminar Pod</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newRoomForm.status}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, status: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-caption font-caption text-on-surface-variant uppercase font-semibold mb-1">
                  Equipment IoT Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Dual 4K Laser Projector, Mic Array, NFC Lock"
                  value={newRoomForm.features}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, features: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary font-label-md text-label-md font-bold shadow"
                >
                  Save SmartRoom
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
