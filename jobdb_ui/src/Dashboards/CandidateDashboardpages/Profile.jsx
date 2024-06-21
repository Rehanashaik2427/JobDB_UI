import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // Import Link from react-router-dom
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';


const Profile = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [userData, setUserData] = useState();

  const getUser = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCandidate?userId=${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser(userId);
  }, [userId]);

  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };



  const user = {
    userName: userName,

    userId: userId,
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3} className="leftside">
          <CandidateLeftSide user={{ userName, userId }} />
        </Col>

        <Col md={18} className="rightside">
          <div className="top-right-content">
            <div className="top-right-content">
              <div className="candidate-search">
                <input type='text' placeholder='serach'></input>
                <button>
                  <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                </button>
                <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} /></div>

              </div>


            </div>
            {showSettings && (
              <div id="modal-container">
                <div id="settings-modal">
                  {/* Your settings options here */}
                  <ul>
                    <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/"> Sing out</Link></li>
                    <li>Setting </li>
                    {/* Add more settings as needed */}
                  </ul>
                  <button onClick={toggleSettings}>Close</button>
                </div>
              </div>
            )}

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
                  {/* <button className="profile-button" onClick={handleEdit}>Edit</button> */}
                </>
              )}
            </div>



          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
