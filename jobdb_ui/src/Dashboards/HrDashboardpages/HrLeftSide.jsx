import { faAddressCard, faBriefcase, faHouse, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function HrLeftSide({ user }) {
    const navigate = useNavigate(); // Initialize navigate

    const userName = user.userName;
    const userEmail = user.userEmail;

    return (
        <Navbar expand="lg" className="flex-column align-items-start" style={{ backgroundColor: 'rgb(209, 247, 247)', color: 'black' }}>
            <Container fluid className="flex-column">
                <Nav className="flex-column full-height align-items-start" style={{ color: 'black' }}>
                    <Navbar.Brand>
                        <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="jobboxlogo" className='auth-logo' />
                    </Navbar.Brand>
                    <Navbar.Text>
                        <h2> Welcome {userName}</h2>
                    </Navbar.Text>
                    <Link to="/hr-dashboard" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}>
                        <FontAwesomeIcon icon={faHouse} /> Dashboard
                    </Link>
                    <Link to="/hr-dashboard/my-jobs" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/my-jobs', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}>
                        <FontAwesomeIcon icon={faBriefcase} /> My Jobs
                    </Link>
                    <Link to="/hr-dashboard/hr-applications" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/hr-applications', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}> 
                        <FontAwesomeIcon icon={faAddressCard} /> Applicants
                    </Link>
                    <Link to="/hr-dashboard/posted-jobs" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/posted-jobs', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}>
                        <FontAwesomeIcon icon={faBriefcase} /> All Jobs
                    </Link>
                    <Link to="/hr-dashboard/people" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/people', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}>
                        <FontAwesomeIcon icon={faUsers} /> People
                    </Link>
                    <Link to="/hr-dashboard/profile" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/profile', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}>
                        <FontAwesomeIcon icon={faUser} /> Profile
                    </Link>
                    <Link to="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link" style={{color:'black'}}>
                        Contact us
                    </Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default HrLeftSide;
