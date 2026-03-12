import './ReceivedApplications.css';
import { useState, useEffect } from 'react';

const ReceivedApplications = ({ mode }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('/api/applications?route=received', {
          headers: { 'auth-token': token }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Error fetching received applications:', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApps = filter === 'All'
    ? applications
    : applications.filter(app => app.tender?.category === filter);

  const uniqueCategories = ['All', ...new Set(applications.map(app => app.tender?.category).filter(Boolean))];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`received-apps-container ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <div className="received-apps-header">
        <h1>Applications Received</h1>
        <p className="subtitle">View all applications submitted for your published tenders</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No applications received yet</h3>
          <p>When companies apply for your tenders, their applications will appear here.</p>
        </div>
      ) : (
        <>
          <div className="filter-tabs">
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'All' ? `All (${applications.length})` : cat}
              </button>
            ))}
          </div>

          <div className="apps-summary">
            <div className="summary-card">
              <strong>{applications.length}</strong>
              <span>Total Applications</span>
            </div>
            <div className="summary-card">
              <strong>{new Set(applications.map(a => a.tender_id)).size}</strong>
              <span>Tenders with Applications</span>
            </div>
            <div className="summary-card">
              <strong>{new Set(applications.map(a => a.company_id)).size}</strong>
              <span>Unique Applicants</span>
            </div>
          </div>

          <div className="apps-list">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className={`app-card ${expandedApp === app.id ? 'expanded' : ''}`}
                onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
              >
                <div className="app-card-header">
                  <div className="app-card-left">
                    <h3 className="applicant-name">{app.company?.name || 'Unknown Company'}</h3>
                    <p className="applicant-industry">{app.company?.industry || 'N/A'}</p>
                  </div>
                  <div className="app-card-right">
                    <span className={`tender-status ${app.tender?.status?.toLowerCase()}`}>
                      {app.tender?.status || 'N/A'}
                    </span>
                    <span className="app-date">{formatDate(app.createdAt)}</span>
                  </div>
                </div>

                <div className="app-card-tender">
                  <span className="tender-label">Applied for:</span>
                  <span className="tender-title">{app.tender?.title || 'Unknown Tender'}</span>
                  <span className="tender-category">{app.tender?.category}</span>
                </div>

                {expandedApp === app.id && (
                  <div className="app-card-details">
                    <div className="detail-section">
                      <h4>Proposal Message</h4>
                      <p className="proposal-message">{app.message || 'No message provided'}</p>
                    </div>
                    <div className="detail-section">
                      <h4>Applicant Details</h4>
                      <div className="detail-grid">
                        <div><strong>Email:</strong> {app.company?.email || 'N/A'}</div>
                        <div><strong>Phone:</strong> {app.company?.phone || 'N/A'}</div>
                        <div><strong>Industry:</strong> {app.company?.industry || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="detail-section">
                      <h4>Tender Details</h4>
                      <div className="detail-grid">
                        <div><strong>Deadline:</strong> {formatDate(app.tender?.deadline)}</div>
                        <div><strong>Status:</strong> {app.tender?.status}</div>
                        <div><strong>Category:</strong> {app.tender?.category}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="expand-hint">
                  {expandedApp === app.id ? '▲ Click to collapse' : '▼ Click to view details'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReceivedApplications;
