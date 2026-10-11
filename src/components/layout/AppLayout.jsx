import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F8F6] text-[#202A27]">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-[#168567] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#65736B]">Loading NextCampus Session...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated guests cannot access internal app features
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Administrative route guard: students cannot access admin consoles
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAdminUser = user.role === 'admin' || user.role === 'care_admin';
  if (isAdminPath && !isAdminUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Determine if active route requires edge-to-edge full-bleed viewport
  const isMapRoute = location.pathname.startsWith('/campus-map');

  return (
    <div className="flex min-h-screen bg-[#F6F8F6] font-sans text-[#202A27] antialiased selection:bg-[#EAF5EF] selection:text-[#142D28]">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile / Tablet Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          <div
            className="fixed inset-0 bg-[#142D28]/40 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="relative z-10 w-[260px] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main
          className={
            isMapRoute
              ? 'flex-1 p-0 w-full overflow-hidden h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)]'
              : 'flex-1 p-4 sm:p-6 lg:p-8 w-full'
          }
        >
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation with all destinations accessible */}
        <MobileNav onOpenMore={() => setMobileSidebarOpen(true)} />
      </div>
    </div>
  );
};

export default AppLayout;
