import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import LogoutIcon from '@mui/icons-material/Logout';
import TAT from '../assets/img/TAT_Logo.jpeg'
import './Navbar.css'
const Navbar = (props) => {
    const navigate = useNavigate();
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null);
        setIsAuthenticated(false);
        navigate("/")
    }
    let location = useLocation();
    useEffect(() => {
    }, [location])

    return (
        <nav className={`navbar ${props.mode === 'dark' ? 'nav-shadow-dark' : 'nav-shadow-light'} navbar-expand-lg navbar-${props.mode} bg-${props.mode}`} >
            <div className="container-fluid">
                <a className="navbar-brand" href="/TAT" ><img style={{ height: "25px", width: "25px", filter: "invert(1)" }} src={TAT} alt="Error 404"></img></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {!isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/tenders">Tenders</Link>
                            </li>
                        )}

                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/applyTender">FileTender</Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/search">Search</Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/analytics">Analytics</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" aria-disabled="true" to="/about" >AboutUs</Link>
                        </li>
                    </ul>
                    {isAuthenticated ? (
                        <div className="dropdown">
                            <button style={{ backgroundColor: props.mode === 'dark' ? 'silver' : 'white' }} className="btn btn-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                User : {user?.name || 'User'}
                            </button>
                            <ul style={{ backgroundColor: props.mode === 'dark' ? 'silver' : 'white' }} className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                <li className="dropdown-item" onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="themeSwitch" onClick={() => props.toggleMode('null')} />
                                        <label style={{ color: props.mode === 'dark' ? 'black' : 'black' }} className="form-check-label" htmlFor="themeSwitch">{props.btnText}</label>
                                    </div>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} className="dropdown-item text-danger d-flex justify-content-between align-items-center" onClick={handleLogout}>
                                        Logout
                                        <LogoutIcon style={{ width: '15px', height: '15px' }} />
                                    </button >
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <form className="d-flex">
                            <Link className='btn btn-primary mx-3' to='/' role='button'>Login</Link>
                            <Link className='btn btn-primary' to='/signup' role='button'>Sign up</Link>
                        </form>
                    )}

                </div>
            </div>
        </nav>
    )
}
Navbar.propTypes = {
    title: PropTypes.string,
    aboutText: PropTypes.string
}
export default Navbar