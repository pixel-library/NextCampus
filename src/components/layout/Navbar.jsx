import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  DoorOpen,
  Compass,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'CS-301 Lecture Relocated',
      desc: 'Shifted to Alan Turing Hall Room B-204 due to projector servicing.',
      time: '15m ago',
      type: 'schedule',
      icon: Calendar,
      unread: true,
    },
    {
      id: 2,
      title: 'Care Ticket #CMP-1042 Updated',
      desc: 'Technician Marcus Vance dispatched with replacement optical fiber assembly.',
      time: '35m ago',
      type: 'care',
      icon: CheckCircle2,
      unread: true,
    },
    {
      id: 3,
      title: 'Library Pod 4B Reserved',
      desc: 'Confirmed from 4:00 PM – 6:00 PM today. Access PIN: 4920.',
      time: '2h ago',
      type: 'pod',
      icon: DoorOpen,
      unread: false,
    },
  ]);

  const notifRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    if (q.includes('room') || q.includes('pod') || q.includes('lab') || q.includes('b-204')) {
      navigate(`/smartroom?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (q.includes('map') || q.includes('building') || q.includes('hall') || q.includes('turing')) {
      navigate(`/campus-map?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (q.includes('ticket') || q.includes('care') || q.includes('complaint')) {
      navigate(`/complaints?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left: Campus Live Status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mewar University • Term 2026</span>
        </div>
        <div className="text-xs text-slate-400 hidden md:inline">|</div>
        <span className="text-xs text-slate-500 font-medium hidden md:inline">
          Gangrar, Chittorgarh (Rajasthan)
        </span>
      </div>

      {/* Global Interactive Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, buildings, staff, tickets..."
            className="w-full text-xs font-medium pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#9E153E] focus:ring-2 focus:ring-rose-100 transition-all"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-500 text-[10px] font-semibold">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </form>

      {/* Right Actions: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Campus Notifications"
            className={`relative p-2 rounded-xl transition-colors ${
              showNotifications
                ? 'bg-rose-50 text-[#9E153E]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Campus Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#9E153E] text-white">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-[#9E153E] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border flex gap-3 transition-colors ${
                        n.unread
                          ? 'bg-rose-50/40 border-rose-100'
                          : 'bg-slate-50/60 border-slate-100'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 text-[#9E153E] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <NavLink
                  to="/profile"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-semibold text-[#9E153E] hover:underline inline-flex items-center gap-1"
                >
                  Notification Preferences →
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        {user ? (
          <NavLink
            to="/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors text-decoration-none"
          >
            <div className="w-6 h-6 rounded-lg bg-[#9E153E] text-white flex items-center justify-center text-[11px] font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline truncate max-w-[120px]">
              {user.name}
            </span>
          </NavLink>
        ) : (
          <NavLink
            to="/auth"
            className="px-3.5 py-1.5 rounded-xl bg-[#9E153E] hover:bg-[#881337] text-white text-xs font-semibold shadow-xs transition-colors text-decoration-none"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
