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
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  Building2,
  CheckCircle2,
  Calendar,
  Clock,
  Laptop,
} from 'lucide-react';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-secondary)' }}>
      {/* 1. TOP INSTITUTIONAL ACCREDITATION & UTILITY BANNER */}
      <div
        className="hidden sm:flex items-center justify-between py-2 px-4 md:px-8 text-[11.5px] bg-[#0A1A15] text-[#9FB3A8] border-b border-emerald-900/40 z-50 relative"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2ECE6', fontWeight: 700 }}>
            <Award size={13} className="text-amber-400" />
            <span>NAAC Grade &lsquo;A&rsquo; Accredited • UGC Recognized University</span>
          </span>
          <span style={{ color: '#1B382D' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9FB3A8' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span>Academic Session 2026–27 Active</span>
          </span>
          <span style={{ color: '#1B382D' }}>|</span>
          <Link to="/campus-map" style={{ color: '#34D399', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Compass size={12} />
            <span>Live Campus GIS Map (30-Acre Grounds)</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#9FB3A8' }}>
            <Phone size={12} className="text-emerald-400" />
            <span>Toll-Free Helpline: 1800-3070-7398</span>
          </span>
          <span style={{ color: '#1B382D' }}>|</span>
          <Link to="/auth" style={{ color: '#F1F5F9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GraduationCap size={13} className="text-amber-400" />
            <span>{user ? `Welcome, ${user.name}` : 'Student & Faculty Portal'}</span>
          </Link>
        </div>
      </div>

      {/* 2. STICKY INSTITUTIONAL HEADER NAVIGATION */}
      <header
        className="w-full h-[76px] bg-white border-b border-[#E2E8F0] sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 shadow-xs"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Logo size="md" showText={true} />
            <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[12px] font-black text-slate-800 tracking-tight uppercase leading-tight font-heading">
                Mewar University
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider">
                Gangrar, Chittorgarh (Rajasthan)
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
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
              <Compass size={15} />
              <span>Campus GIS Map</span>
              <span style={{ fontSize: '10px', backgroundColor: '#ECFDF5', color: '#047857', padding: '1px 6px', borderRadius: '9999px', fontWeight: 800 }}>
                LIVE
              </span>
            </Link>
            <Link
              to="/smartroom"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Layers size={14} className="text-slate-500" />
              <span>Indoor Navigation</span>
            </Link>
            <Link
              to="/complaints"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Shield size={14} className="text-slate-500" />
              <span>Campus Care</span>
            </Link>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Portal Login
              </Button>
              <Link to="/campus-map" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" icon={Compass}>
                  <span className="hidden sm:inline">Launch </span>Live Map
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 3. CINEMATIC HERO SECTION WITH VERIFIED MEWAR UNIVERSITY ARCHITECTURE */}
      <section
        id="hero"
        className="relative min-h-[460px] md:min-h-[580px] flex items-center justify-center text-center px-4 py-12 md:py-20 md:px-8"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(8, 28, 22, 0.72) 0%, rgba(10, 26, 21, 0.88) 100%), url("/mewar_campus_front.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#FFFFFF',
          }}
        >

          {/* Inspiring Headline */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-white mb-4 md:mb-5 tracking-tight font-heading"
          >
            Smarter Navigation.{' '}
            <span style={{ color: '#FB923C', display: 'block', textShadow: '0 2px 14px rgba(249, 115, 22, 0.4)' }}>
              Real-Time Campus Life.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8 font-medium">
            Welcome to NextCampus — Mewar University&apos;s authoritative smart spatial ecosystem connecting our 30-acre campus with precision GIS pedestrian wayfinding, indoor blueprint navigation, live classroom telemetry, and unified student services.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-center w-full max-w-md sm:max-w-none">
            <Link
              to="/campus-map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#168567] hover:bg-[#0f6b52] text-white rounded-xl font-extrabold text-xs sm:text-[13.5px] uppercase tracking-wider shadow-xl shadow-emerald-950/40 transition-all text-center no-underline border border-emerald-400/30"
            >
              <Compass size={17} />
              <span>Explore Interactive Map</span>
            </Link>

            <Link
              to="/smartroom"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-xl font-extrabold text-xs sm:text-[13.5px] uppercase tracking-wider shadow-md hover:bg-slate-50 transition-all text-center no-underline"
            >
              <Layers size={16} className="text-[#168567]" />
              <span>Indoor CAD Navigation</span>
            </Link>

            <Link
              to="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-white rounded-xl font-bold text-xs sm:text-[13.5px] bg-white/12 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all text-center no-underline"
            >
              <GraduationCap size={16} className="text-amber-300" />
              <span>Student &amp; Faculty Portal</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>


      {/* UNIVERSITY PILLARS OF EXCELLENCE */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-xs font-extrabold tracking-wider text-[#168567] uppercase">
              SMART CAMPUS INFRASTRUCTURE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 font-heading">
              Four Core Spatial Pillars for Modern Campus Life
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Designed specifically for students, faculty, visiting parents, and researchers navigating Mewar University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#168567] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Compass size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 font-heading">
                  Interactive GIS Wayfinding
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Turn-by-turn pedestrian pathfinding across academic blocks, football grounds, administrative pavilion, and hostel sectors.
                </p>
              </div>
              <Link to="/campus-map" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#168567] hover:text-emerald-700 no-underline">
                <span>Open GIS Map</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#168567] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Layers size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 font-heading">
                  Indoor CAD Blueprint Navigation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Architectural floor plans connecting Central Hall to lecture theatres, Central Library, and examination rooms with door-to-door routing.
                </p>
              </div>
              <Link to="/smartroom" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#168567] hover:text-emerald-700 no-underline">
                <span>View Floor Plans</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#168567] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Activity size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 font-heading">
                  Live Classroom Telemetry
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Real-time occupancy rates, environmental sensor telemetry, active timetable schedules, and available quiet study desks.
                </p>
              </div>
              <Link to="/smartroom" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#168567] hover:text-emerald-700 no-underline">
                <span>View Live Spaces</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#168567] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Shield size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 font-heading">
                  Campus Care &amp; Support
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Direct grievance redressal, hostel maintenance ticketing, and automated administrative resolution tracking.
                </p>
              </div>
              <Link to="/complaints" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#168567] hover:text-emerald-700 no-underline">
                <span>File Grievance</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 5. STUDENT SPOTLIGHT & CAMPUS CULTURE */}
      <section id="spotlight" className="relative overflow-hidden">
        <div
          className="min-h-[380px] md:min-h-[440px] flex items-center px-4 py-10 md:py-16 md:px-8"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(8, 28, 22, 0.94) 0%, rgba(10, 26, 21, 0.78) 55%, rgba(15, 23, 42, 0.5) 100%), url("/student_spotlight.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' , width: '100%', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '640px', color: '#FFFFFF' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  color: '#FDE68A',
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
                className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-white mb-5 font-heading"
                style={{ fontStyle: 'normal' }}
              >
                &ldquo;NextCampus has transformed our day-to-day life at Mewar University. Having verified indoor routing to lecture halls, live study pod occupancy, and seamless spatial wayfinding gives us a truly smart university experience.&rdquo;
              </blockquote>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#F1F5F9' }}>
                  Aarav Sharma
                </div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '2px' }}>
                  Class of 2026 • Computer Science &amp; Artificial Intelligence Innovations
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link
                  to="/campus-map"
                  style={{
                    backgroundColor: '#168567',
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
                    boxShadow: '0 4px 14px rgba(22, 133, 103, 0.4)',
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
      <div className="quick-action-strip flex-col sm:flex-row gap-2.5 sm:gap-4 p-4 sm:p-6 items-stretch sm:items-center justify-center">
        <Link to="/campus-map" className="quick-action-btn justify-center text-center">
          <Compass size={15} />
          <span>Launch Campus GIS Map</span>
        </Link>

        <Link to="/smartroom" className="quick-action-btn justify-center text-center">
          <Layers size={15} />
          <span>Indoor CAD Navigation</span>
        </Link>


        <Link to="/auth" className="quick-action-btn justify-center text-center">
          <Users size={15} />
          <span>Student &amp; Staff Login</span>
        </Link>
      </div>

      {/* 7. FORMAL UNIVERSITY FOOTER */}
      <footer className="bg-[#0A1A15] text-[#CBD5E1] py-12 px-4 md:py-16 md:px-8 border-t border-emerald-900/40">
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Column 1: University Identity */}
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>NextCampus • Mewar University</span>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#9FB3A8', marginBottom: '14px' }}>
                NH-48, Gangrar, Chittorgarh, Rajasthan 312901, India.<br />
                Established by Govt. of Rajasthan &amp; Recognized by UGC under section 2(f) of the UGC Act, 1956. NAAC Grade &lsquo;A&rsquo; Accredited.
              </p>
              <div style={{ fontSize: '12.5px', color: '#E2ECE6', fontWeight: 700 }}>
                📞 Campus Toll-Free: 1800-3070-7398
              </div>
            </div>

            {/* Column 2: Digital Spatial Services */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Spatial Navigation
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><Link to="/campus-map" style={{ color: '#34D399', fontWeight: 700, textDecoration: 'none' }}>Live Campus Map (GIS Wayfinding)</Link></li>
                <li><Link to="/smartroom" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Indoor CAD Floor Plans</Link></li>
                <li><Link to="/complaints" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Campus Care &amp; Grievance Helpdesk</Link></li>
              </ul>
            </div>

            {/* Column 3: Academic Faculties */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Academic Infrastructure
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><Link to="/campus-map?bldg=eng" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Faculty of Engineering &amp; AI Labs</Link></li>
                <li><Link to="/campus-map?bldg=library" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Swami Vivekananda Central Library</Link></li>
                <li><Link to="/campus-map?bldg=admin" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Maharana Pratap Admin Secretariat</Link></li>
                <li><Link to="/campus-map?bldg=cafeteria" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Food Court &amp; Student Canteen</Link></li>
              </ul>
            </div>

            {/* Column 4: Institutional Portals */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Campus Portals
              </h4>
              <p style={{ fontSize: '12.5px', color: '#9FB3A8', lineHeight: 1.5, marginBottom: '14px' }}>
                Official portal for student course schedules, examination timetables, smart bookings, and academic notices.
              </p>
              <Link
                to="/auth"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '11px 16px',
                  backgroundColor: '#168567',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
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
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
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
              <Link to="/campus-map" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Campus Map</Link>
              <span style={{ color: '#1B382D' }}>•</span>
              <Link to="/smartroom" style={{ color: '#9FB3A8', textDecoration: 'none' }}>Indoor Navigation</Link>
              <span style={{ color: '#1B382D' }}>•</span>
              <Link to="/auth" style={{ color: '#9FB3A8', textDecoration: 'none' }}>University Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
