import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export const NotFoundPage = () => (
  <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center' }}>
    <Card>
      <h1 style={{ fontSize: '3rem', color: '#EB638B' }}>404</h1>
      <h2>Waypoint Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '24px' }}>
        The campus route you requested does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Return to Student Dashboard</Button>
      </Link>
    </Card>
  </div>
);

export default NotFoundPage;
