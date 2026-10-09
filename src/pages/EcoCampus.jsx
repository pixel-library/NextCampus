import React, { useState, useEffect } from 'react';
import api from '../services/api';

export function EcoCampus() {
  const [activeChartStream, setActiveChartStream] = useState('elec');
  const [isSyncing, setIsSyncing] = useState(false);
  const [userEcoPoints, setUserEcoPoints] = useState(420);
  const [completedChallenges, setCompletedChallenges] = useState({
    refill: true,
    offpeak: false,
    paperless: true
  });

  // Fetch backend sustainability metrics if available
  useEffect(() => {
    api.get('/sustainability/metrics')
      .then((res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Sync state if server returns metrics
        }
      })
      .catch(() => {
        // Use initial robust verified sample telemetry
      });
  }, []);

  const handleSyncMeters = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const handleToggleChallenge = (key, pts) => {
    setCompletedChallenges((prev) => {
      const nextVal = !prev[key];
      setUserEcoPoints((p) => (nextVal ? p + pts : p - pts));
      return { ...prev, [key]: nextVal };
    });
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Ambient Glow Behind Viewport Header */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>

        {/* Top Campus Photo Banner / Visual Context Strip */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-space-lg shadow-md group border border-outline-variant/20">
          <div
            className="w-full h-48 md:h-56 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMLc07xsfXTrG06sRn3d8oq3LciMAPobuAHK6MsgilpjHLtfvHBBaCJnQM7smCNAPXUNxh6Mhjm9wegwiY26YPZVKkbjT6h9feBeBKK_qfvRFj4pfT_SD0wfAZx9CxtFzTgAHFbBtbb8NpcTDP08PRCcL6fg7bpflZcMfhTxcIXDXCUwAZJ3g_mPVJfiwhmYNel_Xo1jSyoGY0tHmRMsFE_SVaXfXb_zv71ATRZHGReIaguUWpOiYnNA')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent flex flex-col justify-end p-space-lg">
            <div className="flex flex-wrap items-center gap-space-xs mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-fixed font-caption text-caption uppercase tracking-wider font-semibold border border-primary/30">
                Charter 2030 Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption flex items-center gap-1 border border-outline-variant/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Telemetry Stream Live
              </span>
              <span className="text-on-surface-variant font-caption text-caption hidden sm:inline">• IoT Gateway Node #BMS-094</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
                  SUSTAINABILITY &amp; NET-ZERO METRICS • OXFORD BROOKES CAMPUS • GREEN CAMPUS CHARTER 2030
                </span>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mt-0.5">
                  EcoCampus — Sustainability &amp; Resource Telemetry
                </h1>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <button
                  onClick={handleSyncMeters}
                  className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md border border-outline-variant/30"
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>cached</span>
                  <span>{isSyncing ? 'Syncing...' : 'Sync Meters'}</span>
                </button>
                <button
                  onClick={() => alert('Downloading official Oxford Brookes Sustainability Audit Report PDF...')}
                  className="flex items-center gap-space-xs px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all shadow-[0_0_16px_rgba(172,39,79,0.35)] font-label-md text-label-md font-semibold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Audit Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Context Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg px-1">
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Explore energy conservation, real-time water indexing, smart circular waste diversion, and student-led ecological initiatives across Oxford Brookes academic blocks and central residential quadrangles.
          </p>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="font-caption text-caption text-on-surface-variant">Grid Frequency:</span>
            <span className="font-caption text-caption font-mono px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold border border-primary/30">
              50.02 Hz • Nominal
            </span>
          </div>
        </div>

        {/* Top Summary Key Performance Metrics (5-Pill Bento) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md mb-space-xl">
          {/* Metric 1 */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Sustainability Score</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">78%</span>
                <span className="px-1.5 py-0.5 rounded text-caption font-semibold bg-primary-container/40 text-primary-fixed">Grade A-</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-primary-fixed font-caption text-caption">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+4.2% vs last term</span>
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Electricity Usage</span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">12,450</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">kWh</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-primary-fixed font-caption text-caption">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                <span>-8% vs benchmark</span>
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Water Saved</span>
              <div className="w-8 h-8 rounded-lg bg-tertiary-container/40 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">8,230</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Litres</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-caption text-caption">
                <span className="material-symbols-outlined text-[14px] text-tertiary">cyclone</span>
                <span>Greywater cycle active</span>
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Waste Diverted</span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[18px]">recycling</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">480</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">kg</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-primary-fixed font-caption text-caption">
                <span className="material-symbols-outlined text-[14px]">compost</span>
                <span>82% diverted / composted</span>
              </div>
            </div>
          </div>

          {/* Metric 5 */}
          <div className="col-span-2 sm:col-span-1 bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Green Initiatives</span>
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">forest</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">14</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Active</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-caption text-caption">
                <span className="material-symbols-outlined text-[14px] text-primary">groups</span>
                <span>Student &amp; facility teams</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* LEFT / MAIN TELEMETRY COLUMN (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-xl">
            {/* 1. Resource Telemetry Interactive Chart Card */}
            <div className="bg-surface-container p-space-lg rounded-xl shadow-sm relative overflow-hidden border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Resource Telemetry &amp; Consumption Curves</h2>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    Hourly multi-feed integration • Academic Quad Zone A &amp; B
                  </p>
                </div>

                {/* Stream Toggles */}
                <div className="flex items-center p-1 rounded-lg bg-surface-container-low shrink-0 self-start sm:self-auto border border-outline-variant/30">
                  <button
                    onClick={() => setActiveChartStream('elec')}
                    className={`px-3 py-1 rounded text-caption font-semibold transition-all ${
                      activeChartStream === 'elec'
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Electricity (kWh)
                  </button>
                  <button
                    onClick={() => setActiveChartStream('water')}
                    className={`px-3 py-1 rounded text-caption font-semibold transition-all ${
                      activeChartStream === 'water'
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Water Flow (L)
                  </button>
                  <button
                    onClick={() => setActiveChartStream('solar')}
                    className={`px-3 py-1 rounded text-caption font-semibold transition-all ${
                      activeChartStream === 'solar'
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Solar Harvest (kWp)
                  </button>
                </div>
              </div>

              {/* Chart Sub-Header Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-space-xs text-caption text-on-surface-variant px-1 mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded bg-primary"></span>
                    <span>{activeChartStream === 'elec' ? 'Actual Consumption' : activeChartStream === 'water' ? 'Water Flow Index' : 'PV Solar Output'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded bg-secondary-container"></span>
                    <span>Charter Baseline</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary-fixed font-mono text-[11px] border border-primary/20">
                  Peak Conservation Window: 13:00 - 16:30 Daily
                </span>
              </div>

              {/* Inline SVG Multi-Stream Telemetry Curve Graph */}
              <div className="w-full bg-surface-container-lowest/70 rounded-xl p-3 relative mb-space-md border border-outline-variant/30">
                <svg className="w-full h-56 overflow-visible" viewBox="0 0 700 240">
                  <defs>
                    <linearGradient id="elecGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ffb2bf" stopOpacity="0.35"></stop>
                      <stop offset="100%" stopColor="#ac274f" stopOpacity="0.0"></stop>
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="680" y2="30" stroke="#383335" strokeDasharray="3 3" strokeWidth="1"></line>
                  <line x1="30" y1="80" x2="680" y2="80" stroke="#383335" strokeDasharray="3 3" strokeWidth="1"></line>
                  <line x1="30" y1="130" x2="680" y2="130" stroke="#383335" strokeDasharray="3 3" strokeWidth="1"></line>
                  <line x1="30" y1="180" x2="680" y2="180" stroke="#383335" strokeDasharray="3 3" strokeWidth="1"></line>

                  {/* Baseline Reference Curve */}
                  <path
                    d="M 40,165 C 100,160 160,150 230,135 C 300,120 370,140 440,110 C 510,80 580,75 660,65"
                    fill="none"
                    stroke="#8c1844"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.85"
                  ></path>

                  {/* Main Gradient Area Fill */}
                  <path
                    d={
                      activeChartStream === 'water'
                        ? 'M 40,195 L 40,180 C 100,150 160,160 230,120 C 300,100 370,130 440,95 C 510,75 580,80 660,55 L 660,195 Z'
                        : activeChartStream === 'solar'
                        ? 'M 40,195 L 40,190 C 100,180 160,140 230,90 C 300,50 370,70 440,110 C 510,140 580,170 660,185 L 660,195 Z'
                        : 'M 40,195 L 40,170 C 100,165 160,135 230,140 C 300,145 370,115 440,85 C 510,55 580,70 660,45 L 660,195 Z'
                    }
                    fill="url(#elecGrad)"
                  ></path>

                  {/* Main Active Telemetry Curve */}
                  <path
                    d={
                      activeChartStream === 'water'
                        ? 'M 40,180 C 100,150 160,160 230,120 C 300,100 370,130 440,95 C 510,75 580,80 660,55'
                        : activeChartStream === 'solar'
                        ? 'M 40,190 C 100,180 160,140 230,90 C 300,50 370,70 440,110 C 510,140 580,170 660,185'
                        : 'M 40,170 C 100,165 160,135 230,140 C 300,145 370,115 440,85 C 510,55 580,70 660,45'
                    }
                    fill="none"
                    stroke="#ffb2bf"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  ></path>

                  {/* Nodes */}
                  <circle cx="40" cy="170" r="4" fill="#ffb2bf"></circle>
                  <circle cx="110" cy="160" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="180" cy="140" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="250" cy="138" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="320" cy="142" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="390" cy="105" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="460" cy="80" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="530" cy="62" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="600" cy="68" r="3.5" fill="#ffb2bf"></circle>
                  <circle cx="660" cy="45" r="5" fill="#ac274f" stroke="#ffb2bf" strokeWidth="2"></circle>

                  {/* Watermark badge */}
                  <g transform="translate(615, 20)">
                    <rect x="0" y="0" width="70" height="20" rx="4" fill="#ac274f"></rect>
                    <text x="35" y="14" textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontSize="10" fontWeight="600">
                      {activeChartStream === 'solar' ? 'PV: +18%' : 'Oct: -8.4%'}
                    </text>
                  </g>

                  {/* X Labels */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => (
                    <text
                      key={m}
                      x={40 + i * 68.8}
                      y="215"
                      textAnchor="middle"
                      fill={i === 9 ? '#ffb2bf' : '#dfbfc3'}
                      fontFamily="Inter"
                      fontSize="11"
                      fontWeight={i === 9 ? '600' : '400'}
                    >
                      {m}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Sub-meter Disaggregation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                    Facility Sub-Meter Disaggregation
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">Real-time load split</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                  <div className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface truncate">Alan Turing Hall</span>
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                    </div>
                    <div className="font-title-md text-title-md font-bold text-primary mt-1">
                      3,420 <span className="font-caption text-caption font-normal text-on-surface-variant">kWh</span>
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant mt-0.5">Labs &amp; Supercompute</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface truncate">Central Library</span>
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    </div>
                    <div className="font-title-md text-title-md font-bold text-on-surface mt-1">
                      2,890 <span className="font-caption text-caption font-normal text-on-surface-variant">kWh</span>
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant mt-0.5">HVAC Eco-Mode</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface truncate">Ramanujan Cmplx</span>
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    </div>
                    <div className="font-title-md text-title-md font-bold text-on-surface mt-1">
                      4,110 <span className="font-caption text-caption font-normal text-on-surface-variant">kWh</span>
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant mt-0.5">Auditoriums &amp; Studios</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface truncate">Student Union</span>
                      <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
                    </div>
                    <div className="font-title-md text-title-md font-bold text-on-surface mt-1">
                      2,030 <span className="font-caption text-caption font-normal text-on-surface-variant">kWh</span>
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant mt-0.5">Dining &amp; Recreation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Smart Waste & Recycling Circular Matrix Card */}
            <div className="bg-surface-container p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">recycling</span>
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Circular Waste Diversion &amp; Smart Bin Sensors</h2>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    Automated optical sorting weight telemetry across 48 IoT campus waste stations
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-container/20 text-primary-fixed font-caption text-caption self-start sm:self-auto font-medium border border-primary/20">
                  Daily Diversion Rate: 82%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
                {/* Waste Partition */}
                <div className="md:col-span-7 bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mb-3">Material Stream Partition</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-label-sm font-label-sm mb-1">
                        <span className="flex items-center gap-2 text-on-surface">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                          <span>Organic / Dining Compost</span>
                        </span>
                        <span className="font-mono text-primary font-semibold">38% • 182 kg</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '38%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-label-sm font-label-sm mb-1">
                        <span className="flex items-center gap-2 text-on-surface">
                          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                          <span>Dry Recyclables (Paper/Fiber)</span>
                        </span>
                        <span className="font-mono text-secondary font-semibold">32% • 154 kg</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-label-sm font-label-sm mb-1">
                        <span className="flex items-center gap-2 text-on-surface">
                          <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                          <span>E-Waste &amp; Battery Depot</span>
                        </span>
                        <span className="font-mono text-tertiary font-semibold">12% • 58 kg</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-tertiary rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-label-sm font-label-sm mb-1">
                        <span className="flex items-center gap-2 text-on-surface-variant">
                          <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                          <span>Landfill Residual (Non-divertible)</span>
                        </span>
                        <span className="font-mono text-on-surface-variant font-semibold">18% • 86 kg</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-outline rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-caption font-caption text-on-surface-variant border-t border-outline-variant/20">
                    <span>Compost redirected to campus organic greenhouses</span>
                    <span className="text-primary font-medium">Zero incinerator transit</span>
                  </div>
                </div>

                {/* SmartBin Gauges */}
                <div className="md:col-span-5 bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mb-2">Live SmartBin Status</span>
                  <div className="flex items-center justify-around py-1">
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                          <path className="text-tertiary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="45, 100" strokeLinecap="round" strokeWidth="3.5"></path>
                        </svg>
                        <span className="absolute font-label-md text-label-md font-bold text-on-surface">45%</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface font-medium mt-1.5 text-center">Quad North</span>
                      <span className="font-caption text-[10px] text-tertiary">Normal Load</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                          <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="80, 100" strokeLinecap="round" strokeWidth="3.5"></path>
                        </svg>
                        <span className="absolute font-label-md text-label-md font-bold text-primary">80%</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface font-medium mt-1.5 text-center">Library Foyer</span>
                      <span className="font-caption text-[10px] text-primary-fixed">Pickup Queued</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                          <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="30, 100" strokeLinecap="round" strokeWidth="3.5"></path>
                        </svg>
                        <span className="absolute font-label-md text-label-md font-bold text-on-surface">30%</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface font-medium mt-1.5 text-center">Turing Cafe</span>
                      <span className="font-caption text-[10px] text-secondary">Optimal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Opening SmartBin Topology Map across 48 campus waste stations...')}
                    className="mt-3 w-full py-1.5 px-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-caption text-caption text-center border border-outline-variant/20"
                    type="button"
                  >
                    Open SmartBin Topology Map (48 Stations)
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Active Green Campus Initiatives Portfolio */}
            <div className="bg-surface-container p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">energy_savings_leaf</span>
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Active Green Campus Initiatives</h2>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    Capital engineering &amp; ecological retrofits currently deploying across campus
                  </p>
                </div>
                <span className="font-caption text-caption text-on-surface-variant hidden sm:inline">Q4 Milestone Phase</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {/* Initiative 1 */}
                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Rooftop Solar Array Phase II</span>
                      <span className="px-2 py-0.5 rounded text-caption bg-primary-container text-on-primary-container font-semibold">74% Done</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Block A-01 Turing Hall • Target 120 MWh/year high-efficiency monocrystalline PV arrays.
                    </p>
                  </div>
                  <div className="mt-3 pt-2">
                    <div className="flex justify-between text-caption font-mono text-on-surface-variant mb-1">
                      <span>88.8 / 120 MWh cap</span>
                      <span className="text-primary font-semibold">Grid Tie Oct 28</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Initiative 2 */}
                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Geothermal HVAC Loop</span>
                      <span className="px-2 py-0.5 rounded text-caption bg-secondary-container/50 text-secondary-fixed font-semibold">Operational</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Sub-surface heat exchangers in East Meadow cutting cooling energy across Central Library.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between font-caption text-caption">
                    <span className="text-on-surface-variant">Cooling Load Reduction:</span>
                    <span className="font-bold text-secondary font-mono">-14% Peak KWh</span>
                  </div>
                </div>

                {/* Initiative 3 */}
                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Rainwater &amp; Bioswale Sys</span>
                      <span className="px-2 py-0.5 rounded text-caption bg-tertiary-container text-on-tertiary-container font-semibold">Active Cycle</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Gravity-fed bioswale filtration basin servicing botanical landscape and toilet flushes.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between font-caption text-caption">
                    <span className="text-on-surface-variant">Reservoir Capacity:</span>
                    <span className="font-bold text-tertiary font-mono">45,000 Litres</span>
                  </div>
                </div>

                {/* Initiative 4 */}
                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Zero Single-Use Plastics</span>
                      <span className="px-2 py-0.5 rounded text-caption bg-primary-container/40 text-primary-fixed font-semibold">96% Compliant</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Comprehensive audit across all 4 dining halls, faculty lounges, and campus vendor cafes.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between font-caption text-caption">
                    <span className="text-on-surface-variant">Scope 3 Packaging:</span>
                    <span className="font-bold text-primary font-mono">3.4 Tons Avoided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT RAIL: STUDENT PARTICIPATION, ECO-AI & RECOMMENDATIONS (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-xl">
            {/* 1. Student Eco-Action & Participation Hub */}
            <div className="bg-surface-container p-space-lg rounded-xl shadow-sm relative overflow-hidden border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">workspace_premium</span>
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Student Eco-Action Hub</h2>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    Earn Green Credits, complete micro-challenges, and level up campus sustainability
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-container/30 text-primary text-caption font-semibold">
                  Fall '26
                </span>
              </div>

              {/* Top Student Leader Card */}
              <div className="bg-surface-container-low p-space-md rounded-xl mb-space-md flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center font-title-md text-title-md font-bold text-on-primary shrink-0 shadow-sm">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Aarav Sharma</span>
                      <span className="material-symbols-outlined text-primary text-[16px]">stars</span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">CS '25 • Campus Eco-Ambassador</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-title-md text-title-md font-bold text-primary font-mono">{userEcoPoints}</span>
                  <span className="font-caption text-caption text-on-surface-variant block">EcoPoints</span>
                </div>
              </div>

              {/* Micro-Challenges */}
              <div className="space-y-space-sm mb-space-md">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  Weekly Micro-Challenges
                </span>

                <div
                  onClick={() => handleToggleChallenge('refill', 50)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    completedChallenges.refill
                      ? 'bg-primary-container/20 border-primary/40'
                      : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-primary">water_full</span>
                    <div>
                      <p className="text-label-md font-label-md font-bold text-on-surface">Use Hydration Station x3</p>
                      <p className="text-caption font-caption text-on-surface-variant">Tap sensor at library or Turing quad</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-caption font-bold font-mono ${completedChallenges.refill ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                    {completedChallenges.refill ? '✓ +50 pts' : '+50 pts'}
                  </span>
                </div>

                <div
                  onClick={() => handleToggleChallenge('offpeak', 75)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    completedChallenges.offpeak
                      ? 'bg-primary-container/20 border-primary/40'
                      : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-secondary">power</span>
                    <div>
                      <p className="text-label-md font-label-md font-bold text-on-surface">Study in Off-Peak Window</p>
                      <p className="text-caption font-caption text-on-surface-variant">Book study pod during 13:00 - 16:30</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-caption font-bold font-mono ${completedChallenges.offpeak ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                    {completedChallenges.offpeak ? '✓ +75 pts' : '+75 pts'}
                  </span>
                </div>

                <div
                  onClick={() => handleToggleChallenge('paperless', 40)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    completedChallenges.paperless
                      ? 'bg-primary-container/20 border-primary/40'
                      : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">description</span>
                    <div>
                      <p className="text-label-md font-label-md font-bold text-on-surface">Paperless Submission</p>
                      <p className="text-caption font-caption text-on-surface-variant">Submit assignment digitally via LMS</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-caption font-bold font-mono ${completedChallenges.paperless ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                    {completedChallenges.paperless ? '✓ +40 pts' : '+40 pts'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Sustainability Recommendations & AI Advisory */}
            <div className="bg-surface-container p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-space-md">
                <span className="material-symbols-outlined text-primary text-[22px]">lightbulb</span>
                <h2 className="font-title-md text-title-md text-on-surface font-bold">Sustainability Recommendations</h2>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm font-bold text-primary">Smart HVAC Scheduling</span>
                    <span className="text-caption font-mono text-on-surface-variant">Recommendation #1</span>
                  </div>
                  <p className="text-caption text-on-surface-variant leading-relaxed">
                    Shift library cooling loads 30 minutes earlier to leverage morning solar surplus before peak tariff pricing at 14:00.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm font-bold text-secondary">Quad Rainwater Diversion</span>
                    <span className="text-caption font-mono text-on-surface-variant">Recommendation #2</span>
                  </div>
                  <p className="text-caption text-on-surface-variant leading-relaxed">
                    Connect Block B rainwater runoff directly into the East Meadow bioswale to prevent municipal storm sewer surcharge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EcoCampus;
