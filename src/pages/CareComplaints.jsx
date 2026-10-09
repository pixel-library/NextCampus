import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const CareComplaints = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>NextCampus Care — Complaint Management</h2>
      <Badge status="pending">Phase 4 Target Page</Badge>
    </div>
    <Card>
      <h3>Ticket Submission & Issue Tracking</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/complaints</code> | Backend API: <code>/api/v1/care/complaints</code> | Model: <code>Complaint</code>
      </p>
    </Card>
  </div>
);

export default CareComplaints;
