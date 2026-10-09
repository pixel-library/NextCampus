import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Building,
  Users,
  UserCheck,
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
  Layers,
  ArrowRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';

export const CampusDirectory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState('all'); // all | buildings | departments | faculty | staff | facilities
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [openNowOnly, setOpenNowOnly] = useState(false);

  // Sample Directory Records
  const buildings = [
    {
      id: 'turing',
      name: 'Alan Turing Hall',
      subtitle: 'Computing & Cybernetics',
      block: 'Block A-01',
      floors: '4 Floors',
      description: 'Home to Dept. of Computer Science, AI Labs, and Multi-media Lecture Theatres B-201 to B-208.',
      hours: '07:30 AM – 10:00 PM',
      occupancy: 'Occupancy: 68%',
      skybridge: 'Skybridge to Central Library',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzYh3wsFNkpG0Wr5PmEiEPyjUf81LeiY5vJ9B9Sxyo3dx3yKkLKEvuobY_stKWREYAm-xtryUr5CzNxRyp6kWcBW6mT1RYIQTKJZ1RFKhr1tCBUBahI5VA3CoCK_p5Np_LAfs1PaC3M7y7-ya4VPmmZ6A0gZuvA1inx88ISY2DXthL3xPA_0Ju_y1UkJVdkVWxf1DF6cfxFkdwDK99UIQJqyKNJQuQEQa8WnHcYuWoBBwNhieVUe0Tg',
    },
    {
      id: 'library',
      name: 'Central Campus Library & Knowledge Commons',
      subtitle: 'Digital Reference & Research Archive',
      block: 'Block B-02',
      floors: '3 Floors',
      description: 'Quiet study zones, high-speed digital research terminals, reserve desks, and thesis archives.',
      hours: 'Open 24/7 with Student ID',
      occupancy: '142 Seats Available',
      skybridge: 'Direct Skybridge Access',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q',
    },
    {
      id: 'ramanujan',
      name: 'Ramanujan Science Complex',
      subtitle: 'Applied Physics & Computational Mathematics',
      block: 'Block C-03',
      floors: '3 Floors',
      description: 'Applied Physics, Computational Mathematics, and Hardware Prototyping Cleanrooms.',
      hours: '08:00 AM – 09:00 PM',
      occupancy: 'Occupancy: 55%',
      skybridge: 'North Quad Path',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnsBFmdYqr6jHc-tYoJj9aCEEbfKyFo5L3SLupQ0ikKDdXvkE8ZnSUMjdGmIop8z5KCO7QmVOsIqHy9HYbjtta90SqR4wGPlU-2wqtRGDiq5rUGxAyV903zRKjRYWmoztCiNad357-F5wzNP-stQIagLuV-V9RJTr5eWXoeezLsB_Qjl-q6e13GHym0Nopm46ykpFUvv08rbvxuEQW96J72Y2DHoTV7V4NV_eChXmGJjkKxk7Yk9JxWA',
    },
    {
      id: 'robotics',
      name: 'Robotics & AI Innovation Hub',
      subtitle: 'Autonomous Systems Garage',
      block: 'Block D-04',
      floors: '2 Floors',
      description: 'Hardware prototyping garage, drone flight test chamber, quadruped robotics lab, and 3D printing suites.',
      hours: '08:00 AM – 10:00 PM',
      occupancy: 'Occupancy: 72%',
      skybridge: 'East Tech Promenade',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1V6NaAN18Lf9daDEOiUCcg0Qz9TKAJTZEk9ECU3aySgNV_3O2hapiSnHSeUeScEXSjx47TLmk0cx0dsb_ZVA9EORszw3fNNN0V5EICouIgNfcs0lFyeVR0z0-fBJTvFLwabJeDl7KTSnD62my8TfA-M8AVfxPtiTO4SRRFQokqKIaWdLNfZtih4yUWkpusJLlN7f8edtZ98cv56xSSZJgS1akZwa_mq0qR3mAERMOY_rHpGJyiEVsGYmjpP',
    },
  ];

  const facultyList = [
    {
      id: 'f1',
      bldgId: 'turing',
      name: 'Prof. Ananya Roy, Ph.D.',
      title: 'Professor & Chair of Distributed Systems',
      dept: 'School of Computing & Cybernetics',
      room: 'Alan Turing Hall, Room B-204 (Level 2)',
      email: 'ananya.roy@nextcampus.edu',
      phone: 'Ext: 4821',
      officeHours: 'Office Hours Today: 2:00 PM – 4:30 PM (Walk-in)',
      status: 'Available Now',
      initials: 'AR',
    },
    {
      id: 'f2',
      bldgId: 'ramanujan',
      name: 'Dr. Vikram Seth',
      title: 'Associate Professor of Machine Learning & Neural Networks',
      dept: 'Department of Mathematics & Computing',
      room: 'Ramanujan Science Block, Room S-108',
      email: 'vikram.seth@nextcampus.edu',
      phone: 'Ext: 4310',
      officeHours: 'Office Hours Tomorrow: 10:00 AM',
      status: 'In Lecture until 2:30 PM',
      initials: 'VS',
    },
    {
      id: 'f3',
      bldgId: 'robotics',
      name: 'Dr. Emily Nakamura',
      title: 'Head of Robotics & Autonomous Systems',
      dept: 'Mechatronics & Embedded IoT Labs',
      room: 'Innovation Hub, Hardware Lab 4',
      email: 'e.nakamura@nextcampus.edu',
      phone: 'Ext: 5102',
      officeHours: 'Drop-in Desk #14 Active',
      status: 'In Laboratory',
      initials: 'EN',
    },
  ];

  const servicesList = [
    {
      id: 's1',
      bldgId: 'admin',
      name: 'Office of the University Registrar & Student Records',
      dept: 'Administration Main Desk',
      description: 'Enrolment validation, official transcripts, degree verification, and student status letters.',
      location: 'Administration Building, Ground Floor East',
      hours: 'Mon-Fri 09:00 AM – 05:00 PM',
    },
    {
      id: 's2',
      bldgId: 'sac',
      name: 'Campus Health & Psychological Counseling Center',
      dept: 'Priority Student Care',
      description: 'Confidential mental health triage, certified counselors, primary medical advice, and accessibility accommodations.',
      location: 'Student Activity Center, Suite 102',
      hours: '24/7 Urgent Helpline • Walk-in 08:30 – 18:00',
    },
  ];

  // Search filtering logic
  const filteredBuildings = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
      {/* TOP BANNER & METRICS BAR */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'var(--bg-surface-elevated)', marginBottom: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-accent)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--brand-misty)', textTransform: 'uppercase' }}>
                NEXTCAMPUS INSTITUTE • INSTITUTIONAL DIRECTORY 2026
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Campus Directory</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '720px' }}>
              Discover academic departments, faculty offices, campus facilities, and administrative services indexed across NextCampus main grounds.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <Compass size={18} style={{ color: 'var(--brand-accent)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Geo-spatial Indoor Engine Live</span>
          </div>
        </div>

        {/* Summary Counters Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <Card>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>14</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Academic Blocks</div>
          </Card>
          <Card>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>28</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Departments</div>
          </Card>
          <Card>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>180+</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Faculty</div>
          </Card>
          <Card>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>48</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Campus Facilities</div>
          </Card>
          <Card style={{ background: 'linear-gradient(135deg, rgba(56, 46, 49, 0.8) 0%, rgba(25, 21, 22, 0.9) 100%)', border: '1px solid var(--border-interactive)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-accent)' }}>100%</div>
            <div style={{ fontSize: '12px', color: 'var(--brand-misty)' }}>All Nodes GIS-Indexed</div>
          </Card>
        </div>
      </section>

      {/* SEARCH BAR & CATEGORY TABS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by faculty name, department, research lab, office number, or building..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-interactive)',
                borderRadius: '10px',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="all">All Disciplines</option>
              <option value="computing">School of Computing</option>
              <option value="engineering">Engineering & Robotics</option>
              <option value="math">Mathematical Sciences</option>
            </select>
          </div>
        </div>

        {/* Category Segment Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === 'all' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
            }}
          >
            All Entries (270)
          </button>
          <button
            onClick={() => setActiveTab('buildings')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === 'buildings' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
            }}
          >
            Buildings (14)
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === 'faculty' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
            }}
          >
            Faculty (142)
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === 'staff' ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF',
            }}
          >
            Staff & Services (38)
          </button>
        </div>
      </section>

      {/* DIRECTORY CONTENT SECTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* SECTION 1: FEATURED BUILDINGS & KEY LANDMARKS */}
        {(activeTab === 'all' || activeTab === 'buildings') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Featured Buildings & Key Landmarks</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing {filteredBuildings.length} Buildings</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredBuildings.map((bldg) => (
                <Card key={bldg.id} interactive style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                    <img src={bldg.image} alt={bldg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <Badge status="active">{bldg.block}</Badge>
                    </div>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: 0 }}>{bldg.name}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--brand-accent)' }}>{bldg.subtitle}</span>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>{bldg.description}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--brand-misty)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                      <span>{bldg.hours}</span>
                      <span>{bldg.occupancy}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <Button
                        variant="primary"
                        style={{ flex: 1 }}
                        icon={Compass}
                        onClick={() => navigate(`/campus-map?bldg=${bldg.id}`)}
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: FACULTY & ACADEMIC ADVISORS */}
        {(activeTab === 'all' || activeTab === 'faculty') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Faculty & Academic Advisors</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing {filteredFaculty.length} Advisors</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredFaculty.map((fac) => (
                <Card key={fac.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          shrink: 0,
                        }}
                      >
                        {fac.initials}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: 0 }}>{fac.name}</h3>
                          <Badge status="active">{fac.status}</Badge>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-accent)' }}>{fac.title}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{fac.dept}</span>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--brand-misty)', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} style={{ color: 'var(--brand-accent)' }} />
                            {fac.room}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={14} />
                            {fac.email}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={14} />
                            {fac.phone}
                          </span>
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--brand-misty)', marginTop: '4px', fontStyle: 'italic' }}>
                          {fac.officeHours}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Compass}
                        onClick={() => navigate(`/campus-map?bldg=${fac.bldgId}`)}
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: ADMINISTRATIVE & STUDENT SERVICES */}
        {(activeTab === 'all' || activeTab === 'staff') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LifeBuoy size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Administrative & Student Service Offices</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {servicesList.map((srv) => (
                <Card key={srv.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-accent)' }}>{srv.dept}</span>
                    <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '4px 0 8px 0' }}>{srv.name}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{srv.description}</p>
                    <div style={{ fontSize: '11px', color: 'var(--brand-misty)', marginTop: '8px' }}>{srv.location}</div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ flex: 1 }}
                      icon={Compass}
                      onClick={() => navigate(`/campus-map?bldg=${srv.bldgId}`)}
                    >
                      View on Map
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CampusDirectory;
