import { faAddressCard, faBriefcase, faBuilding, faEnvelope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HrLeftSide = ({ user }) => {
    const { userName, userEmail } = user;
    const navigate = useNavigate();
    const location = useLocation();


    const navLinks = [
        { to: '/hr-dashboard', label: 'Dashboard', icon: <RxDashboard size={30} /> },
        { to: '/hr-dashboard/my-jobs', label: 'My Jobs', icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/hr-applications', label: 'Applicants', icon: <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/posted-jobs', label: 'All Jobs', icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/people', label: 'HR Team', icon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/profile', label: 'Profile', icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/company-showcase', label: 'Company', icon: <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.7rem' }} /> },
        { to: '/contact', label: 'Contact', icon: <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.7rem' }} /> }
    ];

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        // Restore scroll position when component mounts or location changes
        if (scrollContainerRef.current) {
            const savedScrollPosition = sessionStorage.getItem('leftSideScrollPosition');
            if (savedScrollPosition) {
                scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
            }
        }

        // Save scroll position when component unmounts or location changes
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollPosition = scrollContainerRef.current.scrollTop;
                sessionStorage.setItem('leftSideScrollPosition', scrollPosition.toString());
            }
        };

        const currentRef = scrollContainerRef.current;

        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [location]);

    return (
        <Navbar expand="lg" className="flex-column align-items-start" style={{ height: '100vh', backgroundColor: 'white' }}>
            <Container fluid className="flex-column">
                <Navbar.Brand>
                    <img
                        style={{ backgroundColor: 'white' }}
                        src="/jb_logo.png"
                        alt="jobboxlogo"
                        className='auth-logo'
                    />
                </Navbar.Brand>
                <Navbar.Text>
                    <h2 style={{ color: 'black' }}>{userName}</h2>
                </Navbar.Text>
                <div ref={scrollContainerRef} className='scrollbar-container' style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
                    <Nav className="flex-column full-height align-items-center">
                        {navLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                <Link
                                    to={{ pathname: link.to, state: { userName, userEmail } }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(link.to, { state: { userName, userEmail } });
                                    }}
                                    className="nav-link d-flex align-items-center"
                                    style={{
                                        fontSize: '1.1rem',
                                        transition: 'color 0.3s',
                                        color: 'black',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'purple';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'black';
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


