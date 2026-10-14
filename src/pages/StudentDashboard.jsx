import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
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

  // If user is Admin, direct to Admin Console
  if (user?.role === 'admin' || user?.role === 'care_admin' || user?.role === 'staff') {
    return <Navigate to="/admin" replace />;
  }


  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Digital Gate Pass Modal & Appeal State
  const [isGatePassOpen, setIsGatePassOpen] = useState(false);
  const [hasCopiedPassId, setHasCopiedPassId] = useState(false);
  const [turnstileUnlocked, setTurnstileUnlocked] = useState(false);
  const [myGatePasses, setMyGatePasses] = useState([]);
  const [gatePassSubmitting, setGatePassSubmitting] = useState(false);
  const [gatePassSuccessMsg, setGatePassSuccessMsg] = useState('');
  const [activeGatePassTab, setActiveGatePassTab] = useState('pass'); // 'pass' | 'apply'
  const [gatePassForm, setGatePassForm] = useState({
    destination: '',
    reason: '',
    outTime: '',
    expectedInTime: '',
    emergencyContact: '',
  });

  const fetchMyGatePasses = async () => {
    try {
      const res = await api.get('/gatepass/my-passes');
      if (res.success && res.data?.passes) {
        setMyGatePasses(res.data.passes);
        const hasApproved = res.data.passes.some((p) => p.status === 'APPROVED');
        if (!hasApproved && res.data.passes.length === 0) {
          setActiveGatePassTab('apply');
        }
      }
    } catch (err) {
      console.warn('[Student] Failed to fetch gate passes:', err);
    }
  };

  useEffect(() => {
    if (isGatePassOpen) {
      fetchMyGatePasses();
    }
  }, [isGatePassOpen]);

  const handleSubmitGatePassAppeal = async (e) => {
    e.preventDefault();
    if (!gatePassForm.destination || !gatePassForm.reason) {
      return;
    }
    setGatePassSubmitting(true);
    try {
      const res = await api.post('/gatepass/apply', {
        destination: gatePassForm.destination,
        reason: gatePassForm.reason,
        outTime: gatePassForm.outTime || 'Today 05:00 PM',
        expectedInTime: gatePassForm.expectedInTime || 'Today 08:30 PM',
        emergencyContact: gatePassForm.emergencyContact || user?.emergencyContact || user?.phone || '',
      });
      if (res.success) {
        setGatePassSuccessMsg('Gate pass appeal submitted! Sent to Campus Admin / Warden for approval.');
        setGatePassForm({ destination: '', reason: '', outTime: '', expectedInTime: '', emergencyContact: '' });
        fetchMyGatePasses();
        setActiveGatePassTab('pass');
        setTimeout(() => setGatePassSuccessMsg(''), 6000);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit gate pass');
    } finally {
      setGatePassSubmitting(false);
    }
  };

  // Live Class Countdown (Starts at 24m 18s and ticks every 1s)
  const [classCountdownSecs, setClassCountdownSecs] = useState(24 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setClassCountdownSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard accessibility: Escape to dismiss gate pass modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isGatePassOpen) {
        setIsGatePassOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGatePassOpen]);

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
          2. ACADEMIC OVERVIEW ROW: NEXT CLASS HERO (FULL-WIDTH)
          ========================================================================= */}
      <section className="w-full">
        {/* HERO LIVE CLASS SPOTLIGHT */}
        <div className="w-full bg-white rounded-2xl border border-[#E4EAE5] shadow-xs p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
              <div className="flex flex-wrap items-center gap-2">
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

            <h2 className="text-lg sm:text-2xl font-black text-[#202A27] tracking-tight">
              CS-301: Distributed Systems &amp; Cloud Infrastructure
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#65736B] mt-2">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#87968D]">Instructor:</span>
                <span className="text-[#202A27] font-semibold">Prof. Ananya Roy</span>
              </div>
              <span className="text-[#D0DAD2] hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-[#168567] font-semibold">
                <MapPin size={14} className="shrink-0" />
                <span>Faculty of Engineering (ENG-02), Room B-204</span>
              </div>
            </div>

            {/* Live Room Telemetry Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5]/80">
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

          <div className="pt-5 mt-5 border-t border-[#E4EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[#65736B] flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#168567] shrink-0" />
              <span>Dual 4K Laser Projection Ready • Wi-Fi 7 Core AP Online</span>
            </span>

            <Button
              variant="primary"
              size="sm"
              icon={Navigation}
              className="w-full sm:w-auto justify-center"
              onClick={() => navigate('/campus-map?bldg=eng&room=B-204')}
            >
              Navigate to Room B-204 (1.2 min walk)
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. RESTRAINED QUICK ACTIONS LAUNCHER BAR
          ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div
          onClick={() => navigate('/campus-map')}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#CBE2D4] hover:shadow-sm transition-all flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Compass size={19} />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#168567] transition-colors truncate">
              Campus Map
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#65736B] mt-0.5 truncate">3D Vector &amp; GIS</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/smartroom')}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#CBE2D4] hover:shadow-sm transition-all flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <DoorOpen size={19} />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#168567] transition-colors truncate">
              SmartRooms
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#65736B] mt-0.5 truncate">Study Pods &amp; Labs</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/directory')}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#C9DFEE] hover:shadow-sm transition-all flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EEF5FA] text-[#3478B8] border border-[#C9DFEE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Users size={19} />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#3478B8] transition-colors truncate">
              Directory
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#65736B] mt-0.5 truncate">Faculty &amp; Hours</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/complaints')}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E4EAE5] hover:border-[#CBE2D4] hover:shadow-sm transition-all flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <LifeBuoy size={19} />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#202A27] leading-tight group-hover:text-[#168567] transition-colors truncate">
              Campus Care
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#65736B] mt-0.5 truncate">&lt;45m CAFM Fix</div>
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
          <section className="bg-white rounded-2xl border border-[#E4EAE5] p-4 sm:p-6 shadow-xs">
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
                  className="w-full sm:w-auto shrink-0 justify-center"
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
                  className="w-full sm:w-auto shrink-0 justify-center"
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
                  className="w-full sm:w-auto shrink-0 justify-center"
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
                  className="w-full sm:w-auto shrink-0 justify-center"
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
        </div>
      </div>

      {/* =========================================================================
          MODAL: DIGITAL NFC CAMPUS SMART GATE PASS & OUT-PASS APPEAL SYSTEM
          ========================================================================= */}
      {isGatePassOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-pass-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsGatePassOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D28]/40 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-[#202A27] max-h-[92dvh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#168567]" />
                <div className="flex flex-col">
                  <span id="gate-pass-title" className="text-xs font-bold text-[#202A27]">
                    Mewar University Smart Pass
                  </span>
                  <span className="text-[10px] text-[#65736B] font-medium">Digital Turnstile & Campus Out-Pass</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close turnstile gate pass"
                onClick={() => setIsGatePassOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Success toast if recently submitted */}
            {gatePassSuccessMsg && (
              <div className="p-3 rounded-xl bg-[#EAF5EF] border border-[#B7DEC9] text-[#142D28] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="text-[#168567] shrink-0" />
                <span>{gatePassSuccessMsg}</span>
              </div>
            )}

            {/* Toggle: Active Pass vs Apply New */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F0F4F1] text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveGatePassTab('pass')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  activeGatePassTab === 'pass'
                    ? 'bg-white text-[#142D28] shadow-xs'
                    : 'text-[#65736B] hover:text-[#202A27]'
                }`}
              >
                My Pass & Appeals {myGatePasses.length > 0 && `(${myGatePasses.length})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveGatePassTab('apply')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  activeGatePassTab === 'apply'
                    ? 'bg-white text-[#142D28] shadow-xs'
                    : 'text-[#65736B] hover:text-[#202A27]'
                }`}
              >
                + Apply for Out-Pass
              </button>
            </div>

            {/* TAB 1: ACTIVE PASS / STATUS VIEW */}
            {activeGatePassTab === 'pass' && (
              <div className="space-y-4">
                {myGatePasses.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F6F8F6] border border-[#E4EAE5] text-center space-y-3">
                    <ShieldCheck size={32} className="mx-auto text-[#87968D]" />
                    <p className="text-xs font-semibold text-[#404D46]">
                      You do not have any active out-passes registered.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveGatePassTab('apply')}
                      className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f3f38] text-white text-xs font-bold cursor-pointer"
                    >
                      Fill Gate Pass Appeal Form
                    </button>
                  </div>
                ) : (
                  myGatePasses.map((pass) => {
                    const isApproved = pass.status === 'APPROVED';
                    const isPending = pass.status === 'PENDING';
                    const isRejected = pass.status === 'REJECTED';

                    return (
                      <div
                        key={pass.id || pass.passCode}
                        className={`p-4 rounded-2xl border transition-all ${
                          isApproved
                            ? 'bg-gradient-to-b from-[#F6F8F6] to-white border-[#168567]/30 shadow-xs'
                            : isPending
                            ? 'bg-[#FFF9EB]/60 border-[#F9E2AF]'
                            : 'bg-[#FDF2F3]/60 border-[#F1C2C6]'
                        }`}
                      >
                        {/* Status bar */}
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E4EAE5]">
                          <span className="font-mono text-xs font-bold text-[#142D28]">
                            {pass.passCode || 'GP-OUTPASS'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isApproved
                                ? 'bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]'
                                : isPending
                                ? 'bg-[#FFF9EB] text-[#B26A00] border border-[#F9E2AF]'
                                : 'bg-[#FDF2F3] text-[#C43D4B] border border-[#F1C2C6]'
                            }`}
                          >
                            {pass.status}
                          </span>
                        </div>

                        {isApproved ? (
                          /* Approved Digital QR Pass */
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-32 h-32 p-2 rounded-xl bg-white border border-[#E4EAE5] flex items-center justify-center shadow-xs">
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
                                <circle cx="50" cy="50" r="5" fill="#168567" />
                              </svg>
                            </div>

                            <div className="text-center">
                              <h4 className="text-sm font-extrabold text-[#202A27]">{pass.studentName}</h4>
                              <p className="text-xs font-mono font-bold text-[#168567] mt-0.5">{pass.enrollmentNumber}</p>
                              <p className="text-[11px] text-[#65736B] font-medium mt-0.5">
                                Destination: <span className="font-bold text-[#202A27]">{pass.destination}</span>
                              </p>
                              <p className="text-[10px] text-[#87968D]">
                                Window: {pass.outTime} $\rightarrow$ {pass.expectedInTime}
                              </p>
                            </div>

                            <Button
                              variant={turnstileUnlocked ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={handleSimulateTurnstile}
                              icon={turnstileUnlocked ? Unlock : Lock}
                              className="w-full"
                            >
                              {turnstileUnlocked ? 'Turnstile Unlocked! ✓' : 'Tap at Gate Reader'}
                            </Button>
                          </div>
                        ) : isPending ? (
                          /* Pending Appeal Information */
                          <div className="space-y-2 text-xs">
                            <p className="font-bold text-[#B26A00] flex items-center gap-1.5">
                              <Clock size={14} /> Appeal Under Administrative Review
                            </p>
                            <p className="text-[#404D46]">
                              Destination: <span className="font-semibold text-[#202A27]">{pass.destination}</span>
                            </p>
                            <p className="text-[#65736B] text-[11px]">Reason: {pass.reason}</p>
                            <div className="p-2 rounded-lg bg-white/80 border border-[#F9E2AF] text-[10.5px] text-[#87968D]">
                              Your appeal is currently with the Hostel Warden & Campus Admin. Once approved, your digital QR pass will become active.
                            </div>
                          </div>
                        ) : (
                          /* Rejected Appeal */
                          <div className="space-y-1.5 text-xs">
                            <p className="font-bold text-[#C43D4B] flex items-center gap-1.5">
                              <AlertTriangle size={14} /> Request Declined
                            </p>
                            <p className="text-[#65736B] text-[11px]">
                              {pass.adminRemarks || 'Declined by campus administration.'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: APPLY FOR GATE PASS FORM */}
            {activeGatePassTab === 'apply' && (
              <form onSubmit={handleSubmitGatePassAppeal} className="space-y-3 text-xs">
                {/* Auto-filled Section */}
                <div className="p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Student Name:</span>
                    <span className="font-bold text-[#202A27]">{studentName} (Auto-filled)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Enrollment / MUR:</span>
                    <span className="font-mono font-bold text-[#168567]">{studentRoll} (Auto-filled)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Course & Dept:</span>
                    <span className="font-medium text-[#202A27] truncate max-w-[200px]">{studentDept}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Registered Mobile:</span>
                    <span className="font-mono font-bold text-[#202A27]">
                      {user?.phone || '+91 98765 43210'} (Auto-filled)
                    </span>
                  </div>
                </div>

                {/* Destination Input */}
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Railway Station / Home / Medical Clinic"
                    value={gatePassForm.destination}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                {/* Reason Input */}
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Reason for Leaving Campus *</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="e.g. Family function attendance over the weekend"
                    value={gatePassForm.reason}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-[#404D46] block mb-1">Out Time (Departure)</label>
                    <input
                      type="text"
                      placeholder="Today 05:00 PM"
                      value={gatePassForm.outTime}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, outTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#404D46] block mb-1">Expected Return Time</label>
                    <input
                      type="text"
                      placeholder="Today 08:30 PM"
                      value={gatePassForm.expectedInTime}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, expectedInTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Parent / Guardian Contact</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={gatePassForm.emergencyContact}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                <div className="pt-2 border-t border-[#E4EAE5] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveGatePassTab('pass')}
                    className="px-3 py-2 rounded-xl bg-[#F0F4F1] text-[#65736B] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={gatePassSubmitting}
                    className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f3f38] text-white font-bold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {gatePassSubmitting ? 'Submitting Appeal...' : 'Submit Gate Pass Appeal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
