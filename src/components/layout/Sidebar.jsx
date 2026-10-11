import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  DoorOpen,
  LifeBuoy,
  ShieldAlert,
  Settings,
  Sliders,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ onClose, isCollapsed = false, onToggleCollapse }) => {
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
    <aside
      className={`bg-white border-r border-[#E4EAE5] flex flex-col h-screen sticky top-0 z-40 select-none shrink-0 shadow-[1px_0_3px_rgba(20,45,40,0.02)] transition-[width] duration-200 ease-in-out ${
        isCollapsed ? 'w-[72px] overflow-visible' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 border-b border-[#E4EAE5] flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {isCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={false}
            aria-label="Expand sidebar"
            title="Expand sidebar (⌘B)"
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F0F4F1] text-[#65736B] hover:text-[#202A27] transition-all relative group cursor-pointer"
          >
            <Logo size="sm" showText={false} />
            <span className="absolute inset-0 bg-[#142D28]/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
              <PanelLeftOpen size={18} />
            </span>
          </button>
        ) : (
          <>
            <NavLink to="/" onClick={handleLinkClick} className="flex items-center gap-2 group text-decoration-none min-w-0">
              <Logo size="sm" showText={true} />
            </NavLink>
            <div className="flex items-center gap-1">
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-expanded={true}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar (⌘B)"
                  className="hidden md:flex w-8 h-8 items-center justify-center text-[#87968D] hover:text-[#202A27] hover:bg-[#F0F4F1] rounded-lg transition-colors cursor-pointer"
                >
                  <PanelLeftClose size={18} />
                </button>
              )}
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
          </>
        )}
      </div>

      {/* Nav Items List */}
      <div className={`flex-1 py-4 space-y-4 ${isCollapsed ? 'overflow-visible px-2' : 'overflow-y-auto px-3.5 space-y-5'}`}>
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className={isCollapsed ? 'space-y-1.5' : 'space-y-1'}>
            {isCollapsed ? (
              gIdx > 0 && <div className="my-2 border-t border-[#E4EAE5]/80 mx-1" />
            ) : (
              <div className="px-3 pb-1.5 text-[10.5px] font-bold text-[#87968D] uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return isCollapsed ? (
                /* Collapsed Icon Rail Item with Non-Clipping Floating Tooltip */
                <div key={idx} className="relative group/tooltip flex justify-center">
                  <NavLink
                    to={item.path}
                    onClick={handleLinkClick}
                    aria-label={item.label}
                    className={({ isActive }) =>
                      `flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 text-decoration-none min-h-[44px] sm:min-h-0 ${
                        isActive
                          ? 'bg-[#EAF5EF] text-[#142D28] font-bold shadow-xs'
                          : 'text-[#65736B] hover:text-[#202A27] hover:bg-[#F0F4F1]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <Icon
                        size={19}
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#168567]'
                            : 'text-[#87968D] group-hover/tooltip:text-[#202A27]'
                        }`}
                      />
                    )}
                  </NavLink>
                  {/* Floating Tooltip visible on hover & keyboard focus */}
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#142D28] text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-opacity duration-150 flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#168567] text-white rounded">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#142D28]" />
                  </div>
                </div>
              ) : (
                /* Expanded Sidebar Nav Item */
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
        isCollapsed ? (
          /* Collapsed User Section */
          <div className="p-2 border-t border-[#E4EAE5] bg-[#F6F8F6]/70 flex flex-col items-center gap-2">
            <div className="relative group/tooltip flex justify-center">
              <NavLink
                to="/profile"
                onClick={handleLinkClick}
                aria-label={`Profile: ${user.name}`}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#168567] to-[#142D28] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs hover:ring-2 hover:ring-[#168567]/30 transition-all text-decoration-none min-h-[44px] sm:min-h-0"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </NavLink>
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#142D28] text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-opacity duration-150 flex flex-col"
              >
                <span>{user.name}</span>
                <span className="text-[10px] text-[#A3B8AC] font-normal capitalize">
                  {user.role === 'care_admin' ? 'Care Officer' : user.role || 'Student'}
                </span>
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#142D28]" />
              </div>
            </div>

            <div className="relative group/tooltip flex justify-center">
              <button
                type="button"
                onClick={logout}
                aria-label="Sign Out"
                className="w-9 h-9 flex items-center justify-center text-[#87968D] hover:text-[#C43D4B] hover:bg-[#FDF2F3] rounded-xl transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
              >
                <LogOut size={16} />
              </button>
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#142D28] text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-opacity duration-150"
              >
                <span>Sign Out</span>
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#142D28]" />
              </div>
            </div>
          </div>
        ) : (
          /* Expanded User Section */
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
                type="button"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-1.5 text-[#87968D] hover:text-[#C43D4B] hover:bg-[#FDF2F3] rounded-lg transition-colors ml-1 shrink-0 cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )
      )}
    </aside>
  );
};

export default Sidebar;
