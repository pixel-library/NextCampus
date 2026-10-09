import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const SmartRooms = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>SmartRooms IoT & Capacity</h2>
      <Badge status="pending">Phase 4 Target Page</Badge>
    </div>
    <Card>
      <h3>Automated Facility Control</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/smartroom</code> | Backend API: <code>/api/v1/smartrooms/rooms</code> | Model: <code>Room</code>
      </p>
    </Card>
  </div>
);

export default SmartRooms;
