import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";

import { Col, Container, Row } from 'react-bootstrap';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';
const HrDashboard = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [countOfJobs, setCountOfJobs] = useState(Number(localStorage.getItem('countOfJobs')) || 0);
  const [countOfApplications, setCountOfApplications] = useState(Number(localStorage.getItem('countOfApplications')) || 0);
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(Number(localStorage.getItem('countOfShortlistedCandiCompany')) || 0);

  useEffect(() => {
    if (userEmail) {
      fetchUserData(userEmail);
      fetchCounts(userEmail);
    }
  }, [userEmail]);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName`, {
        params: { userEmail: userEmail }
      });
      setUserData(response.data);
      const name = response.data.userName;
      setUserName(name);
      localStorage.setItem('userName', name);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  const fetchCounts = async (userEmail) => {
    try {
      const jobsResponse = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany?userEmail=${userEmail}`);
      const applicationsResponse = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany?userEmail=${userEmail}`);
      const shortlistedResponse = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany?userEmail=${userEmail}`);

      setCountOfJobs(jobsResponse.data);
      setCountOfApplications(applicationsResponse.data);
      setCountOfShortlistedCandiCompany(shortlistedResponse.data);

      localStorage.setItem('countOfJobs', jobsResponse.data);
      localStorage.setItem('countOfApplications', applicationsResponse.data);
      localStorage.setItem('countOfShortlistedCandiCompany', shortlistedResponse.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const user = {
    userName: userName,
    userEmail: userEmail,
  };


  return (
    <Container fluid className="hr-dashboard-container">
      <Row>
        <Col md={3} className="hr-leftside">
          <HrLeftSide user={user} />
        </Col>

        <Col md={9} className="hr-rightside">
          <Row>
            <Col md={4} className="candidate-search">
              <FontAwesomeIcon
                icon={faUser}
                id="user"
                className="icon"
                style={{ color: 'black' }}
                onClick={toggleSettings}
              />
            </Col>
   

            {showSettings && (
              <div className="modal-container">
                <div className="settings-modal">
                  <ul>
                    <li>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <Link to="/">Sign out</Link>
                    </li>
                    <li>Setting</li>
                  </ul>
                  <button onClick={toggleSettings}>Close</button>
                </div>
              </div>
            )}

            <Row style={{ marginBottom: '5rem' }}>
              <Col md={6} className="box">
                <h2>Jobs</h2>
                <img src="https://cdn-icons-png.flaticon.com/128/3688/3688609.png" className="animated-icons" alt="Jobs Icon" />
                <Link to={{ pathname: '/posted-jobs', state: { userName: userName, userEmail: userEmail } }}>
                  <h4> {countOfJobs} posted by us</h4>
                </Link>
              </Col>
              <Col md={6} className="box">
                <FontAwesomeIcon icon=" " className="box-icon" />
                <h2>Total Applications</h2>
                <img src="https://cdn-icons-png.flaticon.com/128/942/942748.png" className="animated-icons" alt="Applications Icon" />
                <h4>Total Applicants  {countOfApplications}</h4>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="box">
                <FontAwesomeIcon icon=" " className="box-icon" />
                <h2>Shortlisted candidates</h2>
                <img src="https://cdn-icons-png.flaticon.com/128/11356/11356039.png" className="animated-icons" alt="Candidates Icon" />
                <h4>Shortlisted Candidates  {countOfShortlistedCandiCompany}</h4>
              </Col>
              <Col md={6} className="box">
                <Link to={{ pathname: '/dreamApplication', state: { userName: userName, userEmail: userEmail } }}>
                  <h2>Dream Applications</h2>
                  <img src="https://cdn-icons-png.flaticon.com/128/15597/15597760.png" className="animated-icons" alt="Activities Icon" />
                </Link>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>

  );
}

export default HrDashboard;
