import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Page Imports
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import CampusMap from './pages/CampusMap';
import CampusDirectory from './pages/CampusDirectory';
import SmartRooms from './pages/SmartRooms';
import CareComplaints from './pages/CareComplaints';
import AiAssistant from './pages/AiAssistant';
import EcoCampus from './pages/EcoCampus';
import SkillCampus from './pages/SkillCampus';
import AdminDashboard from './pages/AdminDashboard';
import CampusManagement from './pages/CampusManagement';
import ComplaintAdmin from './pages/ComplaintAdmin';
import AuthPage from './pages/AuthPage';
import ProfileSettings from './pages/ProfileSettings';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout Shell Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="campus-map" element={<CampusMap />} />
            <Route path="directory" element={<CampusDirectory />} />
            <Route path="smartroom" element={<SmartRooms />} />
            <Route path="complaints" element={<CareComplaints />} />
            <Route path="ai-assistant" element={<AiAssistant />} />
            <Route path="ecocampus" element={<EcoCampus />} />
            <Route path="skillcampus" element={<SkillCampus />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/campus-management" element={<CampusManagement />} />
            <Route path="admin/complaints" element={<ComplaintAdmin />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
