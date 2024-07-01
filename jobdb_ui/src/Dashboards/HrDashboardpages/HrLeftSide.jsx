import { faAddressCard, faBriefcase, faEnvelope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HrLeftSide = ({ user }) => {
    const { userName, userEmail } = user;
    const navigate = useNavigate();
    const location = useLocation();
    const scrollRef = useRef(null);
    const savedScrollPosition = useRef(0);

    const [activeLink, setActiveLink] = useState(location.pathname);

    const navLinks = [
        { to: '/hr-dashboard', label: 'Dashboard', icon: <RxDashboard size={30} /> },
        { to: '/hr-dashboard/my-jobs', label: 'My Jobs', icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/hr-applications', label: 'Applicants', icon: <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/posted-jobs', label: 'All Jobs', icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/people', label: 'People', icon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/profile', label: 'Profile', icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.7rem' }} /> },
        { to: '/contact', label: 'Contact', icon: <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.7rem' }} /> }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = savedScrollPosition.current;
        }
    }, [location]);

    const handleLinkClick = (to) => {
        if (scrollRef.current) {
            savedScrollPosition.current = scrollRef.current.scrollTop;
        }
        setActiveLink(to);
        navigate(to, { state: { userName, userEmail } });
    };

    return (
        <Navbar expand="lg" className="flex-column align-items-start" style={{ height: '100vh', backgroundColor: 'white' }}>
            <Container fluid className="flex-column">
                <Navbar.Brand>
                    <img
                        style={{ backgroundColor: 'white' }}
                        src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png"
                        alt="jobboxlogo"
                        className='auth-logo'
                    />
                </Navbar.Brand>
                <Navbar.Text>
                    <h2 style={{ color: 'black' }}>{userName}</h2>
                </Navbar.Text>
                <div ref={scrollRef} className='scrollbar-container' style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
                    <Nav className="flex-column full-height align-items-start">
                        {navLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                <Link
                                    to={link.to}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLinkClick(link.to);
                                    }}
                                    className={`nav-link d-flex align-items-center ${activeLink === link.to ? 'active' : ''}`}
                                    style={{
                                        fontSize: '1.1rem',
                                        transition: 'color 0.3s',
                                        color: activeLink === link.to ? 'purple' : 'black',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeLink !== link.to) {
                                            e.currentTarget.style.color = 'purple';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeLink !== link.to) {
                                            e.currentTarget.style.color = 'black';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                        {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                                        {link.label}
                                    </div>
                                </Link>
                                <hr style={{ width: '100%', borderColor: 'black' }} />
                            </React.Fragment>
                        ))}
                    </Nav>
                </div>
            </Container>
        </Navbar>
    );
};

export default HrLeftSide;
