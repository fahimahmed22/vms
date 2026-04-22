import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import api from './api';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import VisitorDashboard from './pages/VisitorDashboard';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #1A1917;
    background: #F7F6F3;
    -webkit-font-smoothing: antialiased;
  }

  /* ── LOGIN PAGE ─────────────────────────────────── */

  .vms-login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #1A1917;
  }

  @media (max-width: 860px) {
    .vms-login-page { grid-template-columns: 1fr; }
    .vms-login-hero { display: none; }
  }

  .vms-login-hero {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    background: #1A1917;
    position: relative;
    overflow: hidden;
  }

  .vms-login-hero::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(201,247,79,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .vms-login-hero::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(201,247,79,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .vms-hero-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .vms-hero-logo-icon {
    width: 36px; height: 36px;
    background: #C9F74F;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vms-hero-logo-icon svg { width: 20px; height: 20px; }

  .vms-hero-logo-text {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.02em;
  }

  .vms-hero-body {
    position: relative;
    z-index: 1;
  }

  .vms-hero-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C9F74F;
    margin-bottom: 16px;
  }

  .vms-hero-headline {
    font-size: 38px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }

  .vms-hero-desc {
    font-size: 14.5px;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    max-width: 380px;
    margin-bottom: 40px;
  }

  .vms-demo-creds {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .vms-demo-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 4px;
  }

  .vms-cred-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
  }

  .vms-cred-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .vms-cred-dot.admin { background: #C9F74F; }
  .vms-cred-dot.employee { background: #378ADD; }
  .vms-cred-dot.visitor { background: #EF9F27; }

  .vms-cred-role {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    width: 70px;
    flex-shrink: 0;
    text-transform: capitalize;
  }

  .vms-cred-user {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    font-family: 'DM Mono', monospace;
    flex: 1;
  }

  .vms-cred-pass {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    font-family: 'DM Mono', monospace;
  }

  .vms-hero-footer {
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: rgba(255,255,255,0.2);
  }

  /* ── LOGIN FORM PANEL ───────────────────────────── */

  .vms-login-panel {
    background: #F7F6F3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
  }

  .vms-login-form-wrap {
    width: 100%;
    max-width: 380px;
  }

  .vms-login-form-title {
    font-size: 24px;
    font-weight: 600;
    color: #1A1917;
    margin-bottom: 6px;
  }

  .vms-login-form-sub {
    font-size: 13.5px;
    color: #8A8880;
    margin-bottom: 32px;
  }

  .vms-field {
    margin-bottom: 16px;
  }

  .vms-field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8A8880;
    margin-bottom: 7px;
  }

  .vms-field-input {
    width: 100%;
    padding: 10px 13px;
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1A1917;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .vms-field-input::placeholder { color: #C0BDB8; }

  .vms-field-input:focus {
    border-color: #A8A6A1;
    box-shadow: 0 0 0 3px rgba(26,25,23,0.06);
  }

  .vms-login-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    background: #FCEBEB;
    border: 1px solid #F09595;
    border-radius: 8px;
    font-size: 13.5px;
    color: #791F1F;
    margin-bottom: 16px;
  }

  .vms-login-error svg { width: 15px; height: 15px; flex-shrink: 0; }

  .vms-btn-login {
    width: 100%;
    padding: 12px 18px;
    background: #1A1917;
    color: #C9F74F;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
    margin-top: 8px;
  }

  .vms-btn-login:hover { background: #2C2B28; }
  .vms-btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── DASHBOARD SHELL ────────────────────────────── */

  .vms-shell {
    min-height: 100vh;
    background: #F7F6F3;
    font-family: 'DM Sans', sans-serif;
    color: #1A1917;
  }

  .vms-shell-topbar {
    background: #1A1917;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: sticky;
    top: 0;
    z-index: 200;
  }

  .vms-shell-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .vms-shell-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
  }

  .vms-shell-logo-icon {
    width: 28px; height: 28px;
    background: #C9F74F;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vms-shell-logo-icon svg { width: 16px; height: 16px; }

  .vms-shell-logo-text {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }

  .vms-shell-divider {
    width: 1px;
    height: 18px;
    background: rgba(255,255,255,0.12);
  }

  .vms-shell-context {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vms-shell-greeting {
    font-size: 13.5px;
    color: rgba(255,255,255,0.5);
  }

  .vms-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 500;
    font-family: 'DM Mono', monospace;
  }

  .vms-role-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .vms-role-badge.admin { background: rgba(201,247,79,0.15); color: #C9F74F; }
  .vms-role-badge.admin::before { background: #C9F74F; }
  .vms-role-badge.employee { background: rgba(55,138,221,0.15); color: #85B7EB; }
  .vms-role-badge.employee::before { background: #378ADD; }
  .vms-role-badge.visitor { background: rgba(239,159,39,0.15); color: #FAC775; }
  .vms-role-badge.visitor::before { background: #EF9F27; }

  .vms-shell-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .vms-btn-logout {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.15s;
  }

  .vms-btn-logout:hover {
    background: rgba(255,255,255,0.11);
    color: rgba(255,255,255,0.9);
  }

  .vms-btn-logout svg { width: 13px; height: 13px; }

  /* Admin has its own full-page layout with sidebar */
  .vms-shell-body-admin {
    /* AdminDashboard manages its own layout */
  }

  /* Employee & Visitor use a centered content layout */
  .vms-shell-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 36px 28px 60px;
  }
`;

/* ── ICONS ────────────────────────────────────────── */

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#1A1917" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

/* ── LOGIN ────────────────────────────────────────── */

const Login = ({ setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setRole(res.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="vms-login-page">
      <style>{globalStyles}</style>

      {/* Hero / left panel */}
      <div className="vms-login-hero">
        <div className="vms-hero-logo">
          <div className="vms-hero-logo-icon"><LockIcon /></div>
          <span className="vms-hero-logo-text">VMS Portal</span>
        </div>

        <div className="vms-hero-body">
          <div className="vms-hero-eyebrow">Visitor Management System</div>
          <div className="vms-hero-headline">Fast meetings,<br />clear approvals.</div>
          <div className="vms-hero-desc">
            Sign in to track meeting requests, approve visitor access, and generate entry QR codes instantly.
          </div>

          <div>
            <div className="vms-demo-label">Demo credentials</div>
            <div className="vms-demo-creds">
              {[
                { dot: 'admin', role: 'Admin', user: 'admin', pass: 'admin123' },
                { dot: 'employee', role: 'Employee', user: 'employee1', pass: 'employee123' },
                { dot: 'visitor', role: 'Visitor', user: 'visitor1', pass: 'visitor123' },
              ].map(c => (
                <div key={c.role} className="vms-cred-row">
                  <div className={`vms-cred-dot ${c.dot}`} />
                  <div className="vms-cred-role">{c.role}</div>
                  <div className="vms-cred-user">{c.user}</div>
                  <div className="vms-cred-pass">{c.pass}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="vms-hero-footer">© 2025 VMS Portal · All rights reserved</div>
      </div>

      {/* Form / right panel */}
      <div className="vms-login-panel">
        <div className="vms-login-form-wrap">
          <div className="vms-login-form-title">Welcome back</div>
          <div className="vms-login-form-sub">Sign in to your account to continue</div>

          {error && (
            <div className="vms-login-error">
              <AlertIcon />{error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="vms-field">
              <label className="vms-field-label">Username</label>
              <input
                className="vms-field-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            <div className="vms-field">
              <label className="vms-field-label">Password</label>
              <input
                className="vms-field-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="vms-btn-login" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ── DASHBOARD SHELL ──────────────────────────────── */

const Dashboard = ({ role, setRole }) => {
  if (!role) return <Navigate to="/login" />;

  const handleLogout = () => {
    localStorage.clear();
    setRole('');
    window.location.href = '/login';
  };

  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="vms-shell">
      <style>{globalStyles}</style>

      <header className="vms-shell-topbar">
        <div className="vms-shell-left">
          <div className="vms-shell-logo">
            <div className="vms-shell-logo-icon"><LockIcon /></div>
            <span className="vms-shell-logo-text">VMS Portal</span>
          </div>
          <div className="vms-shell-divider" />
          <div className="vms-shell-context">
            <span className="vms-shell-greeting">Signed in as</span>
            <span className={`vms-role-badge ${role}`}>{displayRole}</span>
          </div>
        </div>

        <div className="vms-shell-right">
          <button className="vms-btn-logout" onClick={handleLogout}>
            <LogoutIcon />Sign out
          </button>
        </div>
      </header>

      {role === 'admin' ? (
        // AdminDashboard manages its own full-page layout (sidebar + content)
        <div className="vms-shell-body-admin">
          <AdminDashboard />
        </div>
      ) : (
        <main className="vms-shell-body">
          {role === 'employee' ? <EmployeeDashboard /> : <VisitorDashboard />}
        </main>
      )}
    </div>
  );
};

/* ── APP ROOT ─────────────────────────────────────── */

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  return (
    <Routes>
      <Route path="/login" element={<Login setRole={setRole} />} />
      <Route path="/dashboard" element={<Dashboard role={role} setRole={setRole} />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}