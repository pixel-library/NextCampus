import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined text-[28px] animate-spin text-primary">progress_activity</span>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>Loading NextCampus Session...</span>
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', marginBottom: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
