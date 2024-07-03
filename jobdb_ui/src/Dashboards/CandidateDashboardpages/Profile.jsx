import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import './CandidateDashboard.css';

import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import CandidateLeftSide from './CandidateLeftSide';


const Profile = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [userData, setUserData] = useState();


  const navigate = useNavigate();

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


  const toggleSettings = () => {
    navigate('/');
  };


  const user = {
    userName: userName,

    userId: userId,
  };
  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);
  return (
    <Container fluid className='dashboard-container'>
    <Row>
      <Col md={2} className="left-side">
        <CandidateLeftSide user={user} />
      </Col>

      <Col md={18} className="rightside" style={{
        overflow: 'hidden'
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



        </Col>
      </Row>
    </Container>

  )
}

export default Profile;
