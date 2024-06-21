import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';
const HrDashboard = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(location.state?.userEmail || '');
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [countOfJobs, setCountOfJobs] = useState(0);
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      fetchUserData(userEmail);
      fetchCounts(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    const storedUserName = localStorage.getItem(`userName_${userEmail}`);
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [userEmail]);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName`, {
        params: { userEmail: userEmail }
      });
      setUserData(response.data);
      setUserName(response.data.userName);
      localStorage.setItem(`userName_${userEmail}`, response.data.userName); // Store userName with user-specific key

    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  const fetchCounts = async (userEmail) => {
    try {
      const jobsResponse = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany`, {
        params: { userEmail: userEmail }
      });
      const applicationsResponse = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany`, {
        params: { userEmail: userEmail }
      });
        setCountOfJobs(jobsResponse.data);
      setCountOfApplications(applicationsResponse.data);
      const shortlistedResponse = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
        params: { userEmail: userEmail }
      });

    
      setCountOfShortlistedCandiCompany(shortlistedResponse.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

console.log("...>>"+countOfJobs);
console.log("...>>"+countOfApplications);
console.log("...>>"+countOfShortlistedCandiCompany);
console.log("...>>"+countOfJobs);

  const toggleSettings = () => {
    navigate('/');
  };

  const user = {
    userName: userData?.userName || '',
    userEmail: userEmail,
  };

  console.log("email", userEmail, " name", userName)
  return (
    <Container fluid className="hr-dashboard-container">
      <Row>
        <Col md={3} className="hr-leftside">
          <HrLeftSide user={user} />
        </Col>

        <Col md={9} className="hr-rightside">
        <Row className=" d-flex justify-content-end ">

<Col xs={4} md={1}>
          <div className="user col px-3 header-part-right" style={{marginTop:'10px'}}>
                <Dropdown>
                  <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                    <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} />
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
              </Col>

           

            <Row style={{ marginBottom: '5rem' }}>
              <Col md={6} className="box">
                <h2>Jobs</h2>
                <img src="https://cdn-icons-png.flaticon.com/128/3688/3688609.png" className="animated-icons" alt="Jobs Icon" />
                <Link to="/hr-dashboard/posted-jobs" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/posted-jobs', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link">
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
                <Link to="/hr-dashboard/dream-applications" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/dream-applications', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link">
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
