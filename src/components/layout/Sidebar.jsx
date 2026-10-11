import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  DoorOpen,
  LifeBuoy,
  Bot,
  ShieldAlert,
  Settings,
  Sliders,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'care_admin';

  const navGroups = isAdmin
    ? [
        {
          title: 'Administration',
          items: [
            { label: 'Admin Dashboard', path: '/admin', icon: ShieldAlert },
            { label: 'Campus Management', path: '/admin/campus-management', icon: Sliders },
            { label: 'Helpdesk & Care', path: '/admin/complaints', icon: LifeBuoy, badge: 'Live' },
          ],
        },
        {
          title: 'Campus Operations',
          items: [
            { label: 'Interactive Map', path: '/campus-map', icon: MapPin },
            { label: 'SmartRooms & Space', path: '/smartroom', icon: DoorOpen },
            { label: 'Campus Directory', path: '/directory', icon: Users },
            { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
          ],
        },
        {
          title: 'Settings',
          items: [{ label: 'Profile & Settings', path: '/profile', icon: Settings }],
        },
      ]
    : [
        {
          title: 'Student Workspace',
          items: [
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Interactive Map', path: '/campus-map', icon: MapPin, badge: 'GIS' },
            { label: 'SmartRooms IoT', path: '/smartroom', icon: DoorOpen },
            { label: 'Helpdesk & Care', path: '/complaints', icon: LifeBuoy },
            { label: 'Campus Directory', path: '/directory', icon: Users },
            { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
          ],
        },
        {
          title: 'Settings',
          items: [{ label: 'Profile & Settings', path: '/profile', icon: Settings }],
        },
      ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-[260px] bg-white border-r border-[#E4EAE5] flex flex-col h-screen sticky top-0 z-40 select-none shrink-0 shadow-[1px_0_3px_rgba(20,45,40,0.02)]">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#E4EAE5] flex items-center justify-between">
        <NavLink to="/" onClick={handleLinkClick} className="flex items-center gap-2 group text-decoration-none">
          <Logo size="sm" showText={true} />
        </NavLink>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#87968D] hover:text-[#202A27] hover:bg-[#F0F4F1] rounded-xl transition-colors cursor-pointer"
            title="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10.5px] font-bold text-[#87968D] uppercase tracking-wider">
              {group.title}
            </div>
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs transition-all duration-150 group text-decoration-none ${
                      isActive
                        ? 'bg-[#EAF5EF] text-[#142D28] font-bold shadow-xs'
                        : 'text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1] font-semibold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={17}
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#168567]'
                              : 'text-[#87968D] group-hover:text-[#202A27]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-[#168567] text-white'
                              : 'bg-[#EAF5EF] text-[#168567] group-hover:bg-[#CBE2D4]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Account Strip */}
      {user && (
        <div className="p-3.5 border-t border-[#E4EAE5] bg-[#F6F8F6]/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E4EAE5] shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#168567] to-[#142D28] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#202A27] truncate leading-tight">
                  {user.name}
                </div>
                <div className="text-[10.5px] text-[#65736B] font-medium capitalize truncate mt-0.5">
                  {user.role === 'care_admin' ? 'Care Officer' : user.role || 'Student'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#87968D] hover:text-[#C43D4B] hover:bg-[#FDF2F3] rounded-lg transition-colors ml-1 shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
