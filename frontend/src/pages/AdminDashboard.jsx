import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import jsQR from 'jsqr';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .vms-root {
    font-family: 'DM Sans', sans-serif;
    background: #F7F6F3;
    min-height: 100vh;
    color: #1A1917;
  }

  .vms-sidebar {
    position: fixed;
    top: 0; left: 0;
    width: 240px;
    height: 100vh;
    background: #1A1917;
    display: flex;
    flex-direction: column;
    padding: 0;
    z-index: 100;
  }

  .vms-logo {
    padding: 28px 24px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .vms-logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .vms-logo-icon {
    width: 32px; height: 32px;
    background: #C9F74F;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .vms-logo-icon svg { width: 18px; height: 18px; }

  .vms-logo-text {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.02em;
  }

  .vms-logo-sub {
    font-size: 10px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 1px;
  }

  .vms-nav {
    padding: 16px 12px;
    flex: 1;
  }

  .vms-nav-section {
    margin-bottom: 24px;
  }

  .vms-nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    padding: 0 12px;
    margin-bottom: 6px;
  }

  .vms-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 400;
    color: rgba(255,255,255,0.55);
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }

  .vms-nav-item:hover {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.85);
  }

  .vms-nav-item.active {
    background: rgba(201,247,79,0.12);
    color: #C9F74F;
    font-weight: 500;
  }

  .vms-nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }

  .vms-nav-badge {
    margin-left: auto;
    background: #C9F74F;
    color: #1A1917;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
  }

  .vms-user-section {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .vms-user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
  }

  .vms-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #C9F74F, #8BC34A);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #1A1917;
    flex-shrink: 0;
  }

  .vms-user-name {
    font-size: 12.5px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
  }

  .vms-user-role {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 1px;
  }

  .vms-main {
    margin-left: 240px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .vms-topbar {
    background: #F7F6F3;
    border-bottom: 1px solid #E8E6DF;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .vms-page-title {
    font-size: 15px;
    font-weight: 600;
    color: #1A1917;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vms-breadcrumb {
    font-size: 13px;
    color: #8A8880;
    font-weight: 400;
  }

  .vms-topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .vms-btn-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    border: 1px solid #E8E6DF;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6B6966;
    transition: all 0.15s;
  }

  .vms-btn-icon:hover { background: #F0EFE9; color: #1A1917; }
  .vms-btn-icon svg { width: 16px; height: 16px; }

  .vms-notif-dot {
    position: relative;
  }

  .vms-notif-dot::after {
    content: '';
    position: absolute;
    top: -2px; right: -2px;
    width: 7px; height: 7px;
    background: #E24B4A;
    border-radius: 50%;
    border: 1.5px solid #F7F6F3;
  }

  .vms-content {
    padding: 32px;
    flex: 1;
  }

  .vms-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .vms-section-title {
    font-size: 18px;
    font-weight: 600;
    color: #1A1917;
  }

  .vms-section-sub {
    font-size: 13px;
    color: #8A8880;
    margin-top: 2px;
  }

  .vms-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px;
    background: #1A1917;
    color: #C9F74F;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.01em;
  }

  .vms-btn-primary:hover { background: #2C2B28; }
  .vms-btn-primary svg { width: 14px; height: 14px; }

  .vms-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    background: white;
    color: #4A4845;
    border: 1px solid #E8E6DF;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.15s;
  }

  .vms-btn-outline:hover { background: #F0EFE9; border-color: #D4D2CB; }
  .vms-btn-outline svg { width: 14px; height: 14px; }

  .vms-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .vms-stat-card {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    padding: 20px 22px;
    position: relative;
    overflow: hidden;
  }

  .vms-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }

  .vms-stat-card.accent-green::before { background: #C9F74F; }
  .vms-stat-card.accent-blue::before { background: #378ADD; }
  .vms-stat-card.accent-amber::before { background: #EF9F27; }
  .vms-stat-card.accent-red::before { background: #E24B4A; }

  .vms-stat-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .vms-stat-icon svg { width: 18px; height: 18px; }
  .vms-stat-icon.green { background: #F0FBDA; color: #3B6D11; }
  .vms-stat-icon.blue { background: #E6F1FB; color: #185FA5; }
  .vms-stat-icon.amber { background: #FFF3D6; color: #854F0B; }
  .vms-stat-icon.red { background: #FCEBEB; color: #A32D2D; }

  .vms-stat-value {
    font-size: 28px;
    font-weight: 600;
    color: #1A1917;
    font-family: 'DM Mono', monospace;
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 6px;
  }

  .vms-stat-label {
    font-size: 12.5px;
    color: #8A8880;
    font-weight: 400;
  }

  .vms-stat-delta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    font-weight: 500;
    margin-top: 8px;
    padding: 3px 8px;
    border-radius: 20px;
  }

  .vms-stat-delta.up { background: #F0FBDA; color: #3B6D11; }
  .vms-stat-delta.down { background: #FCEBEB; color: #A32D2D; }
  .vms-stat-delta svg { width: 12px; height: 12px; }

  .vms-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }

  .vms-card {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    overflow: hidden;
  }

  .vms-card-header {
    padding: 18px 22px 14px;
    border-bottom: 1px solid #F0EFE9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vms-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #1A1917;
  }

  .vms-card-body {
    padding: 16px 22px;
  }

  .vms-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 500;
    font-family: 'DM Mono', monospace;
  }

  .vms-badge.green { background: #EAF3DE; color: #3B6D11; }
  .vms-badge.blue { background: #E6F1FB; color: #185FA5; }
  .vms-badge.amber { background: #FAEEDA; color: #854F0B; }
  .vms-badge.red { background: #FCEBEB; color: #A32D2D; }
  .vms-badge.gray { background: #F1EFE8; color: #5F5E5A; }

  .vms-activity-list {
    display: flex;
    flex-direction: column;
  }

  .vms-activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid #F5F4F0;
  }

  .vms-activity-item:last-child { border-bottom: none; }

  .vms-activity-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
  }

  .vms-activity-dot.green { background: #639922; }
  .vms-activity-dot.blue { background: #378ADD; }
  .vms-activity-dot.amber { background: #EF9F27; }
  .vms-activity-dot.red { background: #E24B4A; }

  .vms-activity-text {
    font-size: 13px;
    color: #3A3836;
    line-height: 1.5;
    flex: 1;
  }

  .vms-activity-text strong { font-weight: 500; color: #1A1917; }

  .vms-activity-time {
    font-size: 11.5px;
    color: #B0ADA8;
    font-family: 'DM Mono', monospace;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .vms-user-table {
    width: 100%;
    border-collapse: collapse;
  }

  .vms-user-table th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #B0ADA8;
    padding: 0 0 10px;
    border-bottom: 1px solid #F0EFE9;
  }

  .vms-user-table td {
    padding: 12px 0;
    border-bottom: 1px solid #F5F4F0;
    font-size: 13px;
    color: #3A3836;
    vertical-align: middle;
  }

  .vms-user-table tr:last-child td { border-bottom: none; }

  .vms-user-mini {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .vms-mini-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .vms-action-btn {
    background: none;
    border: 1px solid #E8E6DF;
    border-radius: 6px;
    padding: 4px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: #6B6966;
    cursor: pointer;
    transition: all 0.15s;
  }

  .vms-action-btn:hover { background: #F0EFE9; color: #1A1917; }

  .vms-quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .vms-quick-action-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 14px 16px;
    background: #F7F6F3;
    border: 1px solid #E8E6DF;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }

  .vms-quick-action-btn:hover { background: #F0EFE9; border-color: #D4D2CB; transform: translateY(-1px); }

  .vms-quick-action-icon {
    width: 30px; height: 30px;
    border-radius: 7px;
    background: white;
    border: 1px solid #E8E6DF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .vms-quick-action-icon svg { width: 15px; height: 15px; color: #4A4845; }

  .vms-quick-action-title {
    font-size: 12.5px;
    font-weight: 500;
    color: #1A1917;
  }

  .vms-quick-action-sub {
    font-size: 11px;
    color: #8A8880;
  }

  .vms-system-status {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .vms-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vms-status-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vms-status-indicator {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .vms-status-indicator.online { background: #639922; box-shadow: 0 0 0 2px rgba(99,153,34,0.2); }
  .vms-status-indicator.warning { background: #EF9F27; }
  .vms-status-indicator.offline { background: #E24B4A; }

  .vms-status-name { font-size: 13px; color: #3A3836; }

  .vms-status-bar-wrap {
    flex: 1;
    max-width: 120px;
    height: 4px;
    background: #F0EFE9;
    border-radius: 2px;
    overflow: hidden;
    margin: 0 12px;
  }

  .vms-status-bar {
    height: 100%;
    border-radius: 2px;
    background: #C9F74F;
  }

  .vms-status-value {
    font-size: 11.5px;
    font-family: 'DM Mono', monospace;
    color: #8A8880;
    min-width: 36px;
    text-align: right;
  }
`;

const NavIcon = ({ name }) => {
  const icons = {
    dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    qr: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="5" y="5" width="4" height="4"/><rect x="15" y="5" width="4" height="4"/><rect x="5" y="15" width="4" height="4"/><path d="M13 13h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3z"/></svg>,
    logs: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trending_up: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow_up: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrow_down: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  };
  return icons[name] || null;
};

const users = [];
const activity = [];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [overview, setOverview] = useState({ employeeCount: 0, visitorCount: 0, totalRequests: 0, pending: 0, accepted: 0, rejected: 0 });
  const [requests, setRequests] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanLoopRef = useRef(null);

  const fetchOverview = async () => {
    setLoadingOverview(true);
    setError('');
    try {
      const res = await api.get('/api/admin/overview');
      setOverview(res.data);
    } catch (err) {
      setError('Unable to load overview data.');
    }
    setLoadingOverview(false);
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    setError('');
    try {
      const res = await api.get('/api/admin/requests');
      setRequests(res.data);
    } catch (err) {
      setError('Unable to load requests.');
    }
    setLoadingRequests(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError('');
    try {
      const res = await api.get('/api/admin/users');
      setUserList(res.data.map(user => ({
        ...user,
        initials: user.username.slice(0, 2).toUpperCase(),
        name: user.username,
        color: user.role === 'visitor' ? '#FBEAF0' : '#E6F1FB',
        textColor: user.role === 'visitor' ? '#993556' : '#185FA5',
      })));
    } catch (err) {
      setError('Unable to load users.');
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchOverview();
    fetchRequests();
    fetchUsers();
  }, []);

  const stopScan = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScannerOpen(false);
  };

  const validateQrData = async (qrData) => {
    try {
      const res = await api.post('/api/admin/validate-qr', { qrData });
      setScanResult(res.data);
      setScanError('');
    } catch (err) {
      setScanResult(null);
      setScanError(err.response?.data?.message || 'Invalid QR code.');
    }
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      scanLoopRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const code = jsQR(imageData.data, width, height);
    if (code?.data) {
      validateQrData(code.data);
      stopScan();
    } else {
      scanLoopRef.current = requestAnimationFrame(scanFrame);
    }
  };

  const openScanner = async () => {
    setScanError('');
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScannerOpen(true);
      scanLoopRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      setScanError('Camera access denied or not available.');
      setScannerOpen(false);
    }
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id === 'qr') {
      openScanner();
    } else {
      stopScan();
    }
  };

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'users', icon: 'users', label: 'Users' },
    { id: 'qr', icon: 'qr', label: 'Scan QR' },
    { id: 'logs', icon: 'logs', label: 'Audit Logs' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const renderContent = () => {
    if (activeNav === 'users') {
      return (
        <div className="vms-card">
          <div className="vms-card-header">
            <div>
              <div className="vms-card-title">User Directory</div>
              <div className="vms-card-sub">Users, roles, and request volume.</div>
            </div>
            <button className="vms-btn-outline" onClick={fetchUsers}><NavIcon name="users" /> Refresh</button>
          </div>
          <div className="vms-card-body">
            {loadingUsers ? (
              <div className="vms-loading"><div className="vms-spinner" /> Loading users…</div>
            ) : (
              <table className="vms-user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Requests</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u, i) => (
                    <tr key={i}>
                      <td>
                        <div className="vms-user-mini">
                          <div className="vms-mini-avatar" style={{ background: u.color, color: u.textColor }}>{u.initials}</div>
                          <span style={{ fontWeight: 500, color: '#1A1917' }}>{u.username}</span>
                        </div>
                      </td>
                      <td><span className={`vms-badge ${u.role === 'visitor' ? 'amber' : 'green'}`}>{u.role}</span></td>
                      <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{u.requests}</td>
                      <td><span className="vms-badge green">active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      );
    }

    if (activeNav === 'qr') {
      return (
        <div className="vms-card">
          <div className="vms-card-header">
            <div>
              <div className="vms-card-title">QR Scanner</div>
              <div className="vms-card-sub">Scan visitor approval QR codes and validate them immediately.</div>
            </div>
            <button className="vms-btn-outline" onClick={scannerOpen ? stopScan : openScanner}>
              <NavIcon name="qr" /> {scannerOpen ? 'Stop camera' : 'Open camera'}
            </button>
          </div>
          <div className="vms-card-body">
            <div className="vms-qr-panel">
              <video ref={videoRef} className="vms-qr-video" playsInline muted />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="vms-qr-hint">Point your camera at a QR code to verify it.</div>
              {scanError && <div className="vms-alert error"><AlertIcon /> {scanError}</div>}
              {scanResult && (
                <div className={`vms-qr-result ${scanResult.valid ? 'valid' : 'invalid'}`}>
                  <div className="vms-qr-result-title">{scanResult.valid ? 'QR Verified' : 'Invalid QR'}</div>
                  <div className="vms-qr-result-sub">Status: {scanResult.status}</div>
                  {scanResult.request && (
                    <div className="vms-detail-grid" style={{ marginTop: 16 }}>
                      <div className="vms-detail-field">
                        <div className="vms-detail-field-label">Visitor</div>
                        <div className="vms-detail-field-value">{scanResult.request.visitor}</div>
                      </div>
                      <div className="vms-detail-field">
                        <div className="vms-detail-field-label">Employee</div>
                        <div className="vms-detail-field-value">{scanResult.request.employee}</div>
                      </div>
                      <div className="vms-detail-field full">
                        <div className="vms-detail-field-label">Name</div>
                        <div className="vms-detail-field-value">{scanResult.request.visitorName}</div>
                      </div>
                      <div className="vms-detail-field">
                        <div className="vms-detail-field-label">Contact</div>
                        <div className="vms-detail-field-value">{scanResult.request.contactNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeNav === 'logs') {
      return (
        <div className="vms-card">
          <div className="vms-card-header">
            <div className="vms-card-title">Audit Logs</div>
          </div>
          <div className="vms-card-body">Audit logs are being tracked in the backend and will appear here soon.</div>
        </div>
      );
    }

    if (activeNav === 'settings') {
      return (
        <div className="vms-card">
          <div className="vms-card-header">
            <div className="vms-card-title">Settings</div>
          </div>
          <div className="vms-card-body">Settings are not yet configured for this demo, but they will be available soon.</div>
        </div>
      );
    }

    return (
      <>
        <div className="vms-stat-grid">
          {[
            { label: 'Employees', value: overview.employeeCount, accent: 'green', icon: 'users' },
            { label: 'Visitors', value: overview.visitorCount, accent: 'blue', icon: 'users' },
            { label: 'Total Requests', value: overview.totalRequests, accent: 'amber', icon: 'check' },
            { label: 'Pending', value: overview.pending, accent: 'red', icon: 'shield' },
          ].map((s, i) => (
            <div key={i} className={`vms-stat-card accent-${s.accent}`}>
              <div className={`vms-stat-icon ${s.accent}`}><NavIcon name={s.icon} /></div>
              <div className="vms-stat-value">{loadingOverview ? '—' : s.value}</div>
              <div className="vms-stat-label">{s.label}</div>
              <div className="vms-stat-delta up"><NavIcon name="arrow_up" /> Live</div>
            </div>
          ))}
        </div>

        <div className="vms-grid-2">
          <div className="vms-card">
            <div className="vms-card-header">
              <div>
                <div className="vms-card-title">Recent Requests</div>
                <div className="vms-card-sub">Latest meeting requests across the system.</div>
              </div>
              <button className="vms-btn-outline" onClick={fetchRequests}><NavIcon name="logs" /> Refresh</button>
            </div>
            <div className="vms-card-body">
              {loadingRequests ? (
                <div className="vms-loading"><div className="vms-spinner" /> Loading requests…</div>
              ) : requests.length === 0 ? (
                <div className="vms-empty">
                  <div className="vms-empty-icon"><ClipboardIcon /></div>
                  <div className="vms-empty-text">No requests yet</div>
                  <div className="vms-empty-sub">Meeting requests will appear here once visitors submit them.</div>
                </div>
              ) : (
                <div className="vms-activity-list">
                  {requests.slice(0, 6).map((req) => (
                    <div key={req._id} className="vms-activity-item">
                      <div className={`vms-activity-dot ${req.status === 'accepted' ? 'green' : req.status === 'rejected' ? 'red' : 'blue'}`} />
                      <div className="vms-activity-text"><strong>{req.visitorName}</strong> requested <strong>{req.employee?.username}</strong></div>
                      <div className="vms-activity-time">{new Date(req.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="vms-card">
            <div className="vms-card-header">
              <div className="vms-card-title">Quick Actions</div>
            </div>
            <div className="vms-card-body">
              <div className="vms-quick-actions">
                {[
                  { icon: 'users', title: 'Refresh users', action: fetchUsers },
                  { icon: 'qr', title: 'Open scanner', action: () => handleNavClick('qr') },
                  { icon: 'logs', title: 'Refresh requests', action: fetchRequests },
                  { icon: 'shield', title: 'View settings', action: () => handleNavClick('settings') },
                ].map((a, i) => (
                  <button key={i} className="vms-quick-action-btn" onClick={a.action}>
                    <div className="vms-quick-action-icon"><NavIcon name={a.icon} /></div>
                    <div>
                      <div className="vms-quick-action-title">{a.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="vms-root">
      <style>{styles}</style>
      <div className="vms-sidebar">
        <div className="vms-logo">
          <div className="vms-logo-mark">
            <div className="vms-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1A1917" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <div className="vms-logo-text">VMS Portal</div>
              <div className="vms-logo-sub">Admin Console</div>
            </div>
          </div>
        </div>

        <nav className="vms-nav">
          <div className="vms-nav-section">
            <div className="vms-nav-label">Main</div>
            {navItems.map(item => (
              <button key={item.id} className={`vms-nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => handleNavClick(item.id)}>
                <NavIcon name={item.icon} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="vms-user-section">
          <div className="vms-user-card">
            <div className="vms-avatar">SA</div>
            <div>
              <div className="vms-user-name">Super Admin</div>
              <div className="vms-user-role">system@vms.local</div>
            </div>
          </div>
        </div>
      </div>

      <div className="vms-main">
        <div className="vms-topbar">
          <div className="vms-page-title">Admin Dashboard <span className="vms-breadcrumb">/ {activeNav}</span></div>
          <div className="vms-topbar-actions">
            <div className="vms-btn-icon"><NavIcon name="search" /></div>
            <div className="vms-btn-icon vms-notif-dot"><NavIcon name="bell" /></div>
            <button className="vms-btn-primary" onClick={() => handleNavClick('users')}><NavIcon name="plus" /> Add User</button>
          </div>
        </div>

        <div className="vms-content">
          {error && <div className="vms-alert error"><AlertIcon /> {error}</div>}
          {renderContent()}
          {activeNav === 'qr' && (
            <div>
              <video ref={videoRef} className="vms-qr-video" playsInline muted style={{ width: '100%', borderRadius: 16, marginTop: 16 }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
