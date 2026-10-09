import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const SkillCampus = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>SkillCampus — Student Collaboration</h2>
      <Badge status="pending">Phase 6 Target Page</Badge>
    </div>
    <Card>
      <h3>Peer Project Matching & Hackathons</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/skillcampus</code> | Backend API: <code>/api/v1/skillcampus/projects</code> | Model: <code>Project</code>
      </p>
    </Card>
  </div>
);

export default SkillCampus;
