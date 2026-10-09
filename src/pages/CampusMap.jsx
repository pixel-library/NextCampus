import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const CampusMap = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>Interactive Campus Map</h2>
      <Badge status="pending">Phase 3 Target Page</Badge>
    </div>
    <Card>
      <h3>Wayfinding & Coordinates Module</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/campus-map</code> | Backend API: <code>/api/v1/campus/locations</code> | Model: <code>Location</code>
      </p>
    </Card>
  </div>
);

export default CampusMap;
