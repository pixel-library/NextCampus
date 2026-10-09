import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const ProfileSettings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>Student Profile & Settings</h2>
      <Badge status="pending">Phase 8 Target Page</Badge>
    </div>
    <Card>
      <h3>Account Preferences & Notification Center</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/profile</code> | Backend API: <code>/api/v1/auth/me</code>
      </p>
    </Card>
  </div>
);

export default ProfileSettings;
