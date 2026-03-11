import './Search.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = (props) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies?route=allCompanies');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleCompanyClick = (company) => {
    navigate(`/company/${company._id}`, { state: { company } });
  };

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
          <span key={value} onClick={() => { setQuery(value); setPage(1); }}>
            {label}
          </span>
        ))}
      </div>

      <h3>Featured Companies</h3>
      <div className="company-grid">
        {companies.length > 0 ? (
          companies.slice(0, 12).map((company, index) => (
            <div
              key={index}
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
          <p>No companies found.</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          &lt;
        </button>
        <button
          className={page === 1 ? 'active' : ''}
          onClick={() => setPage(1)}
        >
          1
        </button>
        <button onClick={() => setPage((p) => p + 1)}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Search;