import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const ComplaintAdmin = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>Complaint Administration</h2>
      <Badge status="pending">Phase 7 Target Page</Badge>
    </div>
    <Card>
      <h3>Ticket Assignment & SLA Dispatch</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/admin/complaints</code> | Access: Admin & Care Admin
      </p>
    </Card>
  </div>
);

export default ComplaintAdmin;
