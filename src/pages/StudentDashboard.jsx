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
  Timer,
  FileText,
  Printer,
  Calendar,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StatusIndicator from '../components/common/StatusIndicator';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import {
  formatTime12,
  addHoursToTime,
  calculateDurationHours,
  getOutpassTimeInfo,
} from '../utils/outpassHelpers';

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

  // Digital Outpass Modal & Appeal State
  const [isGatePassOpen, setIsGatePassOpen] = useState(false);
  const [hasCopiedPassId, setHasCopiedPassId] = useState(false);
  const [copiedPassCode, setCopiedPassCode] = useState(null);
  const [turnstileUnlocked, setTurnstileUnlocked] = useState(false);
  const [now, setNow] = useState(new Date());
  const [myGatePasses, setMyGatePasses] = useState([]);
  const [gatePassSubmitting, setGatePassSubmitting] = useState(false);
  const [gatePassSuccessMsg, setGatePassSuccessMsg] = useState('');
  const [activeGatePassTab, setActiveGatePassTab] = useState('pass'); // 'pass' | 'apply'

  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [gatePassForm, setGatePassForm] = useState({
    destination: '',
    reason: '',
    date: todayDateStr,
    outTime: '17:00', // 05:00 PM
    expectedInTime: '19:00', // 07:00 PM (Default 2-hour expire limit)
    emergencyContact: '',
  });

  // Dynamic ticking clock for real-time validity & countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

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

  const currentFormDuration = useMemo(() => {
    return calculateDurationHours(gatePassForm.outTime, gatePassForm.expectedInTime);
  }, [gatePassForm.outTime, gatePassForm.expectedInTime]);

  const handleDurationPresetClick = (hours) => {
    const newInTime = addHoursToTime(gatePassForm.outTime, hours);
    setGatePassForm((prev) => ({
      ...prev,
      expectedInTime: newInTime,
    }));
  };

  const handleSubmitGatePassAppeal = async (e) => {
    e.preventDefault();
    if (!gatePassForm.destination || !gatePassForm.reason) {
      return;
    }
    setGatePassSubmitting(true);
    try {
      const outFormatted = formatTime12(gatePassForm.outTime);
      const inFormatted = formatTime12(gatePassForm.expectedInTime);
      const durationHours = currentFormDuration;

      const res = await api.post('/gatepass/apply', {
        destination: gatePassForm.destination,
        reason: gatePassForm.reason,
        outTime: `${gatePassForm.date} ${outFormatted}`,
        expectedInTime: `${gatePassForm.date} ${inFormatted}`,
        durationHours: Number(durationHours.toFixed(2)),
        expiresAt: new Date(`${gatePassForm.date}T${gatePassForm.expectedInTime}:00`).toISOString(),
        emergencyContact: gatePassForm.emergencyContact || user?.emergencyContact || user?.phone || '',
      });
      if (res.success) {
        setGatePassSuccessMsg(
          `Outpass request submitted! Expire limit: ${durationHours} hours (Valid until ${inFormatted}). Sent to Warden for approval.`
        );
        setGatePassForm((prev) => ({
          ...prev,
          destination: '',
          reason: '',
        }));
        fetchMyGatePasses();
        setActiveGatePassTab('pass');
        setTimeout(() => setGatePassSuccessMsg(''), 6000);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit outpass');
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
            icon={DoorOpen}
            onClick={() => setIsGatePassOpen(true)}
          >
            Digital Outpass
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
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E4EAE5] shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-[#202A27] max-h-[92dvh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF5EF] border border-[#B7DEC9] flex items-center justify-center text-[#168567]">
                  <DoorOpen size={18} />
                </div>
                <div className="flex flex-col">
                  <span id="gate-pass-title" className="text-sm font-extrabold text-[#202A27]">
                    Campus Digital Outpass
                  </span>
                  <span className="text-[10px] text-[#65736B] font-medium">Official Gate Pass & Timed Transit Permit</span>
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
                My Outpass Permits {myGatePasses.length > 0 && `(${myGatePasses.length})`}
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
                + Request New Outpass
              </button>
            </div>

            {/* TAB 1: OUTPASS STATUS & ACTIVE PERMITS */}
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
                      Apply for Campus Outpass
                    </button>
                  </div>
                ) : (
                  myGatePasses.map((pass) => {
                    const isApproved = pass.status === 'APPROVED';
                    const isPending = pass.status === 'PENDING';
                    const isRejected = pass.status === 'REJECTED';
                    const timeInfo = getOutpassTimeInfo(pass, now);
                    const isExpired = isApproved && timeInfo.isExpired;

                    return (
                      <div
                        key={pass.id || pass.passCode}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isApproved && !isExpired
                            ? 'bg-white border-[#168567]/35 shadow-md shadow-[#168567]/5'
                            : isExpired
                            ? 'bg-white border-[#C43D4B]/35 shadow-xs'
                            : isPending
                            ? 'bg-white border-[#F9E2AF] shadow-xs'
                            : 'bg-white border-[#F1C2C6]'
                        }`}
                      >
                        {/* Outpass Header Ribbon */}
                        <div className="p-3.5 bg-[#F6F8F6] border-b border-[#E4EAE5] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-[#142D28] bg-white px-2 py-0.5 rounded border border-[#E4EAE5] shadow-2xs">
                              {pass.passCode || 'GP-OUTPASS'}
                            </span>
                            <span className="text-[10px] font-bold text-[#65736B] uppercase tracking-wider hidden sm:inline">
                              Mewar University
                            </span>
                          </div>

                          {/* Dynamic Status Badge */}
                          {isApproved && !isExpired && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#EAF5EF] text-[#168567] border border-[#B7DEC9]">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#168567] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#168567]"></span>
                              </span>
                              ACTIVE PERMIT
                            </span>
                          )}

                          {isApproved && isExpired && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#FDF2F3] text-[#C43D4B] border border-[#F1C2C6]">
                              <AlertTriangle size={12} /> EXPIRED PASS
                            </span>
                          )}

                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#FFF9EB] text-[#B26A00] border border-[#F9E2AF]">
                              <Clock size={12} /> PENDING REVIEW
                            </span>
                          )}

                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#FDF2F3] text-[#C43D4B] border border-[#F1C2C6]">
                              <AlertTriangle size={12} /> DECLINED
                            </span>
                          )}
                        </div>

                        {/* EXPIRATION & REMAINING TIME BANNER (When Approved) */}
                        {isApproved && !isExpired && (
                          <div className="p-3 bg-gradient-to-r from-[#EAF5EF] to-[#F3F9F5] border-b border-[#B7DEC9]/70 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#142D28] flex items-center gap-1.5">
                                <Timer size={14} className="text-[#168567]" />
                                Expire Limit: <span className="text-[#168567] font-extrabold">{timeInfo.durationText}</span>
                              </span>
                              <span className="font-mono font-bold text-[#168567] text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#B7DEC9]">
                                {timeInfo.remainingText}
                              </span>
                            </div>
                            <div className="w-full bg-[#D1E7DC] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#168567] h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(5, timeInfo.progressPercent)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10.5px] text-[#404D46]">
                              <span>Departure: <b>{timeInfo.outFormatted}</b></span>
                              <span>Auto-Expires: <b>{timeInfo.inFormatted}</b></span>
                            </div>
                          </div>
                        )}

                        {isApproved && isExpired && (
                          <div className="p-3 bg-[#FDF2F3] border-b border-[#F1C2C6] text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-[#C43D4B]">
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle size={14} /> Pass Expired • {timeInfo.durationText} Limit Reached
                              </span>
                              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#F1C2C6]">
                                {timeInfo.remainingText}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8C232F]">
                              This outpass concluded at <b>{timeInfo.inFormatted}</b>. The student must report back to the campus security checkpoint immediately.
                            </p>
                          </div>
                        )}

                        {/* PASS CONTENT */}
                        <div className="p-4 space-y-3.5">
                          {/* Student Identity */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#142D28] to-[#168567] text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                                {(pass.studentName || 'ST').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-sm font-extrabold text-[#202A27]">{pass.studentName}</h4>
                                  <span className="text-[9.5px] text-[#168567] font-bold bg-[#EAF5EF] px-1.5 py-0.2 rounded border border-[#B7DEC9]">
                                    VERIFIED
                                  </span>
                                </div>
                                <p className="text-xs font-mono font-bold text-[#168567] mt-0.5">{pass.enrollmentNumber}</p>
                                <p className="text-[11px] text-[#65736B] truncate max-w-[220px]">
                                  {pass.course || pass.department}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Destination & Reason */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5]">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#87968D] mb-1">
                                <MapPin size={12} className="text-[#168567]" /> Destination
                              </div>
                              <p className="font-bold text-[#202A27] text-xs leading-snug">{pass.destination}</p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5]">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#87968D] mb-1">
                                <FileText size={12} className="text-[#168567]" /> Reason / Purpose
                              </div>
                              <p className="text-[#404D46] text-xs leading-snug">{pass.reason}</p>
                            </div>
                          </div>

                          {/* Time Window & Expiration Limit */}
                          <div className="p-3 rounded-xl bg-[#F0F4F1]/70 border border-[#E4EAE5]">
                            <div className="grid grid-cols-3 items-center text-center">
                              <div>
                                <span className="text-[9.5px] font-extrabold uppercase text-[#87968D] block">Departure</span>
                                <span className="text-sm font-extrabold text-[#202A27] block mt-0.5">{timeInfo.outFormatted}</span>
                                <span className="text-[10px] text-[#65736B] block">{timeInfo.outDateFormatted || 'Scheduled'}</span>
                              </div>

                              <div className="flex flex-col items-center justify-center px-1">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#142D28] text-white shadow-xs">
                                  ⏳ {timeInfo.durationText}
                                </span>
                                <span className="text-[9px] text-[#87968D] mt-1 font-semibold uppercase">Allowed Limit</span>
                              </div>

                              <div>
                                <span className="text-[9.5px] font-extrabold uppercase text-[#87968D] block">Return (Curfew)</span>
                                <span
                                  className={`text-sm font-extrabold block mt-0.5 ${
                                    isExpired ? 'text-[#C43D4B]' : 'text-[#168567]'
                                  }`}
                                >
                                  {timeInfo.inFormatted}
                                </span>
                                <span className="text-[10px] text-[#65736B] block">{timeInfo.inDateFormatted || 'Expires At'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pending Review Details */}
                          {isPending && (
                            <div className="p-3 rounded-xl bg-[#FFF9EB] border border-[#F9E2AF] text-xs space-y-1.5">
                              <p className="font-bold text-[#B26A00] flex items-center gap-1.5">
                                <Clock size={14} /> Outpass Appeal Under Administrative Review
                              </p>
                              <p className="text-[#65736B] text-[11px]">
                                Your requested {timeInfo.durationText} validity window from {timeInfo.outFormatted} to {timeInfo.inFormatted} has been queued with the Hostel Warden & Campus Security Admin. Once approved, the pass will activate automatically.
                              </p>
                            </div>
                          )}

                          {/* Rejection Remarks */}
                          {isRejected && (
                            <div className="p-3 rounded-xl bg-[#FDF2F3] border border-[#F1C2C6] text-xs space-y-1">
                              <p className="font-bold text-[#C43D4B] flex items-center gap-1.5">
                                <AlertTriangle size={14} /> Request Declined
                              </p>
                              <p className="text-[#65736B] text-[11px]">
                                {pass.adminRemarks || 'Declined by campus administration or curfew policy.'}
                              </p>
                            </div>
                          )}

                          {/* Warden Approval Note for Approved */}
                          {isApproved && pass.adminRemarks && (
                            <div className="p-2.5 rounded-xl bg-[#FFF9EB] border border-[#F9E2AF] text-[11px] text-[#404D46]">
                              <span className="font-bold text-[#B26A00]">Warden Approval Note:</span> {pass.adminRemarks}
                            </div>
                          )}

                          {/* Footer with Security Badge & Print/Copy */}
                          <div className="pt-2 border-t border-[#E4EAE5] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-1.5 text-[#65736B]">
                              <ShieldCheck size={14} className="text-[#168567]" />
                              <span>
                                {isApproved
                                  ? `Approved by ${pass.approvedBy || 'Campus Administrator'}`
                                  : 'Mewar University Security Registry'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 ml-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText?.(pass.passCode || studentRoll);
                                  setCopiedPassCode(pass.passCode || pass.id);
                                  setTimeout(() => setCopiedPassCode(null), 2000);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#F0F4F1] hover:bg-[#E4EAE5] text-[#202A27] font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Copy size={12} />
                                {copiedPassCode === (pass.passCode || pass.id) ? 'Copied ID' : 'Copy ID'}
                              </button>
                              <button
                                type="button"
                                onClick={() => window.print?.()}
                                className="px-2.5 py-1 rounded-lg bg-[#142D28] hover:bg-[#1f3f38] text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Printer size={12} />
                                Print
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: APPLY FOR OUTPASS FORM WITH EXPIRATION LIMIT */}
            {activeGatePassTab === 'apply' && (
              <form onSubmit={handleSubmitGatePassAppeal} className="space-y-3.5 text-xs">
                {/* Auto-filled Section */}
                <div className="p-3 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Student:</span>
                    <span className="font-bold text-[#202A27]">{studentName} (Auto-filled)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Enrollment / MUR:</span>
                    <span className="font-mono font-bold text-[#168567]">{studentRoll}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#87968D]">Course & Dept:</span>
                    <span className="font-medium text-[#202A27] truncate max-w-[220px]">{studentDept}</span>
                  </div>
                </div>

                {/* Destination Input */}
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chittorgarh Railway Station / City Center / Home"
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
                    placeholder="e.g. Family function attendance / Medical appointment"
                    value={gatePassForm.reason}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <label className="font-bold text-[#404D46] block mb-1">Outpass Date *</label>
                  <input
                    type="date"
                    required
                    value={gatePassForm.date}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                  />
                </div>

                {/* Quick Expiration Limit Selector Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#404D46] flex items-center gap-1.5">
                      <Timer size={13} className="text-[#168567]" />
                      Select Expire Limit (Hours)
                    </label>
                    <span className="text-[11px] font-extrabold text-[#168567]">
                      {currentFormDuration} {currentFormDuration === 1 ? 'Hour' : 'Hours'} Window
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 6].map((hrs) => {
                      const isSelected = Math.abs(currentFormDuration - hrs) < 0.1;
                      return (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => handleDurationPresetClick(hrs)}
                          className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#142D28] text-white shadow-xs'
                              : 'bg-[#F0F4F1] text-[#404D46] hover:bg-[#E4EAE5]'
                          }`}
                        >
                          {hrs}h Limit
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-[#404D46] block mb-1">
                      Departure Time <span className="font-semibold text-[#168567]">({formatTime12(gatePassForm.outTime)})</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={gatePassForm.outTime}
                      onChange={(e) => {
                        const newOut = e.target.value;
                        const duration = currentFormDuration;
                        setGatePassForm({
                          ...gatePassForm,
                          outTime: newOut,
                          expectedInTime: addHoursToTime(newOut, duration),
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#404D46] block mb-1">
                      Expected Return <span className="font-semibold text-[#168567]">({formatTime12(gatePassForm.expectedInTime)})</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={gatePassForm.expectedInTime}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, expectedInTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-xs focus:outline-hidden focus:border-[#168567]"
                    />
                  </div>
                </div>

                {/* Live Expiration Limit Calculation Banner */}
                <div className="p-3 rounded-xl bg-[#EAF5EF] border border-[#B7DEC9] text-[#142D28] space-y-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#168567]">
                    <Timer size={14} />
                    <span>Outpass Expire Limit: {currentFormDuration} {currentFormDuration === 1 ? 'Hour' : 'Hours'}</span>
                  </div>
                  <p className="text-[11px] text-[#404D46] leading-snug">
                    Permit valid from <b>{formatTime12(gatePassForm.outTime)}</b> until <b>{formatTime12(gatePassForm.expectedInTime)}</b>. Once the {currentFormDuration}-hour limit is reached, this outpass automatically expires.
                  </p>
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
                    className="px-4 py-2 rounded-xl bg-[#142D28] hover:bg-[#1f3f38] text-white font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {gatePassSubmitting ? 'Submitting...' : `Submit Outpass (${currentFormDuration}h Limit)`}
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
