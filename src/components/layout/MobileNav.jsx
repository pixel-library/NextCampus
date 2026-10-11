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
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Map', path: '/campus-map', icon: MapPin },
        { label: 'Rooms', path: '/smartroom', icon: DoorOpen },
        { label: 'Care', path: '/complaints', icon: LifeBuoy },
        { label: 'AI', path: '/ai-assistant', icon: Bot },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E4EAE5] flex items-center justify-around z-40 px-2 shadow-[0_-2px_8px_rgba(20,45,40,0.03)]">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 text-decoration-none ${
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
    </nav>
  );
};

export default MobileNav;
