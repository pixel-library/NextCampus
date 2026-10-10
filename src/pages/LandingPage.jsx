import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutGrid,
  MapPin,
  Search,
  Navigation,
  BookOpen,
  Building,
  HelpCircle,
  Thermometer,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  Lock,
  Layers,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Logo from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState('block-a');
  const [searchQuery, setSearchQuery] = useState('');

  const nodeDetails = {
    'block-a': {
      title: 'Faculty of Engineering & Technology',
      dept: 'Dept. of Computer Science & Engineering',
      status: 'Open (Occupied)',
      temp: '21.5°C Optimal',
      seats: '18 / 60 Desk Pods',
      accessibility: 'Elevator & Ramps',
      lecture: 'CS402: Distributed Systems Architecture',
      instructor: 'Prof. Ananya Roy • 42 Students',
      code: 'ENG-02',
    },
    library: {
      title: 'Central Campus Library',
      dept: 'Digital Reference & Learning Commons',
      status: 'Open (Quiet Zone)',
      temp: '22.0°C Silent',
      seats: '142 / 400 Study Pods',
      accessibility: 'Ramps & Braille Signage',
      lecture: 'Quiet Research Hours Active',
      instructor: 'Librarian Desk Active',
      code: 'LIB-CENTRAL',
    },
    innovation: {
      title: 'Innovation Center',
      dept: 'Robotics & AI Hardware Labs',
      status: 'Open (Lab Active)',
      temp: '20.8°C Climate Controlled',
      seats: '12 / 30 Workbenches',
      accessibility: 'Accessible Ground Floor',
      lecture: 'Robotics Hackathon Prep Session',
      instructor: 'Dr. K. Venkatesh • 28 Researchers',
      code: 'INN-HUB-01',
    },
    activity: {
      title: 'Student Activity Center',
      dept: 'Clubs, Recreation & Event Commons',
      status: 'Open (High Activity)',
      temp: '23.1°C Ambient',
      seats: '85 Open Lounge Seats',
      accessibility: 'Full Wheelchair Ramp',
      lecture: 'Student Club & Tech Study Session',
      instructor: 'Student Council Desk',
      code: 'SAC-MAIN',
    },
  };

  const activeData = nodeDetails[selectedNode] || nodeDetails['block-a'];

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-secondary)' }}>
      {/* STANDALONE PUBLIC NAVBAR */}
      <header
        style={{
          width: '100%',
          height: '68px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Logo size="md" showText={true} />
          <nav style={{ display: 'flex', gap: '20px' }}>
            <a href="#campus-preview" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Campus Preview
            </a>
            <a href="#core-modules" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Core Features
            </a>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Active: <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> ({user.role})
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                onClick={() => navigate(user.role === 'admin' || user.role === 'care_admin' ? '/admin' : '/dashboard')}
              >
                {user.role === 'admin' || user.role === 'care_admin' ? 'Enter Admin Console' : 'Enter Student Portal'}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log Out
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => navigate('/auth')}>
                Get Started / Login
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 24px 64px 24px' }}>
        {/* Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(158, 21, 62, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'var(--brand-soft-bg)',
              border: '1px solid #FECDD3',
              marginBottom: '24px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
              SMART CAMPUS PLATFORM • MEWAR UNIVERSITY, GANGRAR, CHITTORGARH
            </span>
          </div>

          {/* Hero Headline */}
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Your Campus.{' '}
            <span className="brand-gradient-text">Smarter Than Ever.</span>
          </h1>

          {/* Supporting Subtitle */}
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Discover your college through one connected platform for campus wayfinding, classroom discovery, student services, real-time IoT telemetry, and AI assistance.
          </p>

          {/* Hero Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
            <Button
              variant="primary"
              size="lg"
              icon={Compass}
              onClick={() => {
                if (user) {
                  navigate(user.role === 'admin' || user.role === 'care_admin' ? '/admin' : '/dashboard');
                } else {
                  navigate('/auth');
                }
              }}
            >
              {user
                ? user.role === 'admin' || user.role === 'care_admin'
                  ? 'Open Admin Console'
                  : 'Open Student Portal'
                : 'Explore Portal (Sign In)'}
            </Button>
            <a href="#core-modules">
              <Button variant="secondary" size="lg" icon={LayoutGrid}>
                Discover Features
              </Button>
            </a>
          </div>

          {/* Cinematic Campus Visual Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1080px',
              margin: '0 auto',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUP4RYE-W2J2Ft821zjJpsBzRYRojXJDRXUqB6yOdIkZbofKwSHQLnWm1NQu3eC7VGc-ERs04rZgZTiUDP8KOZ6QZVp8JKH8p7y1gH0hwf-1iwFlJA2Yn3lFToy3JxsuOkHu3PCtSUrWCyOdUjDkyODiLlL5fkPpDH8Y2Fib-tI9Nf54lZeQ7Q4-E1-3m_bl6qmut1C4NMjuEh66NBAQEoiO1a30sn1FPIFy_Knx0WDT3MrcU18sNtCQ"
              alt="Cinematic wide-angle view of NextCampus Institute main academic grounds"
              style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
            />

            {/* Floating Top Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', zIndex: 10 }}>
              <Badge status="active">Live Campus Digital Twin Active</Badge>
              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                Target Institution: NextCampus Main Facility Node
              </div>
            </div>

            {/* Bottom Overlay Info Banner */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '14px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />
                  <span>NextCampus Smart Twin Baseline</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Synchronized with campus sensors, room occupancy telemetry, and department logistics grids.
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                onClick={() => {
                  if (user) {
                    navigate(user.role === 'admin' || user.role === 'care_admin' ? '/admin' : '/dashboard');
                  } else {
                    navigate('/auth');
                  }
                }}
              >
                {user
                  ? user.role === 'admin' || user.role === 'care_admin'
                    ? 'Enter Admin Console'
                    : 'Enter Student Portal'
                  : 'Enter Student Portal (Sign In)'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS PREVIEW & DIGITAL TWIN MAP SECTION */}
      <section id="campus-preview" style={{ padding: '64px 24px', backgroundColor: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                Real-Time Spatial Wayfinding
              </span>
              <h2 style={{ fontSize: '1.85rem', marginTop: '4px', color: 'var(--text-primary)' }}>
                Explore the Digital Twin of NextCampus Institute
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '13px' }}>
              Step into corridor navigation, live lecture room occupancy, and instantaneous service access mapped directly to physical facilities.
            </p>
          </div>

          {/* Search Bar & Quick Filters */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buildings, lecture halls, labs, or faculty offices..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-interactive)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
              <Button variant="primary" onClick={() => navigate('/campus-map')}>
                Navigate Map
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>Quick Views:</span>
              <button
                onClick={() => setSelectedNode('block-a')}
                style={{
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: selectedNode === 'block-a' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: selectedNode === 'block-a' ? '#FFF' : 'var(--text-secondary)',
                  border: selectedNode === 'block-a' ? 'none' : '1px solid var(--border-interactive)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: selectedNode === 'block-a' ? 600 : 500,
                }}
              >
                Academic Block A
              </button>
              <button
                onClick={() => setSelectedNode('library')}
                style={{
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: selectedNode === 'library' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: selectedNode === 'library' ? '#FFF' : 'var(--text-secondary)',
                  border: selectedNode === 'library' ? 'none' : '1px solid var(--border-interactive)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: selectedNode === 'library' ? 600 : 500,
                }}
              >
                Central Library
              </button>
              <button
                onClick={() => setSelectedNode('innovation')}
                style={{
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: selectedNode === 'innovation' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: selectedNode === 'innovation' ? '#FFF' : 'var(--text-secondary)',
                  border: selectedNode === 'innovation' ? 'none' : '1px solid var(--border-interactive)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: selectedNode === 'innovation' ? 600 : 500,
                }}
              >
                Innovation Center
              </button>
              <button
                onClick={() => setSelectedNode('activity')}
                style={{
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: selectedNode === 'activity' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: selectedNode === 'activity' ? '#FFF' : 'var(--text-secondary)',
                  border: selectedNode === 'activity' ? 'none' : '1px solid var(--border-interactive)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: selectedNode === 'activity' ? 600 : 500,
                }}
              >
                Student Activity Center
              </button>
            </div>
          </div>

          {/* Interactive Map Grid Container */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* SVG Digital Twin Vector Map */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge status="active">Campus Node: Central Grid</Badge>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive Vector View</span>
              </div>

              {/* Vector SVG Graphic */}
              <div style={{ margin: '20px 0', position: 'relative', width: '100%', height: '260px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none">
                  {/* Grid Lines */}
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 0, 0, 0.04)" strokeWidth="1" />
                  </pattern>
                  <rect width="800" height="450" fill="url(#gridPattern)" />

                  {/* Pathways */}
                  <path d="M 50 210 L 260 100 L 520 230 L 750 120" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 260 100 L 380 280 L 640 280" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />

                  {/* Active Path Highlight */}
                  <path d="M 190 145 C 230 190, 310 180, 420 195" stroke="#E11D48" strokeWidth="4" strokeDasharray="8 8" />

                  {/* Isometric Building Polygons */}
                  {/* Library */}
                  <g onClick={() => setSelectedNode('library')} style={{ cursor: 'pointer' }}>
                    <polygon points="140,80 200,110 200,165 140,135" fill={selectedNode === 'library' ? '#9E153E' : '#64748B'} />
                    <polygon points="140,80 80,110 80,165 140,135" fill="#475569" />
                    <polygon points="140,80 200,110 140,140 80,110" fill="#E11D48" opacity="0.8" />
                    <circle cx="140" cy="110" r="14" fill="#9E153E" />
                    <text x="140" y="114" fill="#FFF" fontSize="10" textAnchor="middle" fontWeight="bold">LIB</text>
                  </g>

                  {/* Block A */}
                  <g onClick={() => setSelectedNode('block-a')} style={{ cursor: 'pointer' }}>
                    <polygon points="430,150 510,190 510,260 430,220" fill={selectedNode === 'block-a' ? '#9E153E' : '#64748B'} />
                    <polygon points="430,150 350,190 350,260 430,220" fill="#475569" />
                    <polygon points="430,150 510,190 430,230 350,190" fill="#E11D48" opacity="0.8" />
                    <circle cx="430" cy="190" r="16" fill="#9E153E" />
                    <text x="430" y="194" fill="#FFF" fontSize="11" textAnchor="middle" fontWeight="bold">BLK-A</text>
                  </g>

                  {/* Innovation Center */}
                  <g onClick={() => setSelectedNode('innovation')} style={{ cursor: 'pointer' }}>
                    <polygon points="620,80 680,110 680,170 620,140" fill={selectedNode === 'innovation' ? '#9E153E' : '#64748B'} />
                    <polygon points="620,80 560,110 560,170 620,140" fill="#475569" />
                    <polygon points="620,80 680,110 620,140 560,110" fill="#E11D48" opacity="0.7" />
                    <circle cx="620" cy="110" r="12" fill="#E11D48" />
                    <text x="620" y="114" fill="#FFF" fontSize="9" textAnchor="middle" fontWeight="bold">INN</text>
                  </g>

                  {/* Activity Center */}
                  <g onClick={() => setSelectedNode('activity')} style={{ cursor: 'pointer' }}>
                    <polygon points="450,280 510,310 510,360 450,330" fill={selectedNode === 'activity' ? '#9E153E' : '#64748B'} />
                    <polygon points="450,280 390,310 390,360 450,330" fill="#475569" />
                    <polygon points="450,280 510,310 450,340 390,310" fill="#94A3B8" />
                    <circle cx="450" cy="310" r="12" fill="#FFE4E6" />
                    <text x="450" y="314" fill="#9E153E" fontSize="9" textAnchor="middle" fontWeight="bold">SAC</text>
                  </g>
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>Click building pins to view live node telemetry</span>
                <Link to="/campus-map" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                  Launch Full Map →
                </Link>
              </div>
            </div>

            {/* Dynamic Telemetry Panel */}
            <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <Badge status="active">Active Selection</Badge>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Node ID: {activeData.code}</span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>{activeData.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{activeData.dept}</p>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Status</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>{activeData.status}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HVAC Temp</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeData.temp}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Capacity</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeData.seats}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Accessibility</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-accent)' }}>{activeData.accessibility}</div>
                  </div>
                </div>

                {/* Session Card */}
                <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Session Activity</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{activeData.lecture}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeData.instructor}</div>
                </div>
              </div>

              <Link to="/campus-map">
                <Button variant="primary" style={{ width: '100%' }} icon={Navigation}>
                  Start Turn-by-Turn Navigation
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CORE MODULES SECTION */}
      <section id="core-modules" style={{ padding: '64px 24px', backgroundColor: 'var(--bg-surface-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
              Architected for Higher-Ed Excellence
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '6px', marginBottom: '12px', color: 'var(--text-primary)' }}>
              The 7 NextCampus Core Modules
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              A unified smart platform replacing fragmented portals with spatial intelligence and student automation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Module 1 */}
            <Card interactive style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-soft-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <Navigation size={22} />
                </div>
                <Badge status="active">Module 01</Badge>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>1. Smart Campus Navigation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                Multi-floor 3D indoor and outdoor wayfinding with step-by-step pathing, wheelchair ramp prioritization, and live skybridge transition routing.
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                <span>• BLE Accuracy &lt; 1.2m</span>
                <span>• Multi-Floor 3D Pathing</span>
                <span>• 100% ADA Compliant</span>
              </div>
            </Card>

            {/* Module 2 */}
            <Card interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-soft-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <BookOpen size={22} />
                </div>
                <Badge status="active">Module 02</Badge>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>2. SmartRooms IoT</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                Real-time room telemetry, classroom & study pod reservation, live occupancy tracking, and IoT HVAC controls.
              </p>
            </Card>

            {/* Module 3 */}
            <Card interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-soft-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <Users size={22} />
                </div>
                <Badge status="active">Module 03</Badge>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>3. Campus Directory</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                Faculty directories, research lab locations, department desks, and instant consultation scheduling.
              </p>
            </Card>

            {/* Module 4 */}
            <Card interactive style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)', border: '1px solid #FECDD3' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <Sparkles size={22} />
                </div>
                <Badge status="active">Module 04 AI</Badge>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--brand-primary)', marginBottom: '8px' }}>4. NextCampus AI Copilot</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                Contextual 24/7 student assistant trained on institution syllabi, exam schedules, and campus logistics.
              </p>
            </Card>

            {/* Module 5 */}
            <Card interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-soft-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <LifeBuoy size={22} />
                </div>
                <Badge status="active">Module 05</Badge>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>5. Campus Helpdesk &amp; Grievance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                Official grievance redressal cell, automated facility incident dispatch, evidence attachments, and SLA status tracking.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Logo size="md" showText={true} />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              NextCampus Smart Campus Management Platform © 2026. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <Link to={user ? (user.role === 'admin' || user.role === 'care_admin' ? '/admin' : '/dashboard') : '/auth'} style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                {user ? (user.role === 'admin' || user.role === 'care_admin' ? 'Admin Dashboard' : 'Student Dashboard') : 'Sign In Portal'}
              </Link>
              <Link to="/campus-map" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Campus Map</Link>
              {!user ? (
                <Link to="/auth" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In / Register</Link>
              ) : (
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, fontSize: '13px' }}>
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
