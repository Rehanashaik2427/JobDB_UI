import { faMoneyCheckDollar, faHouse, faUser, faBuilding, faLayerGroup, faFileLines, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import './CandidateDashboard.css';
import { Container, Nav, Navbar } from 'react-bootstrap';

function CandidateLeftSide({ user }) {
  const { userName, userId } = user;
  console.log(userId);
  console.log(userName);


  return (
    <Navbar expand="lg" className="flex-column align-items-start" style={{ backgroundColor: 'rgb(209, 247, 247)', color: 'black' }}>
      <Container fluid className="flex-column">
        <Nav className="flex-column full-height align-items-start" style={{ color: 'black' }}>
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

          
            <Nav.Link as={Link} to={{
              pathname: '/candidate-dashboard',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faHouse} /> Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to={{
              pathname: '/candidate-jobs',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faLayerGroup} /> Jobs
            </Nav.Link>

            <Nav.Link as={Link} to={{
              pathname: '/candidate-companies',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faBuilding} /> Companies
            </Nav.Link>

            <Nav.Link as={Link} to={{
              pathname: '/my-application',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faFileLines} /> My Application
            </Nav.Link>

            <Nav.Link as={Link} to={{
              pathname: '/resume',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faFile} /> My Resume
            </Nav.Link>

            <Nav.Link as={Link} to={{
              pathname: '/profile',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faUser} /> My Profile
            </Nav.Link>

            <Nav.Link as={Link} to={{
              pathname: '/payment',
              state: { userName: userName, userId: userId }
            }} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faMoneyCheckDollar} /> Payments/Credits
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" style={{ color: 'black' }}>
              Contact us
            </Nav.Link>
        


        </Nav>
      </Container>
    </Navbar>
  );

}
export default CandidateLeftSide;