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
  Sparkles,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
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

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-screen sticky top-0 z-40 select-none shrink-0 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group text-decoration-none">
          <Logo size="sm" showText={true} />
        </NavLink>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {group.title}
            </div>
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group text-decoration-none ${
                      isActive
                        ? 'bg-rose-50/80 text-[#9E153E] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                              ? 'text-[#9E153E]'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-rose-200/60 text-[#9E153E]'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
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
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9E153E] to-[#E11D48] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user.name}
                </div>
                <div className="text-[10.5px] text-slate-500 font-medium capitalize truncate mt-0.5">
                  {user.role === 'care_admin' ? 'Care Officer' : user.role || 'Student'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1 shrink-0"
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
