import { faBriefcase, faEnvelope, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
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
      fetchCounts(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userName && userEmail) {
      fetchUserData(userEmail);
    }
  }, [userEmail,userName]);


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

  console.log("...>>" + countOfJobs);
  console.log("...>>" + countOfApplications);
  console.log("...>>" + countOfShortlistedCandiCompany);
  console.log("...>>" + countOfJobs);

  const toggleSettings = () => {
    navigate('/');
  };

  const user = {
    userName: userData?.userName || '',
    userEmail: userEmail,
  };

  console.log("email", userEmail, " name", userName)
  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>
        <Col md={18} className="rightside" style={{
          overflow: 'hidden'
        }}>
          <Row className="d-flex justify-content-end">
            <Col md={1}>
              <div className="user col px-3 header-part-right" style={{ marginTop: '10px' }}>
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
          </Row>
          <Container className="my-dashboard-container">
            <Row className="dashboard d-flex mt-4 justify-content-center">
              <h3 className='status-info text-center w-100 bg-light'>Company status</h3>

              <Card className="mb-4" style={{ maxWidth: '200px', margin: '10px' }}>
                <Card.Body className="pb-0">
                  <Col className="d-flex flex-column justify-content-center align-items-center">
                    <h4>
                      <FontAwesomeIcon icon={faBriefcase} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                      Total Jobs
                    </h4>
                    <Link to="/hr-dashboard/posted-jobs" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/posted-jobs', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link">
                      <Card.Title className="mb-3 "><h4 className='text-primary'>{countOfJobs}</h4></Card.Title>
                    </Link>
                  </Col>
                </Card.Body>
              </Card>

              <Card className="mb-4" style={{ maxWidth: '200px', margin: '10px' }}>
                <Card.Body className="pb-0">
                  <Col className="d-flex flex-column justify-content-center align-items-center">
                    <h4>
                      <FontAwesomeIcon icon={faUser} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                      Applicants
                    </h4>
                    <Card.Title className="mb-3 "><h4 className='text-primary'>{countOfApplications}</h4></Card.Title>
                  </Col>
                </Card.Body>
              </Card>

              <Card className="mb-4" style={{ maxWidth: '200px', margin: '10px' }}>
                <Card.Body className="pb-0">
                  <Col className="d-flex flex-column justify-content-center align-items-center">
                    <h4>
                      <FontAwesomeIcon icon={faStar} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                      Shortlisted Candidates
                    </h4>
                    <Card.Title className="mb-3 "><h4 className='text-primary'>{countOfShortlistedCandiCompany}</h4></Card.Title>
                  </Col>
                </Card.Body>
              </Card>

              <Card className="mb-4" style={{ maxWidth: '200px', margin: '10px' }}>
                <Card.Body className="pb-0">
                  <Col className="d-flex flex-column justify-content-center align-items-center">
                    <h4>
                      <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                      Candidate
                    </h4>
                    <Link to="/hr-dashboard/dream-applications" onClick={(e) => { e.preventDefault(); navigate('/hr-dashboard/dream-applications', { state: { userName: userName, userEmail: userEmail } }) }} className="nav-link">
                    <Card.Title className="mb-3 "><h4 className='text-primary'>Dream Applications</h4></Card.Title>
                    </Link>
                  </Col>
                </Card.Body>
              </Card>

            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}
export default HrDashboard;
