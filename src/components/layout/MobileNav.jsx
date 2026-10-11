import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  DoorOpen,
  LifeBuoy,
  Bot,
  ShieldAlert,
  Sliders,
  Menu,
  Users
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const MobileNav = ({ onOpenMore }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'care_admin';

    const items = isAdmin
    ? [
        { label: 'Admin', path: '/admin', icon: ShieldAlert },
        { label: 'Campus', path: '/admin/campus-management', icon: Sliders },
        { label: 'Map', path: '/campus-map', icon: MapPin },
        { label: 'Care', path: '/admin/complaints', icon: LifeBuoy },
        { label: 'Directory', path: '/directory', icon: Users },
      ]
    : [
        { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Map', path: '/campus-map', icon: MapPin },
        { label: 'Rooms', path: '/smartroom', icon: DoorOpen },
        { label: 'Care', path: '/complaints', icon: LifeBuoy },
        { label: 'Directory', path: '/directory', icon: Users },
      ];

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E4EAE5] flex items-center justify-around z-40 px-1 shadow-[0_-2px_8px_rgba(20,45,40,0.03)]"
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.path}
            aria-label={item.label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all duration-150 text-decoration-none ${
                isActive
                  ? 'text-[#168567] font-bold'
                  : 'text-[#65736B] hover:text-[#202A27] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-[#EAF5EF] text-[#168567]' : 'text-[#87968D]'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[10px] leading-none tracking-tight">
                  {item.label}
                </span>
              </>
            )}
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
