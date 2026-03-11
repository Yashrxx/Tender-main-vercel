import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/userContext';

const Signup = (props) => {
  const { setUser, setIsAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    cpassword: ''
  });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, cpassword } = credentials;

    if (password !== cpassword) {
      toast.error("Passwords do not match!", { theme: 'colored' });
      return;
    }

    const trimmedData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password
    };

    try {
      setLoading(true);
      const res = await fetch('/api/auth?route=createuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedData)
      });

      const text = await res.text(); // raw text to handle non-JSON errors
      let json;
      try {
        json = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON response");
        throw new Error("Signup failed: Server did not return valid JSON");
      }

      if (json.success) {
        localStorage.setItem('token', json.authtoken);
        localStorage.setItem('user', JSON.stringify(json.user));
        setIsAuthenticated(true);
        setUser(json.user.name);
        toast.success("Signup successful!", {
          position: "top-center",
          theme: "colored"
        });
        navigate('/tenders');
      } else {
        toast.error(json.error || "Signup failed! User may already exist.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
      <Col className="container" xs={12} md={6}>
        <h1 className='text-center'>Sign-up</h1>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input required type="text" className="form-control" name="name" onChange={onChange} minLength={3} />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input required type="email" className="form-control" name="email" onChange={onChange} />
          <div className="form-text" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
            We'll never share your email.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone No</label>
          <input required type="text" className="form-control" name="phone" onChange={onChange} minLength={10} maxLength={10} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input required type="password" className="form-control" name="password" onChange={onChange} minLength={5} />
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input required type="password" className="form-control" name="cpassword" onChange={onChange} minLength={5} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: '10px' }}>
            <h6 style={{ textAlign: 'center' }}>
              This may take a few seconds due to free hosting
            </h6>
          </div>
        )}
      </Col>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </form>
  );
};

export default Signup;