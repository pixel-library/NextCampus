import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const LandingPage = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center' }}>
      <Badge status="pending">Phase 2 Target Page</Badge>
      <h1 style={{ marginTop: '16px', fontSize: '2.5rem' }}>NextCampus Platform Landing</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '12px' }}>
        The Next Generation of Smart Campuses — Modern, Intelligent, Trustworthy, Connected.
      </p>
      <Card style={{ marginTop: '32px', textAlign: 'left' }}>
        <h3>Architectural Overview</h3>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
          Route: <code>/</code> | Status: Foundation Prepared
        </p>
      </Card>
    </div>
  );
};

export default LandingPage;
