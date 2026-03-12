import './Dashboard.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ mode }) => {
  const [activeTab, setActiveTab] = useState('filed');
  const [filedTenders, setFiledTenders] = useState([]);
  const [appliedTenders, setAppliedTenders] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingFiled, setLoadingFiled] = useState(true);
  const [loadingApplied, setLoadingApplied] = useState(true);

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const categories = [
    'All', 'Construction & Civil Works', 'Information Technology (IT)',
    'Electrical Equipment & Works', 'Healthcare & Medical Equipment',
    'Roads & Bridges', 'Education & Training', 'Consultancy Services',
    'Agriculture & Allied Services', 'Transportation & Logistics',
    'Telecommunications', 'Security Services', 'Water Supply & Sanitation',
    'Office Equipment & Stationery', 'Environmental Services',
    'Machinery & Industrial Supplies'
  ];

  // Fetch tenders filed by my company
  useEffect(() => {
    const fetchFiled = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/tenders?route=myTenders', {
          headers: { 'auth-token': token }
        });
        const data = await res.json();
        setFiledTenders(Array.isArray(data) ? data : []);
      } catch {
        setFiledTenders([]);
      } finally {
        setLoadingFiled(false);
      }
    };
    fetchFiled();
  }, []);

  // Fetch tenders I applied to
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/applications?route=myApplications', {
          headers: { 'auth-token': token }
        });
        const data = await res.json();
        setAppliedTenders(Array.isArray(data) ? data : []);
      } catch {
        setAppliedTenders([]);
      } finally {
        setLoadingApplied(false);
      }
    };
    fetchApplied();
  }, []);

  const currentList = activeTab === 'filed' ? filedTenders : appliedTenders;
  const isLoading = activeTab === 'filed' ? loadingFiled : loadingApplied;

  const filteredList = selectedCategory === 'All'
    ? currentList
    : currentList.filter((item) => {
        const cat = activeTab === 'filed' ? item.category : item.tender?.category;
        return cat === selectedCategory;
      });

  return (
    <div className={`tenders-container ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Dashboard</h1>
        <Link className="new-tender" to="/applyTender">New Tender</Link>
      </div>

      {/* Tab Switcher */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'filed' ? 'active' : ''}`}
          onClick={() => { setActiveTab('filed'); setSelectedCategory('All'); }}
        >
          Filed Tenders ({filedTenders.length})
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => { setActiveTab('applied'); setSelectedCategory('All'); }}
        >
          Applied Tenders ({appliedTenders.length})
        </button>
      </div>

      <div className="filters-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-button ${selectedCategory === cat ? 'active-filter' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : filteredList.length === 0 ? (
        <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: '#6b7280' }}>
          {activeTab === 'filed' ? (
            <p style={{ fontSize: '1.1rem' }}>
              📋 You haven't filed any tenders yet.{' '}
              <Link to="/applyTender" style={{ color: '#6366f1' }}>Publish one now</Link>
            </p>
          ) : (
            <p style={{ fontSize: '1.1rem' }}>
              📭 You haven't applied to any tenders yet.{' '}
              <Link to="/tenders" style={{ color: '#6366f1' }}>Browse tenders</Link>
            </p>
          )}
        </div>
      ) : (
        <div className="tender-cards-container">
          {activeTab === 'filed'
            ? filteredList.map((tender, index) => (
                <div className="tender-card" key={tender.id || index}>
                  <div className="card-header">
                    <h3>{tender.title}</h3>
                    <span className={`status-chip ${tender.status?.toLowerCase()}`}>
                      {tender.status}
                    </span>
                  </div>
                  <p className="category-chip">{tender.category}</p>
                  <div className="card-body">
                    <p><strong>Location:</strong> {tender.location}</p>
                    <p><strong>Deadline:</strong> {formatDate(tender.deadline)}</p>
                    <p><strong>Budget:</strong> ₹{tender.budget}</p>
                    {tender.company && (
                      <p><strong>Company:</strong> {tender.company.name}</p>
                    )}
                  </div>
                  {tender.description?.length > 200 ? (
                    <>
                      <button onClick={() => toggleDescription(`f-${index}`)} className="view-more-btn">
                        {expandedDescriptions[`f-${index}`] ? 'View Less ↑' : 'View More →'}
                      </button>
                      {expandedDescriptions[`f-${index}`] && (
                        <div className="description"><strong>Description:</strong> {tender.description}</div>
                      )}
                    </>
                  ) : (
                    <p className="description"><strong>Description:</strong> {tender.description}</p>
                  )}
                </div>
              ))
            : filteredList.map((app, index) => (
                <div className="tender-card applied-card" key={app.id || index}>
                  <div className="card-header">
                    <h3>{app.tender?.title || 'Unknown Tender'}</h3>
                    <span className={`status-chip ${app.tender?.status?.toLowerCase()}`}>
                      {app.tender?.status || 'N/A'}
                    </span>
                  </div>
                  <p className="category-chip">{app.tender?.category}</p>
                  <div className="card-body">
                    <p><strong>Location:</strong> {app.tender?.location || 'N/A'}</p>
                    <p><strong>Deadline:</strong> {formatDate(app.tender?.deadline)}</p>
                    <p><strong>Budget:</strong> ₹{app.tender?.budget || 'N/A'}</p>
                    <p><strong>Posted by:</strong> {app.tender?.company?.name || 'N/A'}</p>
                  </div>
                  <div className="applied-proposal">
                    <p><strong>Your Proposal:</strong></p>
                    <p className="proposal-text">{app.message || 'No message'}</p>
                  </div>
                  <p className="applied-date">Applied: {formatDate(app.created_at)}</p>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;