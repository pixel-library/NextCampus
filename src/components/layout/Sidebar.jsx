import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  DoorOpen,
  LifeBuoy,
  Bot,
  Leaf,
  FolderGit2,
  ShieldAlert,
  Settings,
  Sliders,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navGroups = [
    {
      title: 'Main Navigation',
      items: [
        { label: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Interactive Campus Map', path: '/campus-map', icon: MapPin },
        { label: 'Campus Directory', path: '/directory', icon: Users },
        { label: 'SmartRooms IoT', path: '/smartroom', icon: DoorOpen },
        { label: 'NextCampus Care', path: '/complaints', icon: LifeBuoy },
        { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
        { label: 'EcoCampus', path: '/ecocampus', icon: Leaf },
        { label: 'SkillCampus', path: '/skillcampus', icon: FolderGit2 },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'Admin Dashboard', path: '/admin', icon: ShieldAlert, role: 'admin' },
        { label: 'Campus Management', path: '/admin/campus-management', icon: Sliders, role: 'admin' },
        { label: 'Complaint Admin', path: '/admin/complaints', icon: LifeBuoy, role: 'admin' },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile & Settings', path: '/profile', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width-expanded)',
        backgroundColor: '#1E191A',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <NavLink to="/">
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#FFFFFF' }}>
            Next<span style={{ color: '#EB638B' }}>Campus</span>
          </div>
        </NavLink>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0 12px 8px 12px',
              }}
            >
              {group.title}
            </div>
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: '4px',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    backgroundColor: isActive ? 'rgba(172, 39, 79, 0.2)' : 'transparent',
                    borderLeft: isActive ? '3px solid #EB638B' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {user && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{user.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
