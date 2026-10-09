import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const StudentDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>Student Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome to NextCampus Operations Hub</p>
        </div>
        <Badge status="pending">Phase 2 Target Page</Badge>
      </div>

      <Card>
        <h3>Dashboard Architecture Ready</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Route: <code>/dashboard</code> | Backend API: <code>/api/v1/auth/me</code>, <code>/api/v1/care/complaints</code>
        </p>
      </Card>
    </div>
  );
};

export default StudentDashboard;
