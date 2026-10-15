import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Building2,
  Users,
  Compass,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  Check,
  Calendar,
  LifeBuoy,
  BookOpen,
  Sparkles,
  ArrowRight,
  Navigation,
  CheckCircle2,
  ExternalLink,
  Copy,
  GraduationCap,
  Briefcase,
  X,
  ShieldCheck,
  Radio,
  FileText,
  LayoutGrid,
  List,
  Layers,
  ArrowUpRight,
  Share2,
  Info
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import api from '../services/api';

// ============================================================================
// DATA: Comprehensive Institutional Directory & Spatial Registry
// ============================================================================
const INITIAL_BUILDINGS = [
  {
    id: 'main',
    name: 'Main Academic & Administrative Building',
    subtitle: 'University Secretariat & Administrative Council',
    block: 'Block MAIN-01',
    floors: '4 Floors',
    description:
      'Central university flagship building with expansive solar rooftop arrays, registrar office, admissions desk, accounts, and examination branch.',
    hours: '08:30 AM – 06:00 PM',
    occupancy: '62% Footfall • Nominal',
    routeNote: 'Main Campus Boulevard Entrance',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    depts: ['Academic Registry', 'Examination Branch', 'Finance & Accounts', 'Student Welfare']
  },
  {
    id: 'eng',
    name: 'Faculty of Engineering & Technology',
    subtitle: 'Computer Science, AI & Autonomous Systems',
    block: 'Block ENG-02',
    floors: '4 Floors',
    description:
      'Home to the School of Computing, High-Performance AI Labs, CAD vector nodes, and Multi-media Lecture Theatres B-201 to B-208.',
    hours: '08:00 AM – 08:00 PM',
    occupancy: '74% Footfall • Nominal',
    routeNote: 'East Academic Promenade Entrance',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    depts: ['Computer Science & Eng', 'Robotics & AI', 'Electrical & VLSI', 'Mechanical Eng']
  },
  {
    id: 'law',
    name: 'Faculty of Law & Legal Studies',
    subtitle: 'Judicial Studies, Moot Court & Legal Aid',
    block: 'Block LAW-01',
    floors: '3 Floors',
    description:
      'Dedicated legal education wing with modern simulated moot court halls, law library, and jurisprudence seminar rooms.',
    hours: '08:30 AM – 05:30 PM',
    occupancy: '65% Footfall • Nominal',
    routeNote: 'Southeast Promenade near Mess & Courts',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    depts: ['Constitutional Law', 'Criminal Jurisprudence', 'Corporate Law', 'Legal Aid Clinic']
  },
  {
    id: 'teacher',
    name: 'Teachers & Faculty Academic Building',
    subtitle: 'Faculty Chambers, Research & HOD Cabins',
    block: 'Block FAC-01',
    floors: '3 Floors',
    description:
      'Academic faculty offices, research scholar stations, consultation cabins, and departmental meeting lounges.',
    hours: '08:30 AM – 06:30 PM',
    occupancy: '55% Footfall • Quiet Zone',
    routeNote: 'East of Engineering Building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    depts: ['Faculty Affairs', 'Research & Development', 'Departmental HODs', 'Doctoral Studies']
  },
  {
    id: 'mess',
    name: 'Central Student Dining Mess',
    subtitle: 'Campus Catering & Multi-Counter Dining',
    block: 'Block MSS-01',
    floors: '2 Floors',
    description:
      'Multi-counter student dining complex providing daily nutritional meal plans, vegetarian mess lines, and evening cafeteria refreshments.',
    hours: '07:00 AM – 09:30 PM',
    occupancy: '88% Footfall • Peak Lunch',
    routeNote: 'Central Dining Walkway South of Engineering',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80',
    depts: ['Dining Services', 'Student Mess Committee', 'Quality & Hygiene Control']
  },
  {
    id: 'gora',
    name: 'Gora Boys Residential Hostel',
    subtitle: 'Student Residence & Quadrangle Living',
    block: 'Block HST-03',
    floors: '3 Floors',
    description:
      'Spacious boys residential hostel block built around an open courtyard with reading rooms, recreation facilities, and Wi-Fi.',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    occupancy: '90% Resident Footfall',
    routeNote: 'North Central Residential Precinct',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    depts: ['Hostel Warden Office', 'Student Living Council', 'Maintenance Outpost']
  },
  {
    id: 'sanaga',
    name: 'Sanaga Boys Residential Hostel',
    subtitle: 'Senior Student Residential Wing',
    block: 'Block HST-04',
    floors: '4 Floors',
    description:
      'Air-cooled boys residential blocks with high-speed campus LAN, study lounges, laundry amenities, and 24/7 security station.',
    hours: 'Open 24/7 (Curfew 09:30 PM)',
    occupancy: '91% Resident Footfall',
    routeNote: 'Northeast Residential Boulevard',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    depts: ['Senior Warden Office', 'Student Council', 'Security Post']
  },
  {
    id: 'padmani',
    name: 'Padmani Girls Residential Hostel',
    subtitle: 'Female Student Residential Precinct (North Wing)',
    block: 'Block HST-09',
    floors: '3 Floors',
    description:
      'Secure female student accommodation complex located immediately north of Mira Hostel featuring rooftop solar array, air-cooled rooms, study hall, and 24/7 security station.',
    hours: 'Open 24/7 (In-Time 07:30 PM)',
    occupancy: '82% Resident Footfall',
    routeNote: 'West Residential Precinct North of Mira Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    depts: ['Hostel Warden Office', 'Student Council', 'Security Post']
  },
  {
    id: 'mira',
    name: 'Mira Girls Residential Hostel',
    subtitle: 'Female Student Residential Precinct (Central Wing)',
    block: 'Block HST-01',
    floors: '3 Floors',
    description:
      'Secure female residence quarters with central open courtyard, reading hall, and dedicated warden outpost situated between Padmani and Panna Hostels.',
    hours: 'Open 24/7 (Curfew 09:00 PM)',
    occupancy: '88% Resident Footfall',
    routeNote: 'West Residential Precinct between Padmani & Panna',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    depts: ['Chief Warden (Girls)', 'Student Welfare', 'Biometric Security Desk']
  },
  {
    id: 'panna',
    name: 'Panna Girls Residential Hostel',
    subtitle: 'Female Student Residential Precinct (South Wing)',
    block: 'Block HST-02',
    floors: '3 Floors',
    description:
      'Secure female student quarters, air-cooled living units, study rooms, and attached dining mess located south of Mira Hostel.',
    hours: 'Open 24/7 (Curfew 09:00 PM)',
    occupancy: '85% Resident Footfall',
    routeNote: 'West Residential Precinct South of Mira Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    depts: ['Resident Warden', 'Common Study Hall', 'Security Desk']
  },
  {
    id: 'hospital',
    name: 'University Hospital & Health Centre',
    subtitle: '24/7 Emergency Medical & Pharmacy',
    block: 'Block MED-01',
    floors: 'Ground Floor Wing',
    description:
      '24/7 on-campus medical clinic, emergency triage, resident medical practitioners, ambulance service, and pharmacy dispensary.',
    hours: 'Open 24/7 Emergency Care',
    occupancy: '25% Capacity • Normal',
    routeNote: 'North Medical Wing adjacent to Gora Hostel',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    depts: ['Emergency Medicine', 'General OPD', 'Dispensary & Pharmacy', 'Ambulance Bay']
  }
];

const INITIAL_FACULTY = [
  {
    id: 'f1',
    bldgId: 'eng',
    name: 'Prof. Ananya Roy, Ph.D.',
    title: 'Professor & Chair of Distributed Systems',
    dept: 'School of Computing & Artificial Intelligence',
    room: 'Room B-204 (Level 2)',
    bldgName: 'Faculty of Engineering (Block ENG-02)',
    email: 'ananya.roy@mewaruniversity.ac.in',
    phone: '+91 1471-291148 Ext. 4821',
    officeHours: 'Mon & Wed: 2:00 PM – 4:30 PM (Walk-In)',
    status: 'In Office Hours Now',
    statusType: 'available',
    initials: 'AR',
    researchAreas: ['Distributed Consensus', 'Cloud Architecture', 'Fault-Tolerant Systems'],
    slots: ['02:00 PM - 02:20 PM', '02:30 PM - 02:50 PM', '03:15 PM - 03:35 PM']
  },
  {
    id: 'f2',
    bldgId: 'eng',
    name: 'Dr. Vikram Seth, Ph.D.',
    title: 'Associate Professor of Machine Learning',
    dept: 'Department of Computer Science & Engineering',
    room: 'Room B-203 (Level 2 Systems Lab)',
    bldgName: 'Faculty of Engineering (Block ENG-02)',
    email: 'vikram.seth@mewaruniversity.ac.in',
    phone: '+91 1471-291148 Ext. 4310',
    officeHours: 'Tue & Thu: 10:00 AM – 12:30 PM',
    status: 'In Lecture until 1:00 PM',
    statusType: 'busy',
    initials: 'VS',
    researchAreas: ['Deep Neural Networks', 'Edge AI Vision', 'CUDA Optimization'],
    slots: ['10:00 AM - 10:20 AM', '10:45 AM - 11:05 AM', '11:30 AM - 11:50 AM']
  },
  {
    id: 'f3',
    bldgId: 'eng',
    name: 'Dr. Emily Nakamura, Ph.D.',
    title: 'Head of Robotics & Autonomous Systems',
    dept: 'Mechatronics & Autonomous Drone Labs',
    room: 'Room B-205 (Level 2 AI Lab)',
    bldgName: 'Faculty of Engineering (Block ENG-02)',
    email: 'e.nakamura@mewaruniversity.ac.in',
    phone: '+91 1471-291148 Ext. 5102',
    officeHours: 'Daily 3:00 PM – 5:00 PM (Drop-in Desk #14)',
    status: 'In Robotics Laboratory',
    statusType: 'busy',
    initials: 'EN',
    researchAreas: ['ROS2 Swarm Robotics', 'Autonomous Drones', 'LiDAR SLAM'],
    slots: ['03:00 PM - 03:20 PM', '03:45 PM - 04:05 PM', '04:30 PM - 04:50 PM']
  },
  {
    id: 'f4',
    bldgId: 'admin',
    name: 'Prof. K. Venkatesh, Ph.D.',
    title: 'Professor of Mathematical Sciences',
    dept: 'Department of Mathematics & Neural Models',
    room: 'Room S-108 (Level 1)',
    bldgName: 'Maharana Pratap Block (ADM-01)',
    email: 'k.venkatesh@mewaruniversity.ac.in',
    phone: '+91 1471-291148 Ext. 4118',
    officeHours: 'Tue & Fri: 1:00 PM – 3:00 PM',
    status: 'Available Now',
    statusType: 'available',
    initials: 'KV',
    researchAreas: ['Linear Algebra & Tensors', 'Spectral Graph Theory', 'Quantum Computing'],
    slots: ['01:00 PM - 01:20 PM', '01:45 PM - 02:05 PM', '02:30 PM - 02:50 PM']
  }
];

const INITIAL_SERVICES = [
  {
    id: 's1',
    bldgId: 'admin',
    name: 'Office of the University Registrar & Student Records',
    dept: 'Central Administrative Desk',
    description:
      'Official academic transcripts, enrolment validation letters, degree attestations, and student identity verification.',
    location: 'Maharana Pratap Admin Block, Ground Floor East Wing',
    hours: 'Mon-Fri 09:00 AM – 05:00 PM',
    contact: 'registrar@mewaruniversity.ac.in • Ext. 101'
  },
  {
    id: 's2',
    bldgId: 'admin',
    name: 'Campus Care & Facility Operations Command',
    dept: 'Rapid Maintenance Dispatch & CAFM',
    description:
      'Rapid classroom equipment dispatch (<45 min SLA), lab repairs, network support, and institutional grievance escalation.',
    location: 'Faculty Helpdesk Command, Room ADM-04',
    hours: '24/7 Operations Desk • Hotline Ext. 108',
    contact: 'care@mewaruniversity.ac.in • Ext. 108'
  },
  {
    id: 's3',
    bldgId: 'library',
    name: 'Central Library E-Resource & Thesis Helpdesk',
    dept: 'Knowledge Commons Advisory',
    description:
      'Assistance with IEEE Xplore, ACM Digital Library, plagiarism checking, and research citation repositories.',
    location: 'Swami Vivekananda Library, Level 1 Digital Wing',
    hours: 'Daily 08:30 AM – 08:00 PM',
    contact: 'library@mewaruniversity.ac.in • Ext. 302'
  }
];

export function CampusDirectory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'faculty' | 'buildings' | 'services'
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Data State with Server Sync
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [services, setServices] = useState(INITIAL_SERVICES);

  // Detail Drawer / Modal State
  const [selectedItem, setSelectedItem] = useState(null);

  // Office Consultation Booking Modal
  const [bookingModalFaculty, setBookingModalFaculty] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationTopic, setConsultationTopic] = useState('Capstone Project Architecture Review');
  const [bookingConfirmedPass, setBookingConfirmedPass] = useState(null);

  // Copy Feedback State
  const [copiedEmail, setCopiedEmail] = useState('');

  // Keep search query synced with URL search params
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Sync locations from API on mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await api.get('/campus/locations');
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Merge with INITIAL_BUILDINGS ensuring standard fields
          const mapped = res.data.map((b) => ({
            id: b.code ? b.code.toLowerCase().replace(/[^a-z0-9]/g, '') : b._id,
            name: b.name,
            subtitle: b.precinct || b.category || 'Campus Facility',
            block: b.code ? `Block ${b.code}` : 'Campus Block',
            floors: b.totalFloors ? `${b.totalFloors} Floors` : 'Multi-level',
            description: b.description || 'Academic facility and instructional research center.',
            hours: b.openingHours || '08:00 AM – 08:00 PM',
            occupancy: b.status === 'open' ? 'Active • Open' : 'Restricted Access',
            routeNote: b.precinct || 'Campus Grounds',
            image: b.image || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
            depts: b.departments || ['Academic Faculty']
          }));
          // Prefer distinct records
          const combined = [...INITIAL_BUILDINGS];
          mapped.forEach((m) => {
            if (!combined.some((ex) => ex.name.toLowerCase() === m.name.toLowerCase())) {
              combined.push(m);
            }
          });
          setBuildings(combined);
        }
      } catch {
        // Retain initial rich buildings
      }
    };
    loadLocations();
  }, []);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard?.writeText?.(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  // Unique list of departments across records for filter dropdown
  const departmentOptions = useMemo(() => {
    const set = new Set();
    faculty.forEach((f) => {
      if (f.dept) set.add(f.dept);
    });
    buildings.forEach((b) => {
      b.depts?.forEach((d) => set.add(d));
    });
    services.forEach((s) => {
      if (s.dept) set.add(s.dept);
    });
    return Array.from(set).sort();
  }, [faculty, buildings, services]);

  // Unique building options for filter dropdown
  const buildingOptions = useMemo(() => {
    return buildings.map((b) => ({ id: b.id, name: b.name, block: b.block }));
  }, [buildings]);

  // Filtered Faculty
  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.dept.toLowerCase().includes(q) ||
        f.room.toLowerCase().includes(q) ||
        f.bldgName.toLowerCase().includes(q) ||
        f.researchAreas.some((r) => r.toLowerCase().includes(q));

      const matchDept = departmentFilter === 'all' || f.dept.toLowerCase().includes(departmentFilter.toLowerCase());
      const matchBldg = buildingFilter === 'all' || f.bldgId === buildingFilter;
      const matchAvailable = !availableOnly || f.statusType === 'available';

      return matchSearch && matchDept && matchBldg && matchAvailable;
    });
  }, [faculty, searchQuery, departmentFilter, buildingFilter, availableOnly]);

  // Filtered Buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.block.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.depts.some((d) => d.toLowerCase().includes(q));

      const matchDept =
        departmentFilter === 'all' ||
        b.depts.some((d) => d.toLowerCase().includes(departmentFilter.toLowerCase()));
      const matchBldg = buildingFilter === 'all' || b.id === buildingFilter;

      return matchSearch && matchDept && matchBldg;
    });
  }, [buildings, searchQuery, departmentFilter, buildingFilter]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.dept.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.contact.toLowerCase().includes(q);

      const matchDept = departmentFilter === 'all' || s.dept.toLowerCase().includes(departmentFilter.toLowerCase());
      const matchBldg = buildingFilter === 'all' || s.bldgId === buildingFilter;

      return matchSearch && matchDept && matchBldg;
    });
  }, [services, searchQuery, departmentFilter, buildingFilter]);

  // Handle consultation booking confirmation
  const handleConfirmConsultation = () => {
    if (!bookingModalFaculty || !selectedSlot) return;
    const passObj = {
      passId: `MEWAR-OFFICE-${Math.floor(1000 + Math.random() * 9000)}`,
      facultyName: bookingModalFaculty.name,
      room: bookingModalFaculty.room,
      bldgName: bookingModalFaculty.bldgName,
      slot: selectedSlot,
      topic: consultationTopic,
      status: 'Confirmed'
    };
    setBookingConfirmedPass(passObj);
  };

  const totalResultsCount = useMemo(() => {
    let count = 0;
    if (activeTab === 'all' || activeTab === 'faculty') count += filteredFaculty.length;
    if (activeTab === 'all' || activeTab === 'buildings') count += filteredBuildings.length;
    if (activeTab === 'all' || activeTab === 'services') count += filteredServices.length;
    return count;
  }, [activeTab, filteredFaculty, filteredBuildings, filteredServices]);

  const clearAllFilters = () => {
    handleSearchChange('');
    setDepartmentFilter('all');
    setBuildingFilter('all');
    setAvailableOnly(false);
    setActiveTab('all');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-900 min-h-screen pb-16 font-sans">
      {/* =========================================================================
          TOP BREADCRUMB & CONTEXT STRIP
          ========================================================================= */}
      <section className="flex flex-col gap-4 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 font-semibold text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168567] animate-pulse"></span>
                NextCampus Directory • Verified Roster
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Mewar University • Gangrar, Chittorgarh
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Campus Faculty &amp; Facility Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Locate university professors, walk-in office hour schedules, academic blocks, research laboratories, and student service desks across Mewar campus grounds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/campus-map')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#168567]" />
              <span>Interactive Campus GIS</span>
            </button>
          </div>
        </div>

        {/* Compact, Verified Directory Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Academic Blocks</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{buildings.length} Blocks</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Verified Faculty</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{faculty.length} Professors</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">In Office Hours</span>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {faculty.filter((f) => f.statusType === 'available').length} Available Now
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Service Desks</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{services.length} Operations</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEARCH & MULTI-FILTER TOOLBAR
          ========================================================================= */}
      <section className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="directorySearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search faculty (Prof. Roy), department, research (Cloud, SLAM), room (B-204)..."
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3 lg:col-span-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/10 font-medium"
            >
              <option value="all">All Departments &amp; Schools</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div className="md:col-span-3 lg:col-span-3">
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/10 font-medium"
            >
              <option value="all">All Campus Buildings</option>
              {buildingOptions.map((bldg) => (
                <option key={bldg.id} value={bldg.id}>
                  {bldg.name} ({bldg.block})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Switcher Tabs + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Records', count: filteredFaculty.length + filteredBuildings.length + filteredServices.length },
              { id: 'faculty', label: 'Faculty & Advisors', count: filteredFaculty.length },
              { id: 'buildings', label: 'Academic Blocks', count: filteredBuildings.length },
              { id: 'services', label: 'Campus Services', count: filteredServices.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#168567] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                availableOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
              <span>In Office Hours</span>
            </button>

            {/* View Switcher */}
            <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Table / List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EMPTY SEARCH STATE (IF NO RESULTS)
          ========================================================================= */}
      {totalResultsCount === 0 && (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No matching campus records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              We couldn't find any results matching <strong className="text-slate-700">"{searchQuery}"</strong> with current department or building filters.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-[#168567] text-white text-xs font-bold hover:bg-[#116951] transition-all cursor-pointer"
          >
            Clear All Search Filters
          </button>
        </div>
      )}

      {/* =========================================================================
          DIRECTORY CONTENT SECTIONS
          ========================================================================= */}
      <div className="flex flex-col gap-8">
        {/* 1. FACULTY DIRECTORY & OFFICE HOURS */}
        {(activeTab === 'all' || activeTab === 'faculty') && filteredFaculty.length > 0 && (
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#168567]" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Faculty &amp; Research Advisors</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {filteredFaculty.length} Professor{filteredFaculty.length === 1 ? '' : 's'}
              </span>
            </div>

            {viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFaculty.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between gap-4 shadow-sm group hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 font-black text-base flex items-center justify-center shrink-0">
                        {fac.initials}
                      </div>

                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#168567] transition-colors">
                            {fac.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                              fac.statusType === 'available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                fac.statusType === 'available' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                              }`}
                            ></span>
                            <span>{fac.status}</span>
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#168567]">{fac.title}</span>
                        <span className="text-xs text-slate-500">{fac.dept}</span>

                        {/* Room & Contact Chips */}
                        <div className="flex flex-col gap-1 mt-2 text-xs text-slate-700">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-[#168567] shrink-0" />
                            <span className="font-semibold text-slate-900">{fac.room}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{fac.bldgName}</span>
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-slate-500 text-[11px] font-mono flex-wrap">
                            <button
                              onClick={() => copyEmail(fac.email)}
                              className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer text-left min-w-0"
                              title="Click to copy email"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="break-all">{copiedEmail === fac.email ? 'Copied! ✓' : fac.email}</span>
                            </button>
                            <span>•</span>
                            <span className="flex items-center gap-1 shrink-0">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{fac.phone}</span>
                            </span>
                          </div>

                          <div className="text-[11px] text-emerald-800 font-mono mt-1.5 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/80">
                            Office Hours: {fac.officeHours}
                          </div>
                        </div>

                        {/* Research Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {fac.researchAreas.map((res, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono"
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Consultation Booking & CAD Navigation */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Calendar}
                        className="w-full sm:w-auto justify-center"
                        onClick={() => {
                          setBookingModalFaculty(fac);
                          setSelectedSlot(fac.slots[0]);
                          setBookingConfirmedPass(null);
                        }}
                      >
                        Book Consultation
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={Navigation}
                        className="w-full sm:w-auto justify-center"
                        onClick={() =>
                          navigate(
                            `/campus-map?bldg=${fac.bldgId}&room=${encodeURIComponent(fac.room.split(' ')[1] || 'B-204')}`
                          )
                        }
                      >
                        Navigate to Office
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* COMPACT TABLE / ROW VIEW */
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-slate-500 text-[10px]">
                        <th className="py-3 px-4">Faculty Member</th>
                        <th className="py-3 px-4">Department &amp; Chair</th>
                        <th className="py-3 px-4">Office &amp; Location</th>
                        <th className="py-3 px-4">Status / Hours</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFaculty.map((fac) => (
                        <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#168567] font-bold text-xs flex items-center justify-center shrink-0">
                                {fac.initials}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900">{fac.name}</span>
                                <div className="text-[11px] text-slate-500 font-normal">{fac.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">{fac.dept}</td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            <div>{fac.room}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{fac.bldgName}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                                fac.statusType === 'available'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  fac.statusType === 'available' ? 'bg-emerald-600' : 'bg-slate-400'
                                }`}
                              ></span>
                              <span>{fac.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setBookingModalFaculty(fac);
                                  setSelectedSlot(fac.slots[0]);
                                  setBookingConfirmedPass(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Book
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/campus-map?bldg=${fac.bldgId}&room=${encodeURIComponent(fac.room.split(' ')[1] || 'B-204')}`
                                  )
                                }
                                className="px-2.5 py-1 rounded-lg bg-[#168567] hover:bg-[#116951] text-white text-xs font-semibold cursor-pointer"
                              >
                                Navigate
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 2. CAMPUS BUILDINGS & LANDMARKS */}
        {(activeTab === 'all' || activeTab === 'buildings') && filteredBuildings.length > 0 && (
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#168567]" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Academic Blocks &amp; Facilities</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {filteredBuildings.length} Facilit{filteredBuildings.length === 1 ? 'y' : 'ies'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuildings.map((bldg) => (
                <div
                  key={bldg.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={bldg.image}
                      alt={bldg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 font-mono text-xs font-bold border border-slate-200 shadow-xs">
                        {bldg.block}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{bldg.name}</h3>
                      <p className="text-xs text-[#168567] mt-0.5 font-semibold">{bldg.subtitle}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{bldg.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Hours: {bldg.hours}</span>
                        <span className="text-emerald-700 font-bold">{bldg.occupancy}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Compass}
                          onClick={() => navigate(`/campus-map?bldg=${bldg.id}`)}
                        >
                          View Map
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={ArrowUpRight}
                          onClick={() => navigate(`/smartrooms?search=${encodeURIComponent(bldg.block)}`)}
                        >
                          SmartRooms
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. ADMINISTRATIVE & STUDENT SERVICES */}
        {(activeTab === 'all' || activeTab === 'services') && filteredServices.length > 0 && (
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-[#168567]" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Administrative &amp; Student Service Desks</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {filteredServices.length} Service{filteredServices.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-[#168567] uppercase font-bold tracking-wider">
                      {srv.dept}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">{srv.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.description}</p>
                    <div className="text-xs text-slate-700 font-medium mt-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#168567]" />
                      <span>{srv.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">{srv.contact}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Compass}
                      className="flex-1"
                      onClick={() => navigate(`/campus-map?bldg=${srv.bldgId}`)}
                    >
                      View Location
                    </Button>
                    {srv.id === 's2' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={ArrowRight}
                        onClick={() => navigate('/care')}
                      >
                        Helpdesk
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* =========================================================================
          MODAL: BOOK FACULTY OFFICE CONSULTATION
          ========================================================================= */}
      {bookingModalFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-6 flex flex-col gap-4 text-slate-900 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#168567]" />
                <h3 className="text-base font-bold text-slate-900">Book Office Hour Consultation</h3>
              </div>
              <button
                onClick={() => setBookingModalFaculty(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingConfirmedPass ? (
              <div className="p-4 rounded-xl bg-gradient-to-b from-slate-50 to-white border-2 border-emerald-500 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {bookingConfirmedPass.passId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                    Confirmed
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{bookingConfirmedPass.facultyName}</h4>
                  <p className="text-xs text-slate-500">{bookingConfirmedPass.room}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
                  <span>Slot Time: <strong className="text-emerald-700">{bookingConfirmedPass.slot}</strong></span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Topic: {bookingConfirmedPass.topic}</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-2"
                  onClick={() => setBookingModalFaculty(null)}
                >
                  Close &amp; Return to Directory
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                  <span className="text-slate-500 font-medium">Faculty Member</span>
                  <span className="font-bold text-slate-900 text-sm">{bookingModalFaculty.name}</span>
                  <span className="text-[#168567] font-medium">{bookingModalFaculty.room}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Select Available Slot</label>
                  <div className="grid grid-cols-1 gap-2">
                    {bookingModalFaculty.slots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-left font-mono font-semibold transition-all cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-[#EAF5EF] text-[#168567] border-[#168567]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        {slot} (Today)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Consultation Subject</label>
                  <input
                    type="text"
                    value={consultationTopic}
                    onChange={(e) => setConsultationTopic(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/10"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBookingModalFaculty(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmConsultation}
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CampusDirectory;
