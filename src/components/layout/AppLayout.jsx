import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-[#9E153E] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading NextCampus Session...</span>
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

  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default AppLayout;
