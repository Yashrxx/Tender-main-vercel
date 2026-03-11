import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import Dashboard from "./Pages/Dashboard";
import Tenders from "./Pages/Tenders";
import ApplyTender from "./Pages/ApplyTender";
import Search from "./Pages/Search";
import Navbar from "./headers/Navbar";
import Profile from "./Pages/Profile";
import CompanyDetails from "./Pages/companyDetails";
import Application from "./Pages/Application";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Analytics from './Charts/Analytics';
import About from './Pages/About'

function App() {
  const { setIsAuthenticated, username } = useContext(UserContext);

  const [mode, setmode] = useState('light');
  const [btnText, setbtnTxt] = useState('Enable Dark Mode');

  const removebodycls = () => {
    document.body.classList.remove(
      'bg-light', 'bg-dark', 'bg-success', 'bg-primary', 'bg-danger', 'bg-warning'
    );
  };

  const toggleMode = (cls) => {
    removebodycls();
    document.body.classList.add('bg-' + cls);

    if (mode === 'light') {
      setmode('dark');
      setbtnTxt('Enable Light Mode');
      document.body.style.backgroundColor = '#1f2937';
    } else {
      setmode('light');
      setbtnTxt('Enable Dark Mode');
      document.body.style.backgroundColor = 'white';
    }
  };

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [setIsAuthenticated]);

  return (
    <Router basename='/Tender'>
      <Navbar btnText={btnText} mode={mode} toggleMode={toggleMode} username={username} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login mode={mode} />} />
        <Route path="/signup" element={<Signup mode={mode} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile mode={mode} />} />
          <Route path="/dashboard" element={<Dashboard mode={mode} />} />
          <Route path="/tenders" element={<Tenders mode={mode} />} />
          <Route path="/applyTender" element={<ApplyTender mode={mode} />} />
          <Route path="/search" element={<Search mode={mode} />} />
          <Route path="/apply/:id" element={<Application mode={mode}/>} />
          <Route path="/company/:id" element={<CompanyDetails mode={mode}/>} />
          <Route path="/analytics" element={<Analytics mode={mode}/>} />
          <Route path="/about" element={<About mode={mode}/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;