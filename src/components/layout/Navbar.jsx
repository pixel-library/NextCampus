import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  CheckCircle2,
  Calendar,
  DoorOpen,
  Menu,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = ({ onToggleSidebar, isSidebarCollapsed = false, onToggleCollapse }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
  const mobileSearchInputRef = useRef(null);

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

  // Auto focus mobile search when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    setMobileSearchOpen(false);

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
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#E4EAE5] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(20,45,40,0.02)]">
      {/* Mobile Search Overlay on < sm */}
      {mobileSearchOpen ? (
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 animate-in fade-in duration-150">
          <div className="relative flex-1 flex items-center">
            <Search size={16} className="absolute left-3 text-[#87968D] pointer-events-none" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search campus resources"
              placeholder="Search rooms, buildings, tickets..."
              className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-[#F0F4F1] border border-[#168567] rounded-xl outline-none text-[#202A27] placeholder:text-[#87968D] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-[#168567] text-white text-xs font-semibold rounded-xl shrink-0"
          >
            Go
          </button>
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
            className="p-2 text-[#65736B] hover:text-[#202A27] rounded-xl shrink-0"
          >
            <X size={18} />
          </button>
        </form>
      ) : (
        <>
          {/* Left: Mobile Toggle + Mobile Branding + Desktop Sidebar Toggle + Campus Live Status */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                aria-label="Toggle navigation menu"
                title="Toggle Menu"
                className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1] rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Menu size={20} />
              </button>
            )}

            {/* Mobile Branding - visible only on mobile screens */}
            <NavLink
              to="/"
              className="md:hidden flex items-center text-decoration-none shrink-0"
              aria-label="NextCampus Home"
            >
              <Logo size="sm" showText={true} className="scale-90 origin-left" />
            </NavLink>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-expanded={!isSidebarCollapsed}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isSidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
                className="hidden md:flex min-w-[38px] min-h-[38px] items-center justify-center text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1] rounded-xl transition-colors cursor-pointer"
              >
                {isSidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF5EF] border border-[#CBE2D4] text-[11px] font-semibold text-[#142D28] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168567] animate-pulse" />
              <span>Mewar University • Term 2026</span>
            </div>
            <div className="text-xs text-[#D0DAD2] hidden md:inline">|</div>
            <span className="text-xs text-[#65736B] font-medium hidden md:inline truncate max-w-[200px] lg:max-w-none">
              Gangrar, Chittorgarh (Rajasthan)
            </span>
          </div>

          {/* Desktop & Tablet Interactive Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative flex-1 flex items-center">
              <Search size={15} className="absolute left-3.5 text-[#87968D] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search rooms, buildings, staff, tickets"
                placeholder="Search campus resources..."
                className="w-full text-xs font-medium pl-9 pr-8 sm:pr-12 py-2 bg-[#F0F4F1] border border-[#E4EAE5] rounded-xl outline-none text-[#202A27] placeholder:text-[#87968D] focus:bg-white focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/15 transition-all"
              />
              <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[#E4EAE5] text-[#65736B] text-[10px] font-semibold shadow-2xs">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </form>

          {/* Right Actions: Mobile Search Toggle + AI Assistant + Notifications + Profile */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Mobile Search Icon button (< sm) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
              className="sm:hidden min-w-[38px] min-h-[38px] p-2 flex items-center justify-center text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1] rounded-xl transition-colors cursor-pointer"
            >
              <Search size={18} />
            </button>

            {/* AI Assistant Navbar Icon Button */}
            <NavLink
              to="/ai-assistant"
              aria-label="AI Assistant"
              title="AI Assistant"
              className={({ isActive }) =>
                `relative min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 flex items-center justify-center rounded-xl transition-all cursor-pointer text-decoration-none group ${
                  isActive
                    ? 'bg-[#EAF5EF] text-[#168567] ring-1 ring-[#CBE2D4]'
                    : 'text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1]'
                }`
              }
            >
              <Sparkles size={18} className="shrink-0 transition-transform group-hover:scale-110 text-[#168567]" />
              <span className="sr-only">AI Assistant</span>
            </NavLink>

            {/* Notifications Popover */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Campus Notifications"
                title="Campus Notifications"
                className={`relative min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                  showNotifications
                    ? 'bg-[#EAF5EF] text-[#168567]'
                    : 'text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1]'
                }`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C43D4B] ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="fixed sm:absolute top-16 sm:top-12 left-3 sm:left-auto right-3 sm:right-0 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white border border-[#E4EAE5] rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E4EAE5]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#202A27]">Campus Alerts</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#168567] text-white">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-[#168567] hover:underline"
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
                              ? 'bg-[#EAF5EF]/50 border-[#CBE2D4]'
                              : 'bg-[#F0F4F1]/60 border-[#E4EAE5]'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#E4EAE5] text-[#168567] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-1">
                              <span className="text-xs font-bold text-[#202A27] truncate">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-[#87968D] shrink-0 font-medium">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#65736B] mt-0.5 leading-snug">
                              {n.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#E4EAE5] text-center">
                    <NavLink
                      to="/profile"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] font-semibold text-[#168567] hover:underline inline-flex items-center gap-1"
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
                className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-1.5 sm:pr-3 py-1.5 rounded-xl bg-[#F0F4F1] hover:bg-[#EAF5EF] border border-[#E4EAE5] hover:border-[#CBE2D4] transition-all text-decoration-none shadow-xs shrink-0"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142D28] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-[#202A27] hidden sm:inline truncate max-w-[120px]">
                  {user.name}
                </span>
              </NavLink>
            ) : (
              <NavLink
                to="/auth"
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#168567] hover:bg-[#0F6B52] text-white text-xs font-semibold shadow-xs transition-colors text-decoration-none shrink-0"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
