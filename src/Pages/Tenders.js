import { Fragment, useEffect, useState, useRef } from 'react';
import './Tenders.css';
import { useNavigate } from 'react-router-dom';

const Tenders = () => {
  const [allTenders, setAllTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    status: 'All',
    date: 'All'
  });

  const navigate = useNavigate();
  const rowRefs = useRef([]);

  useEffect(() => {
    const fetchAllTenders = async () => {
      try {
        const res = await fetch('/api/tenderRoutes/allTenders');
        const data = await res.json();

        if (Array.isArray(data)) {
          setAllTenders(data);
          setFilteredTenders(data);
        } else {
          console.error('Invalid response for tenders:', data);
          setAllTenders([]);
          setFilteredTenders([]);
        }
      } catch (err) {
        console.error("Error fetching all tenders:", err);
        setAllTenders([]);
        setFilteredTenders([]);
      }
    };

    fetchAllTenders();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let results = [...allTenders];

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        results = results.filter(t =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.company?.name?.toLowerCase().includes(q)
        );
      }

      if (filters.category !== 'All') {
        results = results.filter(t => t.category === filters.category);
      }

      if (filters.location !== 'All') {
        results = results.filter(t => t.location === filters.location);
      }

      if (filters.status !== 'All') {
        results = results.filter(t => t.status === filters.status);
      }

      if (filters.date === 'Upcoming') {
        results = results.filter(t => new Date(t.deadline) > new Date());
      } else if (filters.date === 'Past') {
        results = results.filter(t => new Date(t.deadline) < new Date());
      }

      setFilteredTenders(results);
    };

    applyFilters();
  }, [searchQuery, filters, allTenders]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRowClick = (index) => {
    setExpandedRow(prev => (prev === index ? null : index));
    setTimeout(() => {
      rowRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const toggleDescription = (index) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleApply = (tenderId) => {
    navigate(`/apply/${tenderId}`);
  };

  const uniqueCategories = ['All', ...new Set(allTenders.map(t => t.category).filter(Boolean))];
  const uniqueLocations = ['All', ...new Set(allTenders.map(t => t.location).filter(Boolean))];
  const uniqueStatuses = ['All', ...new Set(allTenders.map(t => t.status).filter(Boolean))];

  return (
    <div className="tender-page">
      <aside className="filter-panel">
        <input
          type="text"
          className="search-input"
          placeholder="Search tenders"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <h3>Filters</h3>

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
        >
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          {uniqueStatuses.map(stat => (
            <option key={stat} value={stat}>{stat}</option>
          ))}
        </select>

        <select
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
        >
          <option value="All">All</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Past">Past</option>
        </select>
      </aside>

      <main className="tender-table-section">
        <h1>Tenders</h1>
        <div className="table-container">
          {filteredTenders.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center" }}>No tenders found.</p>
          ) : (
            <table className="tender-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenders.map((tender, index) => {
                  const isClosed = new Date(tender.deadline) < new Date();
                  return (
                    <Fragment key={tender.id}>
                      <tr
                        onClick={() => handleRowClick(index)}
                        className="cursor-pointer"
                        ref={el => rowRefs.current[index] = el}
                      >
                        <td>{tender.title}</td>
                        <td className="text-blue">{tender.category}</td>
                        <td className="text-blue">{tender.location}</td>
                        <td><span className="status-badge">{tender.status}</span></td>
                        <td style={{ fontWeight: isClosed ? 'bold' : 'normal', color: isClosed ? 'red' : 'inherit' }}>
                          {isClosed ? "Application Closed" : formatDate(tender.deadline)}
                        </td>
                        <td>
                          <button
                            className="apply-btn"
                            disabled={isClosed}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(tender.id);
                            }}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>

                      {expandedRow === index && (
                        <tr>
                          <td colSpan="6">
                            <div className="dropdown-details">
                              <p>
                                <strong>Description:</strong>{' '}
                                {tender.description.length <= 200
                                  ? tender.description
                                  : (expandedDescriptions[index]
                                    ? tender.description
                                    : `${tender.description.slice(0, 200)}...`)}
                              </p>

                              {tender.company ? (
                                <>
                                  <p><strong>Company:</strong> {tender.company.name}</p>
                                  <p><strong>Phone:</strong> {tender.company.phone}</p>
                                </>
                              ) : (
                                <>
                                  <p><strong>Company:</strong> Not provided</p>
                                  <p><strong>Phone:</strong> Not available</p>
                                </>
                              )}
                              <p><strong>Budget:</strong> ₹{tender.budget}</p>
                            </div>
                            {tender.description.length > 200 && (
                              <div className="view-more-container">
                                <button
                                  className="view-more-btn"
                                  onClick={() => toggleDescription(index)}
                                >
                                  {expandedDescriptions[index] ? 'View Less ↑' : 'View More →'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tenders;