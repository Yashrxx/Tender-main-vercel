import './Application.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Application = () => {
  const { id } = useParams(); // get tender ID from route
  const [tender, setTender] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch tender details
  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await fetch(`/api/tenderRoutes?id=${id}`);
        const data = await res.json();
        setTender(data);
      } catch (error) {
        console.error('Error fetching tender:', error);
      }
    };

    fetchTender();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          tenderId: id,
          message
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert('Application submitted successfully!');
        navigate('/tenders');
      } else {
        alert('Failed: ' + result.error);
      }
    } catch (err) {
      console.error('Error applying:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-container">
      {tender ? (
        <>
          <h1>Apply for Tender: {tender.title}</h1>
          <p><strong>Description:</strong> {tender.description}</p>
          <p><strong>Deadline:</strong> {new Date(tender.deadline).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}</p>

          <p><strong>Budget:</strong> ₹{tender.budget}</p>
          <p><strong>Location:</strong> {tender.location}</p>

          <form onSubmit={handleSubmit} className="application-form">
            <label htmlFor="message">Your Proposal Message:</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why your company is the best fit for this tender..."
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </>
      ) : (
        <p>Loading tender details...</p>
      )}
    </div>
  );
};

export default Application;