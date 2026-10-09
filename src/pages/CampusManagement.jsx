import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const CampusManagement = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>Campus Management</h2>
      <Badge status="pending">Phase 7 Target Page</Badge>
    </div>
    <Card>
      <h3>Building & Master Directory Administration</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/admin/campus-management</code> | Access: Admin Only
      </p>
    </Card>
  </div>
);

export default CampusManagement;
