import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const HrProfile = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';
  const [showSettings, setShowSettings] = useState(false);

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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
<Container fluid className="dashboard-container">
      <Row>
        <Col md={3} className="leftside">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>

        <Col md={18} className="rightside">
        <div className="top-right-content">
          <div className="candidate-search">
            <div>
              <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} />
            </div>
          </div>
        </div>
        {showSettings && (
          <div id="modal-container">
            <div id="settings-modal">
              <ul>
                <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/">Sign out</Link></li>
                <li>Setting</li>
              </ul>
              <button onClick={toggleSettings}>Close</button>
            </div>
          </div>
        )}
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
        </Col>
      </Row>
    </Container>
  );
};

export default HrProfile;
