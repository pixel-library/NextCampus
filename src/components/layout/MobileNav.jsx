import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, DoorOpen, LifeBuoy, Bot, ShieldAlert, Sliders } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const MobileNav = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'care_admin';

  const items = isAdmin
    ? [
        { label: 'Admin', path: '/admin', icon: ShieldAlert },
        { label: 'Campus', path: '/admin/campus-management', icon: Sliders },
        { label: 'Map', path: '/campus-map', icon: MapPin },
        { label: 'Care', path: '/admin/complaints', icon: LifeBuoy },
        { label: 'AI', path: '/ai-assistant', icon: Bot },
      ]
    : [
        { label: 'Dash', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Map', path: '/campus-map', icon: MapPin },
        { label: 'Rooms', path: '/smartroom', icon: DoorOpen },
        { label: 'Care', path: '/complaints', icon: LifeBuoy },
        { label: 'AI', path: '/ai-assistant', icon: Bot },
      ];

  return (
    <nav
      className="mobile-nav-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#1E191A',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
      }}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              fontWeight: 600,
              color: isActive ? '#EB638B' : 'var(--text-muted)',
              textDecoration: 'none',
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
