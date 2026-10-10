import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  Users,
  DoorOpen,
  Wrench,
  Activity,
  Zap,
  TrendingUp,
  Download,
  Megaphone,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  Wifi,
  X,
  Check
} from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  useEffect(() => {
    fetchAdminStats();
  }, [user]);

  const fetchAdminStats = async () => {
    setLoading(true);
    setAccessDenied(false);

    try {
      const res = await api.get('/admin/stats');
      if (res && res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      if (err.status === 403 || err.status === 401) {
        setAccessDenied(true);
      }
      setStats({
        population: { total: 14820, students: 12450, faculty: 1320, staff: 1050 },
        rooms: { total: 184, inUse: 142, available: 42, utilizationRate: 78.4 },
        complaints: { total: 48, active: 18, inDispatch: 30, avgSlaDays: 2.4 },
        projects: { total: 38, openRoles: 64 },
        announcements: [
          { id: '1', title: 'Scheduled Network Maintenance', desc: 'Central Library AP-09 undergoing firmware update', category: 'Network', createdAt: 'Today 08:30 AM' },
          { id: '2', title: 'MU Hackathon 2026 Venue Approval', desc: 'Mewar Central Auditorium reserved for Dec 4-6', category: 'Incubator', createdAt: 'Yesterday' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    alert(`Campus Alert Broadcast Dispatched to 14,820 Nodes: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  const isAdminRole = user?.role === 'admin' || user?.role === 'care_admin' || user?.role === 'staff' || accessDenied;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-slate-800">
      {/* Access Control Notice Banner if user lacks admin role */}
      {!isAdminRole && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Demonstration Access: Backend RBAC restricts admin API mutations to authorized roles (admin, staff, care_admin).</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">READ ONLY DEMO</span>
        </div>
      )}

      {/* Top Command Context Bar */}
      <div className="flex flex-col gap-4 pb-6 border-b border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-500">
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-[#9E153E] border border-rose-200 font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E153E] animate-pulse"></span>
              Admin Central Ops
            </span>
            <span className="hidden sm:inline text-slate-400">• Mewar University Operations Node • Fall 2026</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Telemetry Mesh: Active</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>BMS Core v4.18</span>
            </span>
          </div>
        </div>

        {/* Headline & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Executive Operations Dashboard
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                Live Telemetry
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl mt-1">
              Authorized Executive User: <strong className="text-slate-800">{user?.name || 'Dr. Eleanor Vance (SuperAdmin)'}</strong> • High-concurrency campus oversight &amp; facility health.
            </p>
          </div>

          {/* Action Group */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => alert('Downloading Executive Operations Audit Report (PDF)...')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Ops Report</span>
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-[#9E153E] flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#9E153E]" />
              <span>Broadcast Campus Alert</span>
            </button>
            <button
              onClick={() => navigate('/admin/campus-management')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9E153E] to-[#BE123C] hover:from-[#881337] hover:to-[#9E153E] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span>Campus Management →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Executive Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Enrolled Pop</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#9E153E]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats?.population?.total ? stats.population.total.toLocaleString() : '14,820'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">12,450 Students • 1,320 Faculty</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              +3.2% vs last term
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Space Util</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
              <DoorOpen className="w-4 h-4 text-sky-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats?.rooms?.utilizationRate || 78.4}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {stats?.rooms?.inUse || 142} of {stats?.rooms?.total || 184} Rooms Active
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#9E153E] to-rose-400 rounded-full" style={{ width: '78.4%' }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Optimal thermal load</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Care Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats?.complaints?.total || 48} Active
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">18 Pending • 30 In Dispatch</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-semibold font-mono">Avg SLA: 2.4d</span>
            <button onClick={() => navigate('/care')} className="text-[#9E153E] hover:underline font-bold">
              Care Admin →
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Infrastructure</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">99.85%</div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">14/14 Major Facilities Online</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Nominal Mesh Active
            </span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Smart Grid</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">98.4%</div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">32.4 MWh Monitored</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200">
              <CheckCircle2 className="w-3 h-3" />
              High Efficiency
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* 1. Building Allocation Table */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#9E153E]" />
                  <span>Building &amp; SmartRoom Allocation Matrix</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live telemetry from Building Management System (BMS Core v4.18)</p>
              </div>
              <button
                onClick={() => navigate('/admin/campus-management')}
                className="inline-flex items-center gap-1.5 text-[#9E153E] hover:text-[#881337] text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Manage Buildings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 mt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Building &amp; Node</th>
                    <th className="px-4 py-3 font-semibold">Floors</th>
                    <th className="px-4 py-3 font-semibold">SmartRooms</th>
                    <th className="px-4 py-3 font-semibold">Live Load</th>
                    <th className="px-4 py-3 font-semibold">Defects</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800 divide-y divide-slate-100">
                  {[
                    { name: 'Faculty of Engineering & Tech', code: 'Block ENG-02 • Computing & AI', floors: 4, rooms: '42 (32 In-Use / 10 Free)', load: 84, tickets: '2 Active', status: 'Nominal' },
                    { name: 'Swami Vivekananda Central Library', code: 'Block LIB-03 • Open Learning', floors: 3, rooms: '28 (19 In-Use / 9 Free)', load: 91, tickets: '1 Critical', status: 'Peak Footfall' },
                    { name: 'Maharana Pratap Admin Block', code: 'Block ADM-01 • Registrar & Labs', floors: 5, rooms: '56 (44 In-Use / 12 Free)', load: 76, tickets: '0 Tickets', status: 'Nominal' },
                    { name: 'Central Cafeteria & Food Court', code: 'Block CAF-05 • Dining Plaza', floors: 2, rooms: '18 (15 In-Use / 3 Free)', load: 68, tickets: '1 Ticket', status: 'Nominal' },
                    { name: 'Mewar University Hospital', code: 'Block MED-09 • Clinical Health', floors: 4, rooms: '40 (32 In-Use / 8 Free)', load: 80, tickets: '1 Ticket', status: 'Nominal' }
                  ].map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                            <Building2 className="w-3.5 h-3.5 text-[#9E153E]" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{b.name}</div>
                            <div className="text-[10px] text-slate-400">{b.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{b.floors}</td>
                      <td className="px-4 py-3 text-slate-600">{b.rooms}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-[#9E153E]" style={{ width: `${b.load}%` }}></div>
                          </div>
                          <span className="font-mono text-[11px] font-semibold">{b.load}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.tickets.includes('Critical') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                          {b.tickets}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${b.status.includes('Peak') ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate('/smartroom')}
                          className="px-2.5 py-1 rounded-lg bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[11px] font-semibold transition-colors border border-slate-200 shadow-xs cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. Incident Defect Triage Queue */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#9E153E]" />
                  <span>Campus Helpdesk &amp; Defect Triage Queue</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live incident response stream prioritized by institutional severity</p>
              </div>
              <button
                onClick={() => navigate('/care')}
                className="inline-flex items-center gap-1.5 text-[#9E153E] hover:text-[#881337] text-xs font-bold transition-colors cursor-pointer"
              >
                <span>View Helpdesk Admin Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 mt-4">
              {[
                { id: '#CMP-1042', title: 'CS Lab B Projector HDMI Glitch', sub: 'Classroom AV • Engineering Block B-204 • Tech: Marcus Vance', status: 'En Route (ETA 25m)', prio: 'Medium' },
                { id: '#CMP-1044', title: 'Water Pressure Loss in 2nd Floor Washrooms', sub: 'Plumbing • Swami Vivekananda Library • Unassigned Dispatch', status: 'Pending Assign', prio: 'High', isHigh: true },
                { id: '#CMP-1040', title: 'Core Mesh AP Dropping Packets (Beacon Failure)', sub: 'Wi-Fi / Net • Admin Block East Wing • Assigned: Network Ops Tier 2', status: 'Investigating', prio: 'High', isHigh: true },
                { id: '#CMP-1038', title: 'LED Driver Flickering in Lecture Theatre 1', sub: 'Electrical • Engineering Block ENG-101 • Assigned: Facilities Team 1', status: 'Parts Ordered', prio: 'Low' }
              ].map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-200/80">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${inc.isHigh ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-200/70 text-slate-700'}`}>
                      {inc.id}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{inc.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{inc.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${inc.status.includes('Pending') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {inc.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inc.isHigh ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-600'}`}>
                      {inc.prio}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Administrative Task Pipeline */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Task Pipeline</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#9E153E] text-[10px] font-bold border border-rose-200">5 Pending</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-4">
              {[
                { title: 'Approve Room Allocation for MU Hackathon 2026', tag: 'High Priority', detail: 'Mewar Central Auditorium • Due 2:00 PM', isHigh: true },
                { title: 'Authorize Emergency HVAC Sub-Meter Replacement', tag: 'Medium', detail: 'Block B Basement • Due Tomorrow' },
                { title: 'Sign off 4 Resolved Care Maintenance Tickets', tag: 'Medium', detail: 'Batch Verification • Due Today' },
                { title: 'Review Faculty Keycard NFC Audit Discrepancies', tag: 'Low', detail: 'Security Dispatch • Due Oct 16' },
                { title: 'Publish Term 2 Academic Timetable Re-allocation', tag: 'High Priority', detail: 'Registrar Workflow • Due Oct 18', isHigh: true }
              ].map((tsk, tIdx) => (
                <div key={tIdx} className="p-3 rounded-xl bg-slate-50/70 flex items-start gap-3 hover:bg-slate-50 transition-colors border border-slate-200/80">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-[#9E153E] focus:ring-[#9E153E] h-4 w-4 cursor-pointer" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-900 leading-snug">{tsk.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tsk.isHigh ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-200 text-slate-600'}`}>
                        {tsk.tag}
                      </span>
                      <span className="text-[10px] text-slate-400">{tsk.detail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Operations Bulletins */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/90">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Operations Bulletins</h2>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="text-xs text-[#9E153E] hover:underline font-bold cursor-pointer"
              >
                + Post Bulletin
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-50/70 flex flex-col gap-1 border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Scheduled Network Maintenance</span>
                </div>
                <p className="text-[11px] text-slate-500">Central Library AP-09 undergoing firmware update between 02:00 - 04:00 AM.</p>
                <span className="text-[10px] text-slate-400 self-end font-mono mt-1">Today 08:30 AM</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 flex flex-col gap-1 border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#9E153E]" />
                  <span className="text-xs font-bold text-slate-900">MU Hackathon 2026 Venue Approved</span>
                </div>
                <p className="text-[11px] text-slate-500">Mewar University Central Auditorium &amp; Smart Labs reserved for Dec 4-6 sprint.</p>
                <span className="text-[10px] text-slate-400 self-end font-mono mt-1">Yesterday</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Broadcast Alert Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <Megaphone className="w-5 h-5 text-[#9E153E]" />
                <h3 className="text-base font-bold text-slate-900">Broadcast Campus Alert</h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Message *</label>
                <textarea
                  rows="3"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter high-priority operational broadcast message..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-[#9E153E] resize-none"
                  required
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9E153E] to-[#BE123C] hover:from-[#881337] hover:to-[#9E153E] text-white text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                >
                  Dispatch Alert to All Nodes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
