import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const INITIAL_PROJECTS = [
  {
    _id: 'proj-1',
    title: 'CampusNav AI: LiDAR & Computer Vision Indoor Wayfinding',
    category: 'AI & Machine Learning',
    status: 'In Progress (Sprint 3)',
    statusBadge: 'recruiting',
    department: 'School of Computing & Cybernetics • Autonomous Systems Lab',
    description: 'Developing an edge-computing visual localization engine for indoor navigation in multi-floor campus complexes like Alan Turing Hall, utilizing low-power sensor rigs and vector embeddings.',
    tags: ['PyTorch', 'Python', 'ROS2', 'OpenCV', 'WebSockets'],
    progress: 65,
    teamSizeMax: 5,
    leadStudent: { name: 'Aarav Sharma', avatarText: 'AS', department: 'CS 25' },
    currentMembers: [
      { id: 'm1', name: 'Aarav Sharma', avatarText: 'AS' },
      { id: 'm2', name: 'Priya K.', avatarText: 'PK' },
      { id: 'm3', name: 'Leo M.', avatarText: 'LM' }
    ],
    openRoles: ['Frontend / Three.js Engineer', 'UI/UX Designer'],
    sprintDemo: 'Dec 4, 2026'
  },
  {
    _id: 'proj-2',
    title: 'Autonomous Quad Mail & Sample Courier Drone',
    category: 'Robotics & IoT',
    status: 'Building Prototype',
    statusBadge: 'recruiting',
    department: 'Mechatronics & Robotics Society • Innovation Hub Lab 4',
    description: 'Building a GPS-denied autonomous aerial courier system for transporting biological research samples and inter-departmental mail between Ramanujan Science Complex and Medical Block.',
    tags: ['PX4 Autopilot', 'C++', 'FreeRTOS', 'SolidWorks', 'Telemetry Mesh'],
    progress: 40,
    teamSizeMax: 5,
    leadStudent: { name: 'Elena Rostova', avatarText: 'ER', department: 'Robotics 26' },
    currentMembers: [
      { id: 'm4', name: 'Elena Rostova', avatarText: 'ER' },
      { id: 'm5', name: 'Devan Patel', avatarText: 'DP' },
      { id: 'm6', name: 'Farhan K.', avatarText: 'FK' },
      { id: 'm7', name: 'Mei Lin', avatarText: 'ML' }
    ],
    openRoles: ['Embedded Firmware Engineer'],
    sprintDemo: 'Nov 28, 2026'
  },
  {
    _id: 'proj-3',
    title: 'PeerTutor: Algorithmic Study Group & Skill Exchange',
    category: 'Full-Stack & Web',
    status: 'Ideation & Specs',
    statusBadge: 'recruiting',
    department: 'Student Union Academic Council • Turing Hall Level 2',
    description: 'A peer-to-peer knowledge matching platform pairing junior engineering students with verified senior mentors based on course syllabi, homework milestones, and free time slots.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    progress: 25,
    teamSizeMax: 5,
    leadStudent: { name: 'Sarah Chen', avatarText: 'SC', department: 'Software Eng' },
    currentMembers: [
      { id: 'm8', name: 'Sarah Chen', avatarText: 'SC' },
      { id: 'm9', name: 'Marcus V.', avatarText: 'MV' }
    ],
    openRoles: ['Full-Stack Developer', 'Product Designer', 'QA Tester'],
    sprintDemo: 'Dec 15, 2026'
  },
  {
    _id: 'proj-4',
    title: 'EcoCampus SmartBin Optical Trash Classifier',
    category: 'Sustainability & CleanTech',
    status: 'Active Sprint',
    statusBadge: 'recruiting',
    department: 'Green Campus Charter • Environmental Eng',
    description: 'IoT solar-powered bin attachment running lightweight Edge Impulse AI to automatically categorize and weigh compostable vs recyclable dining waste in real-time.',
    tags: ['Edge Impulse', 'Raspberry Pi', 'TensorFlow Lite', 'LoRaWAN'],
    progress: 82,
    teamSizeMax: 4,
    leadStudent: { name: 'Rohan Gupta', avatarText: 'RG', department: 'Environmental CS' },
    currentMembers: [
      { id: 'm10', name: 'Rohan Gupta', avatarText: 'RG' },
      { id: 'm11', name: 'Anika Roy', avatarText: 'AR' }
    ],
    openRoles: ['Hardware Sensor Tech', 'Mobile App Dev'],
    sprintDemo: 'Oct 30, 2026'
  }
];

export function SkillCampus() {
  const { user } = useContext(AuthContext) || {};

  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [targetProject, setTargetProject] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Create project form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('AI & Machine Learning');
  const [newDescription, setNewDescription] = useState('');
  const [newDepartment, setNewDepartment] = useState('School of Computing & Cybernetics');
  const [newTags, setNewTags] = useState('React, Python, Node.js');
  const [newRole, setNewRole] = useState('Frontend Developer');

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/skillcampus/projects');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProjects(res.data);
      }
    } catch (err) {
      // Keep initial rich data fallback if unpopulated
    }
  };

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Title and description are required.');
      return;
    }

    const tagsArray = newTags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: newTitle,
      category: newCategory,
      description: newDescription,
      department: newDepartment,
      tags: tagsArray,
      openRoles: [newRole],
      progress: 10,
      teamSizeMax: 5
    };

    try {
      const res = await api.post('/skillcampus/projects', payload);
      if (res && res.success) {
        showToast('Project created successfully!');
        setProjects((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      // Local fallback
      const localProj = {
        _id: `proj-local-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        status: 'Recruiting Team',
        department: newDepartment,
        description: newDescription,
        tags: tagsArray,
        progress: 10,
        teamSizeMax: 5,
        leadStudent: { name: user?.name || 'Aarav Sharma', avatarText: user?.name ? user.name.charAt(0) : 'AS' },
        currentMembers: [{ id: user?.id || 'm-me', name: user?.name || 'Aarav Sharma', avatarText: 'AS' }],
        openRoles: [newRole],
        sprintDemo: 'Next Term'
      };
      setProjects((prev) => [localProj, ...prev]);
      showToast(`Project "${newTitle}" registered in incubator!`);
    } finally {
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const handleOpenApplyModal = (proj, role) => {
    setTargetProject(proj);
    setSelectedRole(role || (proj.openRoles && proj.openRoles[0]) || 'Contributor');
    setShowApplyModal(true);
  };

  const handleConfirmJoin = async () => {
    if (!targetProject) return;

    try {
      const res = await api.post(`/skillcampus/projects/${targetProject._id}/join`, {});
      if (res && res.success) {
        showToast(`Joined ${targetProject.title} as ${selectedRole}!`);
        fetchProjects();
      }
    } catch (err) {
      // Handle duplicate check error or local fallback simulation
      const errMessage = err.data?.message || err.message || '';
      if (errMessage.includes('already a member')) {
        showToast('Duplicate Membership Blocked: You are already a registered member or lead of this project.', 'error');
      } else {
        // Local simulation for UI demo
        setProjects((prev) =>
          prev.map((p) => {
            if (p._id === targetProject._id) {
              const myAvatar = user?.name ? user.name.charAt(0) : 'AS';
              const myName = user?.name || 'You';
              const isAlreadyIn = p.currentMembers.some((m) => m.name === myName || m.avatarText === myAvatar);
              if (isAlreadyIn) {
                showToast('Duplicate Membership Blocked: You are already in this team!', 'error');
                return p;
              }
              showToast(`Successfully joined "${p.title}" as ${selectedRole}!`);
              return {
                ...p,
                currentMembers: [...p.currentMembers, { id: `m-${Date.now()}`, name: myName, avatarText: myAvatar }]
              };
            }
            return p;
          })
        );
      }
    } finally {
      setShowApplyModal(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
          notification.type === 'error' ? 'bg-error-container text-on-error border-red-500/50' : 'bg-primary-container text-on-primary-container border-primary'
        }`}>
          <span className="material-symbols-outlined text-[20px]">{notification.type === 'error' ? 'error' : 'check_circle'}</span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Page Header & Kicker */}
      <div className="flex flex-col gap-space-lg mb-space-xl">
        <div className="flex flex-wrap items-center justify-between gap-space-sm text-caption">
          <div className="flex items-center gap-space-xs font-mono tracking-wider uppercase text-on-surface-variant/90">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-bold text-primary">Academic Incubation</span>
            <span className="text-outline">/</span>
            <span>Oxford Brookes Core • Campus Main</span>
            <span className="text-outline">/</span>
            <span>Fall 2026 Term</span>
            <span className="text-outline">/</span>
            <span className="text-secondary bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/30">NODE #SKILL-802</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-mono">
            <span className="material-symbols-outlined text-[15px] text-tertiary">hub</span>
            <span>Mesh Peering: 1,420 Active Student Nodes</span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
          <div className="max-w-4xl space-y-2">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-md">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                SkillCampus — Student Projects &amp; Peer Collaboration
              </h1>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Discover interdisciplinary research initiatives, connect with verified peer builders, assemble agile sprint crews, and deliver portfolio-grade hardware and software solutions across faculty labs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm shrink-0">
            <button
              onClick={() => showToast('Collaborative requests feature active: 2 pending requests')}
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-sm border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">mark_chat_unread</span>
              <span>Collab Requests</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-caption font-bold">2</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary-container/90 active:scale-95 font-label-md text-label-md font-semibold transition-all shadow-md"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Create Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
        <div className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Active Incubator Projects</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">{projects.length || 38}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded-full bg-primary-container/40 text-on-primary-container text-caption font-bold font-mono">+6 this week</span>
              <span className="font-caption text-caption text-on-surface-variant">open for applications</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full w-3/4"></div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Available Roles</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">64</h3>
            <p className="font-caption text-caption text-on-surface-variant mt-1 truncate">AI/ML (22) • Frontend (18) • Robotics (14)</p>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full w-4/5"></div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Multi-Department Sync</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">diversity_3</span>
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">82%</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary text-caption font-mono">High Synergy</span>
              <span className="font-caption text-caption text-on-surface-variant">Computing + Med</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-tertiary-container h-full w-[82%]"></div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Project Showcase Rate</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed-dim">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">94%</h3>
            <p className="font-caption text-caption text-on-surface-variant mt-1">Presented at Oxford Demo Day</p>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary-container h-full w-[94%]"></div>
          </div>
        </div>
      </section>

      {/* Discovery & Filtering Toolbar */}
      <section className="rounded-xl bg-surface-container p-space-md shadow-md mb-space-lg space-y-space-md border border-outline-variant/20">
        <div className="flex flex-col md:flex-row items-center gap-space-md">
          <div className="relative w-full flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, keywords, research topic, or tech stack (e.g. PyTorch, ROS2, Next.js)..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/20"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            'All',
            'AI & Machine Learning',
            'Robotics & IoT',
            'Full-Stack & Web',
            'Mobile Apps',
            'Sustainability & CleanTech'
          ].map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container shadow-sm border border-primary/40'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat === 'All' ? `All Projects (${projects.length})` : cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Catalog List & Side Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-2xl">
        {/* Project Cards (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {filteredProjects.map((proj) => (
            <article key={proj._id} className="relative rounded-2xl bg-surface-container p-space-lg shadow-xl hover:shadow-2xl transition-all duration-200 group flex flex-col justify-between border border-outline-variant/20">
              <div className="space-y-space-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-primary-container text-on-primary-container text-caption font-bold tracking-wide uppercase font-mono">
                      {proj.category}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-tertiary text-caption font-mono border border-outline-variant/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      {proj.status || 'Recruiting'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container/50 text-secondary-fixed text-caption font-semibold border border-secondary-container/70">
                    Seeking {proj.openRoles?.length || 1} Roles
                  </span>
                </div>

                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-caption text-on-surface-variant/80 font-mono">
                  <span className="material-symbols-outlined text-[16px] text-primary">apartment</span>
                  <span>{proj.department || 'School of Computing'}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags && proj.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface text-caption font-mono font-medium border border-outline-variant/20">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Progress & Team */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-caption font-mono">
                    <span className="text-on-surface-variant">Sprint Completion Progress</span>
                    <span className="text-primary font-bold">{proj.progress || 50}% Completed</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${proj.progress || 50}%` }}></div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-caption font-mono text-on-surface-variant">
                        Team: {proj.currentMembers?.length || 1} / {proj.teamSizeMax || 5}
                      </span>
                      <div className="flex -space-x-2">
                        {proj.currentMembers && proj.currentMembers.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold shadow-md border border-surface-container"
                            title={m.name}
                          >
                            {m.avatarText || (m.name ? m.name.charAt(0) : 'M')}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {proj.openRoles && proj.openRoles.map((role, rIdx) => (
                        <span key={rIdx} className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-caption font-medium flex items-center gap-1 border border-primary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Need: {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-space-lg mt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg p-space-md rounded-b-2xl border-t border-outline-variant/20">
                <div className="flex items-center gap-2 text-caption text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">calendar_clock</span>
                  <span>Demo Date: {proj.sprintDemo || 'End of Term'}</span>
                </div>

                <button
                  onClick={() => handleOpenApplyModal(proj)}
                  className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary-container/90 active:scale-95 font-label-md text-label-md font-semibold transition-all shadow-sm"
                >
                  Apply / Join Team
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Right Peer Profile & Telemetry (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <div className="rounded-2xl bg-surface-container p-space-lg shadow-xl border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="font-bold text-on-surface text-label-md uppercase font-mono tracking-wider">Student Builder Profile</span>
              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-caption text-caption font-bold">VERIFIED</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-headline-sm font-bold shadow-md">
                {user?.name ? user.name.charAt(0) : 'AS'}
              </div>
              <div>
                <h4 className="font-title-md text-title-md font-bold text-on-surface">{user?.name || 'Aarav Sharma'}</h4>
                <p className="font-caption text-caption text-on-surface-variant">{user?.department || 'Computer Science 25'} • Oxford Brookes</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-caption font-caption text-on-surface-variant uppercase font-semibold">Endorsed Technical Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {['PyTorch', 'React.js', 'TypeScript', 'Node.js', 'Computer Vision', 'ROS2'].map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-caption font-mono border border-primary/20">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Propose New Incubator Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3">
              <div>
                <label className="block text-caption font-caption uppercase text-on-surface-variant mb-1">Project Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Autonomous Quad Courier Drone"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-caption uppercase text-on-surface-variant mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>AI &amp; Machine Learning</option>
                    <option>Robotics &amp; IoT</option>
                    <option>Full-Stack &amp; Web</option>
                    <option>Mobile Apps</option>
                    <option>Sustainability &amp; CleanTech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption font-caption uppercase text-on-surface-variant mb-1">Department Node</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-caption uppercase text-on-surface-variant mb-1">Description *</label>
                <textarea
                  rows="3"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your research goals, architecture, and sprint milestone..."
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-caption uppercase text-on-surface-variant mb-1">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-caption font-caption uppercase text-on-surface-variant mb-1">First Needed Open Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-bold shadow-md hover:bg-primary-container/90"
                >
                  Publish Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN PROJECT MODAL */}
      {showApplyModal && targetProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Join Project Team</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-on-surface text-sm">{targetProject.title}</p>
              <p className="text-on-surface-variant">Lead Student: {targetProject.leadStudent?.name || 'Project Lead'}</p>
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="text-caption text-on-surface-variant uppercase">Applying For Role:</span>
                <p className="font-bold text-primary text-sm">{selectedRole}</p>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmJoin}
                className="px-5 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-bold shadow-md hover:bg-primary-container/90"
              >
                Confirm Membership
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillCampus;
