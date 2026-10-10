import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, User as UserIcon, X, CheckCircle2, AlertTriangle, Calendar, DoorOpen } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Logo size="sm" showText={true} />
      </div>

      {/* Global Interactive Search Input */}
      <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '420px', margin: '0 24px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, campus map, directory or care tickets..."
            style={{
              width: '100%',
              padding: '8px 14px 8px 38px',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--brand-accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>
      </form>

      {/* Notification and User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Campus Notifications"
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: showNotifications ? '#FFFFFF' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-accent)',
                }}
              />
            )}
          </button>

          {/* Interactive Notifications Popover */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '340px',
                backgroundColor: '#231E1F',
                border: '1px solid rgba(255, 217, 218, 0.15)',
                borderRadius: '14px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Campus Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        backgroundColor: '#AC274F',
                        color: '#FFFFFF',
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFB2BF',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: n.unread ? '#2D292A' : '#1F1A1B',
                        border: '1px solid rgba(255, 217, 218, 0.06)',
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(172, 39, 79, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFB2BF',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>{n.title}</span>
                          <span style={{ fontSize: '10px', color: '#A68A8D' }}>{n.time}</span>
                        </div>
                        <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#DFBFC3', lineHeight: 1.4 }}>
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '6px',
                  borderTop: '1px solid rgba(255, 217, 218, 0.08)',
                }}
              >
                <NavLink
                  to="/profile"
                  onClick={() => setShowNotifications(false)}
                  style={{
                    fontSize: '11px',
                    color: '#FFB1C2',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Configure Notification Preferences →
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {user ? (
          <NavLink
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              backgroundColor: 'rgba(255, 217, 218, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              textDecoration: 'none',
              color: '#FFFFFF',
            }}
          >
            <UserIcon size={16} style={{ color: '#EB638B' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</span>
          </NavLink>
        ) : (
          <NavLink
            to="/auth"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--brand-primary)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
