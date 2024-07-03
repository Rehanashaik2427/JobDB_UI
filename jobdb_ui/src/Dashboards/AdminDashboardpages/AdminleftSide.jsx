import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { faBuilding, faComment, faHouse, faPlusCircle, faUserAlt, faUserCheck, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { RxDashboard } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';

function AdminLeftSide() {
  const navigate = useNavigate();

  const navLinks = [
    { to: '/admin-dashboard', label: 'Dashboard', icon: <RxDashboard size={'30'} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/user-validation', label: 'User Validation', icon: <FontAwesomeIcon icon={faUserCheck} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/company-validation', label: 'Validation Company', icon: <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/allowing-access', label: 'Access', icon: <FontAwesomeIcon icon={faAccessibleIcon} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/block-account', label: 'Block Account', icon: <FontAwesomeIcon icon={faUserLock} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/add-company-details', label: 'Company Details', icon: <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/my-profile', label: 'My Profile', icon: <FontAwesomeIcon icon={faUserAlt} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/contacts', label: 'Contacts', icon: <FontAwesomeIcon icon={faComment} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/', label: 'Home', icon: <FontAwesomeIcon icon={faHouse} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
  ];

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
          <h2 style={{ color: 'black' }}>AdminName</h2>
        </Navbar.Text>
        <div className='scrollbar-container' style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
          <Nav className="flex-column full-height align-items-start">
            {navLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  to={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.to);
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
}

export default AdminLeftSide;
