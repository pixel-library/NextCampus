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
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Thermometer,
  Users,
  Compass,
  Navigation,
  QrCode,
  ShieldCheck,
  Check,
  Copy,
  Wind,
  Sparkles,
  ArrowUpRight,
  X,
  Lock,
  Unlock,
  Radio,
  BookOpen,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StatusIndicator from '../components/common/StatusIndicator';
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

  // Actual Student Identity Resolution
  const studentName = user?.preferredName || user?.name || 'Aarav Mehta';
  const studentRoll = user?.enrollmentNumber || user?.studentId || user?.rollNumber || 'MU/CSE/2024/0482';
  const studentDept = user?.department || 'Computer Science & Engineering';
  const studentYear = user?.semester || user?.academicYear || 'Class of 2027';

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
        suggestedAction: '/smartroom',
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
          reply:
            'Prof. Ananya Roy is in Faculty of Engineering Room B-204. Office hours: Mon & Wed 2:00 PM – 4:00 PM.',
          suggestedAction: '/directory',
        });
      } else if (text.includes('study pod')) {
        setAiResponse({
          reply:
            'Swami Vivekananda Library Pod 4B is open for immediate reservations on Level 2 with NFC tap access.',
          suggestedAction: '/smartroom',
        });
      } else {
        setAiResponse({
          reply:
            'Faculty of Engineering Room B-204 Multi-Media Theatre has 48/60 desks filled. Projector & Wi-Fi 7 AP active.',
          suggestedAction: '/campus-map?bldg=eng&room=B-204',
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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 font-sans">
      {/* =========================================================================
          1. HEADER GREETING & INSTITUTIONAL CONTEXT
          ========================================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4EAE5]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="brand" size="sm">
              Fall Semester 2026 • Week 7
            </Badge>
            <span className="text-xs text-[#65736B] font-medium">
              Mewar University • Gangrar, Chittorgarh (Rajasthan)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A27] tracking-tight">
            Welcome back, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-0.5">
            {studentDept} • {studentYear} • Student ID: <span className="font-mono font-semibold text-[#142D28]">{studentRoll}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={QrCode}
            onClick={() => setIsGatePassOpen(true)}
          >
            Digital Gate Pass
          </Button>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E4EAE5] text-xs text-[#65736B] shadow-xs">
            <StatusIndicator status="online" label="Campus Nodes Active" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ACADEMIC OVERVIEW ROW: NEXT CLASS HERO (7 COLS) + METRICS STACK (5 COLS)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* HERO LIVE CLASS SPOTLIGHT (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4EAE5] shadow-xs p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] font-mono text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#168567] animate-ping" />
                  STARTS IN {formattedCountdown}
                </span>
                <span className="text-xs font-semibold text-[#65736B] font-mono">
                  10:00 AM – 11:30 AM
                </span>
              </div>
              <Badge variant="brand" size="sm">
                Next Academic Session
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#202A27] tracking-tight">
              CS-301: Distributed Systems &amp; Cloud Infrastructure
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#65736B] mt-2">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#87968D]">Instructor:</span>
                <span className="text-[#202A27] font-semibold">Prof. Ananya Roy</span>
              </div>
              <span className="text-[#D0DAD2]">•</span>
              <div className="flex items-center gap-1.5 text-[#168567] font-semibold">
                <MapPin size={14} />
                <span>Faculty of Engineering (ENG-02), Room B-204</span>
              </div>
            </div>

            {/* Live Room Telemetry Tiles */}
            <div className="grid grid-cols-3 gap-2.5 mt-5 p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5]/80">
              <div className="flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0">
                  <Thermometer size={15} />
                </div>
                <div>
                  <div className="text-[10px] text-[#87968D] uppercase font-semibold">Climate</div>
                  <div className="font-bold text-[#202A27]">21.8°C Optimal</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5FA] text-[#3478B8] border border-[#C9DFEE] flex items-center justify-center shrink-0">
                  <Users size={15} />
                </div>
                <div>
                  <div className="text-[10px] text-[#87968D] uppercase font-semibold">Occupancy</div>
                  <div className="font-bold text-[#202A27]">48 / 60 Desks</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0">
                  <Wind size={15} />
                </div>
                <div>
                  <div className="text-[10px] text-[#87968D] uppercase font-semibold">Air Quality</div>
                  <div className="font-bold text-[#202A27]">410 ppm CO₂</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-[#E4EAE5] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#65736B] flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#168567]" />
              <span>Dual 4K Laser Projection Ready • Wi-Fi 7 Core AP Online</span>
            </span>

            <Button
              variant="primary"
              size="sm"
              icon={Navigation}
              onClick={() => navigate('/campus-map?bldg=eng&room=B-204')}
            >
              Navigate to Room B-204 (1.2 min walk)
            </Button>
          </div>
        </div>

        {/* SECONDARY STUDENT METRICS STACK (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Metric 1: Attendance Safety Gauge */}
          <div className="bg-white rounded-2xl border border-[#E4EAE5] p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#65736B] uppercase tracking-wider text-[11px]">
                Semester Attendance
              </span>
              <Badge variant="success" size="sm">
                Safe (&gt;75% Req)
              </Badge>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#202A27]">89.4%</span>
                <span className="text-xs text-[#65736B]">42 of 47 Lectures Attended</span>
              </div>
              <div className="w-full bg-[#F0F4F1] h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#168567] h-full rounded-full transition-all duration-500"
                  style={{ width: '89.4%' }}
                />
              </div>
            </div>
          </div>

          {/* Metric 2: Active Care Grievance SLA */}
          <div
            onClick={() => navigate('/complaints')}
            className="bg-white rounded-2xl border border-[#E4EAE5] hover:border-[#D0DAD2] hover:shadow-sm p-4.5 shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#65736B] uppercase tracking-wider text-[11px]">
                Active Helpdesk Ticket
              </span>
              <Badge variant="brand" size="xs">
                ETA 18 mins
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#202A27] group-hover:text-[#168567] transition-colors">
                  #CMP-1042 Projector HDMI Glitch
                </div>
                <div className="text-xs text-[#65736B] mt-0.5">
                  Tech Marcus Vance dispatched to Room B-204
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-[#87968D] group-hover:text-[#168567] group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>

          {/* Metric 3: Study Pod Reservation Pass */}
          <div
            onClick={() => navigate('/smartroom')}
            className="bg-white rounded-2xl border border-[#E4EAE5] hover:border-[#D0DAD2] hover:shadow-sm p-4.5 shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#65736B] uppercase tracking-wider text-[11px]">
                Active Study Space Pass
              </span>
              <Badge variant="info" size="sm">
                Pod 4B Reserved
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#202A27] group-hover:text-[#3478B8] transition-colors">
                  Swami Vivekananda Library Level 2
                </div>
                <div className="text-xs text-[#65736B] mt-0.5 font-mono">
                  Today 4:00 PM – 6:00 PM • Access PIN: 4920
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-[#87968D] group-hover:text-[#3478B8] group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. RESTRAINED QUICK ACTIONS LAUNCHER BAR
          ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => navigate('/campus-map')}
          className="p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#CBE2D4] hover:shadow-sm transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Compass size={20} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#168567] transition-colors">
              Campus Map
            </div>
            <div className="text-[11px] text-[#65736B] mt-0.5">3D Vector CAD &amp; GIS</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/smartroom')}
          className="p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#CBE2D4] hover:shadow-sm transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <DoorOpen size={20} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#168567] transition-colors">
              SmartRooms
            </div>
            <div className="text-[11px] text-[#65736B] mt-0.5">Study Pods &amp; Labs</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/directory')}
          className="p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#C9DFEE] hover:shadow-sm transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#EEF5FA] text-[#3478B8] border border-[#C9DFEE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#3478B8] transition-colors">
              Directory
            </div>
            <div className="text-[11px] text-[#65736B] mt-0.5">Faculty &amp; Schedules</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/complaints')}
          className="p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#CBE2D4] hover:shadow-sm transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <LifeBuoy size={20} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#168567] transition-colors">
              Campus Care
            </div>
            <div className="text-[11px] text-[#65736B] mt-0.5">&lt;45 min CAFM Fix</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MAIN CONTENT: 2/3 AGENDA & MAP PREVIEW vs 1/3 AI COPILOT
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: AGENDA & MAP (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* A. TODAY'S SCHEDULE TIMELINE */}
          <section className="bg-white rounded-2xl border border-[#E4EAE5] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4EAE5] mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#168567]" />
                <h3 className="text-base font-bold text-[#202A27]">
                  Today's Academic Agenda
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#65736B]">
                Monday, Oct 12 • 3 Lectures
              </span>
            </div>

            <div className="space-y-3">
              {/* Lecture 1 (Upcoming / Current) */}
              <div className="p-3.5 rounded-xl border border-[#CBE2D4] bg-[#EAF5EF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] font-mono text-xs font-bold shrink-0">
                    10:00 – 11:30 AM
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#202A27]">
                      CS-301: Distributed Systems &amp; Cloud Infrastructure
                    </h4>
                    <p className="text-xs text-[#65736B] mt-0.5">
                      Faculty of Engineering Level 2, Room B-204 • Prof. Ananya Roy
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/campus-map?bldg=eng&room=B-204')}
                >
                  Map Route
                </Button>
              </div>

              {/* Lecture 2 */}
              <div className="p-3.5 rounded-xl border border-[#E4EAE5] bg-white hover:bg-[#F6F8F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F0F4F1] text-[#202A27] font-mono text-xs font-bold shrink-0">
                    01:00 – 02:30 PM
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#202A27]">
                      MATH-240: Linear Algebra &amp; Neural Nets
                    </h4>
                    <p className="text-xs text-[#65736B] mt-0.5">
                      Ramanujan Block, Room S-108 • Prof. K. Venkatesh
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/campus-map?bldg=eng')}
                >
                  View Location
                </Button>
              </div>

              {/* Lecture 3 */}
              <div className="p-3.5 rounded-xl border border-[#E4EAE5] bg-white hover:bg-[#F6F8F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F0F4F1] text-[#202A27] font-mono text-xs font-bold shrink-0">
                    03:15 – 05:00 PM
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#202A27]">
                      CS-305: Embedded IoT Systems Lab
                    </h4>
                    <p className="text-xs text-[#65736B] mt-0.5">
                      Faculty of Engineering Level 2, Bench #14 Reserved
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/campus-map?bldg=eng')}
                >
                  View Location
                </Button>
              </div>
            </div>
          </section>

          {/* B. DIGITAL TWIN & WAYFINDING CARD */}
          <section className="bg-white rounded-2xl border border-[#E4EAE5] overflow-hidden shadow-xs">
            <div className="p-5 flex items-center justify-between border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#168567]" />
                <h3 className="text-base font-bold text-[#202A27]">
                  Campus Navigation &amp; Ground Perimeter
                </h3>
              </div>
              <Link
                to="/campus-map"
                className="text-xs text-[#168567] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Launch Interactive GIS Map</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="relative h-52 w-full bg-[#F0F4F1]">
              <img
                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"
                alt="Mewar Campus Twin"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142D28]/85 via-[#142D28]/30 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#202A27] text-xs font-bold shadow-xs">
                  Mewar University Geographic Perimeter Clamped
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
                <div>
                  <div className="text-sm font-bold">Mewar University Main Campus</div>
                  <div className="text-xs text-[#E4EAE5]">
                    NH-48, Gangrar, Chittorgarh • 30+ Academic Blocks
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Compass}
                  onClick={() => navigate('/campus-map')}
                >
                  Open 3D Vector Map
                </Button>
              </div>
            </div>
          </section>

          {/* C. CAMPUS BULLETINS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4.5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#168567] mb-1">
                  <span>INFRASTRUCTURE</span>
                  <span className="text-[#87968D] font-normal">Today, 4:00 PM</span>
                </div>
                <h4 className="text-sm font-bold text-[#202A27]">
                  Central Library Level 2 Wi-Fi 7 Core Migration
                </h4>
                <p className="text-xs text-[#65736B] mt-1 leading-relaxed">
                  AP nodes 12–16 firmware upgrade active. Acoustic study pods in West Wing remain fully online.
                </p>
              </div>
            </div>

            <div className="p-4.5 rounded-2xl bg-white border border-[#E4EAE5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#3478B8] mb-1">
                  <span>HACKATHON • ACADEMIC</span>
                  <span className="text-[#87968D] font-normal">Due Oct 18</span>
                </div>
                <h4 className="text-sm font-bold text-[#202A27]">
                  Mewar SmartCampus Innovation Submissions
                </h4>
                <p className="text-xs text-[#65736B] mt-1 leading-relaxed">
                  Interim architecture documentation open for student teams in AI and Robotics verticals.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: AI COPILOT & DEADLINES (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* A. NEXTCAMPUS AI COPILOT CARD */}
          <div className="bg-white rounded-2xl border border-[#E4EAE5] shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center font-bold">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#202A27]">NextCampus AI Copilot</h3>
                  <span className="text-[11px] text-[#168567] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#168567] animate-pulse" />
                    24/7 Smart Campus AI
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0F4F1] text-[#65736B]">
                GPT-Campus
              </span>
            </div>

            <p className="text-xs text-[#65736B] leading-relaxed bg-[#F6F8F6] p-3 rounded-xl border border-[#E4EAE5]/70">
              Hi {studentName}! Ask me anything about classrooms, professors, or library pods:
            </p>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              {[
                "Where is Prof. Roy's office right now?",
                'Book quiet study pod for 4:00 PM',
                'Where is Room B-204 in Turing Hall?',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#F6F8F6] hover:bg-[#EAF5EF] border border-[#E4EAE5] hover:border-[#CBE2D4] text-xs text-[#202A27] flex items-center justify-between transition-colors group"
                >
                  <span className="truncate pr-2">“{chip}”</span>
                  <ArrowRight
                    size={14}
                    className="text-[#87968D] group-hover:text-[#168567] group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="p-3.5 rounded-xl bg-[#EAF5EF] border border-[#CBE2D4] text-xs text-[#142D28] animate-in fade-in duration-200">
                <p className="leading-relaxed">{aiResponse.reply}</p>
                {aiResponse.suggestedAction && (
                  <button
                    onClick={() => navigate(aiResponse.suggestedAction)}
                    className="mt-2 text-[#168567] hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight size={12} />
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
                placeholder="Ask about schedule, labs, bus..."
                className="flex-1 h-9 px-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs text-[#202A27] placeholder:text-[#87968D] focus:outline-none focus:bg-white focus:border-[#168567] transition-colors"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={aiLoading}
                loading={aiLoading}
                icon={Send}
              />
            </form>
          </div>

          {/* B. UPCOMING DEADLINES */}
          <div className="bg-white rounded-2xl border border-[#E4EAE5] p-4.5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#65736B] flex items-center gap-2">
              <Calendar size={14} className="text-[#168567]" />
              <span>Upcoming Academic Deadlines</span>
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#FEF8EC] border border-[#F6E3B8] flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#B7791F] font-mono">TODAY • 11:59 PM</span>
                <span className="text-xs font-bold text-[#202A27]">
                  Distributed Systems Lab Practical #3
                </span>
                <span className="text-[11px] text-[#65736B]">CS-301 Git Commit tag: v0.3.1</span>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF5FA] border border-[#C9DFEE] flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#3478B8] font-mono">TOMORROW • 2:00 PM</span>
                <span className="text-xs font-bold text-[#202A27]">
                  Robotics Autonomous Drone Flight Review
                </span>
                <span className="text-[11px] text-[#65736B]">
                  Room B-205 Flight Netting Enclosure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: DIGITAL NFC CAMPUS SMART GATE PASS
          ========================================================================= */}
      {isGatePassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D28]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-6 flex flex-col gap-5 text-[#202A27]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#168567]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#202A27]">Mewar University Smart ID</span>
                  <span className="text-[10px] text-[#65736B] font-medium">Turnstile Gate Pass</span>
                </div>
              </div>
              <button
                onClick={() => setIsGatePassOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* High-res Digital Pass Body */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#F6F8F6] to-white border border-[#E4EAE5] flex flex-col items-center gap-3.5 shadow-xs">
              <div className="w-36 h-36 p-2 rounded-xl bg-white border border-[#E4EAE5] flex items-center justify-center shadow-xs">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                  <rect x="10" y="10" width="25" height="25" fill="#142D28" />
                  <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                  <rect x="18" y="18" width="9" height="9" fill="#142D28" />

                  <rect x="65" y="10" width="25" height="25" fill="#142D28" />
                  <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                  <rect x="73" y="18" width="9" height="9" fill="#142D28" />

                  <rect x="10" y="65" width="25" height="25" fill="#142D28" />
                  <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                  <rect x="18" y="73" width="9" height="9" fill="#142D28" />

                  <rect x="42" y="15" width="6" height="6" fill="#142D28" />
                  <rect x="52" y="25" width="6" height="6" fill="#142D28" />
                  <rect x="40" y="45" width="6" height="6" fill="#142D28" />
                  <rect x="55" y="55" width="6" height="6" fill="#142D28" />
                  <rect x="65" y="70" width="6" height="6" fill="#142D28" />
                  <rect x="75" y="45" width="6" height="6" fill="#142D28" />
                  <circle cx="50" cy="50" r="5" fill="#168567" />
                </svg>
              </div>

              <div className="text-center">
                <h4 className="text-base font-extrabold text-[#202A27]">{studentName}</h4>
                <p className="text-xs font-mono font-bold text-[#168567] mt-0.5">{studentRoll}</p>
                <p className="text-[11px] text-[#65736B] mt-1 font-medium">
                  {studentDept} ({studentYear})
                </p>
              </div>

              <div className="w-full pt-2.5 border-t border-[#E4EAE5] flex items-center justify-between text-[11px] text-[#65736B]">
                <span>Gate Barrier: NFC Enabled</span>
                <span className="text-[#168567] font-bold">VALID 2026</span>
              </div>
            </div>

            {/* Turnstile Tap Simulator */}
            <div className="flex flex-col gap-2">
              <Button
                variant={turnstileUnlocked ? 'primary' : 'secondary'}
                size="md"
                onClick={handleSimulateTurnstile}
                icon={turnstileUnlocked ? Unlock : Lock}
              >
                {turnstileUnlocked
                  ? 'Turnstile Access Granted! ✓'
                  : 'Simulate NFC Tap at Gate Reader'}
              </Button>

              <button
                onClick={handleCopyPass}
                className="w-full py-2 rounded-xl text-xs text-[#65736B] hover:text-[#202A27] flex items-center justify-center gap-1.5 font-medium transition-colors"
              >
                {hasCopiedPassId ? (
                  <Check size={14} className="text-[#168567]" />
                ) : (
                  <Copy size={14} />
                )}
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
