import { faAccessibleIcon, faVaadin } from '@fortawesome/free-brands-svg-icons';
import { faBuilding, faComment, faHome, faHouse, faPlusCircle, faUserAlt, faUserCheck, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FaBuilding, FaComments, FaHome, FaPlus, FaUniversalAccess, FaUser, FaUserCheck, FaUserLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AdminleftSide = () => {
  const navigate = useNavigate();
  return (
    <div className='leftside'>
      <nav id='logo'>
        <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="jobboxlogo" />
      </nav>
      <div className="admin-details">
        <nav>
          <h2>AdminName</h2>
        </nav>
        <Link
          to='/admin-dashboard'
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin-dashboard');
          }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faHouse} /> Dashboard
        </Link>
        <Link
          to='/admin-dashboard/user-validation'
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin-dashboard/user-validation');
          }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}
        >
          <FontAwesomeIcon icon={faUserCheck} /> User Validation
        </Link>

        <Link to="/admin-dashboard/company-validation" onClick={(e) => {
          e.preventDefault();
          navigate('/admin-dashboard/company-validation');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faBuilding} /> Validation Company</Link>


        <Link to="/allowing-access" onClick={(e) => {
          e.preventDefault();
          navigate('/admin-dashboard/allowing-access');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faAccessibleIcon} /> Acess</Link>

        <Link to="/admin-dashboard/block-account" onClick={(e) => {
          e.preventDefault();
          navigate('/admin-dashboard/block-account');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faUserLock} /> Block Account</Link>


        <Link to="/add-company-details" onClick={(e) => {
          e.preventDefault();
          navigate('/admin-dashboard/add-company-details');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faPlusCircle} /> Company Details</Link>


        <Link to="/my-profile" onClick={(e) => {
          e.preventDefault();
          navigate('/admin-dashboard/my-profile');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faUserAlt} /> My Profile</Link>


        <Link to="/admin-dashboard/contacts" onClick={(e) => {
          e.preventDefault();
          navigate('/admin-dashboard/contacts');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faComment} /> Contacts</Link>


        <Link to='/' onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
          style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faHouse} /> Home</Link>

      </div>
    </div>
  )
}

export default AdminleftSide
