import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const AiAssistant = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2>NextCampus AI Assistant</h2>
      <Badge status="pending">Phase 5 Target Page</Badge>
    </div>
    <Card>
      <h3>Intelligent Campus Query Interface</h3>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Route: <code>/ai-assistant</code> | Backend API: <code>/api/v1/ai/query</code>
      </p>
    </Card>
  </div>
);

export default AiAssistant;
