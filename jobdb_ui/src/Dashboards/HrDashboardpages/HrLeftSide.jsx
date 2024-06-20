import { faAddressCard, faBriefcase, faHouse, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HrLeftSide({ user }) {
    const { userName, userEmail } = user;

    return (
        <Navbar expand="lg" className="flex-column align-items-start" style={{ backgroundColor: 'rgb(209, 247, 247)', color: 'black' }}>
            <Container fluid className="flex-column">
                <Nav className="flex-column full-height align-items-start" style={{ color: 'black' }}>
                    <Navbar.Brand>
                        <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="jobboxlogo" className='auth-logo' />
                    </Navbar.Brand>
                    <Navbar.Text>
                        <h2> Welcome {user.userName}</h2>
                    </Navbar.Text>
                    <Nav.Link as={Link} to={{ pathname: '/hr-dashboard', state: { userName, userEmail } }} style={{ color: 'black' }}>
                        <FontAwesomeIcon icon={faHouse} /> Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to={{ pathname: '/hr-dashboard/my-jobs', state: { userName, userEmail } }} style={{ color: 'black' }}>
                        <FontAwesomeIcon icon={faBriefcase} /> My Jobs
                    </Nav.Link>
                    <Nav.Link as={Link} to={{ pathname: '/hr-dashboard/hr-applications', state: { userName, userEmail } }} style={{ color: 'black' }}>
                        <FontAwesomeIcon icon={faAddressCard} /> Applicants
                    </Nav.Link>
                    <Nav.Link as={Link} to={{ pathname: '/hr-dashboard/posted-jobs', state: { userName, userEmail } }} style={{ color: 'black' }}>
                        <FontAwesomeIcon icon={faBriefcase} /> All Jobs
                    </Nav.Link>
                    <Nav.Link as={Link} to={{ pathname: '/hr-dashboard/people', state: { userName, userEmail } }} style={{ color: 'black' }}>
                        <FontAwesomeIcon icon={faUsers} /> People
                    </Nav.Link>
                    <Nav.Link as={Link} to={{ pathname: '/hr-dashboard/profile', state: { userName, userEmail } }} style={{ color: 'black' }}>
                        <FontAwesomeIcon icon={faUser} /> Profile
                    </Nav.Link>
                    <Nav.Link as={Link} to="/contact" style={{ color: 'black' }}>
                        Contact us
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default HrLeftSide;
