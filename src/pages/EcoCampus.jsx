import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const EcoCampus = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>EcoCampus — Sustainability Metrics</h2>
      <Badge status="pending">Phase 5 Target Page</Badge>
    </div>
    <Card>
      <h3>Solar, Water & Carbon Footprint Telemetry</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/ecocampus</code> | Backend API: <code>/api/v1/sustainability/metrics</code> | Model: <code>Sustainability</code>
      </p>
    </Card>
  </div>
);

export default EcoCampus;
