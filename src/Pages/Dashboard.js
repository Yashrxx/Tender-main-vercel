import './Dashboard.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';

const Dashboard = ({mode}) => {
  const { user } = useContext(UserContext);
  const [tenders, setTenders] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const toggleDescription = (index) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const [loading, setLoading] = useState(true);
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
  };

  useEffect(() => {
    const fetchCompanyTenders = async () => {
      try {
        const res = await fetch(`/api/tenders?route=companyTenders&companyId=${user.companyId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTenders(data);
        } else {
          setTenders([]);
        }
      } catch (err) {
        setTenders([]);
      }
      setLoading(false);
    };
    fetchCompanyTenders();
  }, [user]);

  return (
    <div className={`tenders-container ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>My Tenders</h1>
        <Link className="new-tender" to="/applyTender">New Tender</Link>
      </div>

      <div className="filters-scroll">
        {[
          "All",
          "Construction & Civil Works",
          "Information Technology (IT)",
          "Electrical Equipment & Works",
          "Healthcare & Medical Equipment",
          "Roads & Bridges",
          "Education & Training",
          "Consultancy Services",
          "Agriculture & Allied Services",
          "Transportation & Logistics",
          "Telecommunications",
          "Security Services",
          "Water Supply & Sanitation",
          "Office Equipment & Stationery",
          "Environmental Services",
          "Machinery & Industrial Supplies"
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`category-button ${selectedCategory === cat ? "active-filter" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="tender-cards-container">
          {
            tenders.filter(tender =>
              selectedCategory === "All" ? true : tender.category === selectedCategory
            ).length === 0 ? (
              <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: '#6b7280' }}>
                <p style={{ fontSize: '1.1rem' }}>🚫 No tenders found for <strong>{selectedCategory}</strong>.</p>
              </div>
            ) : (
              tenders
                .filter(tender =>
                  selectedCategory === "All" ? true : tender.category === selectedCategory
                )
                .map((tender, index) => (
                  <div className="tender-card" key={tender._id || index}>
                    <div className="card-header">
                      <h3>{tender.title}</h3>
                      <span className={`status-chip ${tender.status.toLowerCase()}`}>
                        {tender.status}
                      </span>
                    </div>

                    <p className="category-chip">{tender.category}</p>

                    <div className="card-body">
                      <p><strong>Location:</strong> {tender.location}</p>
                      <p><strong>Deadline:</strong> {formatDate(tender.deadline)}</p>
                      <p><strong>Published:</strong> {formatDate(tender.createdAt)}</p>
                      <p><strong>Budget:</strong> ₹{tender.budget}</p>

                      {tender.company && (
                        <>
                          <p><strong>Company:</strong> {tender.company.name}</p>
                          <p><strong>Phone:</strong> {tender.company.phone}</p>
                        </>
                      )}
                    </div>

                    {tender.description.length > 200 ? (
                      <button onClick={() => toggleDescription(index)} className="view-more-btn">
                        {expandedDescriptions[index] ? "View Less ↑" : "View More →"}
                      </button>
                    ) : (
                      <p className="description"><strong>Description:</strong> {tender.description}</p>
                    )}

                    {expandedDescriptions[index] && (
                      <div className="description">
                        <strong>Description:</strong> {tender.description}
                      </div>
                    )}
                  </div>
                ))
            )
          }
        </div>
      )}
    </div>
  );
};

export default Dashboard;