import './Search.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = (props) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/companies?route=allCompanies');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };
  const handleCompanyClick = (company) => {
    navigate(`/company/${company._id || company.id}`, { state: { company } });
  };

  // Filter companies based on query
  const filteredCompanies = companies.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.industry && c.industry.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE));
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="company-page" data-mode={props.mode}>
      <h1>Find Companies</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Search by company name, industry, or products/services"
        value={query}
        onChange={handleInputChange}
      />

      <h3>Browse by Industry</h3>
      <div className="industry-tags">
        {[
          { label: 'Construction', value: 'Construction & Civil Works' },
          { label: 'IT', value: 'Information Technology (IT)' },
          { label: 'Electrical Works', value: 'Electrical Equipment & Works' },
          { label: 'Healthcare', value: 'Healthcare & Medical Equipment' },
          { label: 'Roads', value: 'Roads & Bridges' },
          { label: 'Education', value: 'Education & Training' },
          { label: 'Consultancy', value: 'Consultancy Services' },
          { label: 'Agriculture', value: 'Agriculture & Allied Services' },
          { label: 'Logistics', value: 'Transportation & Logistics' },
          { label: 'Telecom', value: 'Telecommunications' },
          { label: 'Security', value: 'Security Services' },
          { label: 'Water Supply', value: 'Water Supply & Sanitation' },
          { label: 'Office Supplies', value: 'Office Equipment & Stationery' },
          { label: 'Environment', value: 'Environmental Services' },
          { label: 'Machinery', value: 'Machinery & Industrial Supplies' }
        ].map(({ label, value }) => (
          <span
            key={value}
            className={query === value ? 'active' : ''}
            onClick={() => { setQuery(query === value ? '' : value); setPage(1); }}
          >
            {label}
          </span>
        ))}
      </div>

      <h3>{query ? `Results for "${query}"` : 'Featured Companies'}</h3>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : (
      <div className="company-grid">
        {paginatedCompanies.length > 0 ? (
          paginatedCompanies.map((company, index) => (
            <div
              key={company.id || index}
              className="company-card"
              onClick={() => handleCompanyClick(company)}
            >
              <img
                src={
                  company.logo
                    ? company.logo
                    : 'https://dummyimage.com/100x100/cccccc/000000.png&text=Logo'
                }
                alt={company.name}
                style={{
                  borderRadius: '8px',
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <h4>{company.name}</h4>
              <p>{company.industry || company.category}</p>
            </div>
          ))
        ) : (
          <p>No companies found matching "{query}".</p>
        )}
      </div>
      )}

      {!loading && totalPages > 1 && (
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={page === num ? 'active' : ''}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          &gt;
        </button>
      </div>
      )}
    </div>
  );
};

export default Search;