import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const AdminDashboard = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>Admin Control Center</h2>
      <Badge status="pending">Phase 6 Target Page</Badge>
    </div>
    <Card>
      <h3>Executive Overview & Facility Analytics</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/admin</code> | Access: Admin Only
      </p>
    </Card>
  </div>
);

export default AdminDashboard;
