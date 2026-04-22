import React, { useEffect, useState } from 'react';
import api from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .vms-vis {
    font-family: 'DM Sans', sans-serif;
    color: #1A1917;
  }

  .vms-vis-page-header {
    margin-bottom: 28px;
  }

  .vms-vis-page-title {
    font-size: 22px;
    font-weight: 600;
    color: #1A1917;
    margin-bottom: 4px;
  }

  .vms-vis-page-sub {
    font-size: 13.5px;
    color: #8A8880;
  }

  .vms-vis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
    align-items: start;
  }

  .vms-vis-card {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    overflow: hidden;
  }

  .vms-vis-card-header {
    padding: 18px 22px 16px;
    border-bottom: 1px solid #F0EFE9;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .vms-vis-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #1A1917;
  }

  .vms-vis-card-sub {
    font-size: 12.5px;
    color: #8A8880;
    margin-top: 2px;
  }

  .vms-vis-card-body {
    padding: 20px 22px;
  }

  .vms-form-group {
    margin-bottom: 14px;
  }

  .vms-form-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8A8880;
    margin-bottom: 6px;
  }

  .vms-form-input, .vms-form-select {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 12px;
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #1A1917;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    appearance: none;
  }

  .vms-form-input::placeholder { color: #C0BDB8; }

  .vms-form-input:focus, .vms-form-select:focus {
    border-color: #A8A6A1;
    box-shadow: 0 0 0 3px rgba(26,25,23,0.06);
  }

  .vms-form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8880' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
  }

  .vms-btn-submit {
    width: 100%;
    padding: 11px 18px;
    background: #1A1917;
    color: #C9F74F;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.01em;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .vms-btn-submit:hover { background: #2C2B28; }
  .vms-btn-submit svg { width: 15px; height: 15px; }

  .vms-overview-card {
    background: #1A1917;
    border: none;
    border-radius: 12px;
    padding: 22px;
    color: white;
  }

  .vms-overview-title {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.4);
    margin-bottom: 20px;
  }

  .vms-overview-stat {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 16px 18px;
    margin-bottom: 12px;
  }

  .vms-overview-stat:last-child { margin-bottom: 0; }

  .vms-overview-stat-label {
    font-size: 11.5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: rgba(255,255,255,0.4);
    margin-bottom: 6px;
  }

  .vms-overview-stat-value {
    font-size: 30px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    color: #C9F74F;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .vms-overview-stat-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    margin-top: 4px;
  }

  .vms-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13.5px;
    margin-bottom: 20px;
  }

  .vms-alert.error { background: #FCEBEB; color: #791F1F; border: 1px solid #F09595; }
  .vms-alert.success { background: #EAF3DE; color: #27500A; border: 1px solid #C0DD97; }
  .vms-alert svg { width: 16px; height: 16px; flex-shrink: 0; }

  .vms-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 500;
    font-family: 'DM Mono', monospace;
  }

  .vms-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .vms-badge.pending { background: #FAEEDA; color: #854F0B; }
  .vms-badge.pending::before { background: #EF9F27; }
  .vms-badge.accepted { background: #EAF3DE; color: #3B6D11; }
  .vms-badge.accepted::before { background: #639922; }
  .vms-badge.rejected { background: #FCEBEB; color: #A32D2D; }
  .vms-badge.rejected::before { background: #E24B4A; }

  .vms-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 32px 22px;
    color: #B0ADA8;
    font-size: 13.5px;
  }

  .vms-spinner {
    width: 18px; height: 18px;
    border: 2px solid #E8E6DF;
    border-top-color: #8A8880;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .vms-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 22px;
    text-align: center;
  }

  .vms-empty-icon {
    width: 44px; height: 44px;
    background: #F5F4F0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }

  .vms-empty-icon svg { width: 20px; height: 20px; color: #B0ADA8; }
  .vms-empty-text { font-size: 14px; color: #8A8880; font-weight: 500; margin-bottom: 3px; }
  .vms-empty-sub { font-size: 12.5px; color: #B0ADA8; }

  .vms-req-list-card {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    overflow: hidden;
  }

  .vms-req-list-header {
    padding: 18px 22px 16px;
    border-bottom: 1px solid #F0EFE9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vms-req-list-title {
    font-size: 15px;
    font-weight: 600;
    color: #1A1917;
  }

  .vms-req-list-sub {
    font-size: 12.5px;
    color: #8A8880;
    margin-top: 2px;
  }

  .vms-req-item {
    border-bottom: 1px solid #F5F4F0;
    padding: 18px 22px;
  }

  .vms-req-item:last-child { border-bottom: none; }

  .vms-req-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 16px;
  }

  .vms-req-employee {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .vms-emp-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #E6F1FB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #185FA5;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .vms-emp-name {
    font-size: 14px;
    font-weight: 500;
    color: #1A1917;
  }

  .vms-emp-label {
    font-size: 11.5px;
    color: #8A8880;
    margin-top: 1px;
  }

  .vms-req-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    background: #FAFAF8;
    border: 1px solid #F0EFE9;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 14px;
  }

  .vms-req-field-label {
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #B0ADA8;
    margin-bottom: 3px;
  }

  .vms-req-field-value {
    font-size: 13px;
    color: #2C2B28;
  }

  .vms-req-field.full { grid-column: 1 / -1; }

  .vms-btn-qr {
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

  .vms-btn-qr:hover { background: #F0EFE9; border-color: #D4D2CB; }
  .vms-btn-qr svg { width: 14px; height: 14px; }

  .vms-qr-panel {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 20px;
  }

  .vms-qr-header {
    padding: 16px 22px;
    border-bottom: 1px solid #F0EFE9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vms-qr-title {
    font-size: 14px;
    font-weight: 600;
    color: #1A1917;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vms-qr-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 28px 22px;
  }

  .vms-qr-frame {
    padding: 16px;
    border: 1.5px solid #E8E6DF;
    border-radius: 12px;
    background: white;
  }

  .vms-qr-frame img {
    display: block;
    width: 180px;
    height: 180px;
    border-radius: 4px;
  }

  .vms-qr-note {
    font-size: 12.5px;
    color: #8A8880;
    text-align: center;
    max-width: 260px;
  }

  .vms-btn-hide {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: white;
    color: #6B6966;
    border: 1px solid #E8E6DF;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .vms-btn-hide:hover { background: #F0EFE9; }
  .vms-btn-hide svg { width: 13px; height: 13px; }
`;

const QRIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
    <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="5" y="5" width="4" height="4"/>
    <rect x="15" y="5" width="4" height="4"/><rect x="5" y="15" width="4" height="4"/>
    <path d="M13 13h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3z"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
  </svg>
);

const InboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function VisitorDashboard() {
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qr, setQr] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [empRes, reqRes] = await Promise.all([
        api.get('/api/visitor/employees'),
        api.get('/api/visitor/my-requests'),
      ]);
      setEmployees(empRes.data);
      setRequests(reqRes.data);
    } catch {
      setError('Unable to load visitor dashboard.');
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!selected || !visitorName || !contactNumber || !address || !nidNumber) {
      setError('Please fill in all form fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/api/visitor/request-meeting', { employeeId: selected, visitorName, contactNumber, address, nidNumber });
      setSelected(''); setVisitorName(''); setContactNumber(''); setAddress(''); setNidNumber('');
      setSuccess('Meeting request submitted successfully!');
      await loadData();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to send meeting request.');
    }
    setSubmitting(false);
  };

  const handleShowQR = async (id) => {
    setError('');
    try {
      const res = await api.get(`/api/qr/accepted/${id}`);
      setQr(res.data.qrCode);
    } catch {
      setError('QR code is not available yet.');
    }
  };

  return (
    <div className="vms-vis">
      <style>{styles}</style>

      <div className="vms-vis-page-header">
        <div className="vms-vis-page-title">Book a Meeting</div>
        <div className="vms-vis-page-sub">Request access and track your meeting approvals</div>
      </div>

      {error && (
        <div className="vms-alert error">
          <AlertIcon />{error}
        </div>
      )}
      {success && (
        <div className="vms-alert success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}

      <div className="vms-vis-grid">
        <div className="vms-vis-card">
          <div className="vms-vis-card-header">
            <div>
              <div className="vms-vis-card-title">New Request</div>
              <div className="vms-vis-card-sub">Fill in your details to request a meeting</div>
            </div>
          </div>
          <div className="vms-vis-card-body">
            <form onSubmit={handleRequest}>
              <div className="vms-form-group">
                <label className="vms-form-label">Select Employee</label>
                <select className="vms-form-select" value={selected} onChange={e => setSelected(e.target.value)}>
                  <option value="">Choose an employee…</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.username}</option>
                  ))}
                </select>
              </div>
              <div className="vms-form-group">
                <label className="vms-form-label">Your Full Name</label>
                <input className="vms-form-input" value={visitorName} onChange={e => setVisitorName(e.target.value)} placeholder="e.g. Mahbub Ali" />
              </div>
              <div className="vms-form-group">
                <label className="vms-form-label">Contact Number</label>
                <input className="vms-form-input" value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="+880 1xxx-xxxxxx" />
              </div>
              <div className="vms-form-group">
                <label className="vms-form-label">Address</label>
                <input className="vms-form-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Your current address" />
              </div>
              <div className="vms-form-group">
                <label className="vms-form-label">NID Number</label>
                <input className="vms-form-input" value={nidNumber} onChange={e => setNidNumber(e.target.value)} placeholder="National ID number" />
              </div>
              <button type="submit" className="vms-btn-submit" disabled={submitting}>
                <SendIcon />
                {submitting ? 'Submitting…' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>

        <div className="vms-overview-card">
          <div className="vms-overview-title">Your Overview</div>
          <div className="vms-overview-stat">
            <div className="vms-overview-stat-label">Employees Available</div>
            <div className="vms-overview-stat-value">{employees.length}</div>
            <div className="vms-overview-stat-sub">Ready to receive requests</div>
          </div>
          <div className="vms-overview-stat">
            <div className="vms-overview-stat-label">Total Requests</div>
            <div className="vms-overview-stat-value">{requests.length}</div>
            <div className="vms-overview-stat-sub">Submitted by you</div>
          </div>
          <div className="vms-overview-stat">
            <div className="vms-overview-stat-label">Accepted</div>
            <div className="vms-overview-stat-value">{requests.filter(r => r.status === 'accepted').length}</div>
            <div className="vms-overview-stat-sub">QR codes ready</div>
          </div>
        </div>
      </div>

      <div className="vms-req-list-card">
        <div className="vms-req-list-header">
          <div>
            <div className="vms-req-list-title">My Requests</div>
            <div className="vms-req-list-sub">{requests.length} total · {requests.filter(r => r.status === 'pending').length} pending</div>
          </div>
        </div>

        {loading ? (
          <div className="vms-loading">
            <div className="vms-spinner" />Loading your requests…
          </div>
        ) : requests.length === 0 ? (
          <div className="vms-empty">
            <div className="vms-empty-icon"><InboxIcon /></div>
            <div className="vms-empty-text">No requests yet</div>
            <div className="vms-empty-sub">Use the form above to book your first meeting</div>
          </div>
        ) : (
          requests.map(req => (
            <div key={req._id} className="vms-req-item">
              <div className="vms-req-top">
                <div className="vms-req-employee">
                  <div className="vms-emp-avatar">{getInitials(req.employee?.username)}</div>
                  <div>
                    <div className="vms-emp-name">{req.employee?.username || 'Unknown employee'}</div>
                    <div className="vms-emp-label">Employee</div>
                  </div>
                </div>
                <span className={`vms-badge ${req.status}`}>{req.status}</span>
              </div>

              <div className="vms-req-detail-grid">
                <div className="vms-req-field">
                  <div className="vms-req-field-label">Visitor Name</div>
                  <div className="vms-req-field-value">{req.visitorName || '—'}</div>
                </div>
                <div className="vms-req-field">
                  <div className="vms-req-field-label">Contact</div>
                  <div className="vms-req-field-value">{req.contactNumber || '—'}</div>
                </div>
                <div className="vms-req-field">
                  <div className="vms-req-field-label">NID</div>
                  <div className="vms-req-field-value" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5 }}>{req.nidNumber || '—'}</div>
                </div>
                <div className="vms-req-field">
                  <div className="vms-req-field-label">Address</div>
                  <div className="vms-req-field-value">{req.address || '—'}</div>
                </div>
              </div>

              {req.status === 'accepted' && (
                <button className="vms-btn-qr" onClick={() => handleShowQR(req._id)}>
                  <QRIcon />Show QR Code
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {qr && (
        <div className="vms-qr-panel">
          <div className="vms-qr-header">
            <div className="vms-qr-title">
              <QRIcon />Entry QR Code
            </div>
            <button className="vms-btn-hide" onClick={() => setQr(null)}>
              <EyeOffIcon />Hide
            </button>
          </div>
          <div className="vms-qr-body">
            <div className="vms-qr-frame">
              <img src={qr} alt="Entry QR Code" />
            </div>
            <div className="vms-qr-note">Present this QR code at the reception desk for entry. Valid for your approved meeting only.</div>
          </div>
        </div>
      )}
    </div>
  );
}