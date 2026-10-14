import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  History,
  Layers,
  Calendar,
  Utensils,
  BookOpen,
  ArrowRight,
  Eye,
  Send,
  Loader2,
  Trash2
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Input from '../common/Input';
import Select from '../common/Select';
import api from '../../services/api';

export function AdminUpdatesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' | 'mess' | 'audit'

  // Timetable State
  const [ttDepartment, setTtDepartment] = useState('Computer Science & Engineering');
  const [ttSemester, setTtSemester] = useState(3);
  const [ttSection, setTtSection] = useState('A');
  const [ttEffectiveFrom, setTtEffectiveFrom] = useState('2026-10-20');
  const [ttFile, setTtFile] = useState(null);
  const [ttCsvText, setTtCsvText] = useState('');
  const [ttPreview, setTtPreview] = useState(null);
  const [ttConfirmed, setTtConfirmed] = useState(false);
  const [ttVersions, setTtVersions] = useState([]);

  // Mess Menu State
  const [messFacility, setMessFacility] = useState('Central Mess / Aravalli & Meera Bai Dining Hall');
  const [messFile, setMessFile] = useState(null);
  const [messCsvText, setMessCsvText] = useState('');
  const [messPreview, setMessPreview] = useState(null);
  const [messConfirmed, setMessConfirmed] = useState(false);
  const [messVersions, setMessVersions] = useState([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Load audit logs and versions when tab changes
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab === 'audit') {
      loadAuditLogs();
    } else if (activeTab === 'timetable') {
      loadTimetableVersions();
    } else if (activeTab === 'mess') {
      loadMessVersions();
    }
  }, [isOpen, activeTab, ttDepartment, ttSemester, ttSection, messFacility]);

  const loadAuditLogs = async () => {
    try {
      const res = await api.get('/ai/audit-logs');
      if (res && res.success && res.data) {
        setAuditLogs(res.data.logs || []);
      }
    } catch (err) {
      console.warn('Failed to load audit logs:', err.message);
    }
  };

  const loadTimetableVersions = async () => {
    try {
      const res = await api.get(
        `/timetable/versions?department=${encodeURIComponent(ttDepartment)}&semester=${ttSemester}&section=${ttSection}`
      );
      if (res && res.success && res.data) {
        setTtVersions(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load timetable versions:', err.message);
    }
  };

  const loadMessVersions = async () => {
    try {
      const res = await api.get(`/mess/versions?facility=${encodeURIComponent(messFacility)}`);
      if (res && res.success && res.data) {
        setMessVersions(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load mess versions:', err.message);
    }
  };

  // Preview Timetable Upload
  const handlePreviewTimetable = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append('department', ttDepartment);
      formData.append('semester', ttSemester);
      formData.append('section', ttSection);
      formData.append('effectiveFrom', ttEffectiveFrom);

      if (ttFile) {
        formData.append('file', ttFile);
      } else if (ttCsvText.trim()) {
        formData.append('csvText', ttCsvText.trim());
      } else {
        throw new Error('Please select an Excel/CSV file or paste CSV text to preview.');
      }

      const res = await api.post('/timetable/upload-preview', formData);
      if (res && res.data) {
        setTtPreview(res.data);
        if (!res.data.isValid) {
          setFeedback({
            type: 'error',
            message: `Validation failed: ${(res.data.errors || []).join(', ')}`
          });
        } else {
          setFeedback({
            type: 'success',
            message: `Validated ${res.data.entriesCount} entries successfully.`
          });
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Preview generation failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Publish Timetable
  const handlePublishTimetable = async () => {
    if (!ttPreview || !ttPreview.entries || !ttConfirmed) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const payload = {
        department: ttDepartment,
        semester: Number(ttSemester),
        section: ttSection,
        effectiveFrom: ttEffectiveFrom,
        entries: ttPreview.entries,
        confirm: true,
        changeNotes: `Published via Admin Console on ${new Date().toLocaleDateString()}`
      };
      const res = await api.post('/timetable/publish', payload);
      if (res && res.success) {
        setFeedback({
          type: 'success',
          message: res.message || 'Timetable published atomically!'
        });
        setTtPreview(null);
        setTtConfirmed(false);
        setTtFile(null);
        setTtCsvText('');
        loadTimetableVersions();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Publication failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Rollback Timetable
  const handleRollbackTimetable = async (version) => {
    if (!window.confirm(`Are you sure you want to restore timetable version ${version}?`)) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await api.post('/timetable/rollback', {
        department: ttDepartment,
        semester: Number(ttSemester),
        section: ttSection,
        targetVersion: version,
        confirm: true
      });
      if (res && res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadTimetableVersions();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Rollback failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Preview Mess Upload
  const handlePreviewMess = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append('facility', messFacility);

      if (messFile) {
        formData.append('file', messFile);
      } else if (messCsvText.trim()) {
        formData.append('csvText', messCsvText.trim());
      } else {
        throw new Error('Please select a menu file (.csv, .xlsx, or .pdf) or paste CSV text.');
      }

      const res = await api.post('/mess/upload-preview', formData);
      if (res && res.data) {
        setMessPreview(res.data);
        if (!res.data.isValid) {
          setFeedback({
            type: 'error',
            message: `Validation failed: ${(res.data.errors || []).join(', ')}`
          });
        } else {
          setFeedback({
            type: 'success',
            message: `Validated ${res.data.daysCount} daily menus.`
          });
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Preview generation failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Publish Mess
  const handlePublishMess = async () => {
    if (!messPreview || !messPreview.menus || !messConfirmed) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const payload = {
        facility: messFacility,
        menus: messPreview.menus,
        confirm: true,
        changeNotes: `Published via Admin Console on ${new Date().toLocaleDateString()}`
      };
      const res = await api.post('/mess/publish', payload);
      if (res && res.success) {
        setFeedback({
          type: 'success',
          message: res.message || 'Mess menu published atomically!'
        });
        setMessPreview(null);
        setMessConfirmed(false);
        setMessFile(null);
        setMessCsvText('');
        loadMessVersions();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Publication failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Rollback Mess
  const handleRollbackMess = async (version) => {
    if (!window.confirm(`Are you sure you want to restore mess menu version ${version}?`)) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await api.post('/mess/rollback', {
        facility: messFacility,
        targetVersion: version,
        confirm: true
      });
      if (res && res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadMessVersions();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Rollback failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Administrative Knowledge & Records Management"
      subtitle="Authorized management console for Mewar University timetables, dining menus, and audit history."
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col gap-4 p-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => { setActiveTab('timetable'); setFeedback(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'timetable'
                ? 'bg-[#168567] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar size={14} />
            <span>Timetable Management</span>
          </button>

          <button
            onClick={() => { setActiveTab('mess'); setFeedback(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'mess'
                ? 'bg-[#168567] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Utensils size={14} />
            <span>Mess Menu Management</span>
          </button>

          <button
            onClick={() => { setActiveTab('audit'); setFeedback(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'audit'
                ? 'bg-[#168567] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History size={14} />
            <span>Audit Logs &amp; Versions</span>
          </button>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-150 ${
              feedback.type === 'success'
                ? 'bg-[#EAF5EF] border-[#168567]/30 text-[#168567]'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* TAB 1: TIMETABLE MANAGEMENT */}
        {activeTab === 'timetable' && (
          <div className="flex flex-col gap-4 text-xs">
            {/* Target Scope Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Department</label>
                <select
                  value={ttDepartment}
                  onChange={(e) => setTtDepartment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-[#168567]"
                >
                  <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Semester</label>
                <select
                  value={ttSemester}
                  onChange={(e) => setTtSemester(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-[#168567]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Section</label>
                <select
                  value={ttSection}
                  onChange={(e) => setTtSection(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-[#168567]"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={ttEffectiveFrom}
                  onChange={(e) => setTtEffectiveFrom(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-[#168567]"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-[#168567] mb-2" />
                <span className="font-semibold text-slate-800">Upload Timetable Document</span>
                <span className="text-[11px] text-slate-500 mb-3">Accepts Excel (.xlsx), CSV (.csv), or PDF (.pdf)</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.pdf"
                  onChange={(e) => setTtFile(e.target.files?.[0] || null)}
                  className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#168567] file:text-white hover:file:bg-[#116951] cursor-pointer"
                />
                {ttFile && <span className="text-[11px] text-emerald-600 mt-2 font-mono">Selected: {ttFile.name}</span>}
              </div>

              <div className="flex flex-col">
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Or Paste CSV Data Directly</label>
                <textarea
                  rows={4}
                  value={ttCsvText}
                  onChange={(e) => setTtCsvText(e.target.value)}
                  placeholder="day,code,subject,start,end,faculty,room&#10;Monday,CS301,Data Structures,09:30,10:30,Prof. Roy,Room B-204"
                  className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#168567]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreviewTimetable}
                disabled={isLoading || (!ttFile && !ttCsvText.trim())}
                icon={Eye}
              >
                {isLoading ? 'Processing...' : 'Parse & Validate Preview'}
              </Button>
            </div>

            {/* Validation & Diff Preview Section */}
            {ttPreview && (
              <div className="border border-slate-200 rounded-xl p-3 bg-white flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Extracted Preview</span>
                    <Badge variant={ttPreview.isValid ? 'success' : 'danger'}>
                      {ttPreview.isValid ? 'Valid Format' : 'Has Errors'}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {ttPreview.entriesCount} rows extracted
                  </span>
                </div>

                {ttPreview.warnings?.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle size={13} />
                      Classroom Overlap Warnings:
                    </span>
                    {ttPreview.warnings.map((w, i) => (
                      <span key={i} className="pl-4">• {w}</span>
                    ))}
                  </div>
                )}

                {/* Table Preview */}
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                      <tr>
                        <th className="p-2">Day</th>
                        <th className="p-2">Code</th>
                        <th className="p-2">Subject</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Room</th>
                        <th className="p-2">Faculty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {ttPreview.entries.map((e, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-2 font-sans font-medium">{e.dayOfWeek}</td>
                          <td className="p-2 text-[#168567]">{e.subjectCode}</td>
                          <td className="p-2 font-sans">{e.subject}</td>
                          <td className="p-2">{e.startTime} - {e.endTime}</td>
                          <td className="p-2">{e.room}</td>
                          <td className="p-2 font-sans">{e.faculty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Confirmation Box */}
                {ttPreview.isValid && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ttConfirmed}
                        onChange={(e) => setTtConfirmed(e.target.checked)}
                        className="rounded border-emerald-400 text-[#168567] focus:ring-[#168567]"
                      />
                      <span className="text-xs font-semibold text-emerald-900">
                        I authorize atomic publication of this timetable version for {ttDepartment} Sem {ttSemester}.
                      </span>
                    </label>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handlePublishTimetable}
                      disabled={!ttConfirmed || isLoading}
                      icon={Send}
                    >
                      {isLoading ? 'Publishing...' : 'Confirm & Publish Atomically'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Version History & Rollback Table */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/40">
              <span className="font-bold text-slate-800 text-xs block mb-2">Version History &amp; Rollback</span>
              {ttVersions.length === 0 ? (
                <span className="text-slate-400 italic text-[11px]">No previous versions on record for this scope.</span>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {ttVersions.map((v) => (
                    <div
                      key={v.version}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900">v{v.version}</span>
                        <Badge variant={v.status === 'published' ? 'success' : 'neutral'}>
                          {v.status}
                        </Badge>
                        <span className="text-slate-500 font-mono">
                          {v.entriesCount} classes • Published by {v.publishedBy}
                        </span>
                      </div>
                      {v.status !== 'published' && (
                        <button
                          onClick={() => handleRollbackTimetable(v.version)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw size={12} />
                          Restore v{v.version}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MESS MENU MANAGEMENT */}
        {activeTab === 'mess' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-mono text-slate-500 mb-1">Target Dining Facility</label>
              <select
                value={messFacility}
                onChange={(e) => setMessFacility(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-[#168567]"
              >
                <option value="Central Mess / Aravalli & Meera Bai Dining Hall">
                  Central Mess / Aravalli &amp; Meera Bai Dining Hall
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <Utensils className="w-8 h-8 text-[#168567] mb-2" />
                <span className="font-semibold text-slate-800">Upload Mess Menu Sheet</span>
                <span className="text-[11px] text-slate-500 mb-3">Accepts Excel (.xlsx), CSV (.csv), or PDF (.pdf)</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.pdf"
                  onChange={(e) => setMessFile(e.target.files?.[0] || null)}
                  className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#168567] file:text-white hover:file:bg-[#116951] cursor-pointer"
                />
                {messFile && <span className="text-[11px] text-emerald-600 mt-2 font-mono">Selected: {messFile.name}</span>}
              </div>

              <div className="flex flex-col">
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Or Paste CSV Menu</label>
                <textarea
                  rows={4}
                  value={messCsvText}
                  onChange={(e) => setMessCsvText(e.target.value)}
                  placeholder="day,date,breakfast,lunch,snacks,dinner&#10;Monday,2026-10-19,Poha/Chai,Rajma Rice/Roti,Samosa/Tea,Paneer/Roti/Sweet"
                  className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#168567]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreviewMess}
                disabled={isLoading || (!messFile && !messCsvText.trim())}
                icon={Eye}
              >
                {isLoading ? 'Processing...' : 'Parse & Validate Menu'}
              </Button>
            </div>

            {/* Mess Preview */}
            {messPreview && (
              <div className="border border-slate-200 rounded-xl p-3 bg-white flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Extracted Menu Preview</span>
                    <Badge variant={messPreview.isValid ? 'success' : 'danger'}>
                      {messPreview.isValid ? 'Valid Schedule' : 'Errors Found'}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {messPreview.daysCount} days extracted
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                      <tr>
                        <th className="p-2">Day</th>
                        <th className="p-2">Breakfast</th>
                        <th className="p-2">Lunch</th>
                        <th className="p-2">Snacks</th>
                        <th className="p-2">Dinner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {messPreview.menus.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-2 font-bold text-slate-900">{m.dayOfWeek}</td>
                          <td className="p-2 text-slate-600">{(m.breakfast.items || []).join(', ')}</td>
                          <td className="p-2 text-slate-600">{(m.lunch.items || []).join(', ')}</td>
                          <td className="p-2 text-slate-600">{(m.snacks.items || []).join(', ')}</td>
                          <td className="p-2 text-slate-600">{(m.dinner.items || []).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {messPreview.isValid && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={messConfirmed}
                        onChange={(e) => setMessConfirmed(e.target.checked)}
                        className="rounded border-emerald-400 text-[#168567] focus:ring-[#168567]"
                      />
                      <span className="text-xs font-semibold text-emerald-900">
                        I confirm and publish this verified dining menu cycle.
                      </span>
                    </label>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handlePublishMess}
                      disabled={!messConfirmed || isLoading}
                      icon={Send}
                    >
                      {isLoading ? 'Publishing...' : 'Confirm & Publish Atomically'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mess Versions */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/40">
              <span className="font-bold text-slate-800 text-xs block mb-2">Dining Version History</span>
              {messVersions.length === 0 ? (
                <span className="text-slate-400 italic text-[11px]">No previous versions on record.</span>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {messVersions.map((v) => (
                    <div
                      key={v.version}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900">v{v.version}</span>
                        <Badge variant={v.status === 'published' ? 'success' : 'neutral'}>
                          {v.status}
                        </Badge>
                        <span className="text-slate-500 font-mono">
                          {v.daysCount} days • Published by {v.publishedBy}
                        </span>
                      </div>
                      {v.status !== 'published' && (
                        <button
                          onClick={() => handleRollbackMess(v.version)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw size={12} />
                          Restore v{v.version}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="flex flex-col gap-3 text-xs">
            <span className="text-xs text-slate-500">
              Immutable log of administrator publishes, timetable replacements, and menu updates:
            </span>

            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-2.5">Action</th>
                    <th className="p-2.5">Target Scope</th>
                    <th className="p-2.5">Admin Email</th>
                    <th className="p-2.5">Version</th>
                    <th className="p-2.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5">
                        <Badge variant={log.action.includes('rollback') ? 'warning' : 'success'}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-2.5 font-sans font-medium text-slate-800">{log.targetScope}</td>
                      <td className="p-2.5 text-slate-600">{log.userEmail}</td>
                      <td className="p-2.5">v{log.newVersion || 1}</td>
                      <td className="p-2.5 text-slate-500">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AdminUpdatesModal;
