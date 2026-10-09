import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const AuthPage = () => (
  <div style={{ maxWidth: '440px', margin: '60px auto' }}>
    <Card>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Badge status="pending">Phase 8 Target Page</Badge>
        <h2 style={{ marginTop: '12px' }}>Authentication Portal</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Sign in to your NextCampus Account</p>
      </div>
    </Card>
  </div>
);

export default AuthPage;
