import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  DoorOpen,
  LifeBuoy,
  Bot,
  ShieldAlert,
  Sliders,
  Menu,
  Users,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const MobileNav = ({ onOpenMore }) => {
  const { user } = useAuth();
  const location = useLocation();
  const currentFullPath = location.pathname + location.search;

  const isAdmin = user?.role === 'admin' || user?.role === 'staff' || user?.role === 'care_admin';

  const items = isAdmin
    ? [
        { label: 'Console', path: '/admin', icon: LayoutDashboard },
        { label: 'Gate Pass', path: '/admin?tab=gatepass', icon: DoorOpen },
        { label: 'Students', path: '/admin?tab=students', icon: Users },
        { label: 'Timetable', path: '/admin?tab=timetable', icon: Sliders },
        { label: 'Map', path: '/campus-map', icon: MapPin },
      ]
    : [
        { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Map', path: '/campus-map', icon: MapPin },
        { label: 'Indoor Map', path: '/smartroom', icon: Compass },
        { label: 'Care', path: '/complaints', icon: LifeBuoy },
        { label: 'Directory', path: '/directory', icon: Users },
      ];

  const checkIsActive = (itemPath) => {
    if (itemPath.includes('?')) {
      return currentFullPath === itemPath;
    }
    if (itemPath === '/admin') {
      return location.pathname === '/admin' && (!location.search || location.search === '?tab=overview');
    }
    return location.pathname === itemPath;
  };

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 backdrop-blur-md border-t border-[#E4EAE5] flex items-center justify-around z-40 px-1 shadow-[0_-2px_8px_rgba(20,45,40,0.03)]"
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const active = checkIsActive(item.path);
        return (
          <NavLink
            key={idx}
            to={item.path}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all duration-150 text-decoration-none ${
              active
                ? 'text-[#168567] font-bold'
                : 'text-[#65736B] hover:text-[#202A27] font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                active ? 'bg-[#EAF5EF] text-[#168567]' : 'text-[#87968D]'
              }`}
            >
              <Icon size={18} />
            </div>
            <span className="text-[10px] leading-none tracking-tight">
              {item.label}
            </span>
          </NavLink>
        );
      })}

      {/* More / Menu Drawer Trigger for Directory, Profile, Settings */}
      {onOpenMore && (
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Open More Campus Navigation Destinations"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-1.5 rounded-xl text-[#65736B] hover:text-[#202A27] transition-all cursor-pointer"
        >
          <div className="p-1 rounded-lg text-[#87968D] hover:bg-[#F0F4F1] transition-colors">
            <Menu size={18} />
          </div>
          <span className="text-[10px] leading-none tracking-tight font-medium">
            More
          </span>
        </button>
      )}
    </nav>
  );
};

export default MobileNav;
