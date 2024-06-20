import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faFile, faFileLines, faHouse, faLayerGroup, faMoneyCheckDollar, faUser } from '@fortawesome/free-solid-svg-icons';

import './CandidateDashboard.css';

function CandidateLeftSide({ user }) {
  const { userName, userId } = user;
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="flex-column align-items-start" style={{ backgroundColor: 'rgb(209, 247, 247)', color: 'black' }}>
      <Container fluid className="flex-column">
        <Nav className="flex-column full-height align-items-start" style={{ color: 'black' }}>
          <Navbar.Brand>
            <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="jobboxlogo" className='auth-logo' />
          </Navbar.Brand>

          <Navbar.Text>
            <h2>Welcome {userName}</h2>
          </Navbar.Text>

          <Link
            to="/candidate-dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faHouse} /> Dashboard
          </Link>

          <Link
            to="/candidate-dashboard/candidate-jobs"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/candidate-jobs', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faLayerGroup} /> Jobs
          </Link>

          <Link
            to="/candidate-dashboard/candidate-companies"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/candidate-companies', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faBuilding} /> Companies
          </Link>

          <Link
            to="/candidate-dashboard/my-application"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/my-application', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faFileLines} /> My Application
          </Link>

          <Link
            to="/candidate-dashboard/resume"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/resume', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faFile} /> My Resume
          </Link>

          <Link
            to="/candidate-dashboard/profile"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/profile', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faUser} /> My Profile
          </Link>

          <Link
            to="/candidate-dashboard/payment"
            onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/payment', { state: { userName, userId } });
            }}
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            <FontAwesomeIcon icon={faMoneyCheckDollar} /> Payments/Credits
          </Link>

          <Link
            to="/contact"
            style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
          >
            Contact us
          </Link>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default CandidateLeftSide;
