import React, { useEffect, useState } from 'react';
import api from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .vms-emp {
    font-family: 'DM Sans', sans-serif;
    color: #1A1917;
  }

  .vms-emp-page-header {
    margin-bottom: 28px;
  }

  .vms-emp-page-title {
    font-size: 22px;
    font-weight: 600;
    color: #1A1917;
    margin-bottom: 4px;
  }

  .vms-emp-page-sub {
    font-size: 13.5px;
    color: #8A8880;
  }

  .vms-emp-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }

  .vms-emp-stat {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    padding: 20px 22px;
    position: relative;
    overflow: hidden;
  }

  .vms-emp-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }

  .vms-emp-stat.c-amber::before { background: #EF9F27; }
  .vms-emp-stat.c-green::before { background: #639922; }
  .vms-emp-stat.c-red::before { background: #E24B4A; }

  .vms-emp-stat-label {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #B0ADA8;
    margin-bottom: 10px;
  }

  .vms-emp-stat-value {
    font-size: 32px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    letter-spacing: -0.02em;
    line-height: 1;
    color: #1A1917;
    margin-bottom: 6px;
  }

  .vms-emp-stat-sub {
    font-size: 12.5px;
    color: #8A8880;
  }

  .vms-emp-card {
    background: white;
    border: 1px solid #E8E6DF;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .vms-emp-card-header {
    padding: 18px 24px 16px;
    border-bottom: 1px solid #F0EFE9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vms-emp-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #1A1917;
  }

  .vms-emp-card-sub {
    font-size: 12.5px;
    color: #8A8880;
    margin-top: 2px;
  }

  .vms-emp-card-body {
    padding: 0;
  }

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

  .vms-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13.5px;
    margin-bottom: 20px;
  }

  .vms-alert.error {
    background: #FCEBEB;
    color: #791F1F;
    border: 1px solid #F09595;
  }

  .vms-alert svg { width: 16px; height: 16px; flex-shrink: 0; }

  .vms-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    color: #B0ADA8;
  }

  .vms-empty-icon {
    width: 48px; height: 48px;
    background: #F5F4F0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .vms-empty-icon svg { width: 22px; height: 22px; color: #B0ADA8; }
  .vms-empty-text { font-size: 14px; color: #8A8880; font-weight: 500; margin-bottom: 4px; }
  .vms-empty-sub { font-size: 13px; color: #B0ADA8; }

  .vms-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 32px 24px;
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

  .vms-request-item {
    border-bottom: 1px solid #F5F4F0;
    transition: background 0.15s;
  }

  .vms-request-item:last-child { border-bottom: none; }

  .vms-request-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
    gap: 16px;
  }

  .vms-request-summary:hover { background: #FAFAF8; }

  .vms-request-visitor {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .vms-visitor-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: #F0EFE9;
    border: 1.5px solid #E8E6DF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #5F5E5A;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .vms-visitor-name {
    font-size: 14px;
    font-weight: 500;
    color: #1A1917;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vms-visitor-hint {
    font-size: 12px;
    color: #8A8880;
    margin-top: 1px;
  }

  .vms-request-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .vms-toggle-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    color: #8A8880;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
  }

  .vms-toggle-btn:hover { color: #4A4845; }
  .vms-toggle-btn svg { width: 14px; height: 14px; }

  .vms-request-details {
    background: #FAFAF8;
    border-top: 1px solid #F0EFE9;
    padding: 20px 24px;
    animation: slideDown 0.15s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .vms-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  .vms-detail-field-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #B0ADA8;
    margin-bottom: 4px;
  }

  .vms-detail-field-value {
    font-size: 13.5px;
    color: #2C2B28;
    font-weight: 400;
  }

  .vms-detail-field.full { grid-column: 1 / -1; }

  .vms-action-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid #EDECE8;
  }

  .vms-btn-accept {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
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

  .vms-btn-accept:hover:not(:disabled) { background: #2C2B28; }
  .vms-btn-accept:disabled { opacity: 0.5; cursor: not-allowed; }
  .vms-btn-accept svg { width: 14px; height: 14px; }

  .vms-btn-reject {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    background: white;
    color: #A32D2D;
    border: 1px solid #F09595;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.15s;
  }

  .vms-btn-reject:hover:not(:disabled) { background: #FCEBEB; }
  .vms-btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
  .vms-btn-reject svg { width: 14px; height: 14px; }
`;

const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState('');
  const [openIds, setOpenIds] = useState([]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/employee/requests');
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load requests.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const toggleDetails = (id) => {
    setOpenIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  };

  const handleAccept = async (id) => {
    setAccepting(id); setError('');
    try {
      await api.post('/api/employee/accept-request', { requestId: id });
      await fetchRequests();
    } catch { setError('Failed to accept request.'); }
    setAccepting('');
  };

  const handleReject = async (id) => {
    setAccepting(id); setError('');
    try {
      await api.post('/api/employee/reject-request', { requestId: id });
      await fetchRequests();
    } catch { setError('Failed to reject request.'); }
    setAccepting('');
  };

  const pending = requests.filter(r => r.status === 'pending').length;
  const accepted = requests.filter(r => r.status === 'accepted').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="vms-emp">
      <style>{styles}</style>

      <div className="vms-emp-page-header">
        <div className="vms-emp-page-title">Meeting Requests</div>
        <div className="vms-emp-page-sub">Review and manage incoming visitor requests</div>
      </div>

      <div className="vms-emp-stat-grid">
        <div className="vms-emp-stat c-amber">
          <div className="vms-emp-stat-label">Pending</div>
          <div className="vms-emp-stat-value">{pending}</div>
          <div className="vms-emp-stat-sub">Awaiting your decision</div>
        </div>
        <div className="vms-emp-stat c-green">
          <div className="vms-emp-stat-label">Accepted</div>
          <div className="vms-emp-stat-value">{accepted}</div>
          <div className="vms-emp-stat-sub">QR codes issued</div>
        </div>
        <div className="vms-emp-stat c-red">
          <div className="vms-emp-stat-label">Rejected</div>
          <div className="vms-emp-stat-value">{rejected}</div>
          <div className="vms-emp-stat-sub">Not approved</div>
        </div>
      </div>

      {error && (
        <div className="vms-alert error">
          <AlertIcon />
          {error}
        </div>
      )}

      <div className="vms-emp-card">
        <div className="vms-emp-card-header">
          <div>
            <div className="vms-emp-card-title">All Requests</div>
            <div className="vms-emp-card-sub">{requests.length} total · {pending} need attention</div>
          </div>
        </div>
        <div className="vms-emp-card-body">
          {loading ? (
            <div className="vms-loading">
              <div className="vms-spinner" />
              Loading requests…
            </div>
          ) : requests.length === 0 ? (
            <div className="vms-empty">
              <div className="vms-empty-icon"><ClipboardIcon /></div>
              <div className="vms-empty-text">No requests yet</div>
              <div className="vms-empty-sub">Incoming meeting requests will appear here</div>
            </div>
          ) : (
            requests.map(req => {
              const isOpen = openIds.includes(req._id);
              return (
                <div key={req._id} className="vms-request-item">
                  <div className="vms-request-summary" onClick={() => toggleDetails(req._id)}>
                    <div className="vms-request-visitor">
                      <div className="vms-visitor-avatar">{getInitials(req.visitor?.username)}</div>
                      <div>
                        <div className="vms-visitor-name">{req.visitor?.username || 'Unknown visitor'}</div>
                        <div className="vms-visitor-hint">{req.visitorName || 'No name provided'}</div>
                      </div>
                    </div>
                    <div className="vms-request-meta">
                      <span className={`vms-badge ${req.status}`}>{req.status}</span>
                      <button className="vms-toggle-btn" onClick={e => { e.stopPropagation(); toggleDetails(req._id); }}>
                        {isOpen ? 'Collapse' : 'Details'} <ChevronIcon open={isOpen} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="vms-request-details">
                      <div className="vms-detail-grid">
                        <div className="vms-detail-field">
                          <div className="vms-detail-field-label">Full Name</div>
                          <div className="vms-detail-field-value">{req.visitorName || '—'}</div>
                        </div>
                        <div className="vms-detail-field">
                          <div className="vms-detail-field-label">Contact</div>
                          <div className="vms-detail-field-value">{req.contactNumber || '—'}</div>
                        </div>
                        <div className="vms-detail-field full">
                          <div className="vms-detail-field-label">Address</div>
                          <div className="vms-detail-field-value">{req.address || '—'}</div>
                        </div>
                        <div className="vms-detail-field">
                          <div className="vms-detail-field-label">NID Number</div>
                          <div className="vms-detail-field-value" style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{req.nidNumber || '—'}</div>
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <div className="vms-action-row">
                          <button className="vms-btn-accept" onClick={() => handleAccept(req._id)} disabled={accepting === req._id}>
                            <CheckIcon />
                            {accepting === req._id ? 'Accepting…' : 'Accept'}
                          </button>
                          <button className="vms-btn-reject" onClick={() => handleReject(req._id)} disabled={accepting === req._id}>
                            <XIcon />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}