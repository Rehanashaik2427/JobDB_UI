import { faAddressCard, faBriefcase, faHouse, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function HrLeftSide({ user }) {

    const { userName, userEmail } = user;
    const navigate = useNavigate();




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



                    <Link
                        to={{ pathname: '/hr-dashboard', state: { userName, userEmail } }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/hr-dashboard', { state: { userName, userEmail } });
                        }}
                        style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
                    >
                        <FontAwesomeIcon icon={faHouse} /> Dashboard
                    </Link>

                    <Link
                        to={{ pathname: '/hr-dashboard/my-jobs', state: { userName, userEmail } }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/hr-dashboard/my-jobs', { state: { userName, userEmail } });
                        }}
                        style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
                    >
                        <FontAwesomeIcon icon={faBriefcase} /> My Jobs
                    </Link>

                    <Link
                        to={{ pathname: '/hr-dashboard/hr-applications', state: { userName, userEmail } }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/hr-dashboard/hr-applications', { state: { userName, userEmail } });
                        }}
                        style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
                    >
                        <FontAwesomeIcon icon={faAddressCard} /> Applicants
                    </Link>

                    <Link
                        to={{ pathname: '/hr-dashboard/posted-jobs', state: { userName, userEmail } }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/hr-dashboard/posted-jobs', { state: { userName, userEmail } });
                        }}
                        style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
                    >
                        <FontAwesomeIcon icon={faBriefcase} /> All Jobs
                    </Link>

                    <Link
                        to={{ pathname: '/hr-dashboard/people', state: { userName, userEmail } }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/hr-dashboard/people', { state: { userName, userEmail } });
                        }}
                        style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
                    >
                        <FontAwesomeIcon icon={faUsers} /> People
                    </Link>

                    <Link
                        to={{ pathname: '/hr-dashboard/profile', state: { userName, userEmail } }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/hr-dashboard/profile', { state: { userName, userEmail } });
                        }}
                        style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
                    >
                        <FontAwesomeIcon icon={faUser} /> Profile
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

export default HrLeftSide;
