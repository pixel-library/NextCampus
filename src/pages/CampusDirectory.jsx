import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  FileText
} from 'lucide-react';

// ============================================================================
// DATA: Comprehensive Mewar University Institutional Directory
// ============================================================================
const MEWAR_BUILDINGS = [
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
    routeNote: 'Direct Level 2 Skybridge access to Central Library',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    depts: ['Computer Science & Eng', 'Robotics & AI', 'Electrical & VLSI', 'Mechanical Eng']
  },
  {
    id: 'admin',
    name: 'Maharana Pratap Main Academic & Admin Block',
    subtitle: 'University Secretariat & Administrative Council',
    block: 'Block ADM-01',
    floors: '4 Floors',
    description:
      'Central university reception, Vice Chancellor secretariat, registrar office, admissions desk, and examination branch.',
    hours: '08:30 AM – 06:00 PM',
    occupancy: '62% Footfall • Nominal',
    routeNote: 'Main Campus Boulevard Entrance',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    depts: ['Academic Registry', 'Examination Branch', 'Finance & Accounts', 'Student Welfare']
  },
  {
    id: 'library',
    name: 'Swami Vivekananda Central Library',
    subtitle: 'Digital Reference & Research Knowledge Commons',
    block: 'Block LIB-03',
    floors: '3 Floors',
    description:
      'Quiet study zones, high-speed digital research terminals, acoustic study pods, e-resource portals, and thesis archives.',
    hours: '08:00 AM – 10:00 PM',
    occupancy: '180 Desks Free • Silent Zone',
    routeNote: 'Level 2 Connected to Engineering Block',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    depts: ['Central Lending Stacks', 'Digital Media Archives', 'Acoustic Solo Pods', 'Periodicals Wing']
  },
  {
    id: 'aud',
    name: 'Mewar University Central Auditorium',
    subtitle: 'Convocation Arena & Performing Arts',
    block: 'Block AUD-04',
    floors: '2 Tiers',
    description:
      '1,200-seat multi-tiered acoustic auditorium hall hosting annual tech fests, conferences, hackathons, and cultural assemblies.',
    hours: '08:00 AM – 09:00 PM',
    occupancy: 'Open Access for Events',
    routeNote: 'South Convocation Grounds',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    depts: ['Cultural Council', 'Performing Arts Guild', 'AV Broadcast Studio']
  }
];

const MEWAR_FACULTY = [
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

const MEWAR_SERVICES = [
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
  const [searchParams] = useSearchParams();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState('all'); // all | buildings | faculty | staff
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Office Consultation Booking Modal
  const [bookingModalFaculty, setBookingModalFaculty] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationTopic, setConsultationTopic] = useState('Capstone Project Architecture Review');
  const [bookingConfirmedPass, setBookingConfirmedPass] = useState(null);

  // Copy Feedback State
  const [copiedEmail, setCopiedEmail] = useState('');

  const copyEmail = (email) => {
    navigator.clipboard?.writeText?.(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  // Filtered Buildings
  const filteredBuildings = useMemo(() => {
    return MEWAR_BUILDINGS.filter((b) => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.block.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.depts.some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Filtered Faculty
  const filteredFaculty = useMemo(() => {
    return MEWAR_FACULTY.filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.dept.toLowerCase().includes(q) ||
        f.room.toLowerCase().includes(q) ||
        f.researchAreas.some((r) => r.toLowerCase().includes(q));

      const matchDiscipline =
        disciplineFilter === 'all' ||
        (disciplineFilter === 'computing' && f.dept.includes('Computing')) ||
        (disciplineFilter === 'engineering' && f.dept.includes('Engineering')) ||
        (disciplineFilter === 'math' && f.dept.includes('Mathematics'));

      const matchAvailable = !availableOnly || f.statusType === 'available';

      return matchSearch && matchDiscipline && matchAvailable;
    });
  }, [searchQuery, disciplineFilter, availableOnly]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return MEWAR_SERVICES.filter((s) => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.dept.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Handle consultation booking
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-100 min-h-screen pb-16">
      {/* =========================================================================
          TOP BREADCRUMB & CONTEXT STRIP
          ========================================================================= */}
      <section className="flex flex-col gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Mewar University Directory 2026
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Gangrar, Chittorgarh • Verified Academic Roster
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Campus Faculty &amp; Facility Directory
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Locate professors, live office hour walk-in availability, academic departments, research labs, and indoor CAD room directions across Mewar campus grounds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 shadow-sm">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Geo-Spatial Indoor Engine Connected</span>
            </span>
          </div>
        </div>

        {/* Quick Directory Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-2">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Academic Blocks</span>
            <div className="text-2xl font-black text-white mt-1">14 Blocks</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Verified Faculty</span>
            <div className="text-2xl font-black text-white mt-1">180+ Faculty</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">In Office Hours</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">Available Now</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">CAD Mapped</span>
            <div className="text-2xl font-black text-white mt-1">100% Vector</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEARCH & CATEGORY TOOLBAR
          ========================================================================= */}
      <section className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col gap-3.5 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-7 lg:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty (Prof. Roy, Dr. Seth), department, research area (Cloud, SLAM), room (B-204)..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-5 lg:col-span-4 flex items-center gap-2">
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="all">All Academic Disciplines</option>
              <option value="computing">School of Computing &amp; AI</option>
              <option value="engineering">Engineering &amp; Robotics</option>
              <option value="math">Mathematical Sciences</option>
            </select>

            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                availableOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              Open Now
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-800/80">
          {[
            { id: 'all', label: `All Entries (${MEWAR_BUILDINGS.length + MEWAR_FACULTY.length + MEWAR_SERVICES.length})` },
            { id: 'faculty', label: `Faculty (${filteredFaculty.length})` },
            { id: 'buildings', label: `Buildings (${filteredBuildings.length})` },
            { id: 'staff', label: `Campus Services (${filteredServices.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          DIRECTORY SECTIONS
          ========================================================================= */}
      <div className="flex flex-col gap-8">
        {/* 1. FACULTY DIRECTORY & OFFICE HOURS */}
        {(activeTab === 'all' || activeTab === 'faculty') && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Faculty &amp; Research Advisors</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredFaculty.length} Faculty Members
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaculty.map((fac) => (
                <div
                  key={fac.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4 shadow-lg backdrop-blur-md group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {fac.initials}
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {fac.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            fac.statusType === 'available'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {fac.status}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-emerald-400">{fac.title}</span>
                      <span className="text-xs text-slate-400">{fac.dept}</span>

                      {/* Room & Contact Chips */}
                      <div className="flex flex-col gap-1 mt-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-medium text-white">{fac.room}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{fac.bldgName}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-slate-400 text-[11px] font-mono">
                          <button
                            onClick={() => copyEmail(fac.email)}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                            title="Click to copy email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{copiedEmail === fac.email ? 'Copied! ✓' : fac.email}</span>
                          </button>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{fac.phone}</span>
                          </span>
                        </div>

                        <div className="text-[11px] text-emerald-300/90 font-mono mt-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                          {fac.officeHours}
                        </div>
                      </div>

                      {/* Research Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {fac.researchAreas.map((res, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: CAD Navigation & Consultation Booking */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setBookingModalFaculty(fac);
                        setSelectedSlot(fac.slots[0]);
                        setBookingConfirmedPass(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Book Consultation</span>
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/campus-map?bldg=${fac.bldgId}&room=${fac.room.split(' ')[1] || 'B-204'}`
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-[0.98]"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate to Office</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. CAMPUS BUILDINGS & LANDMARKS */}
        {(activeTab === 'all' || activeTab === 'buildings') && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Campus Academic Blocks &amp; Facilities</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredBuildings.length} Facilities
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuildings.map((bldg) => (
                <div
                  key={bldg.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between group"
                >
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={bldg.image}
                      alt={bldg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                        {bldg.block}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">{bldg.name}</h3>
                      <p className="text-xs text-emerald-400 mt-0.5 font-medium">{bldg.subtitle}</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{bldg.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Hours: {bldg.hours}</span>
                        <span className="text-emerald-400 font-bold">{bldg.occupancy}</span>
                      </div>

                      <button
                        onClick={() => navigate(`/campus-map?bldg=${bldg.id}`)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all mt-1"
                      >
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open in Campus Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. ADMINISTRATIVE & STUDENT SERVICES */}
        {(activeTab === 'all' || activeTab === 'staff') && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Administrative &amp; Student Service Desks</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      {srv.dept}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 leading-snug">{srv.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{srv.description}</p>
                    <div className="text-xs text-slate-300 font-medium mt-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{srv.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">{srv.contact}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={() => navigate(`/campus-map?bldg=${srv.bldgId}`)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Service Location</span>
                    </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Book Office Hour Consultation</h3>
              </div>
              <button
                onClick={() => setBookingModalFaculty(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingConfirmedPass ? (
              <div className="p-4 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-emerald-500 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {bookingConfirmedPass.passId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Confirmed
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{bookingConfirmedPass.facultyName}</h4>
                  <p className="text-xs text-slate-400">{bookingConfirmedPass.room}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <span>Slot Time: <strong className="text-emerald-400">{bookingConfirmedPass.slot}</strong></span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Topic: {bookingConfirmedPass.topic}</p>
                </div>
                <button
                  onClick={() => setBookingModalFaculty(null)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Close &amp; Return to Directory
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-0.5">
                  <span className="text-slate-400 font-medium">Faculty Member</span>
                  <span className="font-bold text-white text-sm">{bookingModalFaculty.name}</span>
                  <span className="text-emerald-400">{bookingModalFaculty.room}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Select Available Slot</label>
                  <div className="grid grid-cols-1 gap-2">
                    {bookingModalFaculty.slots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-left font-mono font-semibold transition-all ${
                          selectedSlot === slot
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {slot} (Today)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Consultation Subject</label>
                  <input
                    type="text"
                    value={consultationTopic}
                    onChange={(e) => setConsultationTopic(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBookingModalFaculty(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmConsultation}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                  >
                    Confirm Appointment
                  </button>
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
