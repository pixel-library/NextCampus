import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  DoorOpen,
  LifeBuoy,
  Bot,
  Send,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Thermometer,
  Users,
  Compass,
  Navigation,
  Code,
  Zap,
  Activity,
  Award,
  QrCode,
  ShieldCheck,
  Smartphone,
  Check,
  Copy,
  Wind,
  Layers,
  Sparkles,
  ArrowUpRight,
  X,
  Lock,
  Unlock,
  Radio,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Digital Gate Pass Modal
  const [isGatePassOpen, setIsGatePassOpen] = useState(false);
  const [hasCopiedPassId, setHasCopiedPassId] = useState(false);
  const [turnstileUnlocked, setTurnstileUnlocked] = useState(false);

  // Live Class Countdown (Starts at 24m 18s and ticks every 1s)
  const [classCountdownSecs, setClassCountdownSecs] = useState(24 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setClassCountdownSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedCountdown = useMemo(() => {
    const mins = Math.floor(classCountdownSecs / 60);
    const secs = classCountdownSecs % 60;
    return `${mins}m : ${secs < 10 ? '0' : ''}${secs}s`;
  }, [classCountdownSecs]);

  const studentName = user ? user.name : 'Aarav Mehta';
  const studentRoll = user ? user.rollNumber || 'MU/CSE/2024/0482' : 'MU/CSE/2024/0482';
  const studentDept = user ? `${user.department || 'Computer Science & Engineering'} '27` : "Computer Science & Engineering '27 (Honors Track)";

  const handleAiSubmit = async (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const res = await api.post('/ai/query', { prompt: aiPrompt });
      if (res.success && res.data) {
        setAiResponse(res.data);
      }
    } catch {
      setAiResponse({
        reply: `Room B-204 in Faculty of Engineering is optimal for your 10:00 AM session (21.8°C, 410 ppm clean air). Central Library silent pods remain open on Level 2 until 8:00 PM.`,
        suggestedAction: '/smartroom'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleChipClick = async (text) => {
    setAiPrompt(text);
    setAiLoading(true);
    try {
      const res = await api.post('/ai/query', { prompt: text });
      if (res && res.success && res.data) {
        setAiResponse(res.data);
      }
    } catch {
      if (text.includes('Prof. Roy')) {
        setAiResponse({
          reply: "Prof. Ananya Roy is in Faculty of Engineering Room B-204. Office hours: Mon & Wed 2:00 PM – 4:00 PM.",
          suggestedAction: "/directory"
        });
      } else if (text.includes('study pod')) {
        setAiResponse({
          reply: "Swami Vivekananda Library Pod 4B is open for immediate reservations on Level 2 with NFC tap access.",
          suggestedAction: "/smartroom"
        });
      } else {
        setAiResponse({
          reply: "Faculty of Engineering Room B-204 Multi-Media Theatre has 48/60 desks filled. Projector & Wi-Fi 7 AP active.",
          suggestedAction: "/campus-map?bldg=eng&room=B-204"
        });
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSimulateTurnstile = () => {
    setTurnstileUnlocked(true);
    setTimeout(() => {
      setTurnstileUnlocked(false);
    }, 4000);
  };

  const handleCopyPass = () => {
    navigator.clipboard?.writeText?.(studentRoll);
    setHasCopiedPassId(true);
    setTimeout(() => setHasCopiedPassId(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-100 min-h-screen pb-16">
      {/* =========================================================================
          1. PERSONALIZED WELCOME & CONTEXT STRIP
          ========================================================================= */}
      <section className="flex flex-col gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Fall Semester 2026 • Week 7
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Mewar University • Gangrar, Chittorgarh (Rajasthan)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good morning, {studentName}! ☀️
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">{studentDept}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsGatePassOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
            >
              <QrCode className="w-4 h-4" />
              <span>Smart Gate Pass</span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All Campus Nodes Operational</span>
            </span>
          </div>
        </div>

        {/* 4 Quick Metric Intelligence Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {/* Metric 1: Next Class Countdown */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono uppercase tracking-wider">Next Session</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {formattedCountdown}
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                CS-301 • Room B-204 (Eng Block)
              </div>
            </div>
          </div>

          {/* Metric 2: Attendance Safety Meter */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono uppercase tracking-wider">Term Attendance</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">89.4%</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Safe (&gt;75%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '89.4%' }}></div>
              </div>
            </div>
          </div>

          {/* Metric 3: Active Care Grievance SLA */}
          <div
            onClick={() => navigate('/complaints')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-400/60 shadow-lg flex flex-col justify-between backdrop-blur-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono uppercase tracking-wider">Active Care Ticket</span>
              <LifeBuoy className="w-4 h-4 text-rose-400 group-hover:rotate-45 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white flex items-center justify-between">
                <span>1 In Progress</span>
                <ArrowRight className="w-4 h-4 text-rose-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
                <span>#CMP-1042 Projector</span>
                <span className="text-rose-400 font-bold">ETA 18m</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Reserved Space Pass */}
          <div
            onClick={() => navigate('/smartroom')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 shadow-lg flex flex-col justify-between backdrop-blur-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono uppercase tracking-wider">Space Booking</span>
              <DoorOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white flex items-center justify-between">
                <span>1 Active Pass</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                B-206 Pods • 11:30 AM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TACTILE QUICK ACTIONS LAUNCHER BAR
          ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => navigate('/campus-map')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all flex items-center gap-3 text-left shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white leading-tight">Campus Map</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Vector CAD &amp; GIS</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/smartroom')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all flex items-center gap-3 text-left shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
            <DoorOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white leading-tight">SmartRooms</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Study Pods &amp; Labs</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/directory')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all flex items-center gap-3 text-left shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white leading-tight">Faculty Directory</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Office Hours &amp; Rooms</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/complaints')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80 transition-all flex items-center gap-3 text-left shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white leading-tight">Grievance SLA</div>
            <div className="text-[11px] text-slate-400 mt-0.5">&lt;45 min CAFM Fix</div>
          </div>
        </button>
      </section>

      {/* =========================================================================
          3. MAIN CONTENT: 2/3 AGENDA & TWIN vs 1/3 AI & PASSES
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: HERO SCHEDULE & DIGITAL TWIN (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* A. TODAY'S ACADEMIC AGENDA */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Today's Academic Agenda</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Monday, Oct 12 • 3 Lectures</span>
            </div>

            {/* Next Up Hero Class Spotlight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950 border-2 border-emerald-500/60 shadow-xl flex flex-col gap-4 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                      STARTS IN {formattedCountdown}
                    </span>
                    <span className="text-xs font-mono text-slate-400">10:00 AM – 11:30 AM</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    CS-301: Distributed Systems &amp; Cloud Infrastructure
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                    <span className="text-slate-400">Instructor:</span>
                    <span className="font-semibold text-white">Prof. Ananya Roy</span>
                    <span className="text-slate-600">•</span>
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium text-emerald-300">
                      Faculty of Engineering (Block ENG-02), Room B-204
                    </span>
                  </div>
                </div>

                {/* IoT Live Room Telemetry Pill */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col gap-1 text-xs shrink-0">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>21.8°C Climate</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>48/60 Desks Filled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-400 text-[11px] font-mono">
                    <Wind className="w-3.5 h-3.5" />
                    <span>410 ppm Pristine Air</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Dual 4K Laser Projection Ready • Wi-Fi 7 Core AP Online
                </span>

                <button
                  onClick={() => navigate('/campus-map?bldg=eng&room=B-204')}
                  className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-[0.98]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate to Room B-204 (1.2 min walk)</span>
                </button>
              </div>
            </div>

            {/* Subsequent Sessions Timeline */}
            <div className="flex flex-col gap-2.5">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-sky-400 font-mono text-xs font-bold border border-slate-800">
                    01:00 PM – 02:30 PM
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      MATH-240: Linear Algebra &amp; Neural Nets
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ramanujan Block, Room S-108 • Prof. K. Venkatesh
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/campus-map?bldg=eng')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors self-end sm:self-auto"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-teal-400 font-mono text-xs font-bold border border-slate-800">
                    03:15 PM – 05:00 PM
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      CS-305: Embedded IoT Systems Lab
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Faculty of Engineering Level 2, Bench #14 Reserved
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/campus-map?bldg=eng')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors self-end sm:self-auto"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* B. DIGITAL TWIN & LIVE WAYFINDING PORTAL */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Digital Twin &amp; Campus Perimeter</h2>
              </div>
              <Link to="/campus-map" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                <span>Open Vector CAD &amp; GIS Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
              <div className="relative h-56 w-full">
                <img
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"
                  alt="Mewar Campus Twin"
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                    Mewar University Geographic Boundary Clamped
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Mewar University Central Campus</span>
                    <span className="text-xs text-slate-400">NH-48, Gangrar, Chittorgarh • 30+ Academic Blocks</span>
                  </div>

                  <button
                    onClick={() => navigate('/campus-map')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Launch 3D Indoor CAD</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* C. CAMPUS BULLETINS & ANNOUNCEMENTS */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Campus Bulletins &amp; Notices</h2>
              <span className="text-xs font-mono text-slate-400">Verified Broadcasts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
                    <span>INFRASTRUCTURE</span>
                    <span>Today, 4:00 PM</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Central Library Level 2 Wi-Fi 7 Core Migration
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    AP nodes 12–16 firmware upgrade active. Acoustic study pods in West Wing remain fully online.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-sky-400 mb-1">
                    <span>ACADEMIC • HACKATHON</span>
                    <span>Due Oct 18</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Mewar SmartCampus Innovation Submissions
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Interim architecture documentation open for student teams in AI and Robotics verticals.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR: AI COPILOT & ACADEMIC STANDING (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* A. NEXTCAMPUS AI COPILOT CARD */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">NextCampus Copilot</h3>
                  <span className="text-[11px] text-emerald-400 font-mono">24/7 Smart Campus AI</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                GPT-Campus
              </span>
            </div>

            <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 leading-relaxed">
              Hi {studentName}! Tap any prompt or ask me anything about classrooms, professors, or library pods:
            </p>

            {/* Quick Prompt Chips */}
            <div className="flex flex-col gap-1.5">
              {[
                "Where is Prof. Roy's office right now?",
                "Book quiet study pod for 4:00 PM",
                "Where is Room B-204 in Turing Hall?"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/40 text-xs text-slate-300 flex items-center justify-between transition-all"
                >
                  <span className="truncate pr-2">“{chip}”</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-slate-200 animate-in fade-in duration-200">
                <p className="leading-relaxed">{aiResponse.reply}</p>
                {aiResponse.suggestedAction && (
                  <button
                    onClick={() => navigate(aiResponse.suggestedAction)}
                    className="mt-2 text-emerald-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Ask Input */}
            <form onSubmit={handleAiSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask about timetable, labs, buses..."
                className="flex-1 h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="h-9 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* B. UPCOMING DEADLINES */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Upcoming Academic Deadlines</span>
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-rose-400">TODAY • 11:59 PM</span>
                <span className="text-xs font-bold text-white">Distributed Systems Lab Practical #3</span>
                <span className="text-[11px] text-slate-400">CS-301 Git Commit tag: v0.3.1</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-sky-400">TOMORROW • 2:00 PM</span>
                <span className="text-xs font-bold text-white">Robotics Autonomous Drone Flight Review</span>
                <span className="text-[11px] text-slate-400">Room B-205 Flight Netting Enclosure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: DIGITAL NFC CAMPUS SMART GATE PASS
          ========================================================================= */}
      {isGatePassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border-2 border-emerald-500 shadow-2xl p-6 flex flex-col gap-5 text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Mewar University Smart ID</span>
                  <span className="text-[10px] font-mono text-emerald-400">Official Turnstile Gate Pass</span>
                </div>
              </div>
              <button
                onClick={() => setIsGatePassOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res Digital Pass Body */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center gap-3">
              <div className="w-36 h-36 p-2 rounded-xl bg-white flex items-center justify-center shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                  <rect x="10" y="10" width="25" height="25" fill="#000000" />
                  <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                  <rect x="18" y="18" width="9" height="9" fill="#000000" />

                  <rect x="65" y="10" width="25" height="25" fill="#000000" />
                  <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                  <rect x="73" y="18" width="9" height="9" fill="#000000" />

                  <rect x="10" y="65" width="25" height="25" fill="#000000" />
                  <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                  <rect x="18" y="73" width="9" height="9" fill="#000000" />

                  <rect x="42" y="15" width="6" height="6" fill="#000000" />
                  <rect x="52" y="25" width="6" height="6" fill="#000000" />
                  <rect x="40" y="45" width="6" height="6" fill="#000000" />
                  <rect x="55" y="55" width="6" height="6" fill="#000000" />
                  <rect x="65" y="70" width="6" height="6" fill="#000000" />
                  <rect x="75" y="45" width="6" height="6" fill="#000000" />
                  <circle cx="50" cy="50" r="5" fill="#10B981" />
                </svg>
              </div>

              <div className="text-center">
                <h4 className="text-base font-bold text-white">{studentName}</h4>
                <p className="text-xs font-mono text-emerald-400">{studentRoll}</p>
                <p className="text-[11px] text-slate-400 mt-1">B.Tech Computer Science &amp; Eng (2023-2027)</p>
              </div>

              <div className="w-full pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Gate Turnstile: Auth Pass</span>
                <span className="text-emerald-400 font-bold">VALID 2026</span>
              </div>
            </div>

            {/* Turnstile Tap Simulator */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSimulateTurnstile}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  turnstileUnlocked
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {turnstileUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{turnstileUnlocked ? 'Turnstile Access Granted! ✓' : 'Simulate NFC Tap at Gate Reader'}</span>
              </button>

              <button
                onClick={handleCopyPass}
                className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 font-mono"
              >
                {hasCopiedPassId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedPassId ? 'Roll Number Copied' : 'Copy Student Roll ID'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
