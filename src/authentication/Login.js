import { Form, Container, Row, Col } from 'react-bootstrap';
import { Fragment } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/userContext';

const Login = (props) => {
    const { setUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect to tenders
    if (isAuthenticated) {
        return <Navigate to="/tenders" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth?route=login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();
            console.log("Login response:", json); // Debugging

            if (response.ok && json.authtoken && json.user) {
                // Save data to localStorage
                localStorage.setItem('token', json.authtoken);
                localStorage.setItem('username', json.user.name);
                localStorage.setItem('email', json.user.email);
                localStorage.setItem('user', JSON.stringify(json.user));

                // Set context
                setIsAuthenticated(true);
                setUser(json.user);

                toast.success("Login successful!", {
                    position: "top-center",
                    hideProgressBar: true,
                    pauseOnHover: false,
                    theme: "colored"
                });

                navigate('/tenders');
            } else {
                toast.error("Invalid Credentials or Missing Token/User.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed. Try again later.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Fragment>
            <div id="login" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <div className="container-x">
                    <section>
                        <Container>
                            <Row style={{ justifyContent: "space-evenly", alignItems: "center", alignContent: "center" }}>
                                <Col xs={12} md={6}>
                                    <h1 className="text-center mb-4">Login to Tender-client</h1>
                                    <Form onSubmit={handleSubmit}>  {/* 🔹 Ensure form handles submit */}
                                        <Form.Group className="justify-content-md-center  mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className=" mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>

                                        {loading ? <div style={{ marginTop: '10px' }}><h6 style={{ display: 'flex', justifyContent: "center" }}>This may take a few seconds...</h6></div> : ""}
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
            />
        </Fragment>
    )
}

export default Login;