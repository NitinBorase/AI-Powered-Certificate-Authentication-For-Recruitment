import './output.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import SignupApplicant from './pages/SignupApplicant';
import SignupEmployer from './pages/SignupEmployer';
import SignupInstitute from './pages/SignupInstitute';
import ApplicantPage from './pages/ApplicantPage';
import EmployerPage from './pages/EmployerPage';
import InstitutePage from './pages/InstitutePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signupApplicant" element={<SignupApplicant />} />
        <Route path="/signupEmployer" element={<SignupEmployer />} />
        <Route path="/signupInstitute" element={<SignupInstitute />} />
        <Route path="/applicantPage" element={<ApplicantPage />} />
        <Route path="/employerPage" element={<EmployerPage />} />
        <Route path="/institutePage" element={<InstitutePage />} />
      </Routes>
    </Router>
  );
}

export default App;