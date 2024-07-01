import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { faBuilding, faComment, faHouse, faPlusCircle, faUserAlt, faUserCheck, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
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
    <div className='leftside'>
      <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="jobboxlogo" className='auth-logo' />
      <div className="admin-details">
        <h2>AdminName</h2>
        <div className="nav-box">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.to);
              }}
              className='nav-link'
              style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
            >
              {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminLeftSide;
