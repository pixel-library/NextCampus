import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Logo size="sm" showText={true} />
      </div>

      <div style={{ flex: 1, maxWidth: '420px', margin: '0 24px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search rooms, campus map, directory or care tickets..."
            style={{
              width: '100%',
              padding: '8px 14px 8px 38px',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-accent)',
            }}
          />
        </button>

        {user ? (
          <NavLink
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              backgroundColor: 'rgba(255, 217, 218, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              textDecoration: 'none',
              color: '#FFFFFF',
            }}
          >
            <UserIcon size={16} style={{ color: '#EB638B' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</span>
          </NavLink>
        ) : (
          <NavLink
            to="/auth"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--brand-primary)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
