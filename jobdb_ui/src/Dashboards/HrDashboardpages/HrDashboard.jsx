import { faBriefcase, faEnvelope, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Link, useLocation, useNavigate } from "react-router-dom";
import HrLeftSide from './HrLeftSide';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';

// Register the necessary scales and elements with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HrDashboard = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(location.state?.userEmail || '');
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [countOfJobs, setCountOfJobs] = useState(0);
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);
  const [countOfUnderReviewCandi, setCountOfUnderReview] = useState(0);
  const [monthlyJobData, setMonthlyJobData] = useState({
    labels: [],
    datasets: [{
      data: []
    }]
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      fetchCounts(userEmail);
      fetchMonthlyJobData();
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userName && userEmail) {
      fetchUserData(userEmail);
    }
  }, [userEmail, userName]);

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
      localStorage.setItem(`userName_${userEmail}`, response.data.userName);
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
      const shortlistedResponse = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
        params: { userEmail: userEmail }
      });
      // const underReviewresponse = await axios.get(`${BASE_API_URL}/CountOfUnderReviewCandidateBYHRJob`, {
      //   params: { userEmail: userEmail }
      // });

      setCountOfJobs(jobsResponse.data);
      setCountOfApplications(applicationsResponse.data);
      setCountOfShortlistedCandiCompany(shortlistedResponse.data);
      // setCountOfUnderReview(underReviewresponse.data);

    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchMonthlyJobData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/monthlyJobPercentagesByCompany`, {
        params: { userEmail: userEmail }
      });

      const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      // Map month numbers to month names
      const jobData = allMonths.map((month, index) => response.data[index + 1] || 0);

      setMonthlyJobData({
        labels: allMonths,
        datasets: [{
          label: 'Job %',
          backgroundColor: 'skyblue',
          borderColor: 'black',
          borderWidth: 1,
          hoverBackgroundColor: 'skyblue',
          hoverBorderColor: 'black',
          data: jobData
        }]
      });
    } catch (error) {
      console.error('Error fetching monthly job data:', error);
    }
  };

  const toggleSettings = () => {
    navigate('/');
  };

  const user = {
    userName: userData?.userName || '',
    userEmail: userEmail,
  };

  const toggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
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

  const DATA = [
    { icon: faBriefcase, title: countOfJobs, subtitle: "Total Jobs", link: "/hr-dashboard/posted-jobs" },
    { icon: faUser, title: countOfApplications, subtitle: "Applicants" },
    { icon: faStar, title: countOfShortlistedCandiCompany, subtitle: "Shortlisted" },
    { icon: faEnvelope, subtitle: "Dream Applications", link: '/hr-dashboard/dream-applications' }
  ];

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>
        <Col md={10} className="rightside" style={{
          overflowY: 'scroll'
        }}>
          <div className="d-flex justify-content-end align-items-center mb-3 mt-12 ml-2">
            <i
              datafullscreen="true"
              onClick={toggleFullScreen}
              className="i-Full-Screen header-icon d-none d-lg-inline-block"
              style={{ fontSize: '20px', marginRight: '12px' }}
            />
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
          <Container className="my-dashboard-container">
            <h3 className='status-info text-center bg-light'>Company status</h3>
            <Row className="dashboard d-flex mt-4">
              {DATA.map((card, index) => (
                <Col lg={3} sm={6} key={index}>
                  <Card className="card-icon-bg gap-3 card-icon-bg-primary o-hidden mb-4">
                    <Card.Body className="align-items-center gap-4">
                      <FontAwesomeIcon icon={card.icon} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                      <div className="content gap-1">
                        {card.link ? (
                          <Link to={card.link} state={{ userName, userEmail }} className="nav-link">
                            <p className="text-muted mb-0 text-capitalize">{card.subtitle}</p>
                            <p className="lead text-primary text-24 mb-0 text-capitalize">{card.title}</p>
                          </Link>
                        ) : (
                          <>
                            <p className="text-muted mb-0 text-capitalize">{card.subtitle}</p>
                            <p className="lead text-primary text-24 mb-0 text-capitalize">{card.title}</p>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
          <Row>
            <Col md={6} className="offset-md-3 mt-4">
              <Card className="shadow-sm rounded-4"  >
                <Card.Header className=" bg-light text-center" style={{ height: '40px' }}>
                  <Card.Title as="h4" className='text-center'>Monthly Job Percentages</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Bar
                    data={monthlyJobData}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: {
                            color: '#888',
                            font: {
                              size: 12
                            }
                          }
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            color: '#888',
                            font: {
                              size: 12
                            },
                            maxTicksLimit: 100,
                            stepSize: 10
                          }
                        }
                      }
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default HrDashboard;
