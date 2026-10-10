import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Navigation,
  ArrowRight,
  Sparkles,
  Phone,
  ChevronRight,
  Shield,
  Activity,
  Users,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Logo from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Interactive Digital Twin State
  const [selectedNode, setSelectedNode] = useState('block-a');

  // Node details for Interactive Digital Twin section
  const nodeDetails = {
    'block-a': {
      title: 'Faculty of Engineering & Technology',
      dept: 'Dept. of Computer Science & Engineering (AI & ML)',
      status: 'Open (Active)',
      temp: '21.5°C Optimal',
      seats: '18 / 60 Desk Pods',
      accessibility: 'Elevator & Step-Free Ramps',
      lecture: 'CS402: Distributed Systems Architecture',
      instructor: 'Prof. Ananya Roy • 42 Students',
      code: 'ENG-02',
      bldgId: 'eng',
    },
    library: {
      title: 'Swami Vivekananda Central Library',
      dept: 'Digital Reference & Learning Commons',
      status: 'Open (Quiet Zone)',
      temp: '22.0°C Silent',
      seats: '142 / 400 Study Pods',
      accessibility: 'Ramps & Tactile Paths',
      lecture: 'Quiet Research & Reference Hours',
      instructor: 'Circulation Desk Active',
      code: 'LIB-03',
      bldgId: 'library',
    },
    innovation: {
      title: 'Innovation Center & Robotics Lab',
      dept: 'Robotics & Embedded AI Hardware Labs',
      status: 'Open (Lab Active)',
      temp: '20.8°C Climate Controlled',
      seats: '12 / 30 Workbenches',
      accessibility: 'Accessible Ground Floor',
      lecture: 'Autonomous Navigation & Drone Testing',
      instructor: 'Dr. K. Venkatesh • 28 Researchers',
      code: 'INN-HUB-01',
      bldgId: 'eng',
    },
    activity: {
      title: 'Student Activity Center & Arena',
      dept: 'Clubs, Recreation & Event Commons',
      status: 'Open (High Activity)',
      temp: '23.1°C Ambient',
      seats: '85 Open Lounge Seats',
      accessibility: 'Full Wheelchair Ramp',
      lecture: 'Student Tech Club Hackathon Meetup',
      instructor: 'Student Welfare Council',
      code: 'SAC-MAIN',
      bldgId: 'admin',
    },
  };

  const activeDigitalData = nodeDetails[selectedNode] || nodeDetails['block-a'];

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-secondary)' }}>
      {/* 1. TOP UTILITY STATUS BAR */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#94A3B8',
          fontSize: '11.5px',
          padding: '7px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 110,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Mewar University Smart Campus • Session 2026–27 Active
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/campus-map" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Compass size={12} /> Live Campus GIS Map (Mewar Grounds Only)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <a href="#digital-twin" style={{ color: '#94A3B8', textDecoration: 'none' }}>
            Classroom IoT Telemetry
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Phone size={12} /> Campus Helpline: 1800-3070-7398
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/auth" style={{ color: '#F8FAFC', fontWeight: 700, textDecoration: 'none' }}>
            {user ? `Logged in: ${user.name}` : 'Student & Staff Login'}
          </Link>
        </div>
      </div>

      {/* 2. STICKY HEADER NAVIGATION */}
      <header
        style={{
          width: '100%',
          height: '72px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size="md" showText={true} />
          </Link>

          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link
              to="/campus-map"
              style={{
                color: 'var(--brand-primary)',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Compass size={14} />
              <span>Live Campus Map</span>
              <span style={{ fontSize: '10px', backgroundColor: '#ECFDF5', color: '#059669', padding: '1px 6px', borderRadius: '9999px', fontWeight: 800 }}>
                GIS LIVE
              </span>
            </Link>
            <a href="#digital-twin" style={{ color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none' }}>
              Digital Twin &amp; IoT
            </a>
            <a href="#spotlight" style={{ color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none' }}>
              Student Life
            </a>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                onClick={() => navigate(user.role === 'admin' || user.role === 'care_admin' ? '/admin' : '/dashboard')}
              >
                {user.role === 'admin' || user.role === 'care_admin' ? 'Admin Console' : 'My Workspace'}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Link to="/campus-map" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" icon={Compass}>
                  Launch Live Map
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 3. CINEMATIC HERO SECTION */}
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '580px',
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.92) 100%), url("/campus_aerial_hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 32px 90px 32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#FFFFFF',
          }}
        >
          {/* Campus Spatial Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              marginBottom: '24px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#FFFFFF', textTransform: 'uppercase' }}>
              SPATIAL SMART CAMPUS • MEWAR UNIVERSITY, GANGRAR
            </span>
          </div>

          {/* Inspiring Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '20px',
              letterSpacing: '-0.025em',
            }}
          >
            Smarter Navigation.{' '}
            <span style={{ color: '#FB923C', display: 'block', textShadow: '0 2px 14px rgba(249, 115, 22, 0.4)' }}>
              Real-Time Campus Life.
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: '#CBD5E1', maxWidth: '640px', lineHeight: 1.7, marginBottom: '36px' }}>
            NextCampus connects Mewar University&apos;s 30-acre campus with precision turn-by-turn GIS pedestrian wayfinding, real-time classroom telemetry, study pod availability, and unified student services.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
            <Link
              to="/campus-map"
              style={{
                padding: '14px 28px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13.5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(158, 21, 62, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              <Compass size={17} />
              <span>Explore Interactive Map</span>
            </Link>

            <a
              href="#digital-twin"
              style={{
                padding: '14px 26px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13.5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <Activity size={16} />
              <span>Inspect Digital Twin</span>
            </a>

            <Link
              to="/auth"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '12px 18px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span>Student Portal</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SPATIAL DIGITAL TWIN SHOWCASE */}
      <section id="digital-twin" style={{ padding: '72px 32px', backgroundColor: '#F8FAFC', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                CAMPUS DIGITAL TWIN
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
                Inspect Live Facilities &amp; Environmental Telemetry
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '13px', lineHeight: 1.5 }}>
              Tap any facility node to view real-time occupancy, climate controls, active lecture timetables, and direct routing paths.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Interactive Vector Map Graphic */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '22px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge status="active">Mewar University Central Quadrangle</Badge>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Interactive Vector View</span>
              </div>

              {/* Vector SVG Graphic */}
              <div style={{ margin: '18px 0', position: 'relative', width: '100%', height: '280px', background: '#F1F5F9', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none">
                  <pattern id="campusGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                  </pattern>
                  <rect width="800" height="450" fill="url(#campusGridPattern)" />

                  {/* Pathways */}
                  <path d="M 50 210 L 260 100 L 520 230 L 750 120" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 260 100 L 380 280 L 640 280" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 190 145 C 230 190, 310 180, 420 195" stroke="#059669" strokeWidth="4" strokeDasharray="8 8" />

                  {/* Library Node */}
                  <g onClick={() => setSelectedNode('library')} style={{ cursor: 'pointer' }}>
                    <polygon points="140,80 200,110 200,165 140,135" fill={selectedNode === 'library' ? '#9E153E' : '#64748B'} />
                    <polygon points="140,80 80,110 80,165 140,135" fill="#475569" />
                    <polygon points="140,80 200,110 140,140 80,110" fill="#E11D48" opacity="0.8" />
                    <circle cx="140" cy="110" r="15" fill="#9E153E" />
                    <text x="140" y="114" fill="#FFF" fontSize="10" textAnchor="middle" fontWeight="bold">LIB</text>
                  </g>

                  {/* Faculty of Engineering Node */}
                  <g onClick={() => setSelectedNode('block-a')} style={{ cursor: 'pointer' }}>
                    <polygon points="430,150 510,190 510,260 430,220" fill={selectedNode === 'block-a' ? '#9E153E' : '#64748B'} />
                    <polygon points="430,150 350,190 350,260 430,220" fill="#475569" />
                    <polygon points="430,150 510,190 430,230 350,190" fill="#E11D48" opacity="0.8" />
                    <circle cx="430" cy="190" r="17" fill="#9E153E" />
                    <text x="430" y="195" fill="#FFF" fontSize="11" textAnchor="middle" fontWeight="bold">ENG</text>
                  </g>

                  {/* Innovation Center Node */}
                  <g onClick={() => setSelectedNode('innovation')} style={{ cursor: 'pointer' }}>
                    <polygon points="620,80 680,110 680,170 620,140" fill={selectedNode === 'innovation' ? '#9E153E' : '#64748B'} />
                    <polygon points="620,80 560,110 560,170 620,140" fill="#475569" />
                    <polygon points="620,80 680,110 620,140 560,110" fill="#E11D48" opacity="0.7" />
                    <circle cx="620" cy="110" r="14" fill="#059669" />
                    <text x="620" y="114" fill="#FFF" fontSize="9" textAnchor="middle" fontWeight="bold">INN</text>
                  </g>

                  {/* Activity Center Node */}
                  <g onClick={() => setSelectedNode('activity')} style={{ cursor: 'pointer' }}>
                    <polygon points="450,280 510,310 510,360 450,330" fill={selectedNode === 'activity' ? '#9E153E' : '#64748B'} />
                    <polygon points="450,280 390,310 390,360 450,330" fill="#475569" />
                    <polygon points="450,280 510,310 450,340 390,310" fill="#94A3B8" />
                    <circle cx="450" cy="310" r="14" fill="#2563EB" />
                    <text x="450" y="314" fill="#FFF" fontSize="9" textAnchor="middle" fontWeight="bold">SAC</text>
                  </g>
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>Tap any node above to inspect telemetry</span>
                <Link to="/campus-map" style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>
                  Open Full GIS Map →
                </Link>
              </div>
            </div>

            {/* Dynamic Telemetry Panel */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <Badge status="active">Active Node Telemetry</Badge>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>
                    NODE: {activeDigitalData.code}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
                  {activeDigitalData.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', marginTop: '4px' }}>
                  {activeDigitalData.dept}
                </p>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Operational Status</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{activeDigitalData.status}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HVAC Climate</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{activeDigitalData.temp}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Seating Capacity</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{activeDigitalData.seats}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Step-Free Access</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-accent)', marginTop: '2px' }}>{activeDigitalData.accessibility}</div>
                  </div>
                </div>

                {/* Session Card */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Active Lecture Session
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {activeDigitalData.lecture}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {activeDigitalData.instructor}
                  </div>
                </div>
              </div>

              <Link to={`/campus-map?bldg=${activeDigitalData.bldgId || 'eng'}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ width: '100%' }} icon={Navigation}>
                  Navigate to {activeDigitalData.code} in Campus Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT SPOTLIGHT & CAMPUS CULTURE */}
      <section id="spotlight" style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            minHeight: '440px',
            backgroundImage: 'linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.72) 55%, rgba(15, 23, 42, 0.4) 100%), url("/student_spotlight.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            padding: '64px 32px',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '620px', color: '#FFFFFF' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(225, 29, 72, 0.25)',
                  border: '1px solid rgba(225, 29, 72, 0.5)',
                  color: '#FECDD3',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <Sparkles size={13} />
                <span>Student Voice &amp; Innovation</span>
              </div>

              <blockquote
                style={{
                  fontSize: 'clamp(1.3rem, 2.2vw, 1.85rem)',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  lineHeight: 1.35,
                  color: '#FFFFFF',
                  marginBottom: '20px',
                }}
              >
                &ldquo;NextCampus changed how we navigate our daily university routine. Having real-time lab room telemetry, instant pedestrian wayfinding, and connected student care in one place makes Mewar University feel truly intelligent.&rdquo;
              </blockquote>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#F1F5F9' }}>
                  Aarav Sharma
                </div>
                <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '2px' }}>
                  Class of 2026 • Computer Science &amp; Artificial Intelligence Innovations
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link
                  to="/campus-map"
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    padding: '11px 22px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                  }}
                >
                  <Compass size={15} />
                  <span>Explore Campus Map</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUICK LAUNCH ACTION STRIP */}
      <div className="quick-action-strip">
        <Link to="/campus-map" className="quick-action-btn">
          <Compass size={15} />
          <span>Launch Campus GIS Map</span>
        </Link>

        <a href="#digital-twin" className="quick-action-btn">
          <Activity size={15} />
          <span>Inspect Digital Twin</span>
        </a>

        <Link to="/auth" className="quick-action-btn">
          <Users size={15} />
          <span>Student &amp; Staff Login</span>
        </Link>
      </div>

      {/* 7. UNIVERSITY FOOTER */}
      <footer style={{ backgroundColor: '#0B1329', color: '#CBD5E1', padding: '56px 32px 32px 32px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '48px' }}>
            {/* Column 1: University Identity */}
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>NextCampus • Mewar University</span>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#94A3B8', marginBottom: '14px' }}>
                NH-48, Gangrar, Chittorgarh, Rajasthan 312901, India.<br />
                Recognized by University Grants Commission (UGC) &amp; NAAC Grade-A Accredited.
              </p>
              <div style={{ fontSize: '12.5px', color: '#E2E8F0', fontWeight: 600 }}>
                📞 Campus Toll-Free: 1800-3070-7398
              </div>
            </div>

            {/* Column 2: Digital Services */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Campus Spatial Services
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><Link to="/campus-map" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>Live Campus Map (GIS Wayfinding)</Link></li>
                <li><a href="#digital-twin" style={{ color: '#94A3B8', textDecoration: 'none' }}>Real-Time IoT Digital Twin</a></li>
                <li><Link to="/smartroom" style={{ color: '#94A3B8', textDecoration: 'none' }}>SmartRooms &amp; Study Pods</Link></li>
                <li><Link to="/complaints" style={{ color: '#94A3B8', textDecoration: 'none' }}>Campus Care &amp; Helpdesk</Link></li>
              </ul>
            </div>

            {/* Column 3: Academic Zones */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Academic Infrastructure
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><Link to="/campus-map?bldg=eng" style={{ color: '#94A3B8', textDecoration: 'none' }}>Faculty of Engineering &amp; AI Labs</Link></li>
                <li><Link to="/campus-map?bldg=library" style={{ color: '#94A3B8', textDecoration: 'none' }}>Swami Vivekananda Central Library</Link></li>
                <li><Link to="/campus-map?bldg=admin" style={{ color: '#94A3B8', textDecoration: 'none' }}>Maharana Pratap Admin Secretariat</Link></li>
                <li><Link to="/campus-map?bldg=cafeteria" style={{ color: '#94A3B8', textDecoration: 'none' }}>Food Court &amp; Student Canteen</Link></li>
              </ul>
            </div>

            {/* Column 4: Quick Portals */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Campus Portals
              </h4>
              <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '14px' }}>
                Access courses, examination timetables, smart room bookings, and campus welfare.
              </p>
              <Link
                to="/auth"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px 16px',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                Student &amp; Faculty Login
              </Link>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div
            style={{
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '11.5px',
              color: '#64748B',
            }}
          >
            <div>
              © 2026 NextCampus Intelligent Spatial Platform • Mewar University. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/campus-map" style={{ color: '#64748B', textDecoration: 'none' }}>Campus Map</Link>
              <span style={{ color: '#334155' }}>•</span>
              <a href="#digital-twin" style={{ color: '#64748B', textDecoration: 'none' }}>Digital Twin</a>
              <span style={{ color: '#334155' }}>•</span>
              <Link to="/auth" style={{ color: '#64748B', textDecoration: 'none' }}>Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
