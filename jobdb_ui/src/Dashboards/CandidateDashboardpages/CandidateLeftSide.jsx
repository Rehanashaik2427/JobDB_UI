import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { faMoneyCheckDollar, faHouse, faUser, faBuilding, faLayerGroup, faFileLines, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CandidateDashboard.css';

function CandidateLeftSide({ user }) {
  const { userName, userId } = user;

  return (
    <Navbar expand="lg" className="flex-column align-items-start" style={{ backgroundColor: 'rgb(209, 247, 247)', color: 'black' }}>
      <Navbar.Brand>
        <img
          src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png"
          alt="jobboxlogo"
          style={{ height: '50px' }} // Adjust height as needed
        />
      </Navbar.Brand>

      <Navbar.Text>
        <h2>Welcome {userName}</h2>
      </Navbar.Text>

      <Nav className="flex-column full-height align-items-start" style={{ color: 'black' }}>
        <Nav.Link as={Link} to={{
          pathname: '/candidate-dashboard',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faHouse} /> Dashboard
        </Nav.Link>

        <Nav.Link as={Link} to={{
          pathname: '/candidate-dashboard/candidate-jobs',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faLayerGroup} /> Jobs
        </Nav.Link>

        <Nav.Link as={Link} to={{
          pathname: '/candidate-dashboard/candidate-companies',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faBuilding} /> Companies
        </Nav.Link>

        <Nav.Link as={Link} to={{
          pathname: '/candidate-dashboard/my-application',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faFileLines} /> My Application
        </Nav.Link>

        <Nav.Link as={Link} to={{
          pathname: '/resume',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faFile} /> My Resume
        </Nav.Link>

        <Nav.Link as={Link} to={{
          pathname: '/profile',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faUser} /> My Profile
        </Nav.Link>

        <Nav.Link as={Link} to={{
          pathname: '/payment',
          state: { userName, userId }
        }} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faMoneyCheckDollar} /> Payments/Credits
        </Nav.Link>

        <Nav.Link as={Link} to="/contact" style={{ color: 'black' }}>
          Contact us
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default CandidateLeftSide;
