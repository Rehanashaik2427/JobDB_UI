import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa'; // Make sure to install react-icons
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const HrProfile = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [userData, setUserData] = useState({});
  const [showLeftSide, setShowLeftSide] = useState(false);
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail);
    }
  }, [userEmail]);

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const toggleSettings = () => {
    navigate('/');
  };

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);

  return (
    <div fluid className="dashboard-container">

    
      <div  className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <HrLeftSide user={{ userName, userEmail }} />
      </div>
      <div className="hamburger-icon" onClick={toggleLeftSide}>
        <FaBars />
      </div>
      <div md={10} className="rightside" style={{
        overflowY: 'scroll'
      }}>       
          <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
            <Dropdown className="ml-2">
              <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                <div
                  className="initials-placeholder"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'grey',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {initials}
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="mt-3">
                <Dropdown.Item as={Link} to="/">
                  <i className="i-Data-Settings me-1" /> Account settings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                  <i className="i-Lock-2 me-1" /> Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <div className="profile-container">
              {userData && (
                <>
                  <div className="profile-item">
                    <span className="profile-label">Name:</span>
                    <span className="profile-value">{userData.userName}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{userData.userEmail}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">PhoneNumber:</span>
                    <span className="profile-value">{userData.phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>

      </div>
      </div>
  );
};

export default HrProfile;
